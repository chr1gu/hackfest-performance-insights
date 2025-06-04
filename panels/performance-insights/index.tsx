import { createRoot } from "react-dom/client";
import { Breadcrumbs } from "./breadcrumbs";
import { ServerTimings } from "./serverTimings";
import { PanelHeader } from "./PanelHeader";
import { PageInsightRequests } from "./pageInsightRequests";
import { PerformanceInsightsTable } from "./PerformanceInsightsTable";
import { useState } from "react";
import { PerformanceInsightDetail } from "./PerformanceInsightDetail";

const PerformanceInsights = () => {
  const [requestId, setSelectedInsights] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const onRowSelection = (id: string) => {
    if (id === requestId) {
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
      <PanelHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <PerformanceInsightsTable
        requestId={requestId}
        onRowSelection={onRowSelection}
        searchTerm={searchTerm}
      />
      {requestId ? <PerformanceInsightDetail requestId={requestId} /> : null}

      {/* <Breadcrumbs />
      <ServerTimings />
      <PageInsightRequests /> */}
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<PerformanceInsights />);

// Open a connection to the background script to detect when the panel is open or closed
chrome.runtime.connect({ name: "devToolsPanel" });
