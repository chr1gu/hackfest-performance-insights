import { useEffect, useState } from "react";

export const Breadcrumbs = () => {
  const [data, setData] = useState<BreadcrumbsData>();

  useEffect(() => {
    // Initial value
    chrome.storage.local
      .get(["breadcrumbs"])
      .then((result) => setData(parseBreadcrumbs(result.breadcrumbs)));

    // Updates
    chrome.storage.onChanged.addListener(async (changes, _) => {
      if (changes.breadcrumbs) {
        setData(parseBreadcrumbs(changes.breadcrumbs.newValue));
      }
    });
  }, []);

  if (!data) {
    return (
      <>
        <h2>Breadcrumbs</h2>
        <p>not available</p>
      </>
    );
  }

  return (
    <>
      <h2>Breadcrumbs</h2>
      <pre>{data.raw}</pre>
      <ol>
        {data.servers.map((server, idx) => (
          <li key={idx}>
            {server.type} | {server.location}
          </li>
        ))}
      </ol>
    </>
  );
};

interface BreadcrumbsData {
  servers: ServerInfo[];
  raw: string;
}

interface ServerInfo {
  type: string;
  location: string;
}

// https://techdocs.akamai.com/property-mgr/docs/breadcrumbs-amd
// Example: [a=173.222.108.31,b=244340660,c=g,n=CH_ZH_GLATTBRUGG,o=20940],[c=c,n=NL__AMSTERDAM,o=20940],[a=211,c=o]
const parseBreadcrumbs = (
  breadcrumbs: string | undefined
): BreadcrumbsData | null => {
  if (!breadcrumbs) {
    return null;
  }

  const servers = [];

  // Match brackets like [a=...,b=...]
  for (const component of breadcrumbs.match(/\[[^\[\]]*\]/g)) {
    const componentLetter = /c=([^,\]]+)/.exec(component)?.[1];
    switch (componentLetter) {
      case "g": {
        // edge server
        const ip = /a=([^,\]]+)/.exec(component)?.[1] ?? "";
        servers.push({
          type: `Edge ${ip}`,
          location: /n=([^,\]]+)/.exec(component)?.[1] || "unknown",
        });
        break;
      }
      case "p": {
        // peer edge server
        servers.push({
          type: "Edge Peer",
          location: /n=([^,\]]+)/.exec(component)?.[1] || "unknown",
        });
        break;
      }
      case "c": {
        // cache server
        servers.push({
          type: "Cache",
          location: /n=([^,\]]+)/.exec(component)?.[1] || "unknown",
        });
        break;
      }
      case "o": {
        // origin server
        servers.push({
          type: "Origin",
          location: "Azure Europe West (Schiphol, NL)",
        });
        break;
      }
    }
  }

  return {
    servers,
    raw: breadcrumbs,
  };
};
