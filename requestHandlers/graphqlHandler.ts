import {
  GraphQlGatewayHostSystem,
  SubGraphQuery,
  type PageInsightRequest,
} from "~shared/pageInsights";
import {
  findServerTimingHeader,
  getAkamaiInfo,
  type RequestHandler,
} from "./requestHandler";
import { getPageInsights, updatePageInsights } from "~shared/storage";

// Server-Timing: dg-trace-gql-subgraphq_dg-shopproductcatalog;desc="layout_query";dur=223;offset=1
// Server-Timing: dg-trace-gql-subgraphq_dg-shopproductcatalog;desc="layout_query";dur=18;offset=225
// Server-Timing: dg-trace-gql-subgraphq_dg-order-details;desc="page_query";dur=18;offset=225
function getSubGraphTimings(
  request: chrome.webRequest.WebResponseHeadersDetails,
  queryName: string
): SubGraphQuery[] {
  const hostSystems: SubGraphQuery[] = [];
  request.responseHeaders
    ?.filter(
      (header) =>
        header.name.toLowerCase() === "server-timing" &&
        header.value?.startsWith("dg-trace-gql-subgraphq_")
    )
    .forEach((header) => {
      const subgraphParts = header.value?.split(";") || [];
      const subgraphQueryName =
        subgraphParts
          .find((part) => part.trim().startsWith("desc="))
          ?.replace("desc=", "")
          .trim() ?? queryName;

      const subgraphDuration = parseInt(
        subgraphParts
          .find((part) => part.trim().startsWith("dur="))
          ?.replace("dur=", "") || "0"
      );

      const subgraphOffset = parseInt(
        subgraphParts
          .find((part) => part.trim().startsWith("offset="))
          ?.replace("dur=", "") || "0"
      );

      const subgraphHost = new GraphQlGatewayHostSystem();
      subgraphHost.duration = subgraphDuration;
      subgraphHost.queryName = subgraphQueryName;
      subgraphHost.offset = subgraphOffset;
      hostSystems.push(subgraphHost);
    });

  return hostSystems;
}

// Server-Timing: dg-trace-gql-gateway;desc="layout_query";dur=23.2
// Server-Timing: dg-trace-gql-gateway;desc="page_query";dur=23.2
export function getGraphQlGatewaySystems(
  request: chrome.webRequest.WebResponseHeadersDetails
): GraphQlGatewayHostSystem[] {
  const hostSystems: GraphQlGatewayHostSystem[] = [];
  request.responseHeaders
    ?.filter(
      (header) =>
        header.name.toLowerCase() === "server-timing" &&
        header.value?.startsWith("dg-trace-gql-gateway")
    )
    .forEach((header) => {
      const gatewayParts = header.value?.split(";") || [];
      const gatewayQueryName =
        gatewayParts
          .find((part) => part.trim().startsWith("desc="))
          ?.replace("desc=", "")
          .trim() ?? "Unknown layout query";

      const gatewayDuration = parseInt(
        gatewayParts
          .find((part) => part.trim().startsWith("dur="))
          ?.replace("dur=", "") || "0"
      );

      const gatewayHost = new GraphQlGatewayHostSystem();
      gatewayHost.duration = gatewayDuration;
      gatewayHost.queryName = gatewayQueryName;
      gatewayHost.subGraphQueries = getSubGraphTimings(
        request,
        gatewayQueryName
      );

      hostSystems.push(gatewayHost);
    });

  return hostSystems;
}

export class GraphQLHandler implements RequestHandler {
  canHandleRequest(request: chrome.webRequest.WebRequestDetails): boolean {
    return (
      request.type === "xmlhttprequest" &&
      request.url.includes("/graphql/o/") &&
      request.method === "POST"
    );
  }

  onBeforeSendHeaders(request: chrome.webRequest.WebRequestDetails): void {
    getPageInsights((pageInsights) => {
      const requestInfo: PageInsightRequest = {
        name: request.url.split("/").pop() || "GraphQL Request",
        type: "GraphQL",
        requestId: request.requestId,
        completed: false,
      };

      pageInsights.requests.push(requestInfo);
      updatePageInsights(pageInsights);
    });
  }

  onCompleted(request: chrome.webRequest.WebResponseHeadersDetails): void {
    getPageInsights((pageInsights) => {
      const requestInfo = pageInsights.requests.find(
        (req) => req.requestId === request.requestId
      );

      if (requestInfo) {
        const akamaiInfo = getAkamaiInfo(request);

        requestInfo.completed = true;
        // This if statement is simply here as a lazy way to fix ts error
        if (requestInfo.completed) {
          requestInfo.response = {
            totalDuration: akamaiInfo.edgeDuration + akamaiInfo.originDuration,
            akamaiInfo,
            hosts: getGraphQlGatewaySystems(request), // This can be populated with more detailed host information if needed
          };
        }
        updatePageInsights(pageInsights);
      }
    });
  }
}
