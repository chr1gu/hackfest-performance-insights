import {
  getPageInsights,
  updatePageInsights,
  type PageInsightRequest,
} from "~shared/pageInsights";
import {
  getAkamaiInfo,
  getEdgeDuration,
  getOriginDuration,
  type RequestHandler,
} from "./requestHandler";

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
    getPageInsights((pageInsights) => {
      const requestInfo = pageInsights.requests.find(
        (req) => req.requestId === request.requestId
      );

      if (requestInfo) {
        const akamaiInfo = getAkamaiInfo(request);

        requestInfo.completed = true;
        requestInfo.response = {
          totalDuration: akamaiInfo.edgeDuration + akamaiInfo.originDuration,
          akamaiInfo,
          hosts: [], // This can be populated with more detailed host information if needed
        };
        updatePageInsights(pageInsights);
      }
    });
  }
}
