import { GrapholithHostSystem, type RequestType } from "~shared/pageInsights";
import {
  getAkamaiInfo,
  getIsoDurations,
  type RequestHandler,
} from "./requestHandler";
import { getPageInsights, updatePageInsights } from "~shared/storage";
import { get } from "http";

// 'server-timing', value: 'dg-trace-gql-grapholith;description=get-brand-like;dur=7'}
// 'server-timing', value: 'dg-trace-gql-grapholith;description=get-brand-initialprops;dur=17'}
export function getGrapholithGatewaySystems(
  request: chrome.webRequest.WebResponseHeadersDetails
): GrapholithHostSystem[] {
  const hostSystems: GrapholithHostSystem[] = [];
  request.responseHeaders
    ?.filter(
      (header) =>
        header.name.toLowerCase() === "server-timing" &&
        header.value?.startsWith("dg-trace-gql-grapholith")
    )
    .forEach((header) => {
      const gatewayParts = header.value?.split(";") || [];
      let gatewayQueryName =
        gatewayParts
          .find((part) => part.trim().startsWith("description="))
          ?.replace("description=", "")
          .trim() ?? "Unknown layout query";

      gatewayQueryName = gatewayQueryName.replace("-", "_");
      const gatewayDuration = parseInt(
        gatewayParts
          .find((part) => part.trim().startsWith("dur="))
          ?.replace("dur=", "") || "0"
      );

      const gatewayHost = new GrapholithHostSystem();
      gatewayHost.duration = gatewayDuration;
      gatewayHost.queryName = gatewayQueryName;

      hostSystems.push(gatewayHost);
    });

  return hostSystems;
}

export class GrapholithHandler implements RequestHandler {
  canHandleRequest(request: chrome.webRequest.WebRequestDetails): boolean {
    return (
      request.type === "xmlhttprequest" &&
      request.url.includes("api/graphql/") &&
      request.method === "POST"
    );
  }

  getName(request: chrome.webRequest.WebRequestDetails): string {
    return request.url.split("/").pop() || "Grapholith Request";
  }

  getType(): RequestType {
    return "Grapholith";
  }

  onCompleted(request: chrome.webRequest.WebResponseHeadersDetails): void {
    getPageInsights((pageInsights) => {
      const requestInfo = pageInsights.requests.find(
        (req) => req.requestId === request.requestId
      );

      if (requestInfo) {
        const akamaiInfo = getAkamaiInfo(request);

        requestInfo.response = {
          totalDuration: akamaiInfo.edgeDuration + akamaiInfo.originDuration,
          akamaiInfo,
          isoDuration: getIsoDurations(request),
          hosts: getGrapholithGatewaySystems(request), // This can be populated with more detailed host information if needed
        };

        updatePageInsights(pageInsights);
      }
    });
  }
}
