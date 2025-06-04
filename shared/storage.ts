import { useStorage } from "~node_modules/@plasmohq/storage/dist/hook";
import { tracingHeaderKey } from "./constants";
import type { PageInsights } from "./pageInsights";
import { Storage } from "@plasmohq/storage";

const pageInsightsKey = "pageInsights";

export const usePageInsightsStorage = () => {
  const [pageInsights] = useStorage<PageInsights>({
    key: pageInsightsKey,
    instance: new Storage({
      area: "local",
    }),
  });

  return pageInsights;
};

const storage = new Storage({
  area: "local",
});

export function getPageInsights(
  callback: (pageInsights: PageInsights) => void
) {
  storage.get<PageInsights>(pageInsightsKey).then((pageInsights) => {
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
  storage.set(pageInsightsKey, pageInsights);
}

export const getTracingKey = async () => {
  return (await storage.get<string>(tracingHeaderKey)) ?? null;
};
