import type { FunctionComponent } from "~node_modules/@types/react";
import type { RequestType } from "~shared/pageInsights";

type RequestTagProps = {
  tag: RequestType;
};

const colorMap: Record<
  RequestType,
  { borderColor: string; color: string; backgroundColor: string }
> = {
  Document: {
    color: "#fff",
    backgroundColor: "#228be6",
    borderColor: "#1971c2",
  },
  GraphQL: {
    color: "#fff",
    backgroundColor: "#fa5252",
    borderColor: "#e03131",
  },
  Grapholith: {
    color: "#fff",
    backgroundColor: "#52e4fa",
    borderColor: "#52e4fa",
  },
};

export const RequestTag: FunctionComponent<RequestTagProps> = ({ tag }) => {
  return (
    <div
      style={{
        display: "inline-block",
        padding: "3px 8px",
        borderRadius: "20px",
        backgroundColor: colorMap[tag]?.backgroundColor,
        fontSize: "13px",
        letterSpacing: "0.25px",
        color: colorMap[tag]?.color,
        border: `1px solid ${colorMap[tag]?.borderColor}`,
        whiteSpace: "nowrap",
      }}
    >
      {tag}
    </div>
  );
};
