export interface ResourceRequest {
  url: string;
  /** The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request. */
  requestId: string;
  /** The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (type is main_frame or sub_frame), frameId indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab. */
  frameId: number;
  /** ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists. */
  parentFrameId: number;
  /** The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab. */
  tabId: number;
  /**
   * How the requested resource will be used.
   */
  type: ResourceType;
  /** The time when this signal is triggered, in milliseconds since the epoch. */
  timeStamp: number;
  /** The origin where the request was initiated. This does not change through redirects. If this is an opaque origin, the string 'null' will be used.
   * @since Since Chrome 63.
   */
  initiator?: string | undefined;
}

export interface WebRequestDetails extends ResourceRequest {
  /** Standard HTTP method. */
  method: string;
}

export type ResourceType =
  | "main_frame"
  | "sub_frame"
  | "stylesheet"
  | "script"
  | "image"
  | "font"
  | "object"
  | "xmlhttprequest"
  | "ping"
  | "csp_report"
  | "media"
  | "websocket"
  | "other";

export interface RequestHandler {
  canHandleRequest(request: WebRequestDetails): boolean;
  onBeforeSendHeaders(request: WebRequestDetails): void;
  onCompleted(request: WebRequestDetails): void;
}
