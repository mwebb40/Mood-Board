# The Phases

A picture mood board built around nine informal "phases" of the year (Bleak
Midwinter, Late Winter, Early Spring, The Warm Up, High Summer, Early Autumn,
Late Autumn, Festive, and Gooch). Pick a phase from the dropdown at the top
of the page to view a gallery of images for it.

## Running it

No build step required — just open `index.html` in a browser, or serve the
folder with any static server, e.g.:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Customizing images

Image data lives in `js/app.js` in the `PHASE_IMAGES` object, one array per
phase (`bleak-midwinter`, `late-winter`, `early-spring`, `warm-up`,
`high-summer`, `early-autumn`, `late-autumn`, `festive`, `gooch`). Each entry
has:

- `src` — path to an image (under `images/<phase-id>/`) or an external URL
- `alt` — accessible alt text
- `caption` — text shown under the image in the gallery

Phase labels and date ranges are defined separately in the `PHASES` array in
`js/app.js`, in case you want to rename or re-date one.

To swap in your own photos, drop image files into `images/<phase-id>/` and
update the corresponding array in `js/app.js` to point at them. The
placeholder `.svg` files that ship in each `images/<phase-id>/` folder can be
deleted once replaced.
