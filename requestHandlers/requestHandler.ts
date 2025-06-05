import type {
  AkamaiInfo,
  HostSystem,
  IsoDurations,
  RequestType,
} from "~shared/pageInsights";

export function findServerTimingHeader(
  request: chrome.webRequest.WebResponseHeadersDetails,
  startingWith: string
): string | undefined {
  return request.responseHeaders?.find(
    (header) =>
      header.name.toLowerCase() === "server-timing" &&
      header.value?.startsWith(startingWith)
  )?.value;
}

function getOriginDuration(
  request: chrome.webRequest.WebResponseHeadersDetails
): number {
  const originDuration = findServerTimingHeader(request, "origin")?.replace(
    "origin; dur=",
    ""
  );

  return parseInt(originDuration || "0");
}

function getEdgeDuration(
  request: chrome.webRequest.WebResponseHeadersDetails
): number {
  const edgeDuration = findServerTimingHeader(request, "edge")?.replace(
    "edge; dur=",
    ""
  );

  return parseInt(edgeDuration || "0");
}

function getAkamaiLocation(
  request: chrome.webRequest.WebResponseHeadersDetails,
  type: "edge" | "cache"
): string | undefined {
  const breadcrumbs = request.responseHeaders?.find(
    (header) => header.name.toLowerCase() === "akamai-request-bc"
  )?.value;

  let result;
  breadcrumbs?.split("],[").forEach((breadcrumb) => {
    if (breadcrumb.startsWith("[")) {
      breadcrumb = breadcrumb.substring(1);
    } else if (breadcrumb.endsWith("]")) {
      breadcrumb = breadcrumb.substring(0, breadcrumb.length - 1);
    }

    const parts = breadcrumb.split(",");

    const networkIdentifier = parts.find((part) =>
      part.startsWith(type === "edge" ? "c=g" : "c=c")
    );

    if (networkIdentifier) {
      const location = parts
        .find((part) => part.startsWith("n"))
        ?.split("=")[1]
        .trim();
      if (location) {
        result = location;
      }
    }
  });

  return result;
}

// {name: 'server-timing', value: 'iso; desc=render; dur=29'}
// {name: 'server-timing', value: 'iso; desc=getInitialProps; dur=198'}
// {name: 'server-timing', value: 'iso; desc=total; dur=227'}
export function getIsoDurations(
  request: chrome.webRequest.WebResponseHeadersDetails
): IsoDurations | null {
  const isoDurations: IsoDurations = {
    render: 0,
    getInitialProps: 0,
    total: 0,
  };

  request.responseHeaders
    ?.filter(
      (header) =>
        header.name.toLowerCase() === "server-timing" &&
        header.value?.startsWith("iso;")
    )
    .forEach((header) => {
      if (header.value) {
        const parts = header.value.split("; ");
        const durPart = parts.find((part) => part.startsWith("dur="));
        const duration = durPart ? parseInt(durPart.replace("dur=", "")) : 0;
        const descPart = parts.find((part) => part.startsWith("desc="));
        const description = descPart
          ? descPart.replace("desc=", "").trim()
          : "";
        if (description === "render") {
          isoDurations.render = duration;
        } else if (description === "getInitialProps") {
          isoDurations.getInitialProps = duration;
        } else if (description === "total") {
          isoDurations.total = duration;
        }
      }
    });

  return isoDurations.getInitialProps !== 0 ||
    isoDurations.render !== 0 ||
    isoDurations.total !== 0
    ? isoDurations
    : null;
}

export function getAkamaiInfo(
  request: chrome.webRequest.WebResponseHeadersDetails
): AkamaiInfo {
  const edgeDuration = getEdgeDuration(request);
  const originDuration = getOriginDuration(request);

  return {
    edgeDuration: edgeDuration,
    edgeLocation: getAkamaiLocation(request, "edge"),
    cacheLocation: getAkamaiLocation(request, "cache"),
    originDuration: originDuration,
  };
}

export interface RequestHandler {
  canHandleRequest(request: chrome.webRequest.WebRequestDetails): boolean;
  getName(request: chrome.webRequest.WebRequestDetails): string;
  getType(): RequestType;
  getHostSystems(
    request: chrome.webRequest.WebResponseHeadersDetails
  ): HostSystem[];
}
