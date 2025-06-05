import {
  pragmaHeader,
  pragmaHeaderValues,
  tracingHeaderKey,
} from "./shared/constants";
import {
  getPageInsights,
  getTracingKey,
  updatePageInsights,
} from "~shared/storage";
import type { RequestHandler } from "~requestHandlers/requestHandler";
import { GraphQLHandler } from "~requestHandlers/graphqlHandler";
import { MainFrameHandler } from "~requestHandlers/mainFrameHandler";
import { GrapholithHandler } from "~requestHandlers/grapholithHandler";
import type { PageInsightRequest } from "~shared/pageInsights";

const addDebugHeadersToRequests = async () => {
  const tracingKey = await getTracingKey();
  updateAddedDebugHeaders(tracingKey);
};

const updateAddedDebugHeaders = async (tracingKey: string | null) => {
  const addRules: chrome.declarativeNetRequest.Rule[] = [];
  if (tracingKey) {
    console.log("Updating debug headers with tracing key:", tracingKey);
    addRules.push({
      id: 1,
      priority: 1,
      condition: {
        regexFilter: `https://.*\.(digitec\.ch|galaxus\.(ch|de|it|nl|at|fr))(:\d+)?(/.*)?`,
        resourceTypes: [
          chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
          chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
        ],
      },
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
        requestHeaders: [
          {
            operation: chrome.declarativeNetRequest.HeaderOperation.SET,
            header: tracingHeaderKey,
            value: tracingKey,
          },
          {
            operation: chrome.declarativeNetRequest.HeaderOperation.SET,
            header: pragmaHeader,
            value: pragmaHeaderValues.join(", "),
          },
        ],
      },
    });
  }

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules,
  });
};

// Add debug headers to requests when the extension is loaded
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "devToolsPanel") {
    console.log("Adding debug headers to requests");
    addDebugHeadersToRequests();

    // Remove debug headers when the panel is closed to avoid sending unnecessary
    port.onDisconnect.addListener(async () => {
      console.log("Removing debug headers from requests");
      updateAddedDebugHeaders(null);
    });
  }
});

/**
 * Dynamically update declarativeNetRequest rules based on storage changes because we don't want to hardcode those rules in the manifest.
 * https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#dynamic-and-session-rules
 */
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  for (let [key, { newValue }] of Object.entries(changes)) {
    if (key === tracingHeaderKey) {
      updateAddedDebugHeaders(newValue);
    }
  }
});

const requestHandlers: RequestHandler[] = [
  new MainFrameHandler(),
  new GraphQLHandler(),
  new GrapholithHandler(),
];

const urlPatterns = [
  "https://*.galaxus.ch/*",
  "https://*.galaxus.de/*",
  "https://*.galaxus.at/*",
  "https://*.galaxus.nl/*",
  "https://*.galaxus.it/*",
  "https://*.galaxus.be/*",
  "https://*.digitec.ch/*",
];

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    for (const handler of requestHandlers) {
      if (handler.canHandleRequest(details)) {
        handler.onCompleted(details);
        break; // Exit the loop after handling the first matching handler
      }
    }

    const now = Date.now();
    const diffMs = Math.round(now - details.timeStamp); // difference in ms
    console.log(" --- end time " + details.requestId, details.timeStamp);

    console.log(
      `Request completed: ${details.url} with status code ${details.statusCode}`,
      details,
      diffMs
    );
  },
  {
    urls: urlPatterns,
  },
  ["responseHeaders"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    for (const handler of requestHandlers) {
      if (handler.canHandleRequest(details)) {
        getPageInsights((pageInsights) => {
          // Update the page insights with the GraphQL request
          const requestInfo: PageInsightRequest = {
            name: handler.getName(details),
            type: handler.getType(),
            requestId: details.requestId,
            startTimeMs: details.timeStamp,
          };

          pageInsights.requests.push(requestInfo);
          updatePageInsights(pageInsights);
        });

        break; // Exit the loop after handling the first matching handler
      }
    }

    console.log(" --- start time " + details.requestId, details.timeStamp);
  },
  {
    urls: urlPatterns,
  }
);
