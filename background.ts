import type { PlasmoCSConfig } from "plasmo";
import { tracingKey } from "./shared/constants";

export const config: PlasmoCSConfig = {
  matches: [
    "https://www.digitec.ch/*",
    "https://www.galaxus.ch/*",
    "https://www.galaxus.de/*",
    "https://www.galaxus.fr/*",
    "https://www.galaxus.it/*",
    "https://www.galaxus.at/*",
    "https://www.galaxus.be/*",
    "https://www.galaxus.nl/*",
    "https://www.galaxus.lu/*",
    "https://www.galaxus.rs/*",
    "https://test-www.digitec.ch/*",
    "https://test-www.galaxus.ch/*",
    "https://test-www.galaxus.de/*",
    "https://test-www.galaxus.fr/*",
    "https://test-www.galaxus.it/*",
    "https://test-www.galaxus.at/*",
    "https://test-www.galaxus.be/*",
    "https://test-www.galaxus.nl/*",
    "https://test-www.galaxus.lu/*",
    "https://test-www.galaxus.rs/*",
  ],
};

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

    if (key === tracingKey) {
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: [
          {
            id: 1,
            priority: 1,
            condition: {
              regexFilter:
                "https://.*.(digitec.ch|galaxus.ch|galaxus.de|galaxus.fr|galaxus.it|galaxus.at|galaxus.be|galaxus.nl|galaxus.lu|galaxus.rs)/.*",
              resourceTypes: [
                chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
              ],
            },
            action: {
              type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
              requestHeaders: [
                {
                  operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                  header: tracingKey,
                  value: newValue,
                },
              ],
            },
          },
        ],
      });
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
