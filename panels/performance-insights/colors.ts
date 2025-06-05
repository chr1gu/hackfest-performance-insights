export type Infrastructure =
  | "Akamai"
  | "Frontend"
  | "Gateway"
  | "Grapholith"
  | "Subgraph"
  | "Database";

export const colorMap: Record<
  Infrastructure,
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
