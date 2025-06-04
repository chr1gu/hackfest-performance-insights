import { createRoot } from "react-dom/client";
import { Breadcrumbs } from "./breadcrumbs";
import { ServerTimings } from "./serverTimings";
import { PanelHeader } from "./PanelHeader";
import { RequestTag } from "./RequestTag";
import { InfrastructureTag } from "./InfrastructureTag";
import { InfrastructureTags } from "./InfrastructureTags";
import type { CSSProperties } from "~node_modules/@types/react";
import { PageInsightRequests } from "./pageInsightRequests";

const thStyles: CSSProperties = {
  textAlign: "left",
  fontSize: "14px",
  padding: "12px 0",
};

const tdStyles: CSSProperties = {
  textAlign: "left",
  fontSize: "14px",
  padding: "12px 0",
};

const PerformanceInsights = () => {
  return (
    <>
      <PanelHeader />
      <div
        style={{
          padding: "24px 20px",
          position: "relative",
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
                borderBottom: "1px solid rgb(221, 221, 221)",
              }}
            >
              <th style={thStyles}>Type</th>
              <th style={thStyles}>Request</th>
              <th style={thStyles}>Duration</th>
              <th style={thStyles}>Involved Infrastructure</th>
            </tr>
          </thead>
          <tbody>
            <tr
              style={{
                borderBottom: "1px solid rgb(221, 221, 221)",
              }}
            >
              <td
                style={{ ...tdStyles, padding: "4px 12px 4px 0" }}
                width="1px"
              >
                <RequestTag tag="Document" />
              </td>
              <td style={tdStyles} width="400px">
                Document Request
              </td>
              <td style={tdStyles} width="auto">
                350ms
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
            </tr>
            <tr
              style={{
                borderBottom: "1px solid rgb(221, 221, 221)",
              }}
            >
              <td
                style={{ ...tdStyles, padding: "4px 12px 4px 0" }}
                width="1px"
              >
                <RequestTag tag="GraphQL" />
              </td>
              <td style={tdStyles} width="400px">
                productDetailPageQuery
              </td>
              <td style={tdStyles} width="auto">
                150ms
              </td>
              <td style={tdStyles} width="auto">
                <InfrastructureTags>
                  <InfrastructureTag tag="Akamai" />
                  <InfrastructureTag tag="Gateway" />
                  <InfrastructureTag tag="Subgraph" />
                  <InfrastructureTag tag="Database" />
                </InfrastructureTags>
              </td>
            </tr>
            <tr
              style={{
                borderBottom: "1px solid rgb(221, 221, 221)",
              }}
            >
              <td
                style={{ ...tdStyles, padding: "4px 12px 4px 0" }}
                width="1px"
              >
                <RequestTag tag="GraphQL" />
              </td>
              <td style={tdStyles} width="400px">
                productDetailPageQuery
              </td>
              <td style={tdStyles} width="auto">
                150ms
              </td>
              <td style={tdStyles} width="auto">
                <InfrastructureTags>
                  <InfrastructureTag tag="Akamai" />
                  <InfrastructureTag tag="Gateway" />
                  <InfrastructureTag tag="Subgraph" />
                  <InfrastructureTag tag="Database" />
                </InfrastructureTags>
              </td>
            </tr>
            <tr
              style={{
                borderBottom: "1px solid rgb(221, 221, 221)",
              }}
            >
              <td
                style={{ ...tdStyles, padding: "4px 12px 4px 0" }}
                width="1px"
              >
                <RequestTag tag="GraphQL" />
              </td>
              <td style={tdStyles} width="400px">
                productDetailPageQuery
              </td>
              <td style={tdStyles} width="auto">
                150ms
              </td>
              <td style={tdStyles} width="auto">
                <InfrastructureTags>
                  <InfrastructureTag tag="Akamai" />
                  <InfrastructureTag tag="Gateway" />
                  <InfrastructureTag tag="Subgraph" />
                  <InfrastructureTag tag="Database" />
                </InfrastructureTags>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Breadcrumbs />
      <ServerTimings />
      <PageInsightRequests />
    </>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<PerformanceInsights />);

// Open a connection to the background script to detect when the panel is open or closed
chrome.runtime.connect({ name: "devToolsPanel" });
