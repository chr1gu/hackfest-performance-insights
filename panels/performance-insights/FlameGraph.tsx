import type {
  CSSProperties,
  FunctionComponent,
} from "~node_modules/@types/react";
import {
  GraphQlGatewayHostSystem,
  type GrapholithHostSystem,
  type HostSystem,
  type PageInsightRequest,
} from "~shared/pageInsights";
import React from "react";
import { colorMap, type Infrastructure } from "./colors";
import { get } from "http";

interface FlameGraphProps {
  request: PageInsightRequest;
}

interface Span {
  type: Infrastructure;
  durationInPercent: number;
  offset: number;
  percent: number;
}

interface RowData {
  queryName: string;
  subGraphName?: string;
  spans: Span[];
}

function getQueryName(hosts: HostSystem[]): string {
  if (hosts[0].type === "AkamaiHostSystem") {
    return "Akamai";
  } else if (hosts[0].type === "GraphQLGateway") {
    return (
      (hosts[0] as GraphQlGatewayHostSystem).queryName || "GraphQL Gateway"
    );
  } else if (hosts[0].type === "Grapholith") {
    return (hosts[0] as GrapholithHostSystem).queryName || "Grapholith";
  } else if (hosts[0].type === "IsomorphHostSystem") {
    return "Isomorph";
  }

  return "Unknown";
}

function getSubGraphName(hosts: HostSystem[]): string {
  if (hosts[0].type === "AkamaiHostSystem") {
    return "";
  } else if (hosts[0].type === "GraphQLGateway") {
    return (
      (hosts[0] as GraphQlGatewayHostSystem).queryName || "GraphQL Gateway"
    );
  } else if (hosts[0].type === "Grapholith") {
    return (hosts[0] as GrapholithHostSystem).queryName || "Grapholith";
  } else if (hosts[0].type === "IsomorphHostSystem") {
    return "";
  }

  return "Unknown";
}

function getRows(rows: RowData[], hosts: HostSystem[], baseOffset: number) {
  if (hosts.length === 0) {
    return;
  }

  const row: RowData = {
    queryName: getQueryName(hosts),
    subGraphName: getSubGraphName(hosts),
    spans: [],
  };

  rows.push(row);

  for (const host of hosts) {
    row.spans.push({
      type: host.type as Infrastructure,
      durationInPercent: (host.duration / 1000) * 100,
      offset: (baseOffset / 1000) * 100,
      percent: (host.duration / 1000) * 100,
    });

    if (host.children && host.children.length > 0) {
      getRows(rows, host.children, baseOffset + host.duration);
    }
  }
}

export const FlameGraph: FunctionComponent<FlameGraphProps> = ({ request }) => {
  if (!request.response) {
    return null;
  }

  const rows: RowData[] = [];
  getRows(rows, request.response.hosts, 0);

  console.log("FlameGraph rows", request.response.hosts, rows);
  //let baseOffset = request.response.akamaiInfo.edgeDuration;
  const totalDuration = request.response.totalDuration;
  const baseOffset = 0;
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {rows.map((row, index) => {
          return (
            <tr key={index}>
              <th style={thStyles}>{row.queryName}</th>
              <th style={thStyles}>{row.subGraphName}</th>
              <td style={tdStyles}>
                {row.spans.map((span, spanIndex) => (
                  <TimeSpan
                    key={spanIndex}
                    duration={span.durationInPercent}
                    durationInPercent={span.durationInPercent}
                    offset={span.offset}
                    type={span.type}
                    title={row.queryName}
                  />
                ))}
              </td>
            </tr>
          );
        })}

        {request.response.hosts.map((host, index) => {
          if (isGrapholithHostSystem(host)) {
            return (
              <tr key={index}>
                <th style={thStyles}>{host.queryName}</th>
                <th style={thStyles}>Grapholith</th>
                <td style={tdStyles}>
                  <TimeSpan
                    duration={host.duration || 0}
                    durationInPercent={
                      ((host.duration || 0) / totalDuration) * 100
                    }
                    offset={(baseOffset / totalDuration) * 100}
                    type="Grapholith"
                  />
                </td>
              </tr>
            );
          }

          if (isGraphQlGatewayHostSystem(host)) {
            return (
              <React.Fragment key={index}>
                <tr key={index}>
                  <th style={thStyles}>{host.queryName}</th>
                  <th style={thStyles}>GraphQL Gateway</th>
                  <td style={tdStyles}>
                    <TimeSpan
                      duration={host.duration || 0}
                      durationInPercent={
                        ((host.duration || 0) / totalDuration) * 100
                      }
                      offset={(baseOffset / totalDuration) * 100}
                      type="Gateway"
                    />
                  </td>
                </tr>

                {host.subGraphQueries
                  ?.sort((a, b) => (a.offset || 0) - (b.offset || 0))
                  .map((subQuery, subIndex) => {
                    // Calculate the offset for sub-queries based on the base offset
                    const subQueryOffset =
                      ((baseOffset + (subQuery.offset || 0)) / totalDuration) *
                      100;

                    return (
                      <tr key={subIndex + " " + index}>
                        <th style={thStyles}>{subQuery.queryName}</th>
                        <th style={thStyles}>{subQuery.subGraphName}</th>
                        <td style={tdStyles}>
                          <TimeSpan
                            key={subIndex}
                            duration={subQuery.duration || 0}
                            durationInPercent={
                              ((subQuery.duration || 0) / totalDuration) * 100
                            }
                            offset={subQueryOffset}
                            type="Subgraph"
                          />
                        </td>
                      </tr>
                    );
                  })}
              </React.Fragment>
            );
          }
        })}
      </tbody>
    </table>
  );
};

function isGraphQlGatewayHostSystem(
  host: HostSystem
): host is GraphQlGatewayHostSystem {
  return "subGraphQueries" in host;
}

function isGrapholithHostSystem(
  host: HostSystem
): host is GrapholithHostSystem {
  return host.type === "Grapholith";
}

interface TimeSpanProps {
  duration: number;
  durationInPercent: number;
  offset: number;
  type: Infrastructure;
  title?: string;
}

const TimeSpan: FunctionComponent<TimeSpanProps> = ({
  duration: time,
  durationInPercent: duration,
  offset,
  type,
  title,
}) => {
  let colors = colorMap[type];
  if (!colors) {
    colors = {
      color: "black",
      backgroundColor: "lightgray",
      borderColor: "gray",
    };
  }

  return (
    <span
      style={{
        display: "block",
        position: "relative",
        marginLeft: `calc(${offset}% + 2px)`,
        marginRight: "2px",
        marginBottom: "8px",
        width: `calc(${duration}% - 5px)`,
        minWidth: "5px",
        height: "14px",
        backgroundColor: colors.backgroundColor,
        float: "left",
        fontSize: "12px",
        color: "black",
        lineHeight: "24px",
        borderRadius: "2px",
        letterSpacing: "0.01em",
      }}
      title={`${time}ms`}
    >
      <span
        style={{
          position: "absolute",
          marginTop: "-5px",
          top: "100%",
          left: "0",
          whiteSpace: "nowrap",
        }}
      >
        {time}ms
        {title && " " + title}
      </span>
    </span>
  );
};

const thStyles: CSSProperties = {
  textAlign: "left",
  fontSize: "14px",
  padding: "12px 8px 12px 0",
  borderBottom: "1px solid rgba(221, 221, 221, .5)",
  fontWeight: 650,
  letterSpacing: "0.01em",
  width: "1px",
  whiteSpace: "nowrap",
};

const tdStyles: CSSProperties = {
  position: "relative",
  padding: "4px 0",
  borderBottom: "1px solid rgba(221, 221, 221, .5)",
};
