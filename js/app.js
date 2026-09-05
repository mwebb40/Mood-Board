// Images are NOT listed here. Instead, each phase's gallery is the live
// contents of images/<phase-id>/ on GitHub — drop a file into that folder
// (by any means: git, the GitHub web UI/app, or the iPhone Shortcut
// described in the README) and it appears here on next load, no code
// changes required.
//
// Caption + "added" date are both derived from the filename, so name files
// as `<unix-timestamp>-<slug>.jpg`, e.g. `1830000000-golden-evenings.jpg`.
// The timestamp also controls sort order (newest first).

const REPO = "mwebb40/Mood-Board";
const BRANCH = "main";
const IMAGE_EXT_RE = /\.(jpe?g|png|gif|webp|svg)$/i;
const TIMESTAMP_PREFIX_RE = /^(\d{9,13})-/;
const MINOR_WORDS = new Set(["a", "an", "the", "of", "in", "on", "to", "by", "at", "for", "and", "or"]);

const PHASES = [
  { id: "bleak-midwinter", label: "Bleak Midwinter", range: "1 Jan – Six Nations" },
  { id: "late-winter", label: "Late Winter", range: "Six Nations – mid-March" },
  { id: "early-spring", label: "Early Spring", range: "Mid-March – first May bank holiday" },
  { id: "warm-up", label: "The Warm Up", range: "First May bank holiday – end of June" },
  { id: "high-summer", label: "High Summer", range: "July & August" },
  { id: "early-autumn", label: "Early Autumn", range: "September – clocks change" },
  { id: "late-autumn", label: "Late Autumn", range: "Clocks change – December" },
  { id: "festive", label: "Festive", range: "December" },
  { id: "gooch", label: "Gooch", range: "Between Christmas & New Year" },
];
const PHASE_BY_ID = Object.fromEntries(PHASES.map((p) => [p.id, p]));

const gallery = document.getElementById("gallery");
const select = document.getElementById("phase-select");
const sectionLabel = document.getElementById("section-label");
const metaLine = document.getElementById("meta-line");

const imageCache = {};

function titleCase(slug) {
  const words = slug.split(/[-_]+/).filter(Boolean);
  return words
    .map((word, i) => {
      const lower = word.toLowerCase();
      const isEdge = i === 0 || i === words.length - 1;
      if (!isEdge && MINOR_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function parseFilename(filename) {
  const base = filename.replace(IMAGE_EXT_RE, "");
  const match = base.match(TIMESTAMP_PREFIX_RE);
  const slug = match ? base.slice(match[0].length) : base;
  const caption = titleCase(slug) || "Untitled";

  let added = null;
  if (match) {
    const raw = match[1];
    const ms = raw.length <= 10 ? Number(raw) * 1000 : Number(raw);
    const date = new Date(ms);
    if (!Number.isNaN(date.getTime())) {
      added = date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    }
  }

  return { caption, added };
}

async function fetchPhaseImages(phaseId) {
  const url = `https://api.github.com/repos/${REPO}/contents/images/${phaseId}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
  const entries = await res.json();

  return entries
    .filter((entry) => entry.type === "file" && IMAGE_EXT_RE.test(entry.name))
    .sort((a, b) => b.name.localeCompare(a.name))
    .map((entry) => {
      const { caption, added } = parseFilename(entry.name);
      return { src: entry.download_url, caption, added, alt: caption };
    });
}

async function getPhaseImages(phaseId) {
  if (imageCache[phaseId]) return imageCache[phaseId];

  try {
    const images = await fetchPhaseImages(phaseId);
    imageCache[phaseId] = images;
    try {
      localStorage.setItem(`moodboard-cache-${phaseId}`, JSON.stringify(images));
    } catch (e) {
      // localStorage unavailable — ignore
    }
    return images;
  } catch (err) {
    console.error(`Couldn't load images for ${phaseId}:`, err);
    try {
      const cached = localStorage.getItem(`moodboard-cache-${phaseId}`);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      // ignore
    }
    return null; // null = load failed; [] = confirmed empty
  }
}

function renderGallery(images, phaseLabel) {
  gallery.innerHTML = "";

  if (images === null) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Couldn't load images right now — check your connection and try again.";
    gallery.appendChild(empty);
    return;
  }

  if (images.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No images yet for this phase.";
    gallery.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  images.forEach(({ src, alt, caption, added }) => {
    const card = document.createElement("div");
    card.className = "card";

    const thumb = document.createElement("div");
    thumb.className = "thumb";
    thumb.style.backgroundImage = `url('${src}')`;
    thumb.setAttribute("role", "img");
    thumb.setAttribute("aria-label", alt);

    const source = document.createElement("div");
    source.className = "source";
    source.textContent = added ? `${phaseLabel} · ${added}` : phaseLabel;

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = caption;

    card.appendChild(thumb);
    card.appendChild(source);
    card.appendChild(title);
    fragment.appendChild(card);
  });

  gallery.appendChild(fragment);
}

async function setPhase(phaseId) {
  const phase = PHASE_BY_ID[phaseId];
  document.body.dataset.phase = phaseId;
  select.value = phaseId;
  sectionLabel.textContent = phase.label;
  metaLine.textContent = `${phase.label} · ${phase.range} · loading…`;
  gallery.innerHTML = '<p class="empty">Loading…</p>';

  try {
    localStorage.setItem("moodboard-phase", phaseId);
  } catch (e) {
    // ignore
  }

  const images = await getPhaseImages(phaseId);

  // If the user switched phases again while this fetch was in flight, drop it.
  if (document.body.dataset.phase !== phaseId) return;

  const count = images === null ? null : images.length;
  metaLine.textContent =
    count === null
      ? `${phase.label} · ${phase.range} · couldn't load`
      : `${phase.label} · ${phase.range} · ${count} image${count === 1 ? "" : "s"}`;
  renderGallery(images, phase.label);
}

select.addEventListener("change", (event) => {
  setPhase(event.target.value);
});

let initialPhase = "bleak-midwinter";
try {
  const saved = localStorage.getItem("moodboard-phase");
  if (saved && PHASE_BY_ID[saved]) {
    initialPhase = saved;
  }
} catch (e) {
  // ignore
}

setPhase(initialPhase);
