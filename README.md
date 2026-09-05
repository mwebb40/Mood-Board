# Mood-Board

A seasonal picture mood board. Pick a season from the dropdown at the top of
the page to view a gallery of images for that time of year.

## Running it

No build step required — just open `index.html` in a browser, or serve the
folder with any static server, e.g.:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Customizing images

Image data lives in `js/app.js` in the `SEASON_IMAGES` object, one array per
season (`spring`, `summer`, `autumn`, `winter`). Each entry has:

- `src` — path to an image (under `images/<season>/`) or an external URL
- `alt` — accessible alt text
- `caption` — text shown under the image in the gallery

To swap in your own photos, drop image files into `images/<season>/` and
update the corresponding array in `js/app.js` to point at them. The
placeholder `.svg` files that ship in each `images/<season>/` folder can be
deleted once replaced.
