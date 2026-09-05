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

## How images work

The gallery for each phase is **not** hardcoded — the page asks the GitHub
API what's in `images/<phase-id>/` on the `main` branch and renders whatever
it finds, every time you load it. That means adding a photo is just a matter
of getting the file into the right folder, by any method: `git`, the GitHub
web UI, the GitHub iPhone app, or the Shortcut below.

Phase folders/ids: `bleak-midwinter`, `late-winter`, `early-spring`,
`warm-up`, `high-summer`, `early-autumn`, `late-autumn`, `festive`, `gooch`
(see the `PHASES` array in `js/app.js` for labels/date ranges if you want to
rename or re-date one).

### File naming convention

Name every image `<unix-timestamp>-<slug>.jpg` (or `.jpeg`/`.png`/`.webp`/`.gif`),
e.g. `1830000000-golden-evenings.jpg`:

- The **slug** becomes the caption shown under the image (dashes → spaces,
  title-cased) — so `golden-evenings.jpg` displays as "Golden Evenings".
- The **timestamp** controls sort order (newest first) and is shown as an
  "added on" date on the card. It's stripped back off before the caption is
  built.

The placeholder images that ship in each folder use a dummy `0000000000-`
prefix so they always sort last, behind anything real you add.

## Adding photos from your iPhone (Shortcut)

This sets up a Shortcut you can trigger from the Photos share sheet: share a
photo → pick a phase → it uploads straight into the right `images/<phase-id>/`
folder on GitHub.

### 1. Create a scoped GitHub token

1. On github.com: **Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token**.
2. Set **Resource owner** to `mwebb40` and **Repository access** to "Only
   select repositories" → `Mood-Board`.
3. Under **Permissions → Repository permissions**, set **Contents** to
   **Read and write**. Leave everything else as "No access".
4. Generate it and copy the token somewhere safe — you'll paste it into the
   Shortcut once. Treat it like a password: anyone with it can write to this
   repo, so never share the Shortcut file (its Export includes the token).

### 2. Build the Shortcut

In the Shortcuts app, create a new shortcut named e.g. **Add to Phases**,
and add these actions in order:

1. **Receive** `Images` as input "when run from Share Sheet".
2. **Choose from Menu** — one item per phase, using the friendly labels
   (Bleak Midwinter, Late Winter, Early Spring, The Warm Up, High Summer,
   Early Autumn, Late Autumn, Festive, Gooch). In each branch, add
   **Set Variable** `PhaseID` to the matching id from the list above (e.g.
   the "Bleak Midwinter" branch sets `PhaseID` to `bleak-midwinter`).
3. **Ask for Input** (Text) — "Caption?" → **Set Variable** `Caption`.
4. **Text** action: lowercase the caption, replace anything that isn't
   `a-z0-9` with `-` (Replace Text, enable **Regular Expression**, pattern
   `[^a-z0-9]+` → `-`), then trim leading/trailing dashes (pattern
   `^-+|-+$` → empty) → **Set Variable** `Slug`.
5. **Repeat with Each** item in the shared `Images`:
   - **Get Current Date** → **Format Date**, format **Unix Time** →
     `Timestamp`.
   - **Base64 Encode** the current repeat item (the photo) → `ImageBase64`.
   - **Text**: build the filename —
     `Timestamp-Repeat Index-Slug.jpg` (include the repeat index so sharing
     several photos at once never collides on the same-second timestamp).
   - **Text**: build the URL —
     `https://api.github.com/repos/mwebb40/Mood-Board/contents/images/PhaseID/<filename>.jpg`
   - **Get Contents of URL**:
     - Method: `PUT`
     - URL: the one you just built
     - Headers: `Authorization` → `Bearer <your token>`, `Accept` →
       `application/vnd.github+json`
     - Request Body: `JSON`, with fields
       `message` = `Add photo via iPhone Shortcut`,
       `content` = `ImageBase64`,
       `branch` = `main`

6. Optionally end with a **Show Notification** ("Added to <phase>") so you
   get confirmation.

### 3. Enable it in the Share Sheet

In the Shortcut's settings (the ⓘ icon), turn on **Show in Share Sheet** and
set accepted types to **Images**.

### 4. Use it

From Photos, select one or more photos → **Share** → **Add to Phases** →
pick the phase → enter a caption → done. The site fetches fresh from GitHub
on every load, so refresh the page (a hard refresh if your browser cached
the old API response) to see new photos — usually visible within seconds of
the upload landing on `main`.
