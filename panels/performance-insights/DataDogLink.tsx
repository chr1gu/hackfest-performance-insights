import React, { type FunctionComponent } from "react";

type DataDogLinkProps = {
  href: string;
  children: React.ReactNode;
};

export const DataDogLink: FunctionComponent<DataDogLinkProps> = ({
  href,
  children,
}) => (
  <a
    href={href}
    style={{
      display: "inline-block",
      background: "#6331b6",
      color: "#fff",
      padding: "8px 8px",
      borderRadius: 4,
      textAlign: "center",
      fontWeight: 650,
      fontSize: 12,
      letterSpacing: 1,
      textDecoration: "none",
      textTransform: "uppercase",
      boxSizing: "border-box",
      border: "none",
      cursor: "pointer",
      userSelect: "none",
    }}
  >
    {children}
  </a>
);
