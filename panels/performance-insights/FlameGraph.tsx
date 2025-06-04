import type {
  CSSProperties,
  FunctionComponent,
} from "~node_modules/@types/react";
import type { CompletePageInsightRequest } from "~shared/pageInsights";

interface FlameGraphProps {
  request: CompletePageInsightRequest;
}

export const FlameGraph: FunctionComponent<FlameGraphProps> = ({ request }) => {
  const totalDuration = request.response.totalDuration;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <th style={thStyles}>Akamai</th>
          <td style={tdStyles}>
            <div>
              <TimeSpan
                duration={
                  (request.response.akamaiInfo.edgeDuration / totalDuration) *
                  100
                }
                offset={0}
              />
              <TimeSpan
                duration={
                  (request.response.akamaiInfo.originDuration / totalDuration) *
                  100
                }
                offset={0}
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

interface TimeSpanProps {
  duration: number;
  offset: number;
}

const TimeSpan: FunctionComponent<TimeSpanProps> = ({ duration, offset }) => {
  return (
    <span
      style={{
        display: "block",
        marginLeft: `calc(${offset}% + 1px)`,
        marginRight: "1px",
        width: `calc(${duration}% - 4px)`,
        height: "20px",
        backgroundColor: "#228be6",
        float: "left",
        border: "1px solid #000",
      }}
    ></span>
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
  textAlign: "left",
  fontSize: "14px",
  padding: "4px 0",
  borderBottom: "1px solid rgba(221, 221, 221, .5)",
  letterSpacing: "0.01em",
};
