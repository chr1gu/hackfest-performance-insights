import { get } from "http";
import type { AkamaiInfo } from "~shared/pageInsights";

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

// {name: 'server-timing', value: 'iso; dur=281'}
export function getIsoDuration(
  request: chrome.webRequest.WebResponseHeadersDetails
): number | null {
  const isoDuration = findServerTimingHeader(request, "iso")?.replace(
    "iso; dur=",
    ""
  );

  return isoDuration ? parseInt(isoDuration) : null;
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
  onBeforeSendHeaders(request: chrome.webRequest.WebRequestDetails): void;
  onCompleted(request: chrome.webRequest.WebResponseHeadersDetails): void;
}
