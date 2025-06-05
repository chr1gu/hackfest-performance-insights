import type { FunctionComponent } from "~node_modules/@types/react";
import { useMemo } from "react";
import { usePageInsightsStorage } from "~shared/storage";
import { FlameGraph } from "./FlameGraph";
import { DataDogLink } from "./DataDogLink";
import type { GraphQlGatewayHostSystem } from "~shared/pageInsights";

interface PerformanceInsightDetailProps {
  requestId: string;
}

export const PerformanceInsightDetail: FunctionComponent<
  PerformanceInsightDetailProps
> = ({ requestId }) => {
  const [pageInsights] = usePageInsightsStorage();

  const request = useMemo(() => {
    return pageInsights?.requests.find((req) => req.requestId === requestId);
  }, [requestId, pageInsights]);

  if (!request) {
    return null;
  }

  let serviceLink: string | undefined;
  if (request.type === "Document") {
    serviceLink =
      "https://app.datadoghq.eu/apm/entity/service%3Afrontend?env=prod&operationName=next.request";
  } else if (request.type === "GraphQL") {
    serviceLink =
      "https://app.datadoghq.eu/apm/entity/service%3Adg.graphqlgateway.host?env=prod";
  } else if (request.type === "Grapholith") {
    serviceLink =
      "https://app.datadoghq.eu/apm/entity/service%3Agraphql?env=prod";
  }

  let resourceLink: string | undefined;
  if (request.type === "GraphQL" && request.response) {
    const queryName = (
      request.response.hosts.find(
        (host) => host.type === "GraphQLGateway"
      ) as GraphQlGatewayHostSystem
    )?.queryName;

    resourceLink =
      "https://app.datadoghq.eu/apm/entity/service%3Adg.graphqlgateway.host?env=prod&fromUser=false&graphType=flamegraph&groupMapByOperation=null&operationName=aspnet_core.request&panels=qson%3A%28data%3A%28%29%2Cversion%3A%210%29&resources=qson%3A%28data%3A%28visible%3A%21t%2Chits%3A%28selected%3Atotal%29%2Cerrors%3A%28selected%3Atotal%29%2Clatency%3A%28selected%3Ap95%29%2CtopN%3A%2110%2Csearch%3A" +
      queryName +
      "%29%2Cversion%3A%211%29&shouldShowLegend=true&sort=time&spanKind=server&summary=qson%3A%28data%3A%28visible%3A%21t%2Cchanges%3A%28%29%2Cerrors%3A%28selected%3Acount%29%2Chits%3A%28selected%3Arate%29%2Clatency%3A%28selected%3Alatency%2Cslot%3A%28agg%3A95%29%2Cdistribution%3A%28isLogScale%3A%21f%29%2CshowTraceOutliers%3A%21t%29%2Csublayer%3A%28slot%3A%28layers%3AserviceAndInferred%29%2Cselected%3Apercentage%29%2ClagMetrics%3A%28selectedMetric%3A%21s%2CselectedGroupBy%3A%21s%29%29%2Cversion%3A%211%29&paused=false#resources";
  }

  return (
    <div
      style={{
        flex: "0 1 auto",
        height: "60%",
        backgroundColor: "#fdfdfd",
        borderTop: "1px solid rgb(221, 221, 221)",
        zIndex: 100,
        padding: "20px 20px 40px",
        overflowY: "auto",
      }}
    >
      <h2 style={{ marginTop: 0, display: "flex" }}>
        {request.name}
        <span style={{ display: "flex", gap: "4px", marginLeft: "auto" }}>
          {serviceLink && <DataDogLink href={serviceLink}>Service</DataDogLink>}
          {resourceLink && (
            <DataDogLink href={resourceLink}>Resource</DataDogLink>
          )}
          <DataDogLink href="yolo">Trace</DataDogLink>
        </span>
      </h2>
      {(request.response && <FlameGraph request={request} />) || (
        <p style={{ color: "gray" }}>
          No flame graph available for pending requests.
        </p>
      )}
    </div>
  );
};
