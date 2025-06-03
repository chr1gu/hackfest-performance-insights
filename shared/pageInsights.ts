import { Storage } from "@plasmohq/storage";

export interface PageInsights {
  totalDuration: number;
  requests: PageInsightRequest[];
}

export interface PageInsightRequest {
  name: string;
  requestId: string;
  completed: boolean;
  hosts: HostSystem[];
}

export interface HostSystem {
  name: string;
  totalDuration: number | null;
}

export interface AkamaiHostSystem extends HostSystem {}

export interface GraphQlGatewayHostSystem extends HostSystem {}

const storage = new Storage();

export function updatePageInsights(pageInsights: PageInsights) {
  storage.set("pageInsights", pageInsights);
}

export function getPageInsights(
  callback: (pageInsights: PageInsights) => void
) {
  storage.get<PageInsights>("pageInsights").then((pageInsights) => {
    if (pageInsights) {
      callback(pageInsights);
    } else {
      // If no insights are found, return an empty structure
      callback({
        totalDuration: 0,
        requests: [],
      });
    }
  });
}
