import { useStorage } from "@plasmohq/storage/hook";
import type { PageInsights } from "~shared/pageInsights";

export const PageInsightRequests = () => {
  const [pageInsights] = useStorage<PageInsights>("pageInsights");

  console.log("--------Page Insights Requests:", pageInsights?.requests);

  return (
    <div>
      <h2>Page Insight Requests</h2>
      <ul>
        {pageInsights?.requests.map((request) => (
          <li key={request.requestId}>
            <strong>{request.name}</strong> -{" "}
            {request.completed ? "Completed" : "Pending"}
            <br />
            Request ID: {request.requestId}
            <br />
            Total Duration: {request.response?.totalDuration || "N/A"} ms
            <br />
            Akamai Info: edge{" "}
            {request.response?.akamaiInfo.edgeDuration || "N/A"} ms , origin{" "}
            {request.response?.akamaiInfo.originDuration || "N/A"} ms
            <br />
            Hosts: {request.response?.hosts.map((host) => host.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};
