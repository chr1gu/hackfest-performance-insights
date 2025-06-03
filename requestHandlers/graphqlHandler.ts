import {
  getPageInsights,
  updatePageInsights,
  type PageInsightRequest,
} from "~shared/pageInsights";
import type { RequestHandler, WebRequestDetails } from "./requestHandler";

export class GraphQLHandler implements RequestHandler {
  canHandleRequest(request: WebRequestDetails): boolean {
    return (
      request.type === "xmlhttprequest" &&
      request.url.includes("/graphql/") &&
      request.method === "POST"
    );
  }

  onBeforeSendHeaders(request: WebRequestDetails): void {
    getPageInsights((pageInsights) => {
      const requestInfo: PageInsightRequest = {
        name: request.url.split("/").pop() || "GraphQL Request",
        requestId: request.requestId,
        completed: false,
        hosts: [],
      };

      pageInsights.requests.push(requestInfo);
      updatePageInsights(pageInsights);
    });
  }

  onCompleted(request: WebRequestDetails): void {
    // Logic to execute after handling the request

    getPageInsights((pageInsights) => {
      // Find the request in the page insights and mark it as completed
      const requestInfo = pageInsights.requests.find(
        (req) => req.requestId === request.requestId
      );

      if (requestInfo) {
        requestInfo.completed = true;
        updatePageInsights(pageInsights);
      }
    });
  }
}
