// {name: 'server-timing', value: 'iso; desc=render; dur=29'}
// {name: 'server-timing', value: 'iso; desc=getInitialProps; dur=198'}

import {
  IsomorphInitialPropsHostSystem,
  IsomorphRenderHostSystem,
  type IsoDurations,
} from "~shared/pageInsights";

// {name: 'server-timing', value: 'iso; desc=total; dur=227'}
function getIsoDurations(
  request: chrome.webRequest.WebResponseHeadersDetails
): IsoDurations | null {
  const isoDurations: IsoDurations = {
    render: 0,
    getInitialProps: 0,
    total: 0,
  };

  request.responseHeaders
    ?.filter(
      (header) =>
        header.name.toLowerCase() === "server-timing" &&
        header.value?.startsWith("iso;")
    )
    .forEach((header) => {
      if (header.value) {
        const parts = header.value.split("; ");
        const durPart = parts.find((part) => part.startsWith("dur="));
        const duration = durPart ? parseInt(durPart.replace("dur=", "")) : 0;
        const descPart = parts.find((part) => part.startsWith("desc="));
        const description = descPart
          ? descPart.replace("desc=", "").trim()
          : "";
        if (description === "render") {
          isoDurations.render = duration;
        } else if (description === "getInitialProps") {
          isoDurations.getInitialProps = duration;
        } else if (description === "total") {
          isoDurations.total = duration;
        }
      }
    });

  return isoDurations.getInitialProps !== 0 ||
    isoDurations.render !== 0 ||
    isoDurations.total !== 0
    ? isoDurations
    : null;
}

export function getIsomorphicRenderHostSystem(
  request: chrome.webRequest.WebResponseHeadersDetails
): IsomorphRenderHostSystem | null {
  const durations = getIsoDurations(request);

  if (!durations) {
    return null;
  }

  const system = new IsomorphRenderHostSystem();
  system.duration = durations.render;
  return system;
}

export function getIsomorphInitialPropsHostSystem(
  request: chrome.webRequest.WebResponseHeadersDetails
): IsomorphInitialPropsHostSystem | null {
  const durations = getIsoDurations(request);

  if (!durations) {
    return null;
  }

  const system = new IsomorphInitialPropsHostSystem();
  system.duration = durations.render;

  return system;
}
