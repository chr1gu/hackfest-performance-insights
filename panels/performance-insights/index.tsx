import { createRoot } from "react-dom/client";
import { Breadcrumbs } from "./breadcrumbs";
import { ServerTimings } from "./serverTimings";
import { PageInsightRequests } from "./pageInsightRequests";

const PerformanceInsights = () => {
  return (
    <>
      <h1>Performance Insights</h1>
      <Breadcrumbs />
      <ServerTimings />
      <PageInsightRequests />
    </>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<PerformanceInsights />);
