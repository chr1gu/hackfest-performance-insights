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
  | "AkamaiOriginHostSystem"
  | "IsomorphRenderHostSystem"
  | "IsomorphInitialPropsHostSystem"
  | "GraphQLGateway"
  | "Grapholith";

export interface HostSystem {
  type: HostSystemType;
  duration: number;
}

export class AkamaiHostSystem implements HostSystem {
  type: HostSystemType = "AkamaiHostSystem";
  duration: number = 0;
  location: string | undefined = undefined;
}

export class AkamaiOriginHostSystem extends AkamaiHostSystem {
  type: HostSystemType = "AkamaiOriginHostSystem";
  children: HostSystem[] = [];
}

export class IsomorphRenderHostSystem implements HostSystem {
  type: HostSystemType = "IsomorphRenderHostSystem";
  duration: number = 0;
}

export class IsomorphInitialPropsHostSystem implements HostSystem {
  type: HostSystemType = "IsomorphInitialPropsHostSystem";
  duration: number = 0;
  children: HostSystem[] = [];
}

export interface AkamaiInfo {
  edgeDuration: number;
  edgeLocation: string | undefined;
  cacheLocation: string | undefined;
  originDuration: number;
}

export class GraphQlGatewayHostSystem implements HostSystem {
  type: HostSystemType = "GraphQLGateway";
  queryName: string = "Unknown gateway query";
  duration: number = 0;
  subGraphQueries?: SubGraphQuery[] = [];
}

export class GrapholithHostSystem implements HostSystem {
  type: HostSystemType = "Grapholith";
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
