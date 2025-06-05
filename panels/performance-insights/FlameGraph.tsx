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

interface FlameGraphProps {
  request: PageInsightRequest;
}

export const FlameGraph: FunctionComponent<FlameGraphProps> = ({ request }) => {
  if (!request.response) {
    return null;
  }

  let baseOffset = request.response.akamaiInfo.edgeDuration;
  const totalDuration = request.response.totalDuration;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <th style={thStyles} colSpan={2}>
            Akamai
          </th>
          <td style={tdStyles}>
            <TimeSpan
              duration={request.response.akamaiInfo.edgeDuration}
              durationInPercent={
                (request.response.akamaiInfo.edgeDuration / totalDuration) * 100
              }
              offset={0}
              type="Akamai"
            />
            <TimeSpan
              duration={request.response.akamaiInfo.originDuration}
              durationInPercent={
                (request.response.akamaiInfo.originDuration / totalDuration) *
                100
              }
              offset={0}
              type="Akamai"
            />
          </td>
        </tr>
        {request.response.isoDuration && (
          <tr>
            <th style={thStyles} colSpan={2}>
              Isomorph
            </th>
            <td style={tdStyles}>
              <TimeSpan
                duration={request.response.isoDuration.getInitialProps}
                durationInPercent={
                  (request.response.isoDuration.getInitialProps /
                    totalDuration) *
                  100
                }
                offset={(baseOffset / totalDuration) * 100}
                type="Frontend"
                title="getInitialProps"
              />
              <TimeSpan
                duration={request.response.isoDuration.render}
                durationInPercent={
                  (request.response.isoDuration.render / totalDuration) * 100
                }
                offset={0}
                type="Frontend"
                title="render"
              />
            </td>
          </tr>
        )}
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
  const colors = colorMap[type];
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
