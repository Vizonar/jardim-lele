const garden = document.getElementById("garden");
const plants = document.getElementById("plants");
const fx = document.getElementById("fx");
const card = document.getElementById("card");
const toolbar = document.getElementById("toolbar");
const picker = document.getElementById("picker");
const colorsBox = document.getElementById("colors");

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
let uid = 0;

// ===== CATÁLOGO DE PLANTAS =====
// flores: c = [claro, médio, escuro] das pétalas
// folhagens: c = "verde" ou "variegada"
const PLANTS = {
  tulipa: {
    label: "Tulipa",
    icon: "🌷",
    colors: [
      { name: "Branca", c: ["#ffffff", "#fbeef1", "#d9b3bd"] },
      { name: "Vermelha", c: ["#ff8a8a", "#e63946", "#9d0208"] },
      { name: "Rosa", c: ["#ffd1dc", "#ff8fab", "#d6336c"] },
      { name: "Amarela", c: ["#fff6bf", "#ffd23f", "#e09f00"] },
      { name: "Lilás", c: ["#ecc8ff", "#b388eb", "#6a1b9a"] },
      { name: "Laranja", c: ["#ffe0b8", "#ff9f45", "#d9480f"] },
      { name: "Pink", c: ["#ffc4e6", "#f15bb5", "#9c1767"] },
    ],
  },
  margarida: {
    label: "Margarida",
    icon: "🌼",
    colors: [
      { name: "Branca", c: ["#ffffff", "#f7f7f2", "#d8d8cc"] },
      { name: "Amarela", c: ["#fff3a3", "#ffd23f", "#e0a800"] },
      { name: "Rosa", c: ["#ffe0ea", "#ff9fbf", "#d6336c"] },
      { name: "Lilás", c: ["#f1dcff", "#c39bec", "#7b3fb0"] },
    ],
  },
  girassol: {
    label: "Girassol",
    icon: "🌻",
    colors: [
      { name: "Amarelo", c: ["#ffe866", "#ffc300", "#e08e00"] },
      { name: "Laranja", c: ["#ffc56b", "#ff8c1a", "#c75000"] },
      { name: "Vermelho", c: ["#ff9a6b", "#d9381e", "#7a1408"] },
    ],
  },
  adao: {
    label: "Costela-de-adão",
    icon: "🌿",
    colors: [
      { name: "Verde", c: "verde", sw: "#40916c" },
      { name: "Variegada", c: "variegada", sw: "linear-gradient(90deg,#f4fbef 50%,#40916c 50%)" },
    ],
  },
  eva: {
    label: "Costela-de-eva",
    icon: "🍃",
    colors: [
      { name: "Verde", c: "verde", sw: "#52b788" },
      { name: "Variegada", c: "variegada", sw: "linear-gradient(90deg,#f4fbef 50%,#52b788 50%)" },
    ],
  },
};

const PETAL_COLORS = [
  ["#ffd1dc", "#ff8fab"],
  ["#ff8a8a", "#e63946"],
  ["#ffffff", "#ffc2d1"],
  ["#ecc8ff", "#b388eb"],
];

// ===== FLORES (tulipa, margarida, girassol) =====
function flowerHead(kind, c, id) {
  if (kind === "tulipa") {
    return `
      <g class="head">
        <path fill="url(#${id}b)" d="M0,0 C-22,-4 -22,-44 -6,-62 L0,-52 L6,-62 C22,-44 22,-4 0,0Z"/>
        <path class="pl" fill="url(#${id}p)" d="M4,6 C-24,6 -30,-30 -18,-58 C-6,-46 6,-30 4,6Z"/>
        <path class="pr" fill="url(#${id}p)" d="M-4,6 C24,6 30,-30 18,-58 C6,-46 -6,-30 -4,6Z"/>
        <path fill="url(#${id}p)" d="M0,8 C-17,5 -16,-34 0,-54 C16,-34 17,5 0,8Z"/>
        <path d="M-3,-8 C-8,-20 -7,-34 -2,-44" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
      </g>`;
  }

  const sun = kind === "girassol";
  const n = sun ? 22 : 16;
  const len = sun ? 30 : 26;
  const core = sun ? 15 : 9;
  let petals = "";
  for (let layer = 0; layer < (sun ? 2 : 1); layer++) {
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * 360 + layer * (180 / n);
      const fill = layer === 0 && sun ? c[2] : `url(#${id}p)`;
      petals += sun
        ? `<path d="M0,${-core + 2} C-6,${-core - len * 0.4} -3,${-core - len * 0.9} 0,${-core - len} C3,${-core - len * 0.9} 6,${-core - len * 0.4} 0,${-core + 2}Z"
                 fill="${fill}" transform="rotate(${ang})"/>`
        : `<ellipse cx="0" cy="${-core - len / 2 + 3}" rx="4.6" ry="${len / 2}" fill="${fill}"
                    stroke="${c[2]}" stroke-width=".6" transform="rotate(${ang})"/>`;
    }
  }
  let seeds = "";
  if (sun) {
    for (let i = 0; i < 26; i++) {
      const r = Math.sqrt(i / 26) * (core - 3);
      const a = i * 137.5 * (Math.PI / 180);
      seeds += `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="1.3" fill="#2b1608" opacity=".7"/>`;
    }
  }
  return `
    <g transform="rotate(${rand(-15, 15)}) scale(1 ${sun ? 0.82 : 0.78})">
      <g class="head head-c">
        <g class="spin">${petals}</g>
        <circle r="${core}" fill="${sun ? "#5b3a1a" : "#f4b400"}"/>
        <circle r="${core * 0.65}" cx="-2" cy="-2" fill="${sun ? "#7a4f22" : "#ffd23f"}"/>
        ${seeds}
      </g>
    </g>`;
}

function flowerSVG(kind, c) {
  const id = "f" + uid++;
  const bend = rand(-12, 12);
  const top = kind === "tulipa" ? 102 : 78;
  const l1 = rand(140, 190);
  const l2 = rand(120, 180);
  const stemW = kind === "girassol" ? 7 : kind === "margarida" ? 3.5 : 5;
  return `
  <svg class="flower" viewBox="0 0 100 320" aria-hidden="true">
    <defs>
      <linearGradient id="${id}p" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${c[0]}"/>
        <stop offset=".55" stop-color="${c[1]}"/>
        <stop offset="1" stop-color="${c[2]}"/>
      </linearGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${c[1]}"/>
        <stop offset="1" stop-color="${c[2]}"/>
      </linearGradient>
      <linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#8fd18a"/>
        <stop offset="1" stop-color="#2d6a4f"/>
      </linearGradient>
    </defs>
    <path class="stem" pathLength="1" d="M50,320 C${50 + bend},250 ${50 - bend},170 50,${top}"
          fill="none" stroke="#3f8f4a" stroke-width="${stemW}" stroke-linecap="round"/>
    <path class="leaf" fill="url(#${id}l)"
          d="M50,318 C24,${320 - l1 * 0.3} 14,${320 - l1 * 0.7} 26,${320 - l1} C38,${320 - l1 * 0.62} 46,${320 - l1 * 0.3} 50,318Z"/>
    <path class="leaf" fill="url(#${id}l)"
          d="M50,318 C76,${320 - l2 * 0.3} 86,${320 - l2 * 0.7} 74,${320 - l2} C62,${320 - l2 * 0.62} 54,${320 - l2 * 0.3} 50,318Z"/>
    <g transform="translate(50,${top + 2})">${flowerHead(kind, c, id)}</g>
  </svg>`;
}

// ===== COSTELA-DE-ADÃO (recortes) e COSTELA-DE-EVA (furinhos) =====
function leafShape(L, W) {
  return `M0,0
    C${-0.3 * W},${0.14 * L} ${-W},${0.1 * L} ${-W},${-0.36 * L}
    C${-W},${-0.78 * L} ${-0.45 * W},${-L} 0,${-L}
    C${0.45 * W},${-L} ${W},${-0.78 * L} ${W},${-0.36 * L}
    C${W},${0.1 * L} ${0.3 * W},${0.14 * L} 0,0Z`;
}

function monsteraLeafSVG(type, variant, angle) {
  const id = "m" + uid++;
  const eva = type === "eva";
  const L = eva ? rand(130, 160) : rand(140, 175);
  const W = eva ? L * 0.34 : L * 0.5;
  const h = rand(150, 260);
  const a = angle ?? rand(-55, 55);
  const tx = Math.sin((a * Math.PI) / 180) * h * 0.45;
  const ty = -h;
  const shades = pick([
    ["#2d6a4f", "#52b788"],
    ["#1b4332", "#40916c"],
    ["#245c3c", "#74c69d"],
  ]);

  let cuts = "";
  let veins = "";
  const n = eva ? 4 : 6;
  for (const s of [-1, 1]) {
    for (let i = 0; i < n; i++) {
      const t = 0.12 + (i / n) * 0.78 + rand(-0.03, 0.03);
      const sy = -t * L;
      if (eva) {
        const cx = s * W * rand(0.42, 0.55);
        cuts += `<ellipse cx="${cx}" cy="${sy}" rx="${W * 0.2}" ry="${L * 0.06}"
                   transform="rotate(${s * -35} ${cx} ${sy})" fill="#000"/>`;
      } else {
        const ey = sy - L * (0.04 + 0.16 * t);
        cuts += `<path d="M${s * W * 0.24},${sy} Q${s * W * 0.7},${sy - L * 0.03} ${s * W * 1.4},${ey}"
                   stroke="#000" stroke-width="${L * rand(0.03, 0.045)}" stroke-linecap="round" fill="none"/>`;
        if (i > 0 && i < n - 1 && Math.random() < 0.6) {
          cuts += `<ellipse cx="${s * W * 0.14}" cy="${sy + L * 0.06}" rx="${W * 0.05}" ry="${L * 0.025}" fill="#000"/>`;
        }
      }
      const vy = sy + L * (eva ? 0.06 : 0.065);
      veins += `<path d="M0,${vy + L * 0.03} Q${s * W * 0.5},${vy} ${s * W * 1.05},${vy - L * 0.14}"/>`;
    }
  }

  // variegada: manchas brancas em "meia-lua" e respingos
  let vari = "";
  if (variant === "variegada") {
    const s = pick([-1, 1]);
    const y1 = -rand(0.15, 0.5) * L;
    const y2 = y1 - rand(0.25, 0.45) * L;
    vari += `<path d="M0,${y1} C${s * W * 0.6},${y1 + L * 0.05} ${s * W * 1.5},${y1} ${s * W * 1.5},${y1}
                     L${s * W * 1.5},${y2} C${s * W},${y2 - L * 0.08} ${s * W * 0.3},${y2} 0,${y2}Z" fill="#f4fbef"/>`;
    for (let i = 0; i < 7; i++) {
      vari += `<ellipse cx="${rand(-W, W)}" cy="${-rand(0.1, 0.9) * L}" rx="${rand(3, 10)}" ry="${rand(2, 6)}"
                 fill="#f4fbef" opacity="${rand(0.6, 0.95)}" transform="rotate(${rand(-40, 40)})"/>`;
    }
  }

  return `
  <svg class="monstera" viewBox="-160 -420 320 420" aria-hidden="true">
    <defs>
      <linearGradient id="${id}g" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="${shades[0]}"/>
        <stop offset="1" stop-color="${shades[1]}"/>
      </linearGradient>
      <mask id="${id}k" maskUnits="userSpaceOnUse" x="-400" y="-600" width="800" height="800">
        <path d="${leafShape(L, W)}" fill="#fff"/>
        ${cuts}
      </mask>
    </defs>
    <path d="M0,0 Q${tx * 0.1},${ty * 0.6} ${tx},${ty}" fill="none" stroke="#3a7d44" stroke-width="6" stroke-linecap="round"/>
    <g transform="translate(${tx},${ty}) rotate(${a})">
      <g mask="url(#${id}k)">
        <path d="${leafShape(L, W)}" fill="url(#${id}g)"/>
        ${vari}
        <g fill="none" stroke="#b7e4c7" stroke-opacity=".35" stroke-width="2">
          <path d="M0,0 L0,${-L * 0.96}" stroke-width="3.5"/>
          ${veins}
        </g>
      </g>
    </g>
  </svg>`;
}

// ===== PLANTAR =====
const MAX_B = 16; // fundo do jardim (vh acima da barra)

function addPlant(svg, { x, b, h, z, d = 0, sa = 2, sd = 4, rise = false }) {
  const el = document.createElement("div");
  el.className = "plant" + (rise ? " rise" : "");
  el.style.cssText = `--x:${x}%;--b:${b}vh;--h:${h};--d:${d}s;--sa:${sa}deg;--sd:${sd}s;z-index:${z}`;
  el.innerHTML = svg;
  plants.appendChild(el);
  return [el];
}

// b = altura no chão (0 = frente, MAX_B = fundo); plantas no fundo ficam menores
function plant(kind, colorEntry, x, b, d = 0) {
  const depth = 1 - (b / MAX_B) * 0.45;
  const z = 100 - Math.round(b * 5);
  const color = colorEntry.c;

  if (kind === "adao" || kind === "eva") {
    const count = kind === "adao" ? 3 : 4;
    const els = [];
    for (let i = 0; i < count; i++) {
      const ang = (i / (count - 1) - 0.5) * 90 + rand(-12, 12);
      els.push(...addPlant(monsteraLeafSVG(kind, color, ang), {
        x: x + rand(-2, 2),
        b: b + rand(-0.5, 0.5),
        h: rand(34, 46) * depth * (kind === "eva" ? 0.85 : 1),
        z: z - 1,
        d: d + i * 0.2,
        sa: rand(1, 2.5),
        sd: rand(4.5, 7),
        rise: true,
      }));
    }
    return els;
  }

  const size = { tulipa: [28, 36], margarida: [27, 34], girassol: [34, 44] }[kind];
  return addPlant(flowerSVG(kind, color), {
    x,
    b,
    h: rand(...size) * depth,
    z,
    d,
    sa: rand(1.5, 4),
    sd: rand(2.8, 5),
  });
}

// ===== ESCOLHA DE PLANTA E COR =====
const state = { kind: "tulipa", color: -1 }; // -1 = sortear

function swatchBg(entry) {
  return entry.sw || `radial-gradient(circle at 35% 30%, ${entry.c[0]}, ${entry.c[1]} 60%, ${entry.c[2]})`;
}

function renderPicker() {
  picker.innerHTML = "";
  for (const [key, p] of Object.entries(PLANTS)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "plant-btn" + (state.kind === key ? " active" : "");
    btn.innerHTML = `<span class="ico">${p.icon}</span><span class="lbl">${p.label}</span>`;
    btn.addEventListener("click", () => {
      state.kind = key;
      state.color = -1;
      renderPicker();
    });
    picker.appendChild(btn);
  }

  colorsBox.innerHTML = "";
  const colors = PLANTS[state.kind].colors;
  const dice = document.createElement("button");
  dice.type = "button";
  dice.className = "swatch dice" + (state.color === -1 ? " active" : "");
  dice.textContent = "🎲";
  dice.title = dice.ariaLabel = "Cor surpresa";
  dice.addEventListener("click", () => { state.color = -1; renderPicker(); });
  colorsBox.appendChild(dice);
  colors.forEach((entry, i) => {
    const sw = document.createElement("button");
    sw.type = "button";
    sw.className = "swatch" + (state.color === i ? " active" : "");
    sw.style.background = swatchBg(entry);
    sw.title = sw.ariaLabel = entry.name;
    sw.addEventListener("click", () => { state.color = i; renderPicker(); });
    colorsBox.appendChild(sw);
  });
  const name = document.createElement("span");
  name.className = "color-name";
  name.textContent = state.color === -1 ? "surpresa" : colors[state.color].name.toLowerCase();
  colorsBox.appendChild(name);

  updateBarHeight();
}

function updateBarHeight() {
  document.documentElement.style.setProperty("--bar", toolbar.offsetHeight + "px");
}
addEventListener("resize", updateBarHeight);

// ===== EFEITOS =====
function spawnPetal() {
  if (document.hidden || fx.childElementCount > 60) return;
  const p = document.createElement("div");
  const [c1, c2] = pick(PETAL_COLORS);
  p.className = "petal";
  p.style.cssText = `--x:${rand(-5, 100)}vw;--s:${rand(10, 18)}px;--t:${rand(7, 13)}s;--dx:${rand(-25, 25)}vw;--c1:${c1};--c2:${c2}`;
  p.addEventListener("animationend", () => p.remove());
  fx.appendChild(p);
}

function addFireflies(n) {
  for (let i = 0; i < n; i++) {
    const f = document.createElement("div");
    f.className = "firefly";
    f.style.cssText = `--x:${rand(0, 100)}vw;--y:${rand(15, 45)}vh;--t:${rand(6, 11)}s;--d:${rand(0, 8)}s;--dx:${rand(-6, 6)}vw`;
    fx.appendChild(f);
  }
}

const butterflies = [];
function addButterfly(color) {
  const el = document.createElement("div");
  el.className = "butterfly";
  el.innerHTML = `
    <svg viewBox="-22 -18 44 36">
      <g class="wl">
        <path d="M-1,-2 C-10,-18 -22,-14 -19,-3 C-17,3 -8,2 -1,-1Z" fill="${color[0]}"/>
        <path d="M-1,1 C-12,2 -16,12 -9,13 C-4,13 -2,7 -1,2Z" fill="${color[1]}"/>
      </g>
      <g class="wr">
        <path d="M1,-2 C10,-18 22,-14 19,-3 C17,3 8,2 1,-1Z" fill="${color[0]}"/>
        <path d="M1,1 C12,2 16,12 9,13 C4,13 2,7 1,2Z" fill="${color[1]}"/>
      </g>
      <rect x="-1.2" y="-8" width="2.4" height="18" rx="1.2" fill="#4a2c2a"/>
    </svg>`;
  fx.appendChild(el);
  butterflies.push({ el, seed: rand(0, 100), sx: rand(0.00012, 0.0002), sy: rand(0.0002, 0.00035), lastX: 0 });
}

function flyButterflies(t) {
  const w = innerWidth;
  const h = innerHeight;
  for (const b of butterflies) {
    const k = t + b.seed * 1000;
    const x = w * (0.5 + 0.45 * Math.sin(k * b.sx) * Math.cos(k * b.sx * 0.37));
    const y = h * (0.45 + 0.18 * Math.sin(k * b.sy) + 0.05 * Math.sin(k * 0.003));
    const tilt = clamp((x - b.lastX) * 8, -25, 25);
    b.lastX = x;
    b.el.style.transform = `translate(${x - 22}px, ${y - 18}px) rotate(${tilt}deg)`;
  }
  requestAnimationFrame(flyButterflies);
}

function burst(x, y) {
  const colors = ["#ff8fab", "#ffd23f", "#ffffff", "#b388eb", "#f15bb5"];
  for (let i = 0; i < 10; i++) {
    const s = document.createElement("div");
    const ang = (i / 10) * Math.PI * 2;
    const dist = rand(30, 60);
    s.className = "spark";
    s.style.cssText = `left:${x}px;top:${y}px;--c:${pick(colors)};--dx:${Math.cos(ang) * dist}px;--dy:${Math.sin(ang) * dist}px`;
    s.addEventListener("animationend", () => s.remove());
    fx.appendChild(s);
  }
}

// ===== APERTAR NO JARDIM =====
const planted = [];
document.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".card, .toolbar")) return;
  burst(e.clientX, e.clientY);

  const groundBottom = garden.getBoundingClientRect().bottom;
  const vh = innerHeight / 100;
  let b = (groundBottom - e.clientY) / vh;
  if (b > MAX_B) b = rand(0, MAX_B); // apertou no céu: planta num lugar qualquer do chão
  b = clamp(b, 0, MAX_B);

  const p = PLANTS[state.kind];
  const entry = state.color === -1 ? pick(p.colors) : p.colors[state.color];
  planted.push(plant(state.kind, entry, (e.clientX / innerWidth) * 100, b));
  if (planted.length > 60) planted.shift().forEach((el) => el.remove());
});

card.addEventListener("click", () => card.classList.toggle("mini"));

// ===== INÍCIO: uma tulipa branca no meio =====
renderPicker();
plant("tulipa", PLANTS.tulipa.colors[0], 50, 3, 0.6);
addFireflies(innerWidth > 700 ? 18 : 10);
addButterfly(["#ffb3c6", "#ff8fab"]);
addButterfly(["#ffe066", "#ffb703"]);
if (innerWidth > 700) addButterfly(["#cdb4db", "#a2d2ff"]);
requestAnimationFrame(flyButterflies);
setInterval(spawnPetal, 900);
