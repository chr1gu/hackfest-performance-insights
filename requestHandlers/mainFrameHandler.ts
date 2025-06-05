import {
  type HostSystem,
  type PageInsightRequest,
  type RequestType,
} from "~shared/pageInsights";
import {
  getAkamaiInfo,
  getIsoDurations,
  type RequestHandler,
} from "./requestHandler";
import { getGraphQlGatewaySystems } from "./graphqlHandler";
import { getPageInsights, updatePageInsights } from "~shared/storage";
import { getGrapholithGatewaySystems } from "./grapholithHandler";
import { findServerTimingHeaderStartingWith } from "./serverTimings/serverTimingHelpers";
import {
  getAkamaiEdgeHostSystem,
  getAkamaiOriginHostSystem,
} from "./serverTimings/akamaiServerTimings";
import {
  getIsomorphicRenderHostSystem,
  getIsomorphInitialPropsHostSystem,
} from "./serverTimings/isomorphicServerTimings";

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

  getHostSystems(
    request: chrome.webRequest.WebResponseHeadersDetails
  ): HostSystem[] {
    const result: HostSystem[] = [];
    const akamaiEdge = findServerTimingHeaderStartingWith("edge;", request);
    if (akamaiEdge) {
      result.push(getAkamaiEdgeHostSystem(akamaiEdge, request));
    }

    var graphqlGateways = getGraphQlGatewaySystems(request);
    const grapholiths = getGrapholithGatewaySystems(request);

    const akamaiOrigin = findServerTimingHeaderStartingWith("origin;", request);
    if (akamaiOrigin) {
      const akamaiOriginHost = getAkamaiOriginHostSystem(akamaiOrigin, request);
      result.push(akamaiOriginHost);
      const renderHost = getIsomorphicRenderHostSystem(request);

      if (renderHost) {
        akamaiOriginHost.children = akamaiOriginHost.children =
          akamaiOriginHost.children || [];
        akamaiOriginHost.children.push(renderHost);
      }

      const initialPropsHost = getIsomorphInitialPropsHostSystem(request);
      if (initialPropsHost) {
        akamaiOriginHost.children = akamaiOriginHost.children || [];
        akamaiOriginHost.children.push(initialPropsHost);

        initialPropsHost.children = initialPropsHost.children || [];
        initialPropsHost.children.push(...graphqlGateways, ...grapholiths);
      } else {
        akamaiOriginHost.children = akamaiOriginHost.children || [];

        akamaiOriginHost.children.push(...graphqlGateways, ...grapholiths);
      }
    } else {
      result.push(...graphqlGateways, ...grapholiths);
    }

    return result;
  }
}
