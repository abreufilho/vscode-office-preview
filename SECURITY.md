# Security Policy

## Supported Versions

The latest release receives fixes. Older versions do not.

## Reporting a Vulnerability

Report privately through
[GitHub Security Advisories](https://github.com/abreufilho/vscode-office-preview/security/advisories/new).
Please do not open a public issue for a vulnerability.

This is a personal project maintained on a best-effort basis. There is no
response time commitment. If a report needs a fix that I cannot make, I will say
so rather than leave it open.

## Scope

The extension renders `.docx` and `.pptx` files the user opens. That content is
untrusted, so the preview:

- serves the webview under a Content Security Policy where scripts run by nonce
  only and no origin is reachable;
- reports read and render failures as status text, never as markup;
- makes no network request, and ships the renderers rather than fetching them.

Rendering itself is delegated to `docx-preview` and `pptx-preview`. A flaw in
how they parse a document belongs upstream, but report it here as well and I
will forward it.
