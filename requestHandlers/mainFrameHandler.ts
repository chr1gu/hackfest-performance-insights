import {
  getPageInsights,
  updatePageInsights,
  type PageInsightRequest,
} from "~shared/pageInsights";
import type { RequestHandler, WebRequestDetails } from "./requestHandler";

export class MainFrameHandler implements RequestHandler {
  canHandleRequest(request: WebRequestDetails): boolean {
    return request.type === "main_frame";
  }

  onBeforeSendHeaders(request: WebRequestDetails): void {
    getPageInsights((pageInsights) => {
      // Update the page insights with the GraphQL request
      const requestInfo: PageInsightRequest = {
        name: "Main Frame Request",
        requestId: request.requestId,
        completed: false,
        hosts: [],
      };

      pageInsights.requests = []; // Reset requests on reload
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
