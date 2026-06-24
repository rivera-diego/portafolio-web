/* ============================================================
   Una cita conmigo 💕 — flujo por pasos
   ============================================================ */

// Estado de la cita
const state = {
  day: "",
  time: "",
  food: "",
};

const cards = Array.from(document.querySelectorAll(".card"));

function goToStep(step) {
  cards.forEach((c) => {
    c.classList.toggle("is-active", Number(c.dataset.step) === step);
  });
}

/* ---------- Botones "Siguiente" genéricos ---------- */
document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const current = Number(btn.closest(".card").dataset.step);
    if (current === 5) return;
    if (current === 4) buildSummary();
    goToStep(current + 1);
  });
});

/* ============================================================
   PASO 1 — El botón "No" escurridizo
   ============================================================ */
const btnNo = document.getElementById("btnNo");
const btnYes = document.getElementById("btnYes");

const frases = ["No 🙈", "Nop 😅", "Atrápame 😈", "Jeje 😝", "Casi 💨", "Imposible 😎"];

// Desplazamiento mediante transform (no cambia el flujo, no desaparece).
let curX = 0, curY = 0;     // posición actual (suavizada)
let tgtX = 0, tgtY = 0;     // posición objetivo
const REPEL = 95;           // radio en el que empieza a huir
const PUSH = 0.9;           // fuerza del empujón

function clampToCard() {
  const card1 = document.querySelector('.card[data-step="1"]');
  const cardR = card1.getBoundingClientRect();
  const r = btnNo.getBoundingClientRect();
  const pad = 8;

  // posición base del botón (sin el transform actual)
  const baseLeft = r.left - curX;
  const baseTop = r.top - curY;

  const minX = cardR.left + pad - baseLeft;
  const maxX = cardR.right - pad - r.width - baseLeft;
  const minY = cardR.top + pad - baseTop;
  const maxY = cardR.bottom - pad - r.height - baseTop;

  tgtX = Math.min(Math.max(tgtX, minX), maxX);
  tgtY = Math.min(Math.max(tgtY, minY), maxY);
}

// Empuja el objetivo lejos del cursor de forma proporcional a la cercanía
function repel(px, py) {
  const r = btnNo.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  let vx = cx - px;
  let vy = cy - py;
  const dist = Math.hypot(vx, vy) || 1;
  if (dist > REPEL) return false;

  const force = (REPEL - dist) * PUSH; // más cerca => empuja más
  tgtX += (vx / dist) * force;
  tgtY += (vy / dist) * force;
  clampToCard();
  return true;
}

// Bucle de animación: interpola suavemente hacia el objetivo (como las luces)
function animateBtn() {
  curX += (tgtX - curX) * 0.12;
  curY += (tgtY - curY) * 0.12;
  btnNo.style.transform = `translate(${curX.toFixed(2)}px, ${curY.toFixed(2)}px)`;
  requestAnimationFrame(animateBtn);
}
requestAnimationFrame(animateBtn);

// Cambia la frase de vez en cuando, sin saltos bruscos
let lastPhrase = 0;
document.addEventListener("mousemove", (e) => {
  const active = cards.find((c) => c.classList.contains("is-active"));
  if (!active || active.dataset.step !== "1") return;

  if (repel(e.clientX, e.clientY)) {
    const now = Date.now();
    if (now - lastPhrase > 600) {
      lastPhrase = now;
      btnNo.textContent = frases[Math.floor(Math.random() * frases.length)];
    }
  }
});

// En móvil / clic: se aparta dentro de la tarjeta
["click", "touchstart"].forEach((evt) => {
  btnNo.addEventListener(evt, (e) => {
    e.preventDefault();
    const t = e.touches ? e.touches[0] : e;
    repel(t.clientX, t.clientY);
  });
});

// Reajusta los límites si cambia el tamaño de la ventana
window.addEventListener("resize", clampToCard);

btnYes.addEventListener("click", () => goToStep(2));

/* ============================================================
   PASO 3 — Día y hora
   ============================================================ */
const datePick = document.getElementById("datePick");
const timePick = document.getElementById("timePick");
const btnDay = document.getElementById("btnDay");
const dayHint = document.getElementById("dayHint");

// No permitir fechas en el pasado
const today = new Date().toISOString().split("T")[0];
datePick.min = today;

function checkDay() {
  state.day = datePick.value;
  state.time = timePick.value;
  const ready = state.day && state.time;
  btnDay.disabled = !ready;
  dayHint.textContent = ready
    ? "¡Perfecto! Es una cita 💘"
    : "Elige día y hora para continuar";
}
datePick.addEventListener("change", checkDay);
timePick.addEventListener("change", checkDay);

// Abre el selector al hacer clic en cualquier parte del campo (no solo el iconito)
[datePick, timePick].forEach((input) => {
  input.addEventListener("click", () => {
    if (typeof input.showPicker === "function") {
      try { input.showPicker(); } catch (_) { /* ignora si el navegador no lo permite */ }
    }
  });
});

/* ============================================================
   PASO 4 — Comida
   ============================================================ */
const foodGrid = document.getElementById("foodGrid");
const btnFood = document.getElementById("btnFood");

foodGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".food");
  if (!btn) return;
  foodGrid.querySelectorAll(".food").forEach((f) => f.classList.remove("selected"));
  btn.classList.add("selected");
  state.food = btn.dataset.food;
  btnFood.disabled = false;
});

/* ============================================================
   PASO 5 — Resumen
   ============================================================ */
function formatDate(value) {
  if (!value) return "—";
  const [y, m, d] = value.split("-");
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "—";
  const [h, min] = value.split(":");
  return `${h}:${min} hrs`;
}

function buildSummary() {
  const summary = document.getElementById("summary");
  summary.innerHTML = `
    <div class="summary__row">📅 <span>Día: <b>${formatDate(state.day)}</b></span></div>
    <div class="summary__row">⏰ <span>Hora: <b>${formatTime(state.time)}</b></span></div>
    <div class="summary__row">🍽️ <span>Comeremos: <b>${state.food || "lo que tú quieras"}</b></span></div>
  `;
}

/* ---------- Reiniciar ---------- */
document.getElementById("btnRestart").addEventListener("click", () => {
  state.day = state.time = state.food = "";
  datePick.value = "";
  timePick.value = "";
  btnDay.disabled = true;
  btnFood.disabled = true;
  dayHint.textContent = "Elige día y hora para continuar";
  foodGrid.querySelectorAll(".food").forEach((f) => f.classList.remove("selected"));
  btnNo.classList.remove("escaping");
  btnNo.removeAttribute("style");
  btnNo.textContent = "No 🙈";
  curX = curY = tgtX = tgtY = 0;
  goToStep(1);
});

/* ============================================================
   Corazones flotantes de fondo
   ============================================================ */
const heartsBg = document.getElementById("heartsBg");
const emojis = ["💕", "💖", "💗", "💓", "🌸", "✨", "💞", "🩷"];

function spawnHeart() {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = 16 + Math.random() * 22 + "px";
  const duration = 6 + Math.random() * 6;
  heart.style.animationDuration = duration + "s";
  heartsBg.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}
setInterval(spawnHeart, 700);
