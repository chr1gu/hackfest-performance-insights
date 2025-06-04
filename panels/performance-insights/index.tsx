import { createRoot } from "react-dom/client";
import { Breadcrumbs } from "./breadcrumbs";
import { ServerTimings } from "./serverTimings";
import { PanelHeader } from "./PanelHeader";
import { PageInsightRequests } from "./pageInsightRequests";
import { PerformanceInsightsTable } from "./PerformanceInsightsTable";
import { useState } from "react";
import { PerformanceInsightDetail } from "./PerformanceInsightDetail";

const PerformanceInsights = () => {
  const [selectedInsights, setSelectedInsights] = useState<string | null>(null);

  const onRowSelection = (id: string) => {
    if (id === selectedInsights) {
      setSelectedInsights(null);
    } else {
      setSelectedInsights(id);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PanelHeader />
      <PerformanceInsightsTable
        requestId={selectedInsights}
        onRowSelection={onRowSelection}
      />
      {selectedInsights ? (
        <PerformanceInsightDetail requestId={selectedInsights} />
      ) : null}

      {/* <Breadcrumbs />
      <ServerTimings />
      <PageInsightRequests /> */}
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<PerformanceInsights />);
