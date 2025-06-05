import {
  GraphQlGatewayHostSystem,
  SubGraphQuery,
  type HostSystem,
  type RequestType,
} from "~shared/pageInsights";
import {
  getAkamaiInfo,
  getIsoDurations,
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
  const subGraphQueries: SubGraphQuery[] = [];
  request.responseHeaders
    ?.filter(
      (header) =>
        header.name.toLowerCase() === "server-timing" &&
        header.value?.trim().startsWith("dg-trace-gql-subgraph_") &&
        header.value?.includes("desc=" + queryName)
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
          ?.replace("offset=", "") || "0"
      );

      const subgraphHost = new SubGraphQuery();
      subgraphHost.duration = subgraphDuration;
      subgraphHost.queryName = subgraphQueryName;
      subgraphHost.offset = subgraphOffset;
      subgraphHost.subGraphName = subgraphParts[0].replace(
        "dg-trace-gql-subgraph_",
        ""
      );
      subGraphQueries.push(subgraphHost);
    });

  return subGraphQueries.sort((a, b) => a.offset - b.offset);
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

  getName(request: chrome.webRequest.WebRequestDetails): string {
    return request.url.split("/").pop() || "GraphQL Request";
  }

  getType(): RequestType {
    return "GraphQL";
  }

  getHostSystems(
    request: chrome.webRequest.WebResponseHeadersDetails
  ): HostSystem[] {
    return getGraphQlGatewaySystems(request);
  }
}
