import { type PageInsightRequest } from "~shared/pageInsights";
import {
  getAkamaiInfo,
  getIsoDurations,
  type RequestHandler,
} from "./requestHandler";
import { getGraphQlGatewaySystems } from "./graphqlHandler";
import { getPageInsights, updatePageInsights } from "~shared/storage";

export class MainFrameHandler implements RequestHandler {
  canHandleRequest(request: chrome.webRequest.WebRequestDetails): boolean {
    return request.type === "main_frame";
  }

  onBeforeSendHeaders(request: chrome.webRequest.WebRequestDetails): void {
    getPageInsights((pageInsights) => {
      // Update the page insights with the GraphQL request
      const requestInfo: PageInsightRequest = {
        name: (() => {
          try {
            const url = new URL(request.url);
            return url.pathname;
          } catch (error) {
            return "Document Request";
          }
        })(),
        type: "Document",
        requestId: request.requestId,
        completed: false,
      };

      pageInsights.requests = []; // Reset requests on reload
      pageInsights.requests.push(requestInfo);
      updatePageInsights(pageInsights);
    });
  }

  onCompleted(request: chrome.webRequest.WebResponseHeadersDetails): void {
    // Logic to execute after handling the request

    getPageInsights((pageInsights) => {
      // Find the request in the page insights and mark it as completed
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
            isoDuration: getIsoDurations(request),
            hosts: getGraphQlGatewaySystems(request), // This can be populated with more detailed host information if needed
          };
        }
        updatePageInsights(pageInsights);
      }
    });
  }
}
