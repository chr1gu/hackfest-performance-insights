import performanceInsightsHTML from "url:./panels/performance-insights/index.html";

chrome.devtools.panels.create(
  "DG Performance Insights",
  null,
  // See: https://github.com/PlasmoHQ/plasmo/issues/106#issuecomment-1188539625
  performanceInsightsHTML.split("/").pop()
);
