export type Theme = 'dark' | 'light';

/** The document kinds this extension previews. */
export type DocumentKind = 'docx' | 'pptx';

/** Host to webview: the file bytes, base64 encoded for the message channel. */
export interface DataMessage {
  type: 'data';
  kind: DocumentKind;
  base64: string;
  theme: Theme;
}

/** Host to webview: the file could not be read. */
export interface ErrorMessage {
  type: 'error';
  message: string;
}

/** Webview to host: the page is listening. */
export interface ReadyMessage {
  type: 'ready';
}

export type HostMessage = DataMessage | ErrorMessage;
export type WebviewMessage = ReadyMessage;
