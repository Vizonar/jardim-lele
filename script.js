const plants = document.getElementById("plants");
const fx = document.getElementById("fx");
const card = document.getElementById("card");

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
let uid = 0;

// ===== NOME (ex: site.com/?para=Ana) =====
const nome = new URLSearchParams(location.search).get("para");
if (nome) {
  document.getElementById("name").textContent = nome;
  document.title = `Um jardim para ${nome}`;
}

// [claro, médio, escuro]
const TULIP_COLORS = [
  ["#ff8a8a", "#e63946", "#9d0208"], // vermelha
  ["#ffd1dc", "#ff8fab", "#d6336c"], // rosa
  ["#fff6bf", "#ffd23f", "#e09f00"], // amarela
  ["#ffffff", "#ffe3ea", "#e8a5b5"], // branca
  ["#ecc8ff", "#b388eb", "#6a1b9a"], // lilás
  ["#ffe0b8", "#ff9f45", "#d9480f"], // laranja
  ["#ffc4e6", "#f15bb5", "#9c1767"], // pink
];

const PETAL_COLORS = [
  ["#ffd1dc", "#ff8fab"],
  ["#ff8a8a", "#e63946"],
  ["#ffffff", "#ffc2d1"],
  ["#ecc8ff", "#b388eb"],
];

// ===== TULIPA =====
function tulipSVG(c) {
  const id = "t" + uid++;
  const bend = rand(-12, 12);
  const l1 = rand(140, 190);
  const l2 = rand(120, 180);
  return `
  <svg class="tulip" viewBox="0 0 100 320" aria-hidden="true">
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
    <path class="stem" pathLength="1" d="M50,320 C${50 + bend},250 ${50 - bend},170 50,102"
          fill="none" stroke="#3f8f4a" stroke-width="5" stroke-linecap="round"/>
    <path class="leaf" fill="url(#${id}l)"
          d="M50,318 C24,${320 - l1 * 0.3} 14,${320 - l1 * 0.7} 26,${320 - l1} C38,${320 - l1 * 0.62} 46,${320 - l1 * 0.3} 50,318Z"/>
    <path class="leaf" fill="url(#${id}l)"
          d="M50,318 C76,${320 - l2 * 0.3} 86,${320 - l2 * 0.7} 74,${320 - l2} C62,${320 - l2 * 0.62} 54,${320 - l2 * 0.3} 50,318Z"/>
    <g transform="translate(50,104)">
      <g class="head">
        <path fill="url(#${id}b)" d="M0,0 C-22,-4 -22,-44 -6,-62 L0,-52 L6,-62 C22,-44 22,-4 0,0Z"/>
        <path class="pl" fill="url(#${id}p)" d="M4,6 C-24,6 -30,-30 -18,-58 C-6,-46 6,-30 4,6Z"/>
        <path class="pr" fill="url(#${id}p)" d="M-4,6 C24,6 30,-30 18,-58 C6,-46 -6,-30 -4,6Z"/>
        <path fill="url(#${id}p)" d="M0,8 C-17,5 -16,-34 0,-54 C16,-34 17,5 0,8Z"/>
        <path d="M-3,-8 C-8,-20 -7,-34 -2,-44" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
      </g>
    </g>
  </svg>`;
}

// ===== COSTELA-DE-ADÃO (folha com recortes) e "Eva" (folha com furos) =====
function leafShape(L, W) {
  return `M0,0
    C${-0.3 * W},${0.14 * L} ${-W},${0.1 * L} ${-W},${-0.36 * L}
    C${-W},${-0.78 * L} ${-0.45 * W},${-L} 0,${-L}
    C${0.45 * W},${-L} ${W},${-0.78 * L} ${W},${-0.36 * L}
    C${W},${0.1 * L} ${0.3 * W},${0.14 * L} 0,0Z`;
}

function monsteraLeafSVG(type) {
  const id = "m" + uid++;
  const eva = type === "eva";
  const L = eva ? rand(130, 160) : rand(140, 175);
  const W = eva ? L * 0.34 : L * 0.5;
  const h = rand(150, 260);
  const a = rand(-55, 55);
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
  for (let s of [-1, 1]) {
    for (let i = 0; i < n; i++) {
      const t = 0.12 + (i / n) * 0.78 + rand(-0.03, 0.03);
      const sy = -t * L;
      if (eva) {
        // furos ovais, sem cortar a borda
        const cx = s * W * rand(0.42, 0.55);
        cuts += `<ellipse cx="${cx}" cy="${sy}" rx="${W * 0.2}" ry="${L * 0.06}"
                   transform="rotate(${s * -35} ${cx} ${sy})" fill="#000"/>`;
      } else {
        // recortes que chegam até a borda
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
        <g fill="none" stroke="#b7e4c7" stroke-opacity=".35" stroke-width="2">
          <path d="M0,0 L0,${-L * 0.96}" stroke-width="3.5"/>
          ${veins}
        </g>
      </g>
    </g>
  </svg>`;
}

// ===== CRIAÇÃO DAS PLANTAS =====
function addPlant(svg, { x, b, h, z, d = 0, sa = 2, sd = 4, rise = false }) {
  const el = document.createElement("div");
  el.className = "plant" + (rise ? " rise" : "");
  el.style.cssText = `--x:${x}%;--b:${b}vh;--h:${h};--d:${d}s;--sa:${sa}deg;--sd:${sd}s;z-index:${z}`;
  el.innerHTML = svg;
  plants.appendChild(el);
  return el;
}

function addTulip(x, row, delay, color) {
  const rows = [
    { b: [13, 16], h: [15, 21], z: 20 }, // fundo
    { b: [7, 10], h: [21, 28], z: 40 },  // meio
    { b: [0, 4], h: [28, 37], z: 60 },   // frente
  ];
  const r = rows[row];
  return addPlant(tulipSVG(color || pick(TULIP_COLORS)), {
    x,
    b: rand(...r.b),
    h: rand(...r.h),
    z: r.z + Math.round(rand(0, 9)),
    d: delay,
    sa: rand(1.5, 4),
    sd: rand(2.8, 5),
  });
}

function addMonstera(cx, spread, count, type, b, z, delay, scale = 1) {
  for (let i = 0; i < count; i++) {
    addPlant(monsteraLeafSVG(type), {
      x: cx + rand(-spread, spread),
      b: b + rand(-1, 1),
      h: rand(36, 50) * scale,
      z: z + i,
      d: delay + i * 0.25,
      sa: rand(1, 2.5),
      sd: rand(4.5, 7),
      rise: true,
    });
  }
}

function buildGarden() {
  const wide = innerWidth / innerHeight > 1;

  // costelas-de-adão grandes atrás, nas laterais
  addMonstera(4, 5, wide ? 6 : 4, "adao", 12, 5, 0);
  addMonstera(96, 5, wide ? 6 : 4, "adao", 12, 5, 0.4);
  // "costelas-de-eva" (folhas com furinhos) no meio do fundo
  addMonstera(wide ? 30 : 22, 6, wide ? 4 : 3, "eva", 14, 3, 0.8, 0.85);
  addMonstera(wide ? 70 : 78, 6, wide ? 4 : 3, "eva", 14, 3, 1, 0.85);
  if (wide) addMonstera(50, 8, 4, "adao", 15, 2, 1.2, 0.8);

  // tulipas em três fileiras
  const base = Math.max(6, Math.round(innerWidth / 70));
  [base, Math.round(base * 1.1), Math.round(base * 0.9)].forEach((count, row) => {
    for (let i = 0; i < count; i++) {
      const x = ((i + rand(0.15, 0.85)) / count) * 100;
      addTulip(x, row, 0.3 + rand(0, 2.2) + row * 0.3);
    }
  });
}

// ===== PÉTALAS CAINDO =====
function spawnPetal() {
  if (document.hidden || fx.childElementCount > 60) return;
  const p = document.createElement("div");
  const [c1, c2] = pick(PETAL_COLORS);
  p.className = "petal";
  p.style.cssText = `--x:${rand(-5, 100)}vw;--s:${rand(10, 18)}px;--t:${rand(7, 13)}s;--dx:${rand(-25, 25)}vw;--c1:${c1};--c2:${c2}`;
  p.addEventListener("animationend", () => p.remove());
  fx.appendChild(p);
}

// ===== VAGALUMES / BRILHOS =====
function addFireflies(n) {
  for (let i = 0; i < n; i++) {
    const f = document.createElement("div");
    f.className = "firefly";
    f.style.cssText = `--x:${rand(0, 100)}vw;--y:${rand(5, 40)}vh;--t:${rand(6, 11)}s;--d:${rand(0, 8)}s;--dx:${rand(-6, 6)}vw`;
    fx.appendChild(f);
  }
}

// ===== BORBOLETAS =====
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
  butterflies.push({
    el,
    seed: rand(0, 100),
    sx: rand(0.00012, 0.0002),
    sy: rand(0.0002, 0.00035),
    lastX: 0,
  });
}

function flyButterflies(t) {
  const w = innerWidth;
  const h = innerHeight;
  for (const b of butterflies) {
    const k = t + b.seed * 1000;
    const x = w * (0.5 + 0.45 * Math.sin(k * b.sx) * Math.cos(k * b.sx * 0.37));
    const y = h * (0.42 + 0.22 * Math.sin(k * b.sy) + 0.05 * Math.sin(k * 0.003));
    const dir = x - b.lastX;
    b.lastX = x;
    const tilt = Math.max(-25, Math.min(25, dir * 8));
    b.el.style.transform = `translate(${x - 22}px, ${y - 18}px) rotate(${tilt}deg)`;
  }
  requestAnimationFrame(flyButterflies);
}

// ===== TOCAR PARA PLANTAR =====
let planted = [];
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

document.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".card")) return;
  burst(e.clientX, e.clientY);
  const x = (e.clientX / innerWidth) * 100;
  const row = e.clientY > innerHeight * 0.75 ? 2 : e.clientY > innerHeight * 0.55 ? 1 : pick([0, 1, 2]);
  planted.push(addTulip(x, row, 0));
  if (planted.length > 40) planted.shift().remove();
});

card.addEventListener("click", () => card.classList.toggle("mini"));

// ===== INÍCIO =====
buildGarden();
addFireflies(innerWidth > 700 ? 18 : 10);
addButterfly(["#ffb3c6", "#ff8fab"]);
addButterfly(["#ffe066", "#ffb703"]);
if (innerWidth > 700) addButterfly(["#cdb4db", "#a2d2ff"]);
requestAnimationFrame(flyButterflies);
setInterval(spawnPetal, 650);
