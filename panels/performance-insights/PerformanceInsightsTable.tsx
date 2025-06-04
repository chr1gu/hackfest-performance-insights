import type {
  CSSProperties,
  FunctionComponent,
} from "~node_modules/@types/react";
import { InfrastructureTag } from "./InfrastructureTag";
import { InfrastructureTags } from "./InfrastructureTags";
import { RequestTag } from "./RequestTag";
import { useState, useMemo } from "react";
import PageInsightSearchField from "./PageInsightSearchField";
import { usePageInsightsStorage } from "~shared/storage";

const thStyles: CSSProperties = {
  textAlign: "left",
  fontSize: "14px",
  padding: "12px 0",
  borderBottom: "1px solid rgb(221, 221, 221)",
  fontWeight: 650,
  letterSpacing: "0.01em",
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
  const [searchTerm, setSearchTerm] = useState("");
  const pageInsights = usePageInsightsStorage();

  const requests = useMemo(() => {
    return (
      pageInsights?.requests.filter((request) => {
        return request.name.toLowerCase().includes(searchTerm.toLowerCase());
      }) || []
    );
  }, [pageInsights, searchTerm]);

  return (
    <>
      <div style={{ flex: "0 0 auto", padding: "16px 20px 8px" }}>
        <PageInsightSearchField
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <div
        style={{
          padding: "0 20px 20px",
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
            {requests.map((request) => (
              <tr
                key={request.requestId}
                style={{
                  borderBottom: "1px solid rgb(221, 221, 221)",
                  backgroundColor:
                    requestId === request.requestId ? "#f5f5f5" : "transparent",
                  cursor: "pointer",
                }}
                onClick={() =>
                  onRowSelection ? onRowSelection(request.requestId) : undefined
                }
              >
                <td
                  style={{ ...tdStyles, padding: "12px 12px 12px 0" }}
                  width="1px"
                >
                  <RequestTag tag={request.type} />
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
