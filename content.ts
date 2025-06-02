import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://www.galaxus.ch/*", "https://test-www.galaxus.ch/*"],
};

// function onLoad() {
//   console.log(
//     "Live now; make now always the most precious time. Now will never come again."
//   );

//   document.body.style.background = "pink";
// }

// window.addEventListener("load", onLoad);

// const observer = new PerformanceObserver((list) => {
//   list
//     .getEntries()
//     .forEach(
//       (entry: {
//         responseStart?: number;
//         requestStart?: number;
//         name?: string;
//       }) => {
//         const request = entry.responseStart - entry.requestStart;
//         if (request > 0) {
//           console.log(`${entry.name}: Request time: ${request}ms`);
//         }
//       }
//     );
// });

// observer.observe({ type: "resource", buffered: true });

// const messageHandler = (
//   request: any,
//   sender: chrome.runtime.MessageSender,
//   sendResponse: (response?: any) => void
// ) => {
//   console.log(
//     sender.tab
//       ? "from a content script:" + sender.tab.url
//       : "from the extension"
//   );
//   if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
// };

// chrome.runtime.onMessage.addListener(messageHandler);

// // Cleanup
// chrome.runtime.connect().onDisconnect.addListener(function () {
//   chrome.runtime.onMessage.removeListener(messageHandler);
// });
