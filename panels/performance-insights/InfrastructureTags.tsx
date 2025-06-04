import { type FunctionComponent } from "~node_modules/@types/react";
import { type ReactNode, Children } from "react";

type InfrastructureTagsProps = {
  children?: ReactNode;
};

export const InfrastructureTags: FunctionComponent<InfrastructureTagsProps> = ({
  children,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {children}
    </div>
  );
};
