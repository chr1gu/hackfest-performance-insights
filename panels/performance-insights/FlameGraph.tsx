import type {
  CSSProperties,
  FunctionComponent,
} from "~node_modules/@types/react";
import {
  GraphQlGatewayHostSystem,
  type CompletePageInsightRequest,
} from "~shared/pageInsights";

interface FlameGraphProps {
  request: CompletePageInsightRequest;
}

export const FlameGraph: FunctionComponent<FlameGraphProps> = ({ request }) => {
  const totalDuration = request.response.totalDuration;

  console.dir(request.response);

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <th style={thStyles}>Akamai</th>
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
        {request.response.hosts.map((host, index) => (
          <>
            <tr key={index}>
              <th style={thStyles}>{host.name}</th>
              <td style={tdStyles}>
                <TimeSpan
                  duration={host.duration || 0}
                  durationInPercent={
                    ((host.duration || 0) / totalDuration) * 100
                  }
                  offset={0}
                />
              </td>
            </tr>

            {host instanceof GraphQlGatewayHostSystem
              ? host.subGraphQueries?.map((subQuery, subIndex) => (
                  <tr key={subIndex}>
                    <th style={thStyles}>{host.name}</th>
                    <td style={tdStyles}>
                      <TimeSpan
                        key={subIndex}
                        duration={subQuery.duration || 0}
                        durationInPercent={
                          ((subQuery.duration || 0) / totalDuration) * 100
                        }
                        offset={0}
                      />
                    </td>
                  </tr>
                ))
              : null}
          </>
        ))}
      </tbody>
    </table>
  );
};

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
  padding: "12px 0",
  borderBottom: "1px solid rgba(221, 221, 221, .5)",
  fontWeight: 650,
  letterSpacing: "0.01em",
  width: "200px",
};

const tdStyles: CSSProperties = {
  position: "relative",
  padding: "4px 0",
  borderBottom: "1px solid rgba(221, 221, 221, .5)",
};
