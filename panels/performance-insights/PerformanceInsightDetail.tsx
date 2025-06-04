import type { FunctionComponent } from "~node_modules/@types/react";
import { useMemo } from "react";
import { usePageInsightsStorage } from "~shared/storage";
import { FlameGraph } from "./FlameGraph";

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
        minHeight: "max(150px, 30%)",
        maxHeight: "70%",
        backgroundColor: "#fdfdfd",
        borderTop: "1px solid rgb(221, 221, 221)",
        zIndex: 100,
        padding: "20px 20px 40px",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Performance Insight Detail</h2>
      {request.completed && <FlameGraph request={request} />}
      <p>Request ID: {request.requestId}</p>
      <p>Request Name: {request.name}</p>
      <strong>{request.name}</strong> -{" "}
      {request.completed ? "Completed" : "Pending"}
      <br />
      Request ID: {request.requestId}
      {(request.completed && (
        <>
          <br />
          Total Duration: {request.response?.totalDuration || "N/A"} ms
          <br />
          Akamai Info: edge {request.response?.akamaiInfo.edgeDuration ||
            "N/A"}{" "}
          ms , origin {request.response?.akamaiInfo.originDuration || "N/A"} ms
          <br />
          Hosts: {request.response?.hosts.map((host) => host.name).join(", ")}
        </>
      )) || <p>Pending</p>}
    </div>
  );
};
