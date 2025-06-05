import type { FunctionComponent } from "~node_modules/@types/react";
import { colorMap } from "./colors";

type InfrastructureTagProps = {
  count: number;
  tag:
    | "Akamai"
    | "Frontend"
    | "Gateway"
    | "Grapholith"
    | "Subgraph"
    | "Database";
};

export const InfrastructureTag: FunctionComponent<InfrastructureTagProps> = ({
  tag,
  count,
}) => {
  if (count <= 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "inline-block",
        padding: "3px 8px",
        borderRadius: "40px",
        backgroundColor: colorMap[tag].backgroundColor,
        fontSize: "13px",
        letterSpacing: "0.25px",
        color: colorMap[tag].color,
        border: `1px solid ${colorMap[tag].borderColor}`,
      }}
    >
      {tag} {count > 1 ? `(${count})` : ""}
    </div>
  );
};
