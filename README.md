# picoTracker-Theme-Studio

## Development Visualization

<video src="https://raw.githubusercontent.com/itsdarklikehell/picoTracker-Theme-Studio/main/gource.mp4" controls width="100%"></video>

*Gource visualization showing the repository's commit history. See the [Gource workflow](.github/workflows/gource.yml) for details.*

<img src="https://img.shields.io/github/stars/itsdarklikehell/picoTracker-Theme-Studio?style=flat-square&color=blue" alt="Stars">
<img src="https://img.shields.io/github/forks/itsdarklikehell/picoTracker-Theme-Studio?style=flat-square&color=green" alt="Forks">
<img src="https://img.shields.io/github/license/itsdarklikehell/picoTracker-Theme-Studio?style=flat-square" alt="License">
<img src="https://img.shields.io/github/actions/workflow/status/itsdarklikehell/picoTracker-Theme-Studio/ci.yml?branch=main&label=CI&style=flat-square" alt="CI Status">

A browser-based theme editor for the [picoTracker](https://github.com/synthetos/picoTracker) — design and export `.PTT` theme files without leaving your browser.

## Features

- **12 color channels** — BACKGROUND, FOREGROUND, HICOLOR1, HICOLOR2, CONSOLECOLOR, CURSORCOLOR, INFOCOLOR, WARNCOLOR, ERRORCOLOR, ACCENTCOLOR, ACCENTALTCOLOR, EMPHASISCOLOR
- **Live preview** — 3 screens (Project, Song, Chain) rendered in real-time with the selected colors
- **Import/Export** — Load existing `.PTT` themes and export your custom designs
- **Randomize** — Generate random color palettes with one click
- **Gallery** — Save themes to localStorage for quick access
- **Keyboard navigation** — Arrow keys switch between preview screens
- **Win95 aesthetic** — Retro-styled UI with classic window chrome

## Installation

### Online usage

Use the live editor here: <https://itsdarklikehell.github.io/picoTracker-Theme-Studio/>

### Local run

```bash
git clone https://github.com/itsdarklikehell/picoTracker-Theme-Studio.git
cd picoTracker-Theme-Studio/static-app
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

## Usage

1. Open the editor in your browser
2. Choose a theme to edit or import a `.PTT` file
3. Adjust colors using the color pickers or click **RANDOMIZE**
4. Preview changes across all 3 screens (Project, Song, Chain)
5. Export as `.PTT` file or save to gallery

### Keyboard shortcuts

| Key | Action |
|-----|--------|
| ← → ↑ ↓ | Navigate between preview screens |

### Color channels

| Channel | Description |
|---------|-------------|
| BACKGROUND | Main background color |
| FOREGROUND | Primary text/foreground color |
| HICOLOR1 | Highlight color 1 (active elements) |
| HICOLOR2 | Highlight color 2 (cursor/selection) |
| CONSOLECOLOR | Console background |
| CURSORCOLOR | Cursor color |
| INFOCOLOR | Info/status indicators |
| WARNCOLOR | Warning messages |
| ERRORCOLOR | Error messages |
| ACCENTCOLOR | Accent color (row numbers, etc.) |
| ACCENTALTCOLOR | Alternate accent color |
| EMPHASISCOLOR | Emphasized text |

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
```

### Running tests

```bash
npm test
```

### Running locally

```bash
npm run serve
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Contributors

- [itsdarklikehell](https://github.com/itsdarklikehell) — Maintainer
- [synthetos](https://github.com/synthetos) — picoTracker creator

## License

MIT — see [LICENSE](LICENSE) for details.
