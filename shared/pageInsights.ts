export interface PageInsights {
  requests: PageInsightRequest[];
}

export type RequestType = "Document" | "GraphQL" | "Grapholith";

export interface PageInsightRequest {
  type: RequestType;
  name: string;
  requestId: string;
  startTimeMs: number;
  endTimeMs?: number;
  response?: PageInsightResponse;
}

export interface IsoDurations {
  render: number;
  getInitialProps: number;
  total: number;
}

export interface PageInsightResponse {
  totalDuration: number;
  hosts: HostSystem[];
}

export type HostSystemType =
  | "AkamaiHostSystem"
  | "IsomorphHostSystem"
  | "GraphQLGateway"
  | "Grapholith";

export interface HostSystem {
  type: HostSystemType;
  name: string;
  duration: number;
  children?: HostSystem[];
}

export class AkamaiHostSystem implements HostSystem {
  type: HostSystemType = "AkamaiHostSystem";
  name: string = "";
  duration: number = 0;
  location: string | undefined = undefined;
  children?: HostSystem[] | undefined = undefined;
}

export class IsomorphHostSystem implements HostSystem {
  type: HostSystemType = "IsomorphHostSystem";
  name: string = "";

  duration: number = 0;
  children?: HostSystem[] | undefined = undefined;
}

export interface AkamaiInfo {
  edgeDuration: number;
  edgeLocation: string | undefined;
  cacheLocation: string | undefined;
  originDuration: number;
}

export class GraphQlGatewayHostSystem implements HostSystem {
  type: HostSystemType = "GraphQLGateway";
  name: string = "GraphQL Gateway";
  queryName: string = "Unknown gateway query";
  duration: number = 0;
  subGraphQueries?: SubGraphQuery[] = [];
}

export class GrapholithHostSystem implements HostSystem {
  type: HostSystemType = "Grapholith";
  name: string = "Grapholith";
  queryName: string = "Unknown gateway query";
  duration: number = 0;
}

export class SubGraphQuery {
  name: string = "Sub Graph";
  queryName: string = "Unknown sub-query";
  subGraphName: string = "";
  duration: number = 0;
  offset: number = 0;
}
