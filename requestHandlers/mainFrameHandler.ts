import { type RequestType } from "~shared/pageInsights";
import {
  getAkamaiInfo,
  getIsoDurations,
  type RequestHandler,
} from "./requestHandler";
import { getGraphQlGatewaySystems } from "./graphqlHandler";
import { getPageInsights, updatePageInsights } from "~shared/storage";
import { getGrapholithGatewaySystems } from "./grapholithHandler";

export class MainFrameHandler implements RequestHandler {
  canHandleRequest(request: chrome.webRequest.WebRequestDetails): boolean {
    return request.type === "main_frame";
  }

  getName(request: chrome.webRequest.WebRequestDetails): string {
    try {
      const url = new URL(request.url);
      return url.pathname;
    } catch (error) {
      return "Document Request";
    }
  }

  getType(): RequestType {
    return "Document";
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

        var graphqlGateways = getGraphQlGatewaySystems(request);
        const grapholiths = getGrapholithGatewaySystems(request);

        requestInfo.response = {
          totalDuration: akamaiInfo.edgeDuration + akamaiInfo.originDuration,
          akamaiInfo,
          isoDuration: getIsoDurations(request),
          hosts: [...graphqlGateways, ...grapholiths],
        };

        updatePageInsights(pageInsights);
      }
    });
  }
}
