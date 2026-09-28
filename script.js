const memories = {
  picnic: { kicker: "Parques del Río", title: "El picnic", copy: "Pan de chocolate, muchos dulces, arroz chino, pinturas y juegos. Un plan con un poquito de todo, pero sobre todo un día que la pasamos muy bien juntos." },
  cine: { kicker: "Misión: disfrutar sin pensar tanto", title: "Kimetsu no Yaiba", copy: "Ahorré para que ese día pudiéramos elegir lo que quisiéramos. Fuimos a ver Kimetsu, disfrutamos la película y después seguimos por el centro comercial jodiendo como siempre." },
  crepes: { kicker: "Alta gastronomía experimental", title: "El método Crepes", copy: "Pedíamos varias cosas y nos las comíamos intercalando para probar todo. Técnicamente compartíamos. En la práctica, vigilábamos el plato del otro." },
  casos: { kicker: "Archivos todavía sin resolver", title: "Gelatina y ñeros", copy: "Una vez me estabas dando gelatina como a un bebé, me hiciste reír y terminé escupiéndotela en la cara por accidente.\n\nY en algún momento, sin razón conocida, empezamos a fingir que éramos ñeros y pasamos horas por la calle jodiendo así. Ninguno de los dos casos tiene explicación, pero ambos siguen dando risa." }
};

const cats = [
  { id: "1", challenge: "light", fur: "#caa9f5", inner: "#f6b4d6", pattern: "#7f57a6", mark: "stripe", title: "La cazadora de luciérnagas", intro: "Esta gata quiere jugar en serio: sigue las luces antes de que se escondan por el jardín.", message: "La cazadora quedó cansada y decidió acompañarte por el jardín." },
  { id: "2", challenge: "picnic", fur: "#292337", inner: "#b990b7", pattern: "#655579", mark: "chest", title: "La guardiana del picnic", intro: "A esta gata no se le olvida un buen plan en Parques del Río. A ver qué tanto te acuerdas.", message: "La guardiana aprobó el recuerdo y hasta dejó intacto el pan de chocolate." },
  { id: "3", challenge: "cinema", fur: "#d88f63", inner: "#f4b6aa", pattern: "#8d513e", mark: "stripe", title: "El gato cinéfilo", intro: "Recuerda la salida a ver Kimetsu, pero se le mezclaron las escenas. Ayúdale a ponerlas en orden.", message: "El gato cinéfilo ya recordó todo el plan. Créditos y salida al centro comercial." },
  { id: "4", challenge: "crepes", fur: "#e9d7bc", inner: "#e7a7ba", pattern: "#8e6e62", mark: "spot", title: "La inspectora de los platos", intro: "No confía en quien prueba un solo plato. Para aprobar, toca turnarse y probar de todo.", message: "La inspectora confirma que compartir por turnos sigue siendo una estrategia brillante." },
  { id: "5", challenge: "cases", fur: "#8e81ae", inner: "#e2a8ca", pattern: "#51476b", mark: "mask", title: "El detective de la cuadra", intro: "Tiene dos expedientes sin resolver: gelatina voladora y ñeros por horas. Toca reconstruirlos.", message: "Casos cerrados. El detective sigue sin entender cómo empezó todo, pero se unió a la pandilla." }
];

const validMemoryIds = new Set(Object.keys(memories));
const validCatIds = new Set(cats.map((cat) => cat.id));

function readSavedSet(key, validValues) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(key) || "[]");
    if (!Array.isArray(stored)) return new Set();
    return new Set(stored.filter((value) => typeof value === "string" && validValues.has(value)));
  } catch {
    return new Set();
  }
}

const state = {
  openedMemories: readSavedSet("openedMemoriesV5", validMemoryIds),
  foundCats: readSavedSet("foundCatsV5", validCatIds),
  currentCat: null, activeCat: null, challengeComplete: false, catTimer: null, challengeTimer: null, supportTimer: null, transitionLocked: false, gardenTouches: 0, coverAwake: false, coverWakeTimer: null
};

const elements = {
  ambient: document.querySelector("#ambient"), petalLayer: document.querySelector("#petal-layer"),
  catLayer: document.querySelector("#roaming-cat-layer"), dialog: document.querySelector("#memory-dialog"),
  dialogTitle: document.querySelector("#dialog-title"), dialogKicker: document.querySelector("#dialog-kicker"),
  dialogCopy: document.querySelector("#dialog-copy"), toast: document.querySelector("#toast"),
  finalButton: document.querySelector("#final-button"), unlockPanel: document.querySelector("#unlock-panel"),
  unlockCopy: document.querySelector("#unlock-copy"), catCount: document.querySelector("#cat-count"),
  gameHud: document.querySelector(".game-hud"), gardenWorld: document.querySelector(".garden-world"),
  gardenHeart: document.querySelector("#garden-heart"), gardenProgress: document.querySelector(".garden-progress"),
  memoryPath: document.querySelector(".memory-path"), supportNook: document.querySelector("#support-nook"),
  supportJump: document.querySelector("#support-jump"), supportActivity: document.querySelector("#support-activity"),
  finalCats: document.querySelector("#final-cats"),
  hero: document.querySelector("#inicio"), heroFlower: document.querySelector("#hero-orbit"),
  heroRoots: document.querySelector("#hero-roots"), heroEnter: document.querySelector("#hero-enter"), heroStatus: document.querySelector("#hero-status"),
  catDialog: document.querySelector("#cat-dialog"), catPortrait: document.querySelector("#cat-portrait"),
  catKicker: document.querySelector("#cat-kicker"), catTitle: document.querySelector("#cat-title"),
  catIntro: document.querySelector("#cat-intro"), catChallenge: document.querySelector("#cat-challenge")
};

let toastTimer;
let pointerFrame;
const randomBetween = (min, max) => Math.random() * (max - min) + min;

function createAmbient() {
  for (let index = 0; index < 24; index += 1) {
    const firefly = document.createElement("span");
    firefly.className = "firefly";
    firefly.style.left = `${randomBetween(2, 98)}%`;
    firefly.style.top = `${randomBetween(4, 96)}%`;
    firefly.style.setProperty("--size", `${randomBetween(2, 5)}px`);
    firefly.style.setProperty("--duration", `${randomBetween(5, 11)}s`);
    firefly.style.setProperty("--delay", `${randomBetween(-10, 0)}s`);
    firefly.style.setProperty("--drift-x", `${randomBetween(-70, 70)}px`);
    firefly.style.setProperty("--drift-y", `${randomBetween(-90, 90)}px`);
    elements.ambient.appendChild(firefly);
  }
  for (let index = 0; index < 9; index += 1) {
    const petal = document.createElement("span");
    petal.className = "ambient-petal";
    petal.style.left = `${randomBetween(0, 100)}%`;
    petal.style.setProperty("--size", `${randomBetween(10, 22)}px`);
    petal.style.setProperty("--duration", `${randomBetween(10, 19)}s`);
    petal.style.setProperty("--delay", `${randomBetween(-18, 0)}s`);
    petal.style.setProperty("--drift", `${randomBetween(-130, 130)}px`);
    elements.ambient.appendChild(petal);
  }
}

function burstPetals(x, y, amount = 12) {
  const colors = ["#ff83c8", "#d1baff", "#a877ff", "#fff8eb"];
  for (let index = 0; index < amount; index += 1) {
    const petal = document.createElement("span");
    const angle = (Math.PI * 2 * index) / amount + randomBetween(-.2, .2);
    const distance = randomBetween(55, 145);
    petal.className = "burst-petal";
    petal.style.setProperty("--x", `${x}px`); petal.style.setProperty("--y", `${y}px`);
    petal.style.setProperty("--dx", `${Math.cos(angle) * distance}px`); petal.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    petal.style.setProperty("--rot", `${randomBetween(-180, 180)}deg`); petal.style.setProperty("--size", `${randomBetween(10, 22)}px`);
    petal.style.setProperty("--color", colors[index % colors.length]); elements.petalLayer.appendChild(petal);
    petal.addEventListener("animationend", () => petal.remove());
  }
}

function showToast(message) {
  clearTimeout(toastTimer); elements.toast.textContent = message; elements.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => elements.toast.classList.remove("is-visible"), 2600);
}

function saveProgress() {
  try {
    window.localStorage.setItem("openedMemoriesV5", JSON.stringify([...state.openedMemories]));
    window.localStorage.setItem("foundCatsV5", JSON.stringify([...state.foundCats]));
  } catch {
    showToast("Este navegador no pudo guardar el progreso; puedes seguir explorando igual.");
  }
}

function setGardenAwake(isAwake) {
  document.body.classList.toggle("garden-awake", isAwake);
  elements.gardenWorld.classList.toggle("is-expanded", isAwake);
  elements.gardenHeart.classList.toggle("is-awake", isAwake);
  elements.gardenHeart.setAttribute("aria-expanded", String(isAwake));
  elements.gardenHeart.querySelector(".garden-heart__message").textContent = isAwake ? "El jardín despertó" : "Toca para despertar el jardín";

  [elements.gardenProgress, elements.memoryPath, elements.unlockPanel, elements.supportNook].forEach((region) => {
    region.inert = !isAwake;
    region.setAttribute("aria-hidden", String(!isAwake));
  });
  elements.gameHud.inert = !isAwake || document.body.dataset.screen !== "jardin";
  elements.supportJump.tabIndex = isAwake && document.body.dataset.screen === "jardin" ? 0 : -1;
  if (!isAwake) {
    resetSupportActivity();
  }
}

function renderFinalCats() {
  if (elements.finalCats.childElementCount) return;
  cats.forEach((profile, index) => {
    const cat = document.createElement("span");
    cat.className = "final__cat";
    cat.style.setProperty("--cat-index", String(index + 1));
    cat.appendChild(createCatDrawing(profile));
    elements.finalCats.appendChild(cat);
  });
}

function resetCover() {
  clearTimeout(state.coverWakeTimer);
  state.coverWakeTimer = null;
  state.coverAwake = false;
  document.body.classList.remove("cover-awake");
  elements.hero.classList.remove("is-awake");
  elements.heroFlower.classList.remove("is-awake");
  elements.heroFlower.setAttribute("aria-pressed", "false");
  elements.heroFlower.setAttribute("aria-label", "Toca la flor para despertar el jardín");
  elements.heroFlower.querySelector(".hero-orbit__label").textContent = "Tócame para empezar";
  elements.heroEnter.disabled = true;
  elements.heroStatus.textContent = "Primero toca la flor para despertar el jardín.";
  elements.hero.style.removeProperty("--flower-x");
  elements.hero.style.removeProperty("--flower-y");
  elements.heroRoots.querySelector(".hero-orbit__root-lines").replaceChildren();
  elements.heroRoots.querySelector(".hero-orbit__root-leaves").replaceChildren();
}

function drawCoverRoots(originX, originY, width, height) {
  const lines = elements.heroRoots.querySelector(".hero-orbit__root-lines");
  const leaves = elements.heroRoots.querySelector(".hero-orbit__root-leaves");
  const rootBaseY = originY + Math.min(42, height * .055);
  const branchY = Math.min(height - 18, rootBaseY + Math.max(46, height * .12));
  const routes = [
    { start: [originX, rootBaseY], end: [originX + width * .018, height + 55], delay: 0, stroke: 4 },
    { start: [originX, branchY], end: [-24, height * .75], delay: 180 },
    { start: [originX, branchY], end: [width + 24, height * .78], delay: 300 },
    { start: [originX + width * .005, branchY + height * .055], end: [width * .12, height + 22], delay: 480 },
    { start: [originX - width * .005, branchY + height * .075], end: [width * .92, height + 22], delay: 600 },
    { start: [originX, branchY + height * .025], end: [-24, height * .31], delay: 760 },
    { start: [originX, branchY + height * .045], end: [width + 24, height * .27], delay: 900 },
    { start: [originX, branchY + height * .13], end: [width * .48, height + 70], delay: 1080, stroke: 2.1 }
  ];

  elements.heroRoots.setAttribute("viewBox", `0 0 ${width} ${height}`);
  lines.replaceChildren();
  leaves.replaceChildren();

  routes.forEach((route, index) => {
    const [sx, sy] = route.start;
    const [ex, ey] = route.end;
    const dx = ex - sx;
    const dy = ey - sy;
    const c1x = sx + dx * .28 + (index % 2 ? 1 : -1) * width * .018;
    const c1y = sy + Math.max(34, height * .12);
    const c2x = ex - dx * .16;
    const c2y = ey - dy * .18;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`);
    path.setAttribute("pathLength", "1");
    if (route.stroke) path.style.strokeWidth = `${route.stroke}px`;
    path.style.setProperty("--root-delay", `${route.delay}ms`);
    lines.appendChild(path);

    if (index === 0) return;
    [.48, .73].forEach((t, leafIndex) => {
      const inverse = 1 - t;
      const x = inverse ** 3 * sx + 3 * inverse ** 2 * t * c1x + 3 * inverse * t ** 2 * c2x + t ** 3 * ex;
      const y = inverse ** 3 * sy + 3 * inverse ** 2 * t * c1y + 3 * inverse * t ** 2 * c2y + t ** 3 * ey;
      const leaf = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + (leafIndex ? -38 : 38);
      leaf.setAttribute("cx", String(x)); leaf.setAttribute("cy", String(y));
      leaf.setAttribute("rx", leafIndex ? "8" : "10"); leaf.setAttribute("ry", "3.5");
      leaf.setAttribute("transform", `rotate(${angle} ${x} ${y})`);
      leaf.setAttribute("fill", index % 3 === 0 ? "#ffe0a8" : "#a8e2c9");
      leaf.style.setProperty("--leaf-delay", `${route.delay + 520 + leafIndex * 170}ms`);
      leaves.appendChild(leaf);
    });
  });
}

function wakeCover() {
  const rect = elements.heroFlower.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  burstPetals(x, y, state.coverAwake ? 12 : 27);
  if (state.coverAwake) return;

  const width = document.documentElement.clientWidth;
  const height = window.innerHeight;
  elements.hero.style.setProperty("--flower-x", `${x}px`);
  elements.hero.style.setProperty("--flower-y", `${y}px`);
  drawCoverRoots(x, y, width, height);
  state.coverAwake = true;
  document.body.classList.add("cover-awake");
  elements.hero.classList.add("is-awake");
  elements.heroFlower.classList.add("is-awake");
  elements.heroFlower.setAttribute("aria-pressed", "true");
  elements.heroFlower.setAttribute("aria-label", "La flor despertó; el jardín está listo");
  elements.heroFlower.querySelector(".hero-orbit__label").textContent = "Ya despertó";
  elements.heroStatus.textContent = "Mira cómo despierta el jardín…";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  state.coverWakeTimer = setTimeout(() => {
    state.coverWakeTimer = null;
    elements.heroEnter.disabled = false;
    elements.heroStatus.textContent = "Ahora sí, entra al jardín.";
  }, reducedMotion ? 0 : 3150);
}

function transitionTo(id) {
  if (state.transitionLocked) return;
  if (document.body.dataset.screen === "inicio" && id === "jardin" && elements.heroEnter.disabled) return;
  state.transitionLocked = true; document.body.classList.add("is-transitioning");
  setTimeout(() => {
    document.querySelectorAll(".screen").forEach((screen) => screen.classList.toggle("is-active", screen.id === id));
    document.body.dataset.screen = id;
    if (id === "jardin") {
      setGardenAwake(false);
    } else {
      resetSupportActivity();
      elements.gameHud.inert = true;
      elements.supportJump.tabIndex = -1;
    }
    clearCurrentCat();
    if (id === "final") renderFinalCats();
    window.scrollTo({ top: 0, behavior: "auto" });
  }, 360);
  setTimeout(() => {
    document.body.classList.remove("is-transitioning"); state.transitionLocked = false;
    if (id === "final") burstPetals(window.innerWidth / 2, Math.min(window.innerHeight * .35, 300), 34);
  }, 760);
}

function updateProgress() {
  const memoryCount = state.openedMemories.size;
  const catCount = state.foundCats.size;
  const ready = memoryCount === 4 && catCount === 5;
  document.querySelector("#progress-text").textContent = `${memoryCount} de 4 recuerdos`;
  document.querySelector("#cat-progress-text").textContent = `${catCount} de 5 gatos`;
  elements.catCount.textContent = `${catCount}/5`;
  document.querySelector("#progress-bar").style.width = `${((memoryCount + catCount) / 9) * 100}%`;
  document.querySelectorAll("[data-memory]").forEach((card) => {
    const opened = state.openedMemories.has(card.dataset.memory);
    card.classList.toggle("is-opened", opened);
    const action = card.querySelector(".memory-card__action");
    if (action) action.textContent = opened ? "Volver a leer ✓" : "Descubrir ↗";
  });
  elements.finalButton.disabled = !ready; elements.unlockPanel.classList.toggle("is-ready", ready);
  elements.finalButton.textContent = ready ? "Despertar la última flor" : "Sorpresa todavía bloqueada";
  elements.unlockCopy.textContent = ready ? "Lo encontraste todo. La última flor ya puede despertar." : `Te faltan ${4 - memoryCount} rosas y ${5 - catCount} gatos.`;
}

function clearCurrentCat() {
  clearTimeout(state.catTimer);
  if (state.currentCat) { state.currentCat.remove(); state.currentCat = null; }
}

function scheduleCat(delay = randomBetween(1800, 4200)) {
  clearTimeout(state.catTimer);
  const supportIsActive = document.querySelector('[data-support][aria-pressed="true"]');
  if (state.foundCats.size === cats.length || supportIsActive || document.body.dataset.screen !== "jardin" || !document.body.classList.contains("garden-awake")) return;
  state.catTimer = setTimeout(spawnCat, delay);
}

function createCatDrawing(profile) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const markings = {
    stripe: `<path d="M43 22 49 33M57 20 54 33M68 24 61 35" fill="none" stroke="${profile.pattern}" stroke-width="5" stroke-linecap="round"/>`,
    chest: `<path d="M50 58c8-8 18-7 25 0-2 18-6 25-13 29-8-5-11-13-12-29Z" fill="${profile.pattern}" opacity=".6"/>`,
    spot: `<path d="M39 36c7-7 15-5 18 2-5 6-12 8-18-2ZM69 58c8-5 15-1 15 7-7 4-13 1-15-7Z" fill="${profile.pattern}" opacity=".65"/>`,
    mask: `<path d="M31 32c8-12 19-10 26 2 8-11 20-12 29 0-7 11-15 16-27 16-12 0-21-6-28-18Z" fill="${profile.pattern}" opacity=".72"/>`
  }[profile.mark] || "";

  svg.setAttribute("viewBox", "0 0 120 120");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("roaming-cat__drawing");
  svg.innerHTML = `
    <path class="cat-tail" d="M84 78c28-2 31-31 13-35-12-2-14 11-6 15" fill="none" stroke="${profile.fur}" stroke-width="12" stroke-linecap="round"/>
    <ellipse cx="61" cy="80" rx="31" ry="27" fill="${profile.fur}"/>
    <path class="cat-ear" d="M31 37 36 9l22 19Z" fill="${profile.fur}"/>
    <path class="cat-ear" d="m65 28 22-19 5 29Z" fill="${profile.fur}"/>
    <path d="m36 27 3-10 9 10ZM76 27l8-10 3 12Z" fill="${profile.inner}"/>
    <circle cx="61" cy="48" r="31" fill="${profile.fur}"/>
    ${markings}
    <ellipse class="cat-eye" cx="49" cy="48" rx="4" ry="6" fill="#fff8eb"/>
    <ellipse class="cat-eye" cx="73" cy="48" rx="4" ry="6" fill="#fff8eb"/>
    <circle cx="49" cy="50" r="2" fill="#20142f"/><circle cx="73" cy="50" r="2" fill="#20142f"/>
    <path d="m61 57-4 3 4 3 4-3Z" fill="${profile.inner}"/>
    <path d="M61 63c-5 5-10 4-13 1M61 63c5 5 10 4 13 1" fill="none" stroke="#4a354d" stroke-width="2" stroke-linecap="round"/>
    <path d="M45 60 25 57M45 65l-19 4M77 60l20-3M77 65l19 4" fill="none" stroke="#eadff0" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>
    <path d="M43 95v14M78 95v14" stroke="${profile.fur}" stroke-width="13" stroke-linecap="round"/>
  `;
  return svg;
}

function completeCatChallenge(profile) {
  if (state.challengeComplete) return;
  clearChallengeTimer();
  state.challengeComplete = true;
  state.foundCats.add(profile.id);
  saveProgress();
  updateProgress();
  burstPetals(window.innerWidth / 2, window.innerHeight / 2, 22);
  elements.catChallenge.innerHTML = `
    <div class="challenge-complete">
      <svg class="challenge-complete__mark" viewBox="0 0 100 100" aria-hidden="true"><use href="#icon-spark" /></svg>
      <h3>Confianza ganada</h3>
      <p>${profile.message}</p>
      <button class="button button--primary challenge-continue" type="button">Seguir explorando</button>
    </div>`;
  elements.catChallenge.querySelector(".challenge-continue").addEventListener("click", () => elements.catDialog.close());
  elements.catChallenge.querySelector(".challenge-continue").focus({ preventScroll: true });
}

function clearChallengeTimer() {
  if (state.challengeTimer !== null) {
    window.clearTimeout(state.challengeTimer);
    state.challengeTimer = null;
  }
}

const picnicRounds = [
  { question: "¿En qué lugar fue el picnic?", options: ["En el cine", "En Parques del Río", "En el colegio"], answer: 1, hint: "Pista: había río, pintura y ganas de quedarse un buen rato." },
  { question: "¿Qué pan tenía un puesto especial en el plan?", options: ["Pan de chocolate", "Pan blandito", "Pan de ajo"], answer: 0, hint: "Pista: es uno de esos dulces que a ella le encantan." },
  { question: "¿Qué otra comida apareció por ahí?", options: ["Arroz chino y mucho dulce", "Pizza y palomitas", "Sopa y ensalada"], answer: 0, hint: "Pista: el nombre del plato te da la pista del país." },
  { question: "Además de comer, ¿qué hicieron?", options: ["Pintaron y jugaron", "Vieron una película", "Se pusieron a entrenar"], answer: 0, hint: "Pista: el picnic también tuvo pinturas sobre la mesa." }
];

const caseRounds = [
  { question: "Caso 1: ¿cómo empezó lo de la gelatina?", options: ["Ella te estaba dando gelatina como a un bebé", "Un gato se robó el postre", "La gelatina salió volando sola"], answer: 0, hint: "Pista: alguien estaba intentando darte de comer." },
  { question: "¿Y cómo terminó el caso?", options: ["Te dio risa y se la escupiste por accidente", "La guardaron para después", "Se fueron a ver una película"], answer: 0, hint: "Pista: no fue a propósito; la risa tuvo la culpa." },
  { question: "Caso 2: cuando se hicieron los ñeros, ¿cuánto duró la joda?", options: ["Unos segundos", "Horas por la calle", "Lo que duró la película"], answer: 1, hint: "Pista: la improvisación se alargó bastante." }
];

const cinemaMoments = [
  { id: "movie", text: "Ver Kimetsu no Yaiba" },
  { id: "mall", text: "Seguir jodiendo por el centro comercial" },
  { id: "save", text: "Juntar el ahorro para ir sin límites" },
  { id: "choose", text: "Elegir lo que se les antojara" }
];

function renderLightChallenge(profile) {
  elements.catChallenge.innerHTML = `
    <p class="challenge-instruction">Atrapa ocho luciérnagas; cada una se esconde en un rincón diferente.</p>
    <div class="challenge-progress" role="progressbar" aria-label="Luciérnagas atrapadas" aria-valuemin="0" aria-valuemax="8" aria-valuenow="0"><span></span></div>
    <div class="light-stage"><button class="chase-light" type="button" aria-label="Atrapar luciérnaga 1 de 8"></button></div>
    <p class="challenge-status" aria-live="polite">0 de 8 luciérnagas atrapadas.</p>`;
  const light = elements.catChallenge.querySelector(".chase-light");
  const status = elements.catChallenge.querySelector(".challenge-status");
  const progress = elements.catChallenge.querySelector(".challenge-progress");
  const progressBar = progress.querySelector("span");
  const spots = [[16, 28], [74, 70], [42, 18], [86, 35], [25, 76], [62, 44], [47, 82], [79, 17]];
  let hits = 0;
  const moveLight = () => {
    const [x, y] = spots[hits];
    light.style.setProperty("--light-x", `${x}%`);
    light.style.setProperty("--light-y", `${y}%`);
    light.setAttribute("aria-label", `Atrapar luciérnaga ${hits + 1} de 8`);
  };
  moveLight();
  light.addEventListener("click", () => {
    hits += 1;
    progress.setAttribute("aria-valuenow", String(hits));
    progressBar.style.width = `${(hits / spots.length) * 100}%`;
    if (hits === spots.length) {
      light.disabled = true;
      status.textContent = "Las ocho luces volvieron a casa. La gata ya te sigue.";
      completeCatChallenge(profile);
      return;
    }
    status.textContent = `${hits} de 8 luciérnagas atrapadas. La siguiente se escondió lejos.`;
    moveLight();
  });
}

function renderRecallChallenge(profile, rounds, step = 0) {
  const round = rounds[step];
  const percent = Math.round((step / rounds.length) * 100);
  elements.catChallenge.innerHTML = `
    <div class="challenge-step"><span>Pista ${step + 1} de ${rounds.length}</span><span>${percent}%</span></div>
    <div class="challenge-progress" role="progressbar" aria-label="Pistas resueltas" aria-valuemin="0" aria-valuemax="${rounds.length}" aria-valuenow="${step}"><span style="width:${percent}%"></span></div>
    <p class="challenge-instruction">${round.question}</p>
    <div class="challenge-options" role="group" aria-label="Opciones de respuesta">${round.options.map((option, index) => `<button class="challenge-option" type="button" data-answer="${index}">${option}</button>`).join("")}</div>
    <p class="challenge-status" aria-live="polite">${round.hint ? "Una respuesta abre la siguiente pista." : "Elige con cuidado."}</p>`;
  const status = elements.catChallenge.querySelector(".challenge-status");
  elements.catChallenge.querySelectorAll(".challenge-option").forEach((button) => {
    button.addEventListener("click", () => {
      if (Number(button.dataset.answer) === round.answer) {
        if (step === rounds.length - 1) {
          completeCatChallenge(profile);
        } else {
          renderRecallChallenge(profile, rounds, step + 1);
          elements.catChallenge.querySelector(".challenge-option")?.focus({ preventScroll: true });
        }
      } else {
        button.classList.remove("is-wrong");
        requestAnimationFrame(() => button.classList.add("is-wrong"));
        status.textContent = round.hint || "Esa pista no era. Prueba con otra.";
      }
    });
  });
}

function renderCinemaChallenge(profile) {
  const expectedOrder = ["save", "choose", "movie", "mall"];
  const pieces = [cinemaMoments[0], cinemaMoments[3], cinemaMoments[1], cinemaMoments[2]];
  let expected = 0;
  elements.catChallenge.innerHTML = `
    <p class="challenge-instruction">Ordena las cuatro escenas de aquella salida al cine. Toca primero lo que pasó primero.</p>
    <div class="challenge-progress" role="progressbar" aria-label="Escenas ordenadas" aria-valuemin="0" aria-valuemax="4" aria-valuenow="0"><span></span></div>
    <div class="timeline-pieces">${pieces.map((piece) => `<button class="timeline-piece" type="button" data-moment="${piece.id}"><span class="timeline-piece__number">?</span><span>${piece.text}</span></button>`).join("")}</div>
    <p class="challenge-status" aria-live="polite">Primero ahorraron. Encuentra esa escena para empezar.</p>`;
  const status = elements.catChallenge.querySelector(".challenge-status");
  const progress = elements.catChallenge.querySelector(".challenge-progress");
  const progressBar = progress.querySelector("span");
  elements.catChallenge.querySelectorAll(".timeline-piece").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.moment === expectedOrder[expected]) {
        button.disabled = true;
        button.classList.add("is-in-order");
        button.querySelector(".timeline-piece__number").textContent = String(expected + 1);
        expected += 1;
        progress.setAttribute("aria-valuenow", String(expected));
        progressBar.style.width = `${(expected / expectedOrder.length) * 100}%`;
        if (expected === expectedOrder.length) completeCatChallenge(profile);
        else status.textContent = `Bien. Escena ${expected} de 4; sigue con el siguiente momento.`;
      } else {
        button.classList.remove("is-wrong");
        requestAnimationFrame(() => button.classList.add("is-wrong"));
        status.textContent = expected === 0 ? "Pista: el ahorro fue lo que permitió hacer el plan sin límites." : "Esa escena va después. Mira las que todavía están pendientes.";
      }
    });
  });
}

function renderCrepesChallenge(profile) {
  elements.catChallenge.innerHTML = `
    <p class="challenge-instruction">En Crepes se turnaban para probar varios platos. La inspectora inventó su propio patrón: míralo y repítelo. Esta secuencia es parte del juego, no una reconstrucción literal de aquella comida.</p>
    <div class="challenge-step"><span id="plate-round">RONDA 1 DE 4</span><span id="plate-length">2 platos</span></div>
    <div class="challenge-progress" role="progressbar" aria-label="Rondas de la cata" aria-valuemin="0" aria-valuemax="4" aria-valuenow="0"><span></span></div>
    <div class="plate-history" id="plate-history" aria-label="Tu respuesta"></div>
    <div class="plate-choices" role="group" aria-label="Elegir qué plato probar">
      <button class="plate-choice" type="button" data-plate="A" aria-label="Elegir plato A" disabled><span class="plate-graphic" aria-hidden="true"><span></span></span><span>Plato A</span></button>
      <button class="plate-choice plate-choice--b" type="button" data-plate="B" aria-label="Elegir plato B" disabled><span class="plate-graphic" aria-hidden="true"><span></span></span><span>Plato B</span></button>
    </div>
    <div class="challenge-actions"><button class="button button--primary" id="plate-play" type="button">Mostrar secuencia</button></div>
    <p class="challenge-status" id="plate-status" aria-live="polite">Cuatro rondas; cada una agrega un paso. Sin reloj.</p>`;
  const status = elements.catChallenge.querySelector(".challenge-status");
  const progress = elements.catChallenge.querySelector(".challenge-progress");
  const progressBar = progress.querySelector("span");
  const history = elements.catChallenge.querySelector(".plate-history");
  const roundLabel = elements.catChallenge.querySelector("#plate-round");
  const lengthLabel = elements.catChallenge.querySelector("#plate-length");
  const playButton = elements.catChallenge.querySelector("#plate-play");
  const plates = [...elements.catChallenge.querySelectorAll(".plate-choice")];
  const patterns = [["A", "B"], ["B", "A", "A"], ["A", "B", "A", "B"], ["B", "B", "A", "A", "B"]];
  const plateOnDuration = 620;
  const plateOffGap = 300;
  let round = 0;
  let inputIndex = 0;
  let isShowing = false;
  let isReady = false;

  const drawRound = () => {
    inputIndex = 0;
    isShowing = false;
    isReady = false;
    roundLabel.textContent = `RONDA ${round + 1} DE ${patterns.length}`;
    lengthLabel.textContent = `${patterns[round].length} platos`;
    history.replaceChildren(...patterns[round].map(() => {
      const slot = document.createElement("span");
      slot.className = "plate-history__slot";
      slot.setAttribute("aria-hidden", "true");
      return slot;
    }));
    plates.forEach((button) => { button.disabled = true; button.classList.remove("is-cued"); });
    playButton.disabled = false;
    playButton.textContent = round === 0 ? "Mostrar secuencia" : "Ver la siguiente ronda";
    progress.setAttribute("aria-valuenow", String(round));
    progressBar.style.width = `${(round / patterns.length) * 100}%`;
  };

  const showPattern = () => {
    if (isShowing || !playButton || round >= patterns.length) return;
    clearChallengeTimer();
    isShowing = true;
    isReady = false;
    inputIndex = 0;
    history.querySelectorAll(".plate-history__slot").forEach((entry) => {
      entry.textContent = "";
      entry.classList.remove("plate-history__slot--a", "plate-history__slot--b");
    });
    plates.forEach((button) => { button.disabled = true; button.classList.remove("is-cued"); });
    playButton.disabled = true;
    status.textContent = `Mira la secuencia de la ronda ${round + 1}.`;
    const pattern = patterns[round];
    let index = 0;
    const showNext = () => {
      if (!elements.catDialog.open || state.challengeComplete) { clearChallengeTimer(); return; }
      if (index === pattern.length) {
        state.challengeTimer = window.setTimeout(() => {
          state.challengeTimer = null;
          isShowing = false;
          isReady = true;
          plates.forEach((button) => { button.disabled = false; });
          playButton.disabled = false;
          playButton.textContent = "Repetir la secuencia";
          status.textContent = `Ahora repítela: ${pattern.length} turnos, sin afán.`;
          plates[0].focus({ preventScroll: true });
        }, 450);
        return;
      }
      const plate = pattern[index];
      const target = plates.find((button) => button.dataset.plate === plate);
      target.classList.add("is-cued");
      status.textContent = `Pista ${index + 1} de ${pattern.length}: plato ${plate}.`;
      state.challengeTimer = window.setTimeout(() => {
        target.classList.remove("is-cued");
        index += 1;
        state.challengeTimer = window.setTimeout(() => {
          state.challengeTimer = null;
          showNext();
        }, plateOffGap);
      }, plateOnDuration);
    };
    showNext();
  };

  playButton.addEventListener("click", showPattern);
  plates.forEach((button) => {
    button.addEventListener("click", () => {
      if (!isReady || isShowing) return;
      button.classList.remove("is-wrong");
      const pattern = patterns[round];
      const slot = history.children[inputIndex];
      if (button.dataset.plate === pattern[inputIndex]) {
        slot.textContent = button.dataset.plate;
        slot.classList.add(`plate-history__slot--${button.dataset.plate.toLowerCase()}`);
        inputIndex += 1;
        playButton.disabled = true;
        if (inputIndex === pattern.length) {
          round += 1;
          progress.setAttribute("aria-valuenow", String(round));
          progressBar.style.width = `${(round / patterns.length) * 100}%`;
          if (round === patterns.length) {
            completeCatChallenge(profile);
          } else {
            status.textContent = "Ronda superada. La siguiente agrega un turno más.";
            drawRound();
            playButton.focus({ preventScroll: true });
          }
        } else {
          status.textContent = `${inputIndex} de ${pattern.length}. Bien; sigue con el siguiente plato.`;
        }
      } else {
        isReady = false;
        inputIndex = 0;
        history.querySelectorAll(".plate-history__slot").forEach((entry) => {
          entry.textContent = "";
          entry.classList.remove("plate-history__slot--a", "plate-history__slot--b");
        });
        plates.forEach((entry) => { entry.disabled = true; });
        playButton.disabled = false;
        playButton.textContent = "Volver a ver la secuencia";
        status.textContent = "Esa no era la siguiente porción. Vuelve a mirar el patrón; puedes repetirlo cuantas veces quieras.";
        button.classList.remove("is-wrong");
        requestAnimationFrame(() => button.classList.add("is-wrong"));
        playButton.focus({ preventScroll: true });
      }
    });
  });
  drawRound();
}

function openCatChallenge(profile) {
  state.activeCat = profile;
  state.challengeComplete = false;
  elements.catPortrait.replaceChildren(createCatDrawing(profile));
  elements.catKicker.textContent = `Encuentro ${profile.id} de ${cats.length}`;
  elements.catTitle.textContent = profile.title;
  elements.catIntro.textContent = profile.intro;
  if (profile.challenge === "light") renderLightChallenge(profile);
  if (profile.challenge === "picnic") renderRecallChallenge(profile, picnicRounds);
  if (profile.challenge === "cinema") renderCinemaChallenge(profile);
  if (profile.challenge === "crepes") renderCrepesChallenge(profile);
  if (profile.challenge === "cases") renderRecallChallenge(profile, caseRounds);
  elements.catDialog.showModal();
}

function spawnCat() {
  clearCurrentCat();
  const available = cats.filter((cat) => !state.foundCats.has(cat.id));
  if (!available.length) return;
  const profile = available[Math.floor(Math.random() * available.length)];
  const positions = [
    { x: randomBetween(3, 20), y: randomBetween(18, 78), fromX: "-65px", fromY: "0", rotation: "12deg" },
    { x: randomBetween(78, 91), y: randomBetween(18, 78), fromX: "65px", fromY: "0", rotation: "-12deg" },
    { x: randomBetween(18, 80), y: randomBetween(13, 24), fromX: "0", fromY: "-65px", rotation: "8deg" },
    { x: randomBetween(18, 80), y: randomBetween(72, 84), fromX: "0", fromY: "65px", rotation: "-8deg" }
  ];
  const position = positions[Math.floor(Math.random() * positions.length)];
  const cat = document.createElement("button");
  cat.type = "button"; cat.className = "roaming-cat";
  cat.setAttribute("aria-label", "Gato escondido. Tócalo antes de que escape.");
  cat.style.setProperty("--cat-x", `${position.x}vw`); cat.style.setProperty("--cat-y", `${position.y}vh`);
  cat.style.setProperty("--from-x", position.fromX); cat.style.setProperty("--from-y", position.fromY);
  cat.style.setProperty("--peek-rotation", position.rotation);
  cat.appendChild(createCatDrawing(profile));
  cat.addEventListener("click", (event) => {
    const rect = cat.getBoundingClientRect();
    cat.classList.add("is-caught"); burstPetals(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
    setTimeout(() => {
      if (state.currentCat !== cat) return;
      clearCurrentCat();
      openCatChallenge(profile);
    }, 500);
    event.stopPropagation();
  });
  elements.catLayer.appendChild(cat); state.currentCat = cat;
  requestAnimationFrame(() => requestAnimationFrame(() => cat.classList.add("is-peeking")));
  state.catTimer = setTimeout(() => {
    cat.classList.remove("is-peeking"); showToast("Se escapó un gato… aparecerá otra vez por algún lado.");
    setTimeout(() => {
      if (state.currentCat !== cat) return;
      clearCurrentCat();
      scheduleCat();
    }, 550);
  }, 5200);
}

function setupCardTilt() {
  document.querySelectorAll(".memory-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const rect = card.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width; const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--ry", `${(x - .5) * 10}deg`); card.style.setProperty("--rx", `${(.5 - y) * 10}deg`);
      card.style.setProperty("--cx", `${x * 100}%`); card.style.setProperty("--cy", `${y * 100}%`);
    });
    card.addEventListener("pointerleave", () => { card.style.setProperty("--ry", "0deg"); card.style.setProperty("--rx", "0deg"); });
  });
}

function setupRipples() {
  document.querySelectorAll(".button").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      const rect = button.getBoundingClientRect(); const ripple = document.createElement("span"); ripple.className = "button-ripple";
      ripple.style.left = `${event.clientX - rect.left}px`; ripple.style.top = `${event.clientY - rect.top}px`; button.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

document.addEventListener("pointermove", (event) => {
  cancelAnimationFrame(pointerFrame);
  pointerFrame = requestAnimationFrame(() => {
    document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
    document.documentElement.style.setProperty("--my", `${event.clientY}px`);
  });
});
document.querySelectorAll("[data-go]").forEach((button) => button.addEventListener("click", () => transitionTo(button.dataset.go)));

elements.heroFlower.addEventListener("click", wakeCover);

document.querySelector("#garden-heart").addEventListener("click", (event) => {
  const messages = ["El jardín dice que sigas explorando.", "Una flor acaba de moverse. Sospechoso.", "Los gatos definitivamente están tramando algo.", "Sí, puedes seguir tocando. No se daña."];
  const firstWake = !document.body.classList.contains("garden-awake");
  state.gardenTouches += 1;
  const rect = event.currentTarget.getBoundingClientRect();
  if (firstWake) {
    setGardenAwake(true);
    burstPetals(rect.left + rect.width / 2, rect.top + rect.height / 2, 28);
    scheduleCat(2200);
    showToast("Ahora sí: los recuerdos entraron en órbita.");
    return;
  }
  event.currentTarget.classList.add("is-awake");
  burstPetals(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
  event.currentTarget.querySelector(".garden-heart__message").textContent = messages[(state.gardenTouches - 2) % messages.length];
});

document.querySelectorAll("[data-memory]").forEach((card) => {
  card.addEventListener("click", () => {
    const memory = memories[card.dataset.memory]; elements.dialogKicker.textContent = memory.kicker;
    elements.dialogTitle.textContent = memory.title; elements.dialogCopy.textContent = memory.copy;
    state.openedMemories.add(card.dataset.memory); saveProgress(); updateProgress();
    clearCurrentCat();
    const rect = card.getBoundingClientRect(); burstPetals(rect.left + rect.width / 2, rect.top + rect.height / 2, 10); elements.dialog.showModal();
  });
});

document.querySelector(".dialog-close").addEventListener("click", () => elements.dialog.close());
document.querySelector(".dialog-continue").addEventListener("click", () => elements.dialog.close());
elements.dialog.addEventListener("click", (event) => { if (event.target === elements.dialog) elements.dialog.close(); });
elements.dialog.addEventListener("close", () => { if (!elements.catDialog.open) scheduleCat(900); });

document.querySelector(".cat-dialog__close").addEventListener("click", () => elements.catDialog.close());
elements.catDialog.addEventListener("click", (event) => { if (event.target === elements.catDialog) elements.catDialog.close(); });
elements.catDialog.addEventListener("close", () => {
  clearChallengeTimer();
  state.activeCat = null;
  if (document.body.dataset.screen === "jardin" && state.foundCats.size < cats.length) scheduleCat(state.challengeComplete ? 1200 : 700);
});

document.querySelector("#hint-button").addEventListener("click", () => {
  if (state.foundCats.size === 5) showToast("Ya encontraste los cinco gatos. Misión cumplida.");
  else { showToast("Encuéntralos por los bordes y supera la prueba de cada uno para ganar su confianza."); clearCurrentCat(); scheduleCat(450); }
});

function clearSupportTimer() {
  if (state.supportTimer !== null) {
    window.clearInterval(state.supportTimer);
    state.supportTimer = null;
  }
}

function resetSupportActivity() {
  clearSupportTimer();
  document.querySelectorAll("[data-support]").forEach((button) => button.setAttribute("aria-pressed", "false"));
  elements.supportActivity.innerHTML = '<p class="support-activity__empty">Este jardín no guarda lo que eliges. Aquí no hay respuestas correctas ni afán.</p>';
  scheduleCat(1200);
}

function supportActivityHeader(label, title, copy) {
  return `<div class="support-activity__header"><div><span class="support-activity__eyebrow">${label}</span><h3>${title}</h3></div><button class="support-back" type="button" data-support-back>Elegir otra</button></div><p class="support-activity__copy">${copy}</p>`;
}

function renderBreathingActivity() {
  elements.supportActivity.innerHTML = `
    <div class="support-activity__panel">
      ${supportActivityHeader("PAUSA OPCIONAL", "Un momento sin afán", "Si te sirve, acompaña la flor: toma aire cuando se abra y suéltalo cuando vuelva. Respira a tu ritmo; puedes pausar o cambiar de actividad cuando quieras.")}
      <div class="breath-layout">
        <div class="breath-stage" id="breath-stage" aria-hidden="true"><span class="breath-stage__halo"></span><svg viewBox="0 0 100 100"><use href="#icon-flower" /></svg></div>
        <div class="breath-instructions"><p class="breath-phase" id="breath-phase" aria-live="polite">Cuando quieras, empieza. No hay que hacerlo perfecto.</p><p class="breath-count" id="breath-count">0 de 4 vueltas</p><p class="breath-footnote">Cada vuelta es cortica. Si seguir el ritmo no se siente bien, paras y ya.</p></div>
      </div>
      <div class="support-activity__actions"><button class="button button--primary" id="breath-toggle" type="button">Empezar</button><button class="button button--secondary" id="breath-reset" type="button">Volver al inicio</button></div>
    </div>`;

  const stage = elements.supportActivity.querySelector("#breath-stage");
  const phaseText = elements.supportActivity.querySelector("#breath-phase");
  const countText = elements.supportActivity.querySelector("#breath-count");
  const toggle = elements.supportActivity.querySelector("#breath-toggle");
  const reset = elements.supportActivity.querySelector("#breath-reset");
  let round = 1;
  let phase = "inhala";
  let isFinished = false;
  stage.dataset.phase = phase;

  const paintBreathState = () => {
    countText.textContent = `${isFinished ? 4 : Math.max(0, round - 1)} de 4 vueltas`;
  };
  const startBreathing = () => {
    isFinished = false;
    stage.classList.add("is-running");
    toggle.textContent = "Pausar";
    phaseText.textContent = phase === "inhala" ? "Inhala suave cuando la flor se abra." : "Suelta el aire cuando la flor se encoja.";
    paintBreathState();
    state.supportTimer = window.setInterval(() => {
      if (phase === "inhala") {
        phase = "suelta";
        stage.dataset.phase = phase;
        phaseText.textContent = "Ahora suelta el aire, sin apurarte.";
      } else if (round === 4) {
        clearSupportTimer();
        isFinished = true;
        stage.classList.remove("is-running");
        toggle.textContent = "Hacer otra vuelta";
        phaseText.textContent = "Listo. Quédate aquí el tiempo que quieras o escoge otra cosa.";
      } else {
        round += 1;
        phase = "inhala";
        stage.dataset.phase = phase;
        phaseText.textContent = `Vuelta ${round}: deja que la flor se abra y toma aire a tu ritmo.`;
      }
      paintBreathState();
    }, 3500);
  };

  toggle.addEventListener("click", () => {
    if (state.supportTimer !== null) {
      clearSupportTimer();
      stage.classList.remove("is-running");
      toggle.textContent = "Continuar";
      phaseText.textContent = "Pausa. Puedes seguir desde aquí o elegir otra actividad.";
      return;
    }
    if (isFinished) { round = 1; phase = "inhala"; stage.dataset.phase = phase; }
    startBreathing();
  });

  reset.addEventListener("click", () => {
    clearSupportTimer();
    round = 1;
    phase = "inhala";
    isFinished = false;
    stage.dataset.phase = phase;
    stage.classList.remove("is-running");
    toggle.textContent = "Empezar";
    phaseText.textContent = "Cuando quieras, empieza. No hay que hacerlo perfecto.";
    countText.textContent = "0 de 4 vueltas";
  });
}

function renderCompanyActivity() {
  elements.supportActivity.innerHTML = `
    <div class="support-activity__panel">
      ${supportActivityHeader("POR SI TE SIRVE", "Pedir compañía, a tu manera", "No tienes que explicar todo ni encontrar las palabras perfectas. Puedes copiar esto, cambiarlo o no usarlo.")}
      <label class="message-template__label" for="company-message">Una idea de mensaje</label>
      <textarea class="message-template" id="company-message" rows="3" readonly>¿Tienes un ratico para acompañarme o hablar un poco? No necesito que soluciones nada; solo me serviría compartir un momento contigo.</textarea>
      <div class="support-activity__actions"><button class="button button--primary" id="copy-company-message" type="button">Copiar mensaje</button><span class="copy-status" id="copy-status" role="status" aria-live="polite">No se envía ni se almacena en esta página; solo se copia si lo pides.</span></div>
      <p class="breath-footnote">Puedes mandárselo a alguien de confianza. No tienes que pedírmelo a mí.</p>
    </div>`;

  const message = elements.supportActivity.querySelector("#company-message");
  const status = elements.supportActivity.querySelector("#copy-status");
  elements.supportActivity.querySelector("#copy-company-message").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(message.value);
      status.textContent = "Copiado. Tú decides si lo cambias, lo mandas o lo dejas ahí.";
    } catch {
      message.focus();
      message.select();
      status.textContent = "No se pudo copiar automáticamente; el texto quedó seleccionado para copiarlo manualmente.";
    }
  });
}

function renderFireflyActivity() {
  elements.supportActivity.innerHTML = `
    <div class="support-activity__panel">
      ${supportActivityHeader("MINI MISIÓN", "Una búsqueda chiquita", "Se escondieron cinco luciérnagas por este pedacito de jardín. Encuéntralas sin afán; no hay reloj.")}
      <div class="firefly-hunt" id="firefly-hunt" role="group" aria-label="Buscar cinco luciérnagas"></div>
      <p class="challenge-status" id="firefly-status" aria-live="polite">0 de 5 encontradas.</p>
      <div class="firefly-finish" id="firefly-finish" hidden><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#icon-flower" /></svg><p>Jardín revisado. Ni una luciérnaga paga arriendo aquí.</p><button class="button button--secondary" id="firefly-again" type="button">Otra búsqueda</button></div>
    </div>`;

  const hunt = elements.supportActivity.querySelector("#firefly-hunt");
  const status = elements.supportActivity.querySelector("#firefly-status");
  const finish = elements.supportActivity.querySelector("#firefly-finish");
  const positions = [[12, 24], [74, 20], [48, 52], [22, 76], [83, 70]];
  let found = 0;
  positions.forEach(([x, y], index) => {
    const light = document.createElement("button");
    light.type = "button";
    light.className = "support-firefly";
    light.style.setProperty("--hunt-x", `${x}%`);
    light.style.setProperty("--hunt-y", `${y}%`);
    light.setAttribute("aria-label", `Luciérnaga escondida ${index + 1}`);
    light.addEventListener("click", () => {
      if (light.disabled) return;
      light.disabled = true;
      light.classList.add("is-found");
      found += 1;
      status.textContent = `${found} de 5 encontradas${found === 5 ? ". Misión cumplida." : ". Sigue mirando por aquí."}`;
      if (found === positions.length) {
        hunt.classList.add("is-complete");
        finish.hidden = false;
        elements.supportActivity.querySelector("#firefly-again").focus({ preventScroll: true });
      } else {
        hunt.querySelector(".support-firefly:not(:disabled)")?.focus({ preventScroll: true });
      }
    });
    hunt.appendChild(light);
  });
  elements.supportActivity.querySelector("#firefly-again").addEventListener("click", () => {
    renderFireflyActivity();
    elements.supportActivity.querySelector("[data-support-back]")?.focus({ preventScroll: true });
  });
}

function openSupportActivity(activity) {
  clearCurrentCat();
  clearSupportTimer();
  document.querySelectorAll("[data-support]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.support === activity)));
  if (activity === "pausa") renderBreathingActivity();
  if (activity === "compania") renderCompanyActivity();
  if (activity === "juego") renderFireflyActivity();
  elements.supportActivity.querySelector("[data-support-back]")?.focus({ preventScroll: true });
}

document.querySelectorAll("[data-support]").forEach((button) => {
  button.addEventListener("click", () => openSupportActivity(button.dataset.support));
});
elements.supportActivity.addEventListener("click", (event) => {
  if (!event.target.closest("[data-support-back]")) return;
  const selected = elements.supportNook.querySelector('[data-support][aria-pressed="true"]');
  resetSupportActivity();
  selected?.focus({ preventScroll: true });
});

elements.finalButton.addEventListener("click", () => { if (!elements.finalButton.disabled) transitionTo("final"); });
document.querySelector("#restart-button").addEventListener("click", () => {
  resetCover();
  state.openedMemories.clear();
  state.foundCats.clear();
  state.gardenTouches = 0;
  saveProgress();
  updateProgress();
  transitionTo("inicio");
  clearCurrentCat();
  showToast("El jardín volvió a esconderlo todo.");
});

createAmbient(); setupCardTilt(); setupRipples(); updateProgress();
