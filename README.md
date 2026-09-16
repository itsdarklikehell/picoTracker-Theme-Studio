# picoTracker-Theme-Studio

A browser-based theme editor for the [picoTracker](https://github.com/synthetos/picoTracker) — design and export `.PTT` theme files without leaving your browser.

## Try it online

Use the live editor here: <https://itsdarklikehell.github.io/picoTracker-Theme-Studio/>

## Run locally

The app is a static site. Serve the `static-app/` folder with any static web server, for example:

```bash
cd static-app
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

## How it works

- **Import** an existing `.PTT` theme file to load its colors.
- **Edit / Randomize** the palette using the on-screen controls.
- **Generate** a new `.PTT` theme file to download and flash to your picoTracker.

## Project layout

- `static-app/` — the static web app (HTML/CSS/JS) published to GitHub Pages.
- `ref/` — reference screens and text used while building the preview.


---

## 🎥 Gource Visualization

De ontwikkelhistorie van dit project in een film:

<video src="https://raw.githubusercontent.com/itsdarklikehell/picoTracker-Theme-Studio/main/gource.mp4" controls width="100%"></video>

*De video wordt automatisch gegenereerd door de [Gource workflow](.github/workflows/gource.yml) bij elke push.*

Lokale video genereren:
```bash
gource --max-files 1000 --key -800x600 \
  --highlight-users --filename-time 3 --output-framerate 25 \
  -s 0.6 --multi-sampling --auto-skip-seconds 0.1 \
  --stop-at-end --hide mouse,progress -o gource.ppm

ffmpeg -y -r 15 -f image2pipe -vcodec ppm -i gource.ppm \
  -vcodec libx264 -preset medium -pix_fmt yuv420p \
  -crf 1 -threads 0 -bf 0 gource.mp4
```
