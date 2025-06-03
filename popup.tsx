import { useEffect, useState } from "react";
import { getTracingKey, updateTracingKey } from "~shared/storage";

function IndexPopup() {
  const [key, setKey] = useState(null);

  useEffect(() => {
    console.log("IndexPopup mounted");
    getTracingKey().then(setKey);
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
          updateTracingKey(e.target.value);
        }}
        defaultValue={key || ""}
      />
    </div>
  );
}

export default IndexPopup;
