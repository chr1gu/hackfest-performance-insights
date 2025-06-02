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
      <p>Edge Server Location: {data.edgeServerLocation}</p>
      <p>Cache Server Location: {data.cacheServerLocation}</p>
      <p>Raw: {data.raw}</p>
    </>
  );
};

interface BreadcrumbsData {
  edgeServerLocation: string;
  cacheServerLocation: string;
  raw: string;
}

// https://techdocs.akamai.com/property-mgr/docs/breadcrumbs-amd
// Example: [a=173.222.108.31,b=244340660,c=g,n=CH_ZH_GLATTBRUGG,o=20940],[c=c,n=NL__AMSTERDAM,o=20940],[a=211,c=o]
const parseBreadcrumbs = (
  breadcrumbs: string | undefined
): BreadcrumbsData | null => {
  if (!breadcrumbs) {
    return null;
  }

  const [edge, cache, origin] = breadcrumbs.match(/\[[^\[\]]*\]/g); // Match brackets like [a=...,b=...]
  const {
    groups: { edgeServerLocation },
  } = /n=(?<edgeServerLocation>[^,\]]+)/.exec(edge);

  const {
    groups: { cacheServerLocation },
  } = /n=(?<cacheServerLocation>[^,\]]+)/.exec(cache);

  return {
    edgeServerLocation: edgeServerLocation || "unknown",
    cacheServerLocation: cacheServerLocation || "unknown",
    raw: breadcrumbs,
  };
};
