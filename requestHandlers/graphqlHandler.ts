import {
  getPageInsights,
  updatePageInsights,
  type PageInsightRequest,
} from "~shared/pageInsights";
import type { RequestHandler } from "./requestHandler";

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
        requestId: request.requestId,
        completed: false,
      };

      pageInsights.requests.push(requestInfo);
      updatePageInsights(pageInsights);
    });
  }

  onCompleted(request: chrome.webRequest.WebResponseHeadersDetails): void {
    // Logic to execute after handling the request

    const edgeDuration = request.responseHeaders
      ?.find(
        (header) =>
          header.name.toLowerCase() === "server-timing" &&
          header.value?.startsWith("edge")
      )
      ?.value?.replace("edge; dur=", "");

    const originDuration = request.responseHeaders
      ?.find(
        (header) =>
          header.name.toLowerCase() === "server-timing" &&
          header.value?.startsWith("origin")
      )
      ?.value?.replace("origin; dur=", "");

    getPageInsights((pageInsights) => {
      // Find the request in the page insights and mark it as completed
      const requestInfo = pageInsights.requests.find(
        (req) => req.requestId === request.requestId
      );

      if (requestInfo) {
        requestInfo.completed = true;
        requestInfo.response = {
          totalDuration:
            parseInt(edgeDuration || "0") + parseInt(originDuration || "0"),
          akamaiInfo: {
            edgeDuration: parseInt(edgeDuration || "0"),
            edgeLocation: "Unknown",
            originDuration: parseInt(originDuration || "0"),
          },
          hosts: [], // This can be populated with more detailed host information if needed
        };
        updatePageInsights(pageInsights);
      }
    });
  }
}
