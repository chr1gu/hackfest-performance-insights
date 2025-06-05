import type { FunctionComponent } from "~node_modules/@types/react";
import { useMemo } from "react";
import { usePageInsightsStorage } from "~shared/storage";
import { FlameGraph } from "./FlameGraph";
import { DataDogLink } from "./DataDogLink";

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
          <DataDogLink href="yolo">Service</DataDogLink>
          <DataDogLink href="yolo">Resource</DataDogLink>
          <DataDogLink href="yolo">Trace</DataDogLink>
        </span>
      </h2>
      {(request.completed && <FlameGraph request={request} />) || (
        <p style={{ color: "gray" }}>
          No flame graph available for pending requests.
        </p>
      )}
    </div>
  );
};
