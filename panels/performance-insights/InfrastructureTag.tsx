import type { FunctionComponent } from "~node_modules/@types/react";

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

const colorMap: Record<
  InfrastructureTagProps["tag"],
  { borderColor: string; color: string; backgroundColor: string }
> = {
  Akamai: {
    color: "#fff",
    backgroundColor: "#228be6",
    borderColor: "#228be6",
  },
  Frontend: {
    color: "#fff",
    backgroundColor: "#40c057",
    borderColor: "#40c057",
  },
  Gateway: {
    color: "#fff",
    backgroundColor: "#fa5252",
    borderColor: "#fa5252",
  },
  Grapholith: {
    color: "#fff",
    backgroundColor: "#fa5252",
    borderColor: "#fa5252",
  },
  Subgraph: {
    color: "#fff",
    backgroundColor: "#fa5252",
    borderColor: "#fa5252",
  },
  Database: {
    color: "#000",
    backgroundColor: "#eeee00",
    borderColor: "#eeee00",
  },
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
