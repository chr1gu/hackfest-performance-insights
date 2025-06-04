function getOriginDuration(
  request: chrome.webRequest.WebResponseHeadersDetails
): number {
  const originDuration = request.responseHeaders
    ?.find(
      (header) =>
        header.name.toLowerCase() === "server-timing" &&
        header.value?.startsWith("origin")
    )
    ?.value?.replace("origin; dur=", "");

  return parseInt(originDuration || "0");
}

function getEdgeDuration(
  request: chrome.webRequest.WebResponseHeadersDetails
): number {
  const edgeDuration = request.responseHeaders
    ?.find(
      (header) =>
        header.name.toLowerCase() === "server-timing" &&
        header.value?.startsWith("edge")
    )
    ?.value?.replace("edge; dur=", "");

  return parseInt(edgeDuration || "0");
}

export function getAkamaiInfo(
  request: chrome.webRequest.WebResponseHeadersDetails
) {
  const edgeDuration = getEdgeDuration(request);
  const originDuration = getOriginDuration(request);
  return {
    edgeDuration: edgeDuration,
    edgeLocation: "Unknown",
    originDuration: originDuration,
  };
}

export interface RequestHandler {
  canHandleRequest(request: chrome.webRequest.WebRequestDetails): boolean;
  onBeforeSendHeaders(request: chrome.webRequest.WebRequestDetails): void;
  onCompleted(request: chrome.webRequest.WebResponseHeadersDetails): void;
}
