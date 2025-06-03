import {
  pragmaHeader,
  pragmaHeaderValues,
  tracingHeader,
} from "./shared/constants";
import { getTracingKey } from "~shared/storage";

const addDebugHeadersToRequests = async () => {
  const tracingKey = await getTracingKey();
  updateAddedDebugHeaders(tracingKey);
};

const updateAddedDebugHeaders = async (tracingKey: string) => {
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
            header: tracingHeader,
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

addDebugHeadersToRequests();

/**
 * Dynamically update declarativeNetRequest rules based on storage changes because we don't want to hardcode those rules in the manifest.
 * https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#dynamic-and-session-rules
 */
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  for (let [key, { newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `New value is "${newValue}".`,
    );

    if (key === tracingHeader) {
      updateAddedDebugHeaders(newValue);
    }
  }
});

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    if (details.type !== "main_frame") {
      return; // Only process main frame requests for testing...
    }

    console.log(details.url, details);
    const breadcrumbs = details.responseHeaders?.find(
      (header) => header.name.toLowerCase() === "akamai-request-bc",
    )?.value;

    const edgeDuration = details.responseHeaders
      ?.find(
        (header) =>
          header.name.toLowerCase() === "server-timing" &&
          header.value?.startsWith("edge"),
      )
      ?.value?.replace("edge; dur=", "");

    const originDuration = details.responseHeaders
      ?.find(
        (header) =>
          header.name.toLowerCase() === "server-timing" &&
          header.value?.startsWith("origin"),
      )
      ?.value?.replace("origin; dur=", "");

    if (breadcrumbs) {
      console.log(`Breadcrumbs for ${details.url}:`, breadcrumbs);
      chrome.storage.local.set({ breadcrumbs: breadcrumbs });
    }

    console.log(
      `Server Timings for ${details.url}: edge ${edgeDuration}, origin ${originDuration}`,
    );

    if (edgeDuration && originDuration) {
      chrome.storage.local.set({
        edgeDuration: edgeDuration,
        originDuration: originDuration,
      });
    }
  },
  { urls: ["https://www.galaxus.ch/*"] },
  ["responseHeaders"],
);
