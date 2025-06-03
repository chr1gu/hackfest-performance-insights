export interface RequestHandler {
  canHandleRequest(request: chrome.webRequest.WebRequestDetails): boolean;
  onBeforeSendHeaders(request: chrome.webRequest.WebRequestDetails): void;
  onCompleted(request: chrome.webRequest.WebResponseHeadersDetails): void;
}
