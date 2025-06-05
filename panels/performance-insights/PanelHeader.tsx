import type { FunctionComponent } from "~node_modules/@types/react";
import PageInsightSearchField from "./PageInsightSearchField";
import { usePageInsightsStorage } from "~shared/storage";

export type PanelHeaderProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export const PanelHeader: FunctionComponent<PanelHeaderProps> = (props) => {
  const [pageInsights, setPageInsights] = usePageInsightsStorage();

  return (
    <>
      <div
        style={{
          flex: "0 0 auto",
          height: "9px",
          background:
            "linear-gradient(90deg, #c4a277 calc(1 / 6 * 100%), #ffc32d calc(1 / 6 * 100%) calc(2 / 6 * 100%), #f67858 calc(2 / 6 * 100%) calc(3 / 6 * 100%), #84d160 calc(3 / 6 * 100%) calc(4 / 6 * 100%), #b384d3 calc(4 / 6 * 100%) calc(5 / 6 * 100%), #72c7f9 calc(5 / 6 * 100%))",
        }}
      ></div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flex: "0 0 auto",
          alignItems: "center",
          padding: "2px 0px",
          boxShadow: "0px 0px 2px #00000029, 0px 4px 8px #00000014",
          zIndex: 2,
        }}
      >
        <div style={{ paddingLeft: "8px" }}>
          <svg
            style={{
              height: "100%",
              width: "100%",
            }}
            fill="none"
            viewBox="0 0 65 80"
            width="24"
            height="24"
          >
            <path
              fill="#000"
              fillRule="evenodd"
              d="M23.889 16.319c-.142.425-.029.596.187.92.144.215.333.499.522.972h.237c2.365-.71 4.73-1.183 7.331-1.183s4.967.473 7.332 1.183h.237c.186-.467.373-.787.516-1.031.22-.375.336-.575.193-.861-.095-.473-.265-.946-.435-1.42-.255-.709-.51-1.418-.51-2.128 0-.591.295-1.419.59-2.247.296-.827.592-1.655.592-2.246 0-.586-1.269-1.534-2.572-2.508-.802-.6-1.618-1.209-2.158-1.75-.53-.53-1.061-1.225-1.567-1.889C33.537 1.021 32.76 0 32.166 0h-.236c-.7 0-1.399.91-2.196 1.947-.55.716-1.148 1.494-1.825 2.074-.54.54-1.356 1.15-2.158 1.75-1.303.973-2.572 1.921-2.572 2.507 0 .425.24 1.089.502 1.82.322.896.68 1.892.68 2.673.339.845.073 1.69-.192 2.534-.106.338-.213.676-.28 1.014M4.969 31.455c1.892 0 3.547.237 4.73.946 1.419-3.311 3.31-6.149 5.912-8.514C10.408 19.393 1.421 18.92.475 19.63s-.946 11.825 4.493 11.825m49.902.946c-1.42-3.311-3.548-6.149-5.913-8.514 5.203-4.494 14.19-4.967 15.137-4.257.946.71.946 12.062-4.494 11.825-1.892 0-3.311.237-4.73.946m-.946 11.589c0-3.548-.71-6.859-1.892-9.933-1.183-2.838-3.075-5.44-5.203-7.569-3.548-3.547-8.041-5.44-12.771-5.912h-3.311c-4.73.473-9.224 2.365-12.772 5.912-2.128 2.129-4.02 4.73-5.203 7.569-1.419 3.074-1.892 6.385-1.892 9.933 0 3.31.71 6.385 1.892 9.46 1.183 2.601 2.602 4.967 4.494 7.095 3.074 3.311 7.095 5.676 11.352 6.622 1.182.237 2.602.473 3.784.473h1.656c5.203-.473 10.17-2.838 13.717-6.858 1.892-2.129 3.31-4.494 4.493-7.095.946-3.312 1.656-6.623 1.656-9.697m1.182 10.879c-1.182 3.075-3.074 5.913-5.44 8.278.237.71.474 1.892.71 3.074.473 5.203 11.825 4.494 12.298 3.548.71-.946-.709-11.352-7.568-14.9M32.403 70.715c1.183 0 2.365 0 3.547-.237-.236 4.257.947 8.041 5.204 8.515h.473c-1.892.709-3.784 1.182-5.677.946-4.493-.71-7.804-4.967-7.804-9.697 1.419.236 2.838.473 4.257.473M13.956 66.22c-.473 5.44-11.59 4.494-12.062 3.311-.473-.946.71-11.115 7.332-14.663 1.419 3.075 3.074 5.913 5.44 8.278-.237.71-.474 1.655-.71 3.074"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <div style={{ flex: "0 0 auto", padding: "8px 20px 8px" }}>
          <PageInsightSearchField
            searchTerm={props.searchTerm}
            setSearchTerm={props.setSearchTerm}
          />
        </div>
        <div style={{ flex: 1 }} />
        {/* Fahrverbot icon rechts als Button */}
        <button
          style={{
            background: "none",
            border: "none",
            padding: 0,
            marginLeft: "16px",
            marginRight: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          title="Clear Cache"
          onClick={() => {
            setPageInsights(() => ({
              requests: [],
            }));
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="14"
              cy="14"
              r="13"
              fill="#F5F6F4"
              stroke="#444941"
              strokeWidth="2"
            />
            <line
              x1="7"
              y1="21"
              x2="21"
              y2="7"
              stroke="#444941"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    </>
  );
};
