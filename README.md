# Office Preview

[![CI](https://github.com/abreufilho/vscode-office-preview/actions/workflows/ci.yml/badge.svg)](https://github.com/abreufilho/vscode-office-preview/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/abreufilho/vscode-office-preview?color=blue)](https://github.com/abreufilho/vscode-office-preview/releases/latest)
[![License](https://img.shields.io/github/license/abreufilho/vscode-office-preview?color=blue)](LICENSE)

Open `.docx` and `.pptx` files inside VS Code instead of switching to another
application. The document opens in a custom editor and reloads when the file
changes on disk.

Rendering happens locally. The renderers ship inside the extension, so no
document is uploaded and no network request is made.

## Requirements

VS Code 1.80 or later.

## Installation

Download the `.vsix` from the [latest release](https://github.com/abreufilho/vscode-office-preview/releases/latest)
and install it:

```bash
code --install-extension office-preview-<version>.vsix
```

## Usage

Open a `.docx` or `.pptx` file from the Explorer. VS Code routes it to the
preview automatically. From a file already open as text, run **Office: Open
Word Preview** or **Office: Open PowerPoint Preview** from the Command Palette.

Editing the file outside the editor refreshes the preview, and deleting it
closes the panel.

## Features

- Renders Word documents with headers, footers, footnotes, endnotes and page
  breaks.
- Renders PowerPoint decks slide by slide.
- Reloads when the file changes on disk.
- Follows the active VS Code light or dark theme.

## Commands

| Command                           | Availability  |
| --------------------------------- | ------------- |
| `Office: Open Word Preview`       | `.docx` files |
| `Office: Open PowerPoint Preview` | `.pptx` files |

## Privacy

Reading and rendering are local. The extension performs no network requests and
collects no telemetry.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the local setup and the checks that
run before a pull request. Participation follows the
[Code of Conduct](CODE_OF_CONDUCT.md). To report a vulnerability, see the
[security policy](SECURITY.md).

## Third-Party

[docx-preview](https://github.com/VolodymyrBaydalka/docxjs),
[pptx-preview](https://github.com/SheetJS/pptx-preview) and
[JSZip](https://github.com/Stuk/jszip) ship inside the extension under their own
licenses, which travel in the bundled files.

## License

[MIT](LICENSE) © [Antonio Abreu Filho](https://abreufilho.com.br)
