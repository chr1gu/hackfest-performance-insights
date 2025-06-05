import { Storage } from "@plasmohq/storage";

export interface PageInsights {
  requests: PageInsightRequest[];
}

export type RequestType = "Document" | "GraphQL" | "Grapholith";

export interface UncompletePageInsightRequest {
  name: string;
  type: RequestType;
  requestId: string;
  completed: false;
}

export interface CompletePageInsightRequest {
  name: string;
  type: RequestType;
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
  edgeLocation: string | undefined;
  cacheLocation: string | undefined;
  originDuration: number;
}

export type HostSystemType = "GraphQLGateway" | "Grapholith";

export interface HostSystem {
  type: HostSystemType;
  name: string;
  duration: number | null;
}

export class GraphQlGatewayHostSystem implements HostSystem {
  type: HostSystemType = "GraphQLGateway";
  name: string = "GraphQL Gateway";
  queryName: string = "Unknown gateway query";
  duration: number | null = null;
  subGraphQueries?: SubGraphQuery[] = [];
}

export class GrapholithHostSystem implements HostSystem {
  type: HostSystemType = "Grapholith";
  name: string = "Grapholith";
  queryName: string = "Unknown gateway query";
  duration: number | null = null;
}

export class SubGraphQuery {
  name: string = "Sub Graph";
  queryName: string = "Unknown sub-query";
  subGraphName: string = "";
  duration: number | null = null;
  offset: number = 0;
}
