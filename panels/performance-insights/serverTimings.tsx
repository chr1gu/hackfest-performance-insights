import { useEffect, useState } from "react";

export const ServerTimings = () => {
  const [data, setData] = useState<ServerTimingData>();

  useEffect(() => {
    // Initial value
    chrome.storage.local
      .get(["edgeDuration", "originDuration"])
      .then((result) =>
        setData({
          edgeDuration: result.edgeDuration,
          originDuration: result.originDuration,
        })
      );

    // Updates
    chrome.storage.onChanged.addListener(async (changes, _) => {
      if (changes.edgeDuration) {
        setData({
          edgeDuration: changes.edgeDuration.newValue,
          originDuration: changes.originDuration.newValue,
        });
      }
    });
  }, []);

  if (!data) {
    return (
      <>
        <h2>SSR Server Timings</h2>
        <p>not available</p>
      </>
    );
  }

  return (
    <>
      <h2>SSR Server Timings</h2>
      <p>Edge Duration: {data.edgeDuration}ms</p>
      <p>Origin Duration: {data.originDuration}ms</p>
    </>
  );
};

interface ServerTimingData {
  edgeDuration: string;
  originDuration: string;
}
