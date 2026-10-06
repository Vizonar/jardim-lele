const garden = document.getElementById("garden");
const plants = document.getElementById("plants");
const fx = document.getElementById("fx");
const card = document.getElementById("card");
const toolbar = document.getElementById("toolbar");
const picker = document.getElementById("picker");
const colorsBox = document.getElementById("colors");
const toastEl = document.getElementById("toast");

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// ids únicos mesmo entre visitas (as plantas salvas guardam seus ids)
let uid = Date.now();

const store = {
  get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} },
};

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

// ===== CATÁLOGO =====
// flores: c = [claro, médio, escuro] | folhagens: c = "verde" ou "variegada"
const PLANTS = {
  tulipa: {
    label: "Tulipa",
    size: [28, 36],
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
  rosa: {
    label: "Rosa",
    size: [26, 33],
    colors: [
      { name: "Vermelha", c: ["#ff6b6b", "#d00000", "#7a0010"] },
      { name: "Rosa", c: ["#ffd6e0", "#ff8fab", "#c9184a"] },
      { name: "Branca", c: ["#ffffff", "#f8f1ec", "#d9c8bd"] },
      { name: "Amarela", c: ["#fff3b0", "#ffd23f", "#d99a00"] },
      { name: "Salmão", c: ["#ffd8c2", "#ff9e7a", "#d9603b"] },
    ],
  },
  margarida: {
    label: "Margarida",
    size: [27, 34],
    colors: [
      { name: "Branca", c: ["#ffffff", "#f7f7f2", "#d8d8cc"] },
      { name: "Amarela", c: ["#fff3a3", "#ffd23f", "#e0a800"] },
      { name: "Rosa", c: ["#ffe0ea", "#ff9fbf", "#d6336c"] },
      { name: "Lilás", c: ["#f1dcff", "#c39bec", "#7b3fb0"] },
    ],
  },
  girassol: {
    label: "Girassol",
    size: [34, 44],
    colors: [
      { name: "Amarelo", c: ["#ffe866", "#ffc300", "#e08e00"] },
      { name: "Laranja", c: ["#ffc56b", "#ff8c1a", "#c75000"] },
      { name: "Vermelho", c: ["#ff9a6b", "#d9381e", "#7a1408"] },
    ],
  },
  lirio: {
    label: "Lírio",
    size: [28, 35],
    colors: [
      { name: "Branco", c: ["#ffffff", "#fdf6f8", "#e6cdd5"] },
      { name: "Rosa", c: ["#ffe0ec", "#ff5fa2", "#b0105a"] },
      { name: "Laranja", c: ["#ffd29a", "#ff8c1a", "#c44d00"] },
      { name: "Amarelo", c: ["#fff7b0", "#ffdf4f", "#d9a400"] },
    ],
  },
  orquidea: {
    label: "Orquídea",
    size: [22, 28],
    colors: [
      { name: "Branca", c: ["#ffffff", "#faf5ff", "#e4d4ec"] },
      { name: "Rosa", c: ["#ffe0f0", "#ff7ac1", "#b8126e"] },
      { name: "Lilás", c: ["#f2e1ff", "#c79bf2", "#7b3fb0"] },
      { name: "Amarela", c: ["#fff8d1", "#ffe066", "#d1a000"] },
    ],
  },
  lavanda: {
    label: "Lavanda",
    size: [30, 38],
    colors: [
      { name: "Lilás", c: ["#e7d4ff", "#b38be8", "#7048b6"] },
      { name: "Roxa", c: ["#d7b8ff", "#8e5bd6", "#4b2585"] },
      { name: "Branca", c: ["#ffffff", "#f1ecf7", "#cbbfd9"] },
    ],
  },
  adao: {
    label: "Costela-de-adão",
    colors: [
      { name: "Verde", c: "verde", sw: "#40916c" },
      { name: "Variegada", c: "variegada", sw: "linear-gradient(90deg,#eef7e4 50%,#40916c 50%)" },
    ],
  },
  eva: {
    label: "Costela-de-eva",
    colors: [
      { name: "Verde", c: "verde", sw: "#52b788" },
      { name: "Variegada", c: "variegada", sw: "linear-gradient(90deg,#eef7e4 50%,#52b788 50%)" },
    ],
  },
  regador: { label: "Regador", colors: [] },
};

const PETAL_COLORS = [
  ["#ffd1dc", "#ff8fab"],
  ["#ff8a8a", "#e63946"],
  ["#ffffff", "#ffc2d1"],
  ["#ecc8ff", "#b388eb"],
];

// ===== FLORES =====
function gradDefs(id, c) {
  return `
    <linearGradient id="${id}p" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c[0]}"/>
      <stop offset=".55" stop-color="${c[1]}"/>
      <stop offset="1" stop-color="${c[2]}"/>
    </linearGradient>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c[1]}"/>
      <stop offset="1" stop-color="${c[2]}"/>
    </linearGradient>
    <radialGradient id="${id}r">
      <stop offset="0" stop-color="${c[2]}"/>
      <stop offset=".45" stop-color="${c[1]}"/>
      <stop offset="1" stop-color="${c[0]}"/>
    </radialGradient>
    <linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8fd18a"/>
      <stop offset="1" stop-color="#2d6a4f"/>
    </linearGradient>`;
}

// cabeça da flor desenhada em volta de (0,0)
function flowerHead(kind, c, id) {
  switch (kind) {
    case "tulipa":
      return `
      <g class="head">
        <path fill="url(#${id}b)" d="M0,0 C-22,-4 -22,-44 -6,-62 L0,-52 L6,-62 C22,-44 22,-4 0,0Z"/>
        <path class="pl" fill="url(#${id}p)" d="M4,6 C-24,6 -30,-30 -18,-58 C-6,-46 6,-30 4,6Z"/>
        <path class="pr" fill="url(#${id}p)" d="M-4,6 C24,6 30,-30 18,-58 C6,-46 -6,-30 -4,6Z"/>
        <path fill="url(#${id}p)" d="M0,8 C-17,5 -16,-34 0,-54 C16,-34 17,5 0,8Z"/>
        <path d="M-3,-8 C-8,-20 -7,-34 -2,-44" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
      </g>`;

    case "rosa": {
      let petals = "";
      const layers = [
        { n: 5, d: 15, rx: 13, ry: 15, f: c[2], o: 0 },
        { n: 5, d: 10, rx: 11, ry: 12, f: `url(#${id}b)`, o: 36 },
        { n: 4, d: 6, rx: 8, ry: 9, f: c[1], o: 20 },
        { n: 3, d: 3, rx: 6, ry: 6, f: `url(#${id}p)`, o: 60 },
      ];
      for (const L of layers) {
        for (let i = 0; i < L.n; i++) {
          const a = (i / L.n) * 360 + L.o;
          petals += `<ellipse cx="0" cy="${-L.d}" rx="${L.rx}" ry="${L.ry}" fill="${L.f}" stroke="${c[2]}" stroke-opacity=".35" stroke-width=".8" transform="rotate(${a})"/>`;
        }
      }
      return `
      <g transform="scale(1 .85)">
        <g class="head head-c">
          ${petals}
          <path d="M0,0 C3,-3 4,2 0,4 C-5,5 -6,-3 -1,-6 C5,-8 9,-1 6,5" fill="none" stroke="${c[2]}" stroke-width="1.6" stroke-linecap="round"/>
        </g>
      </g>`;
    }

    case "lirio": {
      let petals = "";
      let stamens = "";
      for (let i = 0; i < 6; i++) {
        const a = i * 60 + (i % 2 ? 0 : 30) + 0;
        petals += `
          <g transform="rotate(${i * 60})">
            <path d="M0,0 C-9,-8 -9,-24 0,-36 C9,-24 9,-8 0,0Z" fill="url(#${id}r)" stroke="${c[2]}" stroke-opacity=".4" stroke-width=".7"/>
            <path d="M0,-4 L0,-28" stroke="${c[2]}" stroke-opacity=".55" stroke-width="1.2"/>
            <circle cx="-2.5" cy="-12" r="1" fill="${c[2]}"/><circle cx="2.5" cy="-16" r="1" fill="${c[2]}"/>
          </g>`;
        stamens += `<g transform="rotate(${a})"><path d="M0,0 L0,-20" stroke="#cdd88a" stroke-width="1"/><ellipse cx="0" cy="-21" rx="1.6" ry="3" fill="#c2410c"/></g>`;
      }
      return `
      <g transform="rotate(${rand(-20, 20)}) scale(1 .8)">
        <g class="head head-c"><g class="spin">${petals}${stamens}</g><circle r="3" fill="#d9e8a0"/></g>
      </g>`;
    }

    case "orquidea":
      return `
      <g transform="rotate(${rand(-12, 12)})">
        <g class="head head-c">
          <ellipse cx="0" cy="-16" rx="7" ry="14" fill="url(#${id}p)"/>
          <ellipse cx="0" cy="-16" rx="7" ry="14" fill="url(#${id}p)" transform="rotate(125)"/>
          <ellipse cx="0" cy="-16" rx="7" ry="14" fill="url(#${id}p)" transform="rotate(-125)"/>
          <ellipse cx="-13" cy="-2" rx="13" ry="11" fill="url(#${id}b)" transform="rotate(-15 -13 -2)"/>
          <ellipse cx="13" cy="-2" rx="13" ry="11" fill="url(#${id}b)" transform="rotate(15 13 -2)"/>
          <ellipse cx="-13" cy="-2" rx="9" ry="7" fill="${c[0]}" opacity=".6" transform="rotate(-15 -13 -2)"/>
          <ellipse cx="13" cy="-2" rx="9" ry="7" fill="${c[0]}" opacity=".6" transform="rotate(15 13 -2)"/>
          <path d="M-6,4 C-8,12 -3,17 0,17 C3,17 8,12 6,4 C3,7 -3,7 -6,4Z" fill="${c[2]}"/>
          <circle cx="0" cy="2" r="3.5" fill="#fff6c9" stroke="#e0b100" stroke-width=".8"/>
        </g>
      </g>`;

    default: {
      // margarida e girassol
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
  }
}

function lavenderSpike(c, len) {
  let buds = "";
  for (let i = 0; i < 9; i++) {
    const y = -i * (len / 9);
    const s = 1 - i * 0.06;
    for (const side of [-1, 1]) {
      buds += `<ellipse cx="${side * 3.2 * s}" cy="${y}" rx="${3.4 * s}" ry="${4.6 * s}" fill="${i % 2 ? c[1] : c[2]}" transform="rotate(${side * 25} ${side * 3.2 * s} ${y})"/>`;
    }
    buds += `<ellipse cx="0" cy="${y - 2}" rx="${2.4 * s}" ry="${3.4 * s}" fill="${c[0]}" opacity=".8"/>`;
  }
  return buds;
}

function lavenderSVG(c) {
  const id = "f" + uid++;
  const tops = [[32, 92], [50, 70], [68, 96]].map(([x, y]) => [x + rand(-5, 5), y + rand(-10, 10)]);
  let stems = "";
  let spikes = "";
  for (const [x, y] of tops) {
    stems += `<path class="stem" pathLength="1" d="M50,320 Q${(50 + x) / 2},${(320 + y) / 2 + 20} ${x},${y + 50}" fill="none" stroke="#6b8f5e" stroke-width="2.5" stroke-linecap="round"/>`;
    spikes += `<g transform="translate(${x},${y + 52})"><g class="head">${lavenderSpike(c, 55)}</g></g>`;
  }
  let blades = "";
  for (let i = 0; i < 6; i++) {
    const tx = 50 + (i - 2.5) * 9 + rand(-3, 3);
    const ty = 320 - rand(70, 120);
    blades += `<path class="leaf" fill="url(#${id}l)" d="M50,318 Q${(50 + tx) / 2 - 2},${(320 + ty) / 2} ${tx},${ty} Q${(50 + tx) / 2 + 3},${(320 + ty) / 2} 50,318Z"/>`;
  }
  return `
  <svg class="flower" viewBox="0 0 100 320" aria-hidden="true">
    <defs>${gradDefs(id, c).replace("#8fd18a", "#b5c9a8").replace("#2d6a4f", "#5d7d55")}</defs>
    ${stems}${blades}${spikes}
  </svg>`;
}

function flowerSVG(kind, c) {
  if (kind === "lavanda") return lavenderSVG(c);
  const id = "f" + uid++;
  const bend = rand(-12, 12);
  const top = kind === "tulipa" ? 102 : 78;
  const stemW = { girassol: 7, margarida: 3.5, orquidea: 3, lirio: 4.5 }[kind] || 5;

  let leaves;
  if (kind === "orquidea") {
    // folhas largas rentes ao chão
    leaves = `
      <path class="leaf" fill="url(#${id}l)" d="M50,318 C30,300 4,300 2,312 C6,322 34,324 50,318Z"/>
      <path class="leaf" fill="url(#${id}l)" d="M50,318 C70,296 96,298 98,310 C94,322 66,324 50,318Z"/>`;
  } else {
    const l1 = rand(140, 190);
    const l2 = rand(120, 180);
    leaves = `
      <path class="leaf" fill="url(#${id}l)"
            d="M50,318 C24,${320 - l1 * 0.3} 14,${320 - l1 * 0.7} 26,${320 - l1} C38,${320 - l1 * 0.62} 46,${320 - l1 * 0.3} 50,318Z"/>
      <path class="leaf" fill="url(#${id}l)"
            d="M50,318 C76,${320 - l2 * 0.3} 86,${320 - l2 * 0.7} 74,${320 - l2} C62,${320 - l2 * 0.62} 54,${320 - l2 * 0.3} 50,318Z"/>`;
  }
  const stem = kind === "orquidea"
    ? `M50,320 C48,220 46,150 ${60 + bend},${top}`
    : `M50,320 C${50 + bend},250 ${50 - bend},170 50,${top}`;
  const hx = kind === "orquidea" ? 60 + bend : 50;

  return `
  <svg class="flower" viewBox="0 0 100 320" aria-hidden="true">
    <defs>${gradDefs(id, c)}</defs>
    <path class="stem" pathLength="1" d="${stem}" fill="none" stroke="#3f8f4a" stroke-width="${stemW}" stroke-linecap="round"/>
    ${leaves}
    <g transform="translate(${hx},${top + 2})">${flowerHead(kind, c, id)}</g>
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

// variegada: um lado em creme com borda irregular + listras seguindo as nervuras
function variegation(L, W) {
  const s = pick([-1, 1]);
  const y1 = -rand(0.05, 0.35) * L;
  const y2 = y1 - rand(0.35, 0.6) * L;
  let edge = `M0,${y1}`;
  const steps = 6;
  for (let i = 1; i <= steps; i++) {
    const y = y1 + ((y2 - y1) * i) / steps;
    edge += ` L${s * W * rand(0.02, 0.22)},${y}`;
  }
  const half = `${edge} L${s * W * 1.6},${y2 - L * 0.1} L${s * W * 1.6},${y1 + L * 0.1}Z`;
  let streaks = "";
  for (let i = 0; i < 9; i++) {
    const t = rand(0.1, 0.9);
    const side = Math.random() < 0.7 ? -s : s;
    const len = W * rand(0.3, 0.8);
    const y = -t * L;
    const x0 = side * W * rand(0.1, 0.4);
    streaks += `<path d="M${x0},${y} Q${x0 + side * len * 0.5},${y - L * 0.03} ${x0 + side * len},${y - L * 0.09}"
                  stroke="#eef7e4" stroke-width="${rand(1.5, 5)}" stroke-linecap="round" fill="none" opacity="${rand(0.5, 0.9)}"/>`;
  }
  return `
    <path d="${half}" fill="#dcefcf" opacity=".6"/>
    <path d="${half}" fill="#eef7e4" transform="translate(${s * W * 0.06},0) scale(1 .96)" opacity=".95"/>
    ${streaks}`;
}

function monsteraLeafSVG(type, variant, opts = {}) {
  const id = "m" + uid++;
  const eva = type === "eva";
  const L = opts.L ?? (eva ? rand(130, 160) : rand(140, 175));
  const W = eva ? L * 0.34 : L * 0.5;
  const h = opts.h ?? rand(150, 260);
  const a = opts.angle ?? rand(-55, 55);
  const tx = Math.sin((a * Math.PI) / 180) * h * 0.45;
  const ty = -h;
  const shades = opts.shades || pick([
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

  const vari = variant === "variegada" ? variegation(L, W) : "";
  const petiole = h > 0
    ? `<path d="M0,0 Q${tx * 0.1},${ty * 0.6} ${tx},${ty}" fill="none" stroke="#3a7d44" stroke-width="6" stroke-linecap="round"/>`
    : "";

  return `
  <svg class="monstera" viewBox="${opts.viewBox || "-160 -420 320 420"}" aria-hidden="true">
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
    ${petiole}
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

// ===== ÍCONES DA BARRA =====
const WATERING_CAN = `
  <svg viewBox="0 0 64 52" aria-hidden="true">
    <path d="M14,18 L46,18 L42,46 L18,46Z" fill="#7cc0e8" stroke="#3a86b8" stroke-width="2" stroke-linejoin="round"/>
    <path d="M44,24 L60,12" stroke="#3a86b8" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="60" cy="11" rx="4" ry="2.4" fill="#3a86b8" transform="rotate(-35 60 11)"/>
    <path d="M18,20 C12,6 48,6 42,20" fill="none" stroke="#3a86b8" stroke-width="3"/>
    <path d="M14,28 C2,28 2,42 16,40" fill="none" stroke="#3a86b8" stroke-width="3"/>
  </svg>`;

function iconFor(kind) {
  if (kind === "regador") return WATERING_CAN;
  if (kind === "adao" || kind === "eva") {
    return monsteraLeafSVG(kind, "verde", {
      L: 150, h: 0, angle: 0, shades: ["#2d6a4f", "#52b788"],
      viewBox: kind === "adao" ? "-82 -158 164 180" : "-64 -158 128 180",
    });
  }
  const c = PLANTS[kind].colors[kind === "tulipa" || kind === "girassol" ? 0 : 1].c;
  const id = "i" + uid++;
  if (kind === "lavanda") {
    return `<svg class="flower" viewBox="-20 -62 40 70"><g class="head">${lavenderSpike(c, 55)}</g></svg>`;
  }
  const box = kind === "tulipa" ? "-34 -66 68 78" : kind === "orquidea" ? "-30 -32 60 56" : "-46 -46 92 92";
  return `<svg class="flower" viewBox="${box}"><defs>${gradDefs(id, c)}</defs>${flowerHead(kind, c, id)}</svg>`;
}

// ===== PLANTAR =====
const MAX_B = 16; // fundo do jardim (vh acima da barra)
let planted = []; // cada item = lista de elementos plantados com um toque

function addPlant(svg, { x, b, h, z, d = 0, sa = 2, sd = 4, rise = false }) {
  const el = document.createElement("div");
  el.className = "plant" + (rise ? " rise" : "");
  el.dataset.h0 = h.toFixed(2);
  el.style.cssText = `--x:${x.toFixed(2)}%;--b:${b.toFixed(2)}vh;--h:${h.toFixed(2)};--d:${d}s;--sa:${sa.toFixed(2)}deg;--sd:${sd.toFixed(2)}s;z-index:${z}`;
  el.innerHTML = `<div class="bob">${svg}</div>`;
  plants.appendChild(el);
  return el;
}

// b = altura no chão (0 = frente, MAX_B = fundo); plantas no fundo ficam menores
function plant(kind, colorEntry, x, b, d = 0) {
  const depth = 1 - (b / MAX_B) * 0.45;
  const z = 100 - Math.round(b * 5);
  const color = colorEntry.c;

  if (kind === "adao" || kind === "eva") {
    const count = kind === "adao" ? 3 : 4;
    const group = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / (count - 1) - 0.5) * 90 + rand(-12, 12);
      group.push(addPlant(monsteraLeafSVG(kind, color, { angle }), {
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
    return group;
  }

  return [addPlant(flowerSVG(kind, color), {
    x,
    b,
    h: rand(...PLANTS[kind].size) * depth,
    z,
    d,
    sa: rand(1.5, 4),
    sd: rand(2.8, 5),
  })];
}

// ===== SALVAR O JARDIM =====
const SAVE_KEY = "jardim-lele-v1";

function save() {
  store.set(SAVE_KEY, planted.map((group) => group.map((el) => el.outerHTML)));
}

function restore() {
  const data = store.get(SAVE_KEY);
  if (!Array.isArray(data) || !data.length) return false;
  const tpl = document.createElement("template");
  planted = data.map((group) => group.map((html) => {
    tpl.innerHTML = html;
    const el = tpl.content.firstElementChild;
    plants.appendChild(el);
    return el;
  }));
  return true;
}

function startGarden() {
  planted = [plant("tulipa", PLANTS.tulipa.colors[0], 50, 3, 0.6)];
  save();
}

function undo() {
  const group = planted.pop();
  if (!group) return toast("o jardim já está vazio 🌱");
  group.forEach((el) => el.remove());
  save();
}

function clearGarden() {
  if (!confirm("Começar o jardim de novo? Todas as plantas vão sumir.")) return;
  plants.innerHTML = "";
  startGarden();
  toast("jardim novinho 🌷");
}

// ===== REGAR =====
function water(x, y) {
  const can = document.createElement("div");
  can.className = "can";
  can.style.cssText = `left:${x}px;top:${y}px`;
  can.innerHTML = WATERING_CAN;
  fx.appendChild(can);
  setTimeout(() => can.remove(), 1600);

  for (let i = 0; i < 14; i++) {
    const drop = document.createElement("div");
    drop.className = "drop";
    drop.style.cssText = `left:${x + 18 + rand(-14, 14)}px;top:${y - 30}px;--fall:${rand(50, 110)}px;animation-delay:${0.35 + rand(0, 0.6)}s`;
    drop.addEventListener("animationend", () => drop.remove());
    fx.appendChild(drop);
  }

  // plantas perto do toque balançam e crescem um pouquinho
  let hit = 0;
  for (const el of plants.children) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    if (Math.abs(cx - x) < Math.max(40, r.width * 0.4) && y > r.top - 40 && y < r.bottom + 20) {
      hit++;
      const bob = el.firstElementChild;
      bob.classList.remove("watered");
      void bob.offsetWidth;
      bob.classList.add("watered");
      const h0 = parseFloat(el.dataset.h0);
      const h = parseFloat(el.style.getPropertyValue("--h"));
      el.style.setProperty("--h", Math.min(h * 1.06, h0 * 1.35).toFixed(2));
      setTimeout(() => {
        bob.classList.remove("watered");
        burstAt(r.left + r.width / 2, r.top + r.height * 0.15, ["#9ad7ff", "#ffffff", "#c8f7c5"]);
      }, 900);
    }
  }
  if (hit) setTimeout(save, 1000);
}

// ===== ESCOLHA DE PLANTA E COR =====
const state = { kind: "tulipa", color: -1 }; // -1 = cor surpresa

function swatchBg(entry) {
  return entry.sw || `radial-gradient(circle at 35% 30%, ${entry.c[0]}, ${entry.c[1]} 60%, ${entry.c[2]})`;
}

function buildPicker() {
  for (const [key, p] of Object.entries(PLANTS)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "plant-btn";
    btn.dataset.kind = key;
    btn.innerHTML = `<span class="ico">${iconFor(key)}</span><span class="lbl">${p.label}</span>`;
    btn.addEventListener("click", () => {
      state.kind = key;
      state.color = -1;
      renderColors();
    });
    picker.appendChild(btn);
  }
}

function renderColors() {
  for (const btn of picker.children) btn.classList.toggle("active", btn.dataset.kind === state.kind);
  colorsBox.innerHTML = "";

  if (state.kind === "regador") {
    colorsBox.innerHTML = `<span class="color-name wide">toque nas plantas para regar 💧</span>`;
    return updateBarHeight();
  }

  const colors = PLANTS[state.kind].colors;
  const mk = (cls, label, onClick) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.title = label;
    b.setAttribute("aria-label", label);
    b.addEventListener("click", onClick);
    colorsBox.appendChild(b);
    return b;
  };
  mk("swatch dice" + (state.color === -1 ? " active" : ""), "Cor surpresa", () => { state.color = -1; renderColors(); }).textContent = "🎲";
  colors.forEach((entry, i) => {
    mk("swatch" + (state.color === i ? " active" : ""), entry.name, () => { state.color = i; renderColors(); })
      .style.background = swatchBg(entry);
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

// ===== DIA E NOITE =====
const NIGHT_KEY = "jardim-lele-noite";
function isNightNow() {
  const h = new Date().getHours();
  return h >= 18 || h < 6;
}
function applyNight(night) {
  document.body.classList.toggle("night", night);
  document.getElementById("btnNight").textContent = night ? "☀️" : "🌙";
  document.querySelector('meta[name="theme-color"]').content = night ? "#1d2250" : "#ffd9e2";
}
function toggleNight() {
  const night = !document.body.classList.contains("night");
  store.set(NIGHT_KEY, { night, until: Date.now() + 6 * 3600e3 });
  applyNight(night);
}
function initNight() {
  const pref = store.get(NIGHT_KEY);
  applyNight(pref && pref.until > Date.now() ? pref.night : isNightNow());
  const stars = document.getElementById("stars");
  for (let i = 0; i < 70; i++) {
    const s = document.createElement("i");
    s.style.cssText = `left:${rand(0, 100)}%;top:${rand(0, 60)}%;--t:${rand(2, 5)}s;--d:${rand(0, 5)}s;--s:${rand(1, 3)}px`;
    stars.appendChild(s);
  }
}

// ===== MÚSICA (caixinha de música gerada no navegador) =====
const music = { ctx: null, on: false, timer: null, step: 0 };
const CHORDS = [
  [261.63, 329.63, 392.0], // Dó
  [220.0, 261.63, 329.63], // Lá menor
  [174.61, 220.0, 261.63], // Fá
  [196.0, 246.94, 293.66], // Sol
];
const SCALE = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

function note(freq, start, dur, vol, type = "sine") {
  const { ctx, out } = music;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(out);
  o.start(start);
  o.stop(start + dur + 0.05);
}

function scheduleBar() {
  const { ctx } = music;
  const t0 = ctx.currentTime + 0.05;
  const chord = CHORDS[music.step % CHORDS.length];
  music.step++;
  note(chord[0] / 2, t0, 3.8, 0.05, "triangle");
  chord.forEach((f, i) => note(f, t0 + i * 0.04, 3.6, 0.02));
  for (let i = 0; i < 8; i++) {
    if (Math.random() < 0.55) {
      const f = Math.random() < 0.5 ? pick(chord) * 2 : pick(SCALE);
      note(f, t0 + i * 0.5 + rand(0, 0.03), 1.6, rand(0.03, 0.06));
    }
  }
}

function toggleMusic() {
  const btn = document.getElementById("btnMusic");
  if (!music.ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return toast("seu navegador não toca a música 😢");
    music.ctx = new AC();
    // eco suave
    const master = music.ctx.createGain();
    master.gain.value = 0.9;
    const delay = music.ctx.createDelay();
    delay.delayTime.value = 0.35;
    const fb = music.ctx.createGain();
    fb.gain.value = 0.3;
    delay.connect(fb).connect(delay);
    delay.connect(master);
    music.out = music.ctx.createGain();
    music.out.connect(master);
    music.out.connect(delay);
    master.connect(music.ctx.destination);
  }
  music.on = !music.on;
  btn.classList.toggle("on", music.on);
  if (music.on) {
    music.ctx.resume();
    scheduleBar();
    music.timer = setInterval(scheduleBar, 4000);
  } else {
    clearInterval(music.timer);
    music.ctx.suspend();
  }
}

// ===== FOTO DO JARDIM =====
function loadImage(url) {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = url;
  });
}

async function drawSvg(g, svg, r, pad) {
  const clone = svg.cloneNode(true);
  let [vx, vy, vw, vh] = clone.getAttribute("viewBox").split(/[\s,]+/).map(Number);
  let { left: x, top: y, width: w, height: h } = r;
  if (pad) {
    // amplia a área para não cortar folhas que passam do desenho
    const sx = w / vw;
    const sy = h / vh;
    const px = vw;
    const py = vh * 0.4;
    vx -= px; vy -= py; vw += px * 2; vh += py * 2;
    x -= px * sx; y -= py * sy; w = vw * sx; h = vh * sy;
    clone.setAttribute("viewBox", `${vx} ${vy} ${vw} ${vh}`);
  }
  clone.setAttribute("width", w);
  clone.setAttribute("height", h);
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
  const img = await loadImage(url);
  if (img) g.drawImage(img, x, y, w, h);
  URL.revokeObjectURL(url);
}

async function takePhoto() {
  toast("tirando a foto… 📷");
  const W = innerWidth;
  const H = innerHeight;
  const dpr = Math.min(2, devicePixelRatio || 1);
  const cv = document.createElement("canvas");
  cv.width = W * dpr;
  cv.height = H * dpr;
  const g = cv.getContext("2d");
  g.scale(dpr, dpr);
  const night = document.body.classList.contains("night");

  const sky = g.createLinearGradient(0, 0, 0, H);
  (night
    ? [[0, "#141b3c"], [0.45, "#2b2f6b"], [0.8, "#5a4a8a"], [1, "#7a5f8f"]]
    : [[0, "#ffc8d6"], [0.38, "#ffe1e8"], [0.7, "#fff4e8"], [1, "#f3f8df"]]
  ).forEach(([o, c]) => sky.addColorStop(o, c));
  g.fillStyle = sky;
  g.fillRect(0, 0, W, H);

  const orb = document.querySelector(night ? ".moon" : ".sun").getBoundingClientRect();
  const ox = orb.left + orb.width / 2;
  const oy = orb.top + orb.height / 2;
  if (night) {
    g.fillStyle = "#fff";
    for (const s of document.querySelectorAll("#stars i")) {
      const r = s.getBoundingClientRect();
      g.globalAlpha = 0.8;
      g.fillRect(r.left, r.top, r.width || 2, r.height || 2);
    }
    g.globalAlpha = 1;
  } else {
    const glow = g.createRadialGradient(ox, oy, 0, ox, oy, orb.width / 2);
    glow.addColorStop(0, "#fffbe6");
    glow.addColorStop(0.35, "#ffe9a8");
    glow.addColorStop(1, "rgba(255,220,160,0)");
    g.fillStyle = glow;
    g.fillRect(ox - orb.width, oy - orb.width, orb.width * 2, orb.width * 2);
  }

  const groundEl = document.querySelector(".ground");
  await drawSvg(g, groundEl, groundEl.getBoundingClientRect(), false);
  const els = [...plants.children].sort((a, b) => a.style.zIndex - b.style.zIndex);
  for (const el of els) await drawSvg(g, el.querySelector("svg"), el.getBoundingClientRect(), true);

  const gr = garden.getBoundingClientRect();
  g.fillStyle = "#64a85c";
  g.fillRect(0, gr.bottom - 1, W, H - gr.bottom + 1);
  if (night) {
    g.fillStyle = "rgba(25,25,70,.32)";
    g.fillRect(0, 0, W, H);
    g.save();
    g.shadowColor = "rgba(255,250,220,.6)";
    g.shadowBlur = 30;
    g.fillStyle = "#fdf6d8";
    g.beginPath();
    g.arc(ox, oy, orb.width / 2, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }

  // título
  const fs = Math.min(W * 0.11, 56);
  g.textAlign = "center";
  g.fillStyle = night ? "#ffd6e7" : "#c2185b";
  g.shadowColor = "rgba(255,255,255,.7)";
  g.shadowBlur = night ? 0 : 12;
  g.font = `600 ${fs * 0.32}px Quicksand, sans-serif`;
  g.fillText("bem-vindo ao", W / 2, H * 0.08 + fs * 0.3);
  g.font = `700 ${fs}px "Dancing Script", cursive`;
  g.fillText("Jardim da Lele", W / 2, H * 0.08 + fs * 1.3);

  cv.toBlob(async (blob) => {
    if (!blob) return toast("não deu para tirar a foto 😢");
    const file = new File([blob], "jardim-da-lele.png", { type: "image/png" });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Jardim da Lele" });
        return;
      }
    } catch (e) {
      if (e.name === "AbortError") return;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "jardim-da-lele.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast("foto salva! 📸");
  }, "image/png");
}

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

function burstAt(x, y, colors = ["#ff8fab", "#ffd23f", "#ffffff", "#b388eb", "#f15bb5"]) {
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
document.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".card, .toolbar")) return;

  if (state.kind === "regador") return water(e.clientX, e.clientY);

  burstAt(e.clientX, e.clientY);
  const groundBottom = garden.getBoundingClientRect().bottom;
  let b = (groundBottom - e.clientY) / (innerHeight / 100);
  if (b > MAX_B) b = rand(0, MAX_B); // apertou no céu: planta num lugar qualquer do chão
  b = clamp(b, 0, MAX_B);

  const p = PLANTS[state.kind];
  const entry = state.color === -1 ? pick(p.colors) : p.colors[state.color];
  planted.push(plant(state.kind, entry, (e.clientX / innerWidth) * 100, b));
  if (planted.length > 80) planted.shift().forEach((el) => el.remove());
  save();
});

card.addEventListener("click", (e) => {
  if (!e.target.closest(".actions")) card.classList.toggle("mini");
});
document.getElementById("btnUndo").addEventListener("click", undo);
document.getElementById("btnClear").addEventListener("click", clearGarden);
document.getElementById("btnPhoto").addEventListener("click", takePhoto);
document.getElementById("btnMusic").addEventListener("click", toggleMusic);
document.getElementById("btnNight").addEventListener("click", toggleNight);

// ===== INÍCIO =====
initNight();
buildPicker();
renderColors();
if (!restore()) startGarden();
addFireflies(innerWidth > 700 ? 18 : 12);
addButterfly(["#ffb3c6", "#ff8fab"]);
addButterfly(["#ffe066", "#ffb703"]);
if (innerWidth > 700) addButterfly(["#cdb4db", "#a2d2ff"]);
requestAnimationFrame(flyButterflies);
setInterval(spawnPetal, 900);
