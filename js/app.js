// Image data for each phase. Add or replace entries here to customize the
// mood board — point `src` at any image file under images/<phase-id>/ (or
// an external URL) and give it a descriptive `alt`/`caption`.
const PHASE_IMAGES = {
  "bleak-midwinter": [
    { src: "images/bleak-midwinter/1.svg", alt: "Frosty New Year morning", caption: "New Year Frost" },
    { src: "images/bleak-midwinter/2.svg", alt: "Long dark winter evening", caption: "Long Dark Evenings" },
    { src: "images/bleak-midwinter/3.svg", alt: "Bare winter tree branches", caption: "Bare Branches" },
  ],
  "late-winter": [
    { src: "images/late-winter/1.svg", alt: "Six Nations rugby Saturday", caption: "Six Nations Saturday" },
    { src: "images/late-winter/2.svg", alt: "Thawing late winter ground", caption: "Thawing Ground" },
    { src: "images/late-winter/3.svg", alt: "Grey skies starting to ease", caption: "Grey Skies Easing" },
  ],
  "early-spring": [
    { src: "images/early-spring/1.svg", alt: "Daffodils in early spring", caption: "Daffodils Out" },
    { src: "images/early-spring/2.svg", alt: "Lighter spring evenings", caption: "Lighter Evenings" },
    { src: "images/early-spring/3.svg", alt: "First May bank holiday weekend", caption: "First Bank Holiday" },
  ],
  "warm-up": [
    { src: "images/warm-up/1.svg", alt: "Beer gardens reopening", caption: "Beer Gardens Reopen" },
    { src: "images/warm-up/2.svg", alt: "Longer early summer days", caption: "Longer Days" },
    { src: "images/warm-up/3.svg", alt: "Cricket nets in the evening", caption: "Cricket Nets" },
  ],
  "high-summer": [
    { src: "images/high-summer/1.svg", alt: "Sun over a test match", caption: "Test Match Sun" },
    { src: "images/high-summer/2.svg", alt: "Summer festival season", caption: "Festival Season" },
    { src: "images/high-summer/3.svg", alt: "Golden summer evenings", caption: "Golden Evenings" },
  ],
  "early-autumn": [
    { src: "images/early-autumn/1.svg", alt: "Back to school in September", caption: "Back to School" },
    { src: "images/early-autumn/2.svg", alt: "Harvest fields in early autumn", caption: "Harvest Fields" },
    { src: "images/early-autumn/3.svg", alt: "Clocks about to change", caption: "Clocks About to Change" },
  ],
  "late-autumn": [
    { src: "images/late-autumn/1.svg", alt: "Dark by five in late autumn", caption: "Dark by Five" },
    { src: "images/late-autumn/2.svg", alt: "Bonfire smoke in the air", caption: "Bonfire Smoke" },
    { src: "images/late-autumn/3.svg", alt: "Woolly jumper weather", caption: "Woolly Jumpers" },
  ],
  festive: [
    { src: "images/festive/1.svg", alt: "Festive fairy lights", caption: "Fairy Lights" },
    { src: "images/festive/2.svg", alt: "A warm mug of mulled wine", caption: "Mulled Wine" },
    { src: "images/festive/3.svg", alt: "Counting down an advent calendar", caption: "Advent Calendar" },
  ],
  gooch: [
    { src: "images/gooch/1.svg", alt: "No idea what day it is", caption: "No Idea What Day It Is" },
    { src: "images/gooch/2.svg", alt: "Leftover Christmas turkey", caption: "Leftover Turkey" },
    { src: "images/gooch/3.svg", alt: "Pyjamas all day", caption: "Pyjamas All Day" },
  ],
};

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

function renderGallery(phaseId) {
  const images = PHASE_IMAGES[phaseId] || [];
  gallery.innerHTML = "";

  if (images.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No images yet for this phase.";
    gallery.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  images.forEach(({ src, alt, caption }) => {
    const card = document.createElement("div");
    card.className = "card";

    const thumb = document.createElement("div");
    thumb.className = "thumb";
    thumb.style.backgroundImage = `url('${src}')`;
    thumb.setAttribute("role", "img");
    thumb.setAttribute("aria-label", alt);

    const source = document.createElement("div");
    source.className = "source";
    source.textContent = PHASE_BY_ID[phaseId].label;

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

function setPhase(phaseId) {
  const phase = PHASE_BY_ID[phaseId];
  document.body.dataset.phase = phaseId;
  select.value = phaseId;
  sectionLabel.textContent = phase.label;
  const count = (PHASE_IMAGES[phaseId] || []).length;
  metaLine.textContent = `${phase.label} · ${phase.range} · ${count} image${count === 1 ? "" : "s"}`;
  renderGallery(phaseId);
  try {
    localStorage.setItem("moodboard-phase", phaseId);
  } catch (e) {
    // localStorage unavailable (e.g. private browsing) — ignore
  }
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
