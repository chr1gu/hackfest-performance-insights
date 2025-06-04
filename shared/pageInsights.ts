import { Storage } from "@plasmohq/storage";

export interface PageInsights {
  requests: PageInsightRequest[];
}

interface UncompletePageInsightRequest {
  name: string;
  requestId: string;
  completed: false;
}

interface CompletePageInsightRequest {
  name: string;
  requestId: string;
  completed: true;
  response: PageInsightResponse;
}

export type PageInsightRequest =
  | UncompletePageInsightRequest
  | CompletePageInsightRequest;

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
}

export class GraphQlGatewayHostSystem implements HostSystem {
  name: string = "GraphQL Gateway";
  queryName: string = "Unknown gateway query";
  duration: number | null = null;
  subGraphQueries?: SubGraphQuery[] = [];
}

export class SubGraphQuery implements HostSystem {
  name: string = "Sub Graph";
  queryName: string = "Unknown sub-query";
  duration: number | null = null;
}
