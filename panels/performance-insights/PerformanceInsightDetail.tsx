import type { FunctionComponent } from "~node_modules/@types/react";
import { useMemo } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import type { PageInsights } from "~shared/pageInsights";

interface PerformanceInsightDetailProps {
  requestId: string;
}

export const PerformanceInsightDetail: FunctionComponent<
  PerformanceInsightDetailProps
> = ({ requestId }) => {
  const [pageInsights] = useStorage<PageInsights>("pageInsights");

  const request = useMemo(() => {
    return pageInsights?.requests.find((req) => req.requestId === requestId);
  }, [requestId]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "50%",
        backgroundColor: "#fdfdfd",
        borderTop: "1px solid rgb(221, 221, 221)",
        zIndex: 100,
      }}
    >
      <h2>Performance Insight Detail</h2>
      <p>Request ID: {requestId}</p>
    </div>
  );
};
