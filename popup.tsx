import { useEffect, useState } from "react";

function IndexPopup() {
  const [data, setData] = useState({
    DG_TestToken: undefined,
    DG_Debug: undefined,
  });

  useEffect(() => {
    chrome.storage.local.get(["DG_TestToken", "DG_Debug"]).then((result) => {
      setData({
        DG_TestToken: result.DG_TestToken ?? "",
        DG_Debug: result.DG_Debug ?? "",
      });
    });
  }, []);

  return (
    <div
      style={{
        padding: 16,
      }}
    >
      <h2>
        Welcome to our{" "}
        <a href="https://www.plasmo.com" target="_blank">
          Plasmo
        </a>{" "}
        Extension!
      </h2>
      <input
        onChange={(e) =>
          chrome.storage.local.set({ DG_TestToken: e.target.value })
        }
        defaultValue={data.DG_TestToken}
        placeholder="X-Dg-TestToken Key"
      />
      <input
        onChange={(e) => chrome.storage.local.set({ DG_Debug: e.target.value })}
        defaultValue={data.DG_Debug}
        placeholder="X-Dg-Debug Key"
      />
      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
    </div>
  );
}

export default IndexPopup;
