import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(join(root, file), "utf8");
const html = read("index.html");
const css = read("styles.css");
const js = read("script.js");

test("los recursos locales referenciados existen", () => {
  const localLinks = [...html.matchAll(/(?:href|src)="([^"#][^\"]*)"/g)].map((match) => match[1].split("?")[0]);
  for (const resource of localLinks) assert.ok(existsSync(join(root, resource)), `Falta ${resource}`);
});

test("los identificadores HTML son únicos y los selectores JS existen", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "Hay IDs duplicados");
  const idSelectors = [...js.matchAll(/querySelector(?:All)?\(["']#([\w-]+)/g)].map((match) => match[1]);
  for (const id of idSelectors) {
    const isGeneratedAtRuntime = js.includes(`id="${id}"`);
    assert.ok(ids.includes(id) || isGeneratedAtRuntime, `JavaScript busca #${id}, que no existe`);
  }
});

test("el regalo conserva los cuatro recuerdos conocidos y los cinco gatos", () => {
  assert.equal((html.match(/data-memory="/g) || []).length, 4);
  const challenges = [...js.matchAll(/challenge: "(light|picnic|cinema|crepes|cases)"/g)].map((match) => match[1]);
  assert.equal(challenges.length, 5);
  assert.equal(new Set(challenges).size, 5, "Cada gato debe tener un reto distinto");
  for (const detail of ["Parques del Río", "Kimetsu no Yaiba", "Crepes", "Gelatina y ñeros"]) {
    assert.ok(`${html}\n${js}`.includes(detail), `Falta el recuerdo ${detail}`);
  }
});

test("los retos de gatos tienen rondas y usan los recuerdos compartidos", () => {
  const picnic = js.slice(js.indexOf("const picnicRounds"), js.indexOf("const caseRounds"));
  const cases = js.slice(js.indexOf("const caseRounds"), js.indexOf("const cinemaMoments"));
  assert.equal((picnic.match(/\{ question:/g) || []).length, 4);
  assert.equal((cases.match(/\{ question:/g) || []).length, 3);
  assert.match(js, /const expectedOrder = \["save", "choose", "movie", "mall"\]/);
  assert.match(js, /const spots = \[\[16, 28\].*\[79, 17\]\]/);
  assert.match(js, /const patterns = \[\["A", "B"\], \["B", "A", "A"\], \["A", "B", "A", "B"\], \["B", "B", "A", "A", "B"\]\]/);
  assert.match(js, /inventó su propio patrón/);
  assert.match(js, /Pintaron y jugaron/);
  assert.match(js, /Arroz chino y mucho dulce/);
});

test("la secuencia de platos deja la luz apagada entre pasos repetidos", () => {
  const playback = js.slice(js.indexOf("const showNext = () =>"), js.indexOf("playButton.addEventListener(\"click\", showPattern)"));
  assert.match(playback, /target\.classList\.remove\("is-cued"\)[\s\S]*?setTimeout\([\s\S]*?showNext\(\)[\s\S]*?\}, plateOffGap\)/);
  assert.match(js, /const plateOnDuration = 620/);
  assert.match(js, /const plateOffGap = 300/);
});

test("el jardín empieza accesiblemente dormido y activa sus controles juntos", () => {
  for (const selector of ['class="garden-progress"', 'class="memory-path"', 'id="unlock-panel"', 'id="support-nook"']) {
    const element = html.slice(html.indexOf(selector), html.indexOf(">", html.indexOf(selector)) + 1);
    assert.match(element, /\binert\b/);
    assert.match(element, /aria-hidden="true"/);
  }
  assert.match(js, /region\.inert = !isAwake/);
  assert.match(js, /setGardenAwake\(true\)/);
});

test("la portada exige despertar la flor antes de entrar y permite repetir el recorrido", () => {
  const enter = html.match(/<button[^>]*id="hero-enter"[^>]*>/)?.[0];
  assert.ok(enter, "Falta el botón de entrada");
  assert.match(enter, /\bdisabled\b/);
  assert.match(html, /id="hero-status" role="status" aria-live="polite"/);
  assert.match(html, /id="hero-orbit"[^>]*aria-pressed="false"/);
  assert.match(html, /class="hero-orbit__roots"[\s\S]*?class="hero-orbit__root-lines"/);
  assert.match(html, /class="hero__veil"/);
  assert.ok(html.indexOf('class="hero__veil"') < html.indexOf("<main>"), "El velo debe ocupar la pantalla fuera de la sección animada");
  assert.ok(html.indexOf('id="hero-roots"') < html.indexOf("<main>"), "Las raíces deben ocupar la pantalla fuera de la sección animada");
  assert.match(js, /function drawCoverRoots\(originX, originY, width, height\)/);
  assert.match(js, /end: \[-24, height \* \.75\]/);
  assert.match(js, /end: \[width \+ 24, height \* \.78\]/);
  assert.match(js, /function wakeCover\(\)[\s\S]*?drawCoverRoots\(x, y, width, height\)[\s\S]*?elements\.heroEnter\.disabled = false/);
  assert.match(js, /document\.body\.style\.setProperty\("--flower-x"/);
  assert.match(js, /dataset\.screen === "inicio" && id === "jardin" && elements\.heroEnter\.disabled/);
  assert.match(js, /#restart-button[\s\S]*?resetCover\(\)/);
  assert.match(css, /@keyframes roots-grow/);
  assert.match(css, /@keyframes aurora-bloom/);
  assert.match(css, /\.hero__veil \{ position: fixed; inset: 0/);
  assert.match(css, /\.hero-orbit__roots \{ position: fixed; inset: 0/);
  assert.match(css, /main \{ position: relative; z-index: 4; \}/);
});

test("el rincón tiene actividades con controles y no persiste sus elecciones", () => {
  assert.equal((html.match(/data-support=/g) || []).length, 3);
  for (const activity of ["pausa", "compania", "juego"]) assert.ok(html.includes(`data-support="${activity}"`));
  assert.match(js, /function renderBreathingActivity\(\)/);
  assert.match(js, /function renderCompanyActivity\(\)/);
  assert.match(js, /function renderFireflyActivity\(\)/);
  assert.match(js, /navigator\.clipboard\.writeText\(message\.value\)/);
  assert.match(js, /function resetSupportActivity\(\)/);
  assert.match(js, /const positions = \[\[12, 24\].*\[83, 70\]\]/);
  assert.match(js, /puedes pausar o cambiar de actividad cuando quieras/);
  assert.match(js, /No se envía ni se almacena en esta página/);
  assert.match(js, /No tienes que pedírmelo a mí/);
  assert.doesNotMatch(js, /No tiene que ser Dylan/);
  const supportLogic = js.slice(js.indexOf("function clearSupportTimer"), js.indexOf("elements.finalButton.addEventListener"));
  assert.doesNotMatch(supportLogic, /localStorage/);
  assert.match(supportLogic, /clearInterval/);
  assert.match(js, /function renderFinalCats\(\)/);
  assert.match(js, /cats\.forEach\(\(profile, index\)/);
  assert.match(html, /id="final-cats" aria-hidden="true"/);
});

test("la página no solicita servicios externos ni usa emojis como ilustraciones", () => {
  assert.doesNotMatch(html, /(?:src|href)=["']https?:\/\//);
  assert.doesNotMatch(css, /url\(["']?https?:\/\//);
  assert.doesNotMatch(js, /\b(?:fetch|XMLHttpRequest|WebSocket)\b/);
  assert.doesNotMatch(`${html}\n${css}`, /\p{Emoji_Presentation}/u);
});

test("hay adaptación para portátil y móviles estrechos", () => {
  for (const width of [1180, 820, 560, 520]) assert.ok(css.includes(`max-width: ${width}px`), `Falta el breakpoint de ${width}px`);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.cat-dialog[\s\S]*?max-height: calc\(100dvh - 28px\)/);
  assert.match(css, /\.breath-layout/);
  assert.match(css, /\.timeline-pieces/);
  assert.match(html, /<noscript>/);
});
