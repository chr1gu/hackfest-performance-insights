import type { FunctionComponent } from "~node_modules/@types/react";
import { useMemo } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import type { PageInsights } from "~shared/pageInsights";
import { usePageInsightsStorage } from "~shared/storage";

interface PerformanceInsightDetailProps {
  requestId: string;
}

export const PerformanceInsightDetail: FunctionComponent<
  PerformanceInsightDetailProps
> = ({ requestId }) => {
  const pageInsights = usePageInsightsStorage();

  const request = useMemo(() => {
    return pageInsights?.requests.find((req) => req.requestId === requestId);
  }, [requestId]);

  if (!request) {
    return null;
  }

  return (
    <div
      style={{
        flex: "0 1 auto",
        minHeight: "max(300px, 30%)",
        maxHeight: "70%",
        backgroundColor: "#fdfdfd",
        borderTop: "1px solid rgb(221, 221, 221)",
        zIndex: 100,
        padding: "20px 20px 40px",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Performance Insight Detail</h2>
      <p>Request ID: {request.requestId}</p>
      <p>Request Name: {request.name}</p>
    </div>
  );
};
