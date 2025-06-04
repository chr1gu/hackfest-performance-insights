import { useStorage } from "@plasmohq/storage/hook";
import type {
  CSSProperties,
  FunctionComponent,
} from "~node_modules/@types/react";
import type { PageInsights } from "~shared/pageInsights";
import { InfrastructureTag } from "./InfrastructureTag";
import { InfrastructureTags } from "./InfrastructureTags";
import { RequestTag } from "./RequestTag";

const thStyles: CSSProperties = {
  textAlign: "left",
  fontSize: "14px",
  padding: "12px 0",
  borderBottom: "1px solid rgb(221, 221, 221)",
};

const tdStyles: CSSProperties = {
  textAlign: "left",
  fontSize: "14px",
  padding: "12px 0",
};

type PerformanceInsightsTableProps = {
  requestId?: string | null;
  onRowSelection?: (id: string) => void;
};

export const PerformanceInsightsTable: FunctionComponent<
  PerformanceInsightsTableProps
> = ({ requestId, onRowSelection }) => {
  const [pageInsights] = useStorage<PageInsights>("pageInsights");

  const insights = pageInsights
    ? [
        ...pageInsights.requests,
        ...pageInsights.requests,
        ...pageInsights.requests,
        ...pageInsights.requests,
        ...pageInsights.requests,
        ...pageInsights.requests,
        ...pageInsights.requests,
      ]
    : [];

  return (
    <>
      <div style={{ height: "50px", flex: "0 0 auto" }}>Filter Here</div>
      <div
        style={{
          padding: "20px 20px",
          position: "relative",
          flex: "1 1 auto",
          overflow: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                position: "sticky",
                top: "-20px",
                backgroundColor: "white",
                zIndex: 100,
              }}
            >
              <th style={thStyles}>Type</th>
              <th style={thStyles}>Request</th>
              <th style={thStyles}>Duration</th>
              <th style={thStyles}>Involved Infrastructure</th>
            </tr>
          </thead>
          <tbody>
            {insights.map((request) => (
              <tr
                style={{
                  borderBottom: "1px solid rgb(221, 221, 221)",
                  backgroundColor:
                    requestId === request.requestId ? "#f5f5f5" : "transparent",
                }}
                onClick={() =>
                  onRowSelection ? onRowSelection(request.requestId) : undefined
                }
              >
                <td
                  style={{ ...tdStyles, padding: "12px 12px 12px 0" }}
                  width="1px"
                >
                  <RequestTag tag="Document" />
                </td>
                <td style={tdStyles} width="auto">
                  {request.name}
                </td>
                {!request.completed ? (
                  <>
                    <td style={tdStyles} width="auto" colSpan={2}>
                      Pending...
                    </td>
                  </>
                ) : (
                  <>
                    <td
                      style={{
                        ...tdStyles,
                        textAlign: "right",
                        paddingRight: "20px",
                      }}
                      width="auto"
                    >
                      {request.response.totalDuration}ms
                    </td>
                    <td style={tdStyles} width="auto">
                      <InfrastructureTags>
                        <InfrastructureTag tag="Akamai" />
                        <InfrastructureTag tag="Frontend" />
                        <InfrastructureTag tag="Gateway" />
                        <InfrastructureTag tag="Subgraph" />
                        <InfrastructureTag tag="Database" />
                      </InfrastructureTags>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
