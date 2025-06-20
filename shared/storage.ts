import { useStorage } from "~node_modules/@plasmohq/storage/dist/hook";
import { tracingHeaderKey } from "./constants";
import type { PageInsights } from "./pageInsights";
import { Storage } from "@plasmohq/storage";

const pageInsightsKey = "pageInsights";

const sessionStorage = new Storage({
  area: "session",
});

export const usePageInsightsStorage = () => {
  return useStorage<PageInsights>({
    key: pageInsightsKey,
    instance: sessionStorage,
  });
};

export function getPageInsights(
  callback: (pageInsights: PageInsights) => void
) {
  sessionStorage.get<PageInsights>(pageInsightsKey).then((pageInsights) => {
    if (pageInsights) {
      callback(pageInsights);
    } else {
      // If no insights are found, return an empty structure
      callback({
        requests: [],
      });
    }
  });
}

export function updatePageInsights(pageInsights: PageInsights) {
  sessionStorage.set(pageInsightsKey, pageInsights);
  console.log("Page insights updated:", pageInsights);
}

const syncStorage = new Storage({
  area: "sync",
});

export const getTracingKey = async () => {
  return (await syncStorage.get<string>(tracingHeaderKey)) ?? null;
};

export const useTracingKey = () => {
  return useStorage<string>({
    key: tracingHeaderKey,
    instance: syncStorage,
  });
};
