export function findServerTimingHeaderStartingWith(
  startingWith: string,
  request: chrome.webRequest.WebResponseHeadersDetails
): string | undefined {
  return request.responseHeaders?.find(
    (header) =>
      header.name.toLowerCase() === "server-timing" &&
      header.value?.startsWith(startingWith)
  )?.value;
}

export function getDuration(header: string | undefined): number {
  if (!header) return 0;

  const durationMatch = header.match(/dur=(\d+(\.\d+)?)/);
  return durationMatch ? parseFloat(durationMatch[1]) : 0;
}
