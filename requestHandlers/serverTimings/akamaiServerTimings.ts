import type {
  AkamaiHostSystem,
  AkamaiOriginHostSystem,
  HostSystem,
} from "~shared/pageInsights";
import { getDuration } from "./serverTimingHelpers";
import { get } from "http";

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

export function getAkamaiEdgeHostSystem(
  akamaiHeaderValue: string,
  request: chrome.webRequest.WebResponseHeadersDetails
): AkamaiHostSystem {
  return {
    type: "AkamaiHostSystem",
    duration: getDuration(akamaiHeaderValue),
    location: getAkamaiLocation(request, "edge") || "Unknown Location",
  };
}

export function getAkamaiOriginHostSystem(
  akamaiHeaderValue: string,
  request: chrome.webRequest.WebResponseHeadersDetails
): AkamaiOriginHostSystem {
  return {
    type: "AkamaiOriginHostSystem",
    duration: getDuration(akamaiHeaderValue),
    location: getAkamaiLocation(request, "cache") || "Unknown Location",
    children: [],
  };
}
