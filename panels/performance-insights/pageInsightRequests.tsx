import { useStorage } from "@plasmohq/storage/hook";
import {
  GraphQlGatewayHostSystem,
  type HostSystem,
  type PageInsights,
} from "~shared/pageInsights";
import { Storage } from "@plasmohq/storage";

const GraphQlGatewayHostSystemComponent = ({
  host,
}: {
  host: GraphQlGatewayHostSystem;
}) => {
  return (
    <span>
      {host.name} ({host.queryName}) -{" "}
      {host.duration ? `${host.duration} ms` : "N/A"}
      {host.subGraphQueries && host.subGraphQueries.length > 0 && (
        <ul>
          {host.subGraphQueries.map((subQuery, index) => (
            <li key={index}>
              {subQuery.name} ({subQuery.queryName}) -{" "}
              {subQuery.duration ? `${subQuery.duration} ms` : "N/A"}
            </li>
          ))}
        </ul>
      )}
    </span>
  );
};

const HostSystem = (host: HostSystem) => {
  if (host instanceof GraphQlGatewayHostSystem) {
    return (
      <GraphQlGatewayHostSystemComponent
        host={host as GraphQlGatewayHostSystem}
      />
    );
  }
  return (
    <span>
      {host.name} ({host.duration ? `${host.duration} ms` : "N/A"})
    </span>
  );
};

export const PageInsightRequests = () => {
  const [pageInsights] = useStorage<PageInsights>({
    key: "pageInsights",
    instance: new Storage({
      area: "local",
    }),
  });

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
