import { Storage } from "@plasmohq/storage";

export interface PageInsights {
  requests: PageInsightRequest[];
}

export interface PageInsightRequest {
  name: string;
  requestId: string;
  completed: boolean;
  response?: PageInsightResponse;
}

export interface PageInsightResponse {
  totalDuration: number;
  akamaiInfo: AkamaiInfo;
  hosts: HostSystem[];
}

export interface AkamaiInfo {
  edgeDuration: number;
  edgeLocation: string;
  originDuration: number;
}

export interface HostSystem {
  name: string;
  duration: number | null;
  children?: HostSystem[];
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
        requests: [],
      });
    }
  });
}
