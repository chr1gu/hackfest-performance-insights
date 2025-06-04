import {
  pragmaHeader,
  pragmaHeaderValues,
  tracingHeaderKey,
} from "./shared/constants";
import { getTracingKey } from "~shared/storage";
import type { RequestHandler } from "~requestHandlers/requestHandler";
import { GraphQLHandler } from "~requestHandlers/graphqlHandler";
import { MainFrameHandler } from "~requestHandlers/mainFrameHandler";

const addDebugHeadersToRequests = async () => {
  const tracingKey = await getTracingKey();
  updateAddedDebugHeaders(tracingKey);
};

const updateAddedDebugHeaders = async (tracingKey: string | null) => {
  const addRules: chrome.declarativeNetRequest.Rule[] = [];
  if (tracingKey) {
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
    // console.log(
    //   `Storage key "${key}" in namespace "${namespace}" changed.`,
    //   `New value is ".`,
    //   newValue
    // );

    if (key === tracingHeaderKey) {
      updateAddedDebugHeaders(newValue);
    }
  }
});

const requestHandlers: RequestHandler[] = [
  new MainFrameHandler(),
  new GraphQLHandler(),
];

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    for (const handler of requestHandlers) {
      if (handler.canHandleRequest(details)) {
        handler.onCompleted(details);
      }
    }

    console.log("completed: " + details.url, details);
    if (details.type !== "main_frame") {
      return; // Only process main frame requests for testing...
    }

    const breadcrumbs = details.responseHeaders?.find(
      (header) => header.name.toLowerCase() === "akamai-request-bc"
    )?.value;

    if (breadcrumbs) {
      console.log(`Breadcrumbs for ${details.url}:`, breadcrumbs);
      chrome.storage.local.set({ breadcrumbs: breadcrumbs });
    }
  },
  { urls: ["https://www.galaxus.ch/*"] },
  ["responseHeaders"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    for (const handler of requestHandlers) {
      if (handler.canHandleRequest(details)) {
        handler.onBeforeSendHeaders(details);
      }
    }
  },
  { urls: ["https://www.galaxus.ch/*"] }
);
