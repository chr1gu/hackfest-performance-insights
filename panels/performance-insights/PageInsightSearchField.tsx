import React from "react";

interface PageInsightSearchFieldProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const PageInsightSearchField: React.FC<PageInsightSearchFieldProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search insights by name or ID..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        style={{
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "300px",
        }}
      />
    </div>
  );
};

export default PageInsightSearchField;
