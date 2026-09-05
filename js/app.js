// Image data for each season. Add or replace entries here to customize
// the mood board — point `src` at any image file under images/<season>/
// (or an external URL) and give it a descriptive `alt`/`caption`.
const SEASON_IMAGES = {
  spring: [
    { src: "images/spring/1.svg", alt: "Cherry blossoms in bloom", caption: "Cherry Blossoms" },
    { src: "images/spring/2.svg", alt: "Fresh spring rain on leaves", caption: "Fresh Rain" },
    { src: "images/spring/3.svg", alt: "Garden in full bloom", caption: "Garden Bloom" },
    { src: "images/spring/4.svg", alt: "Morning dew on grass", caption: "Morning Dew" },
    { src: "images/spring/5.svg", alt: "Pastel colored meadow", caption: "Pastel Meadow" },
  ],
  summer: [
    { src: "images/summer/1.svg", alt: "Golden sand beach", caption: "Golden Beach" },
    { src: "images/summer/2.svg", alt: "Poolside relaxation", caption: "Poolside" },
    { src: "images/summer/3.svg", alt: "Warm sunset glow", caption: "Sunset Glow" },
    { src: "images/summer/4.svg", alt: "Ocean breeze on the coast", caption: "Ocean Breeze" },
    { src: "images/summer/5.svg", alt: "Long summer days", caption: "Long Days" },
  ],
  autumn: [
    { src: "images/autumn/1.svg", alt: "Falling autumn leaves", caption: "Falling Leaves" },
    { src: "images/autumn/2.svg", alt: "Harvest time in the field", caption: "Harvest Time" },
    { src: "images/autumn/3.svg", alt: "Cozy knit sweater weather", caption: "Cozy Sweater" },
    { src: "images/autumn/4.svg", alt: "Pumpkin patch in October", caption: "Pumpkin Patch" },
    { src: "images/autumn/5.svg", alt: "Amber colored woods", caption: "Amber Woods" },
  ],
  winter: [
    { src: "images/winter/1.svg", alt: "Snow falling gently", caption: "Snowfall" },
    { src: "images/winter/2.svg", alt: "Frost covered pine trees", caption: "Frosted Pines" },
    { src: "images/winter/3.svg", alt: "Warm fireside evening", caption: "Fireside" },
    { src: "images/winter/4.svg", alt: "Crisp winter morning", caption: "Winter Morning" },
    { src: "images/winter/5.svg", alt: "Frozen lake landscape", caption: "Icy Lake" },
  ],
};

const gallery = document.getElementById("gallery");
const select = document.getElementById("season-select");

function renderGallery(season) {
  const images = SEASON_IMAGES[season] || [];
  gallery.innerHTML = "";

  if (images.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No images yet for this season.";
    gallery.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  images.forEach(({ src, alt, caption }) => {
    const figure = document.createElement("figure");
    figure.className = "gallery-card";

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = caption;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    fragment.appendChild(figure);
  });

  gallery.appendChild(fragment);
}

function setSeason(season) {
  document.body.dataset.season = season;
  select.value = season;
  renderGallery(season);
  try {
    localStorage.setItem("moodboard-season", season);
  } catch (e) {
    // localStorage unavailable (e.g. private browsing) — ignore
  }
}

select.addEventListener("change", (event) => {
  setSeason(event.target.value);
});

let initialSeason = "spring";
try {
  const saved = localStorage.getItem("moodboard-season");
  if (saved && SEASON_IMAGES[saved]) {
    initialSeason = saved;
  }
} catch (e) {
  // ignore
}

setSeason(initialSeason);
