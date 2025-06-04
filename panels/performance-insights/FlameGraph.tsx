import type {
  CSSProperties,
  FunctionComponent,
} from "~node_modules/@types/react";
import {
  GraphQlGatewayHostSystem,
  type CompletePageInsightRequest,
  type HostSystem,
} from "~shared/pageInsights";
import React from "react";

interface FlameGraphProps {
  request: CompletePageInsightRequest;
}

export const FlameGraph: FunctionComponent<FlameGraphProps> = ({ request }) => {
  let baseOffset = request.response.akamaiInfo.edgeDuration;
  const totalDuration = request.response.totalDuration;

  console.dir(request.response);

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
            />
            <TimeSpan
              duration={request.response.akamaiInfo.originDuration}
              durationInPercent={
                (request.response.akamaiInfo.originDuration / totalDuration) *
                100
              }
              offset={0}
            />
          </td>
        </tr>
        {request.response.hosts.map((host, index) => {
          console.log("Host:", host);

          const isGraphQlGateway = isGraphQlGatewayHostSystem(host);

          if (!isGraphQlGateway) {
            return null;
          }

          return (
            <React.Fragment key={index}>
              {/* If the host is a GraphQL gateway, we need to adjust the base offset */}
              <tr key={index}>
                <th style={thStyles}>{host.queryName}</th>
                <th style={thStyles}>{host.name}</th>
                <td style={tdStyles}>
                  <TimeSpan
                    duration={host.duration || 0}
                    durationInPercent={
                      ((host.duration || 0) / totalDuration) * 100
                    }
                    offset={(baseOffset / totalDuration) * 100}
                  />
                </td>
              </tr>

              {isGraphQlGatewayHostSystem(host)
                ? host.subGraphQueries
                    ?.sort((a, b) => (a.offset || 0) - (b.offset || 0))
                    .map((subQuery, subIndex) => {
                      // Calculate the offset for sub-queries based on the base offset
                      const subQueryOffset =
                        ((baseOffset + (subQuery.offset || 0)) /
                          totalDuration) *
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
                            />
                          </td>
                        </tr>
                      );
                    })
                : null}
            </React.Fragment>
          );
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

interface TimeSpanProps {
  duration: number;
  durationInPercent: number;
  offset: number;
}

const TimeSpan: FunctionComponent<TimeSpanProps> = ({
  duration: time,
  durationInPercent: duration,
  offset,
}) => {
  return (
    <span
      style={{
        display: "block",
        marginLeft: `calc(${offset}% + 2px)`,
        marginRight: "2px",
        width: `calc(${duration}% - 4px)`,
        minWidth: "18px",
        height: "24px",
        backgroundColor: "#228be6",
        float: "left",
        fontSize: "14px",
        color: "#fff",
        textAlign: "center",
        lineHeight: "24px",
        borderRadius: "2px",
        letterSpacing: "0.01em",
      }}
      title={`${time}ms`}
    >
      {time}ms
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
