import {
  getPageInsights,
  updatePageInsights,
  type PageInsightRequest,
} from "~shared/pageInsights";
import type { RequestHandler, WebRequestDetails } from "./requestHandler";

export class GraphQLHandler implements RequestHandler {
  canHandleRequest(request: WebRequestDetails): boolean {
    // Example: Check if the request URL or method indicates a GraphQL request
    return request.url.includes("/graphql/") && request.method === "POST";
  }

  preHandleRequest(request: WebRequestDetails): void {
    // Logic to execute before handling the request
    console.log("Pre-handling GraphQL request:", request.requestId);

    getPageInsights((pageInsights) => {
      // Update the page insights with the GraphQL request
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

  postHandleRequest(request: WebRequestDetails): void {
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

    console.log("Post-handling GraphQL request:", request.requestId);
  }
}
