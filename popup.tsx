import { useEffect, useState } from "react";
import { tracingKey } from "./shared/constants";

function IndexPopup() {
  const [data, setData] = useState({
    [tracingKey]: undefined,
  });

  console.log("IndexPopup initialized with data:", data[tracingKey]);

  useEffect(() => {
    console.log("IndexPopup mounted");
    chrome.storage.local.get([tracingKey]).then((result) => {
      console.log("Initial data:", result);
      setData({
        [tracingKey]: result[tracingKey] ?? "",
      });
    });
  }, []);

  return (
    <div
      style={{
        padding: 16,
      }}
    >
      <h2>Performance Insights</h2>
      <label style={{ display: "block", marginBottom: 8 }}>
        X-Dg-Tracing Key:
      </label>
      <input
        style={{ width: "300px", padding: 8 }}
        onChange={(e) => {
          console.log("Input changed:", e.target.value);
          chrome.storage.local.set({ [tracingKey]: e.target.value });
        }}
        defaultValue={data[tracingKey]}
      />
    </div>
  );
}

export default IndexPopup;
