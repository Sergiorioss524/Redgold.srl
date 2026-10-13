// Precio del oro en tiempo real (spot internacional, USD).
// Actualiza todos los elementos con atributos data-gold-* de la página.
//
//   data-gold="oz" | "g" | "kg"          precio por onza troy / gramo / kilo
//   data-gold-karat="0.75"               precio por gramo a esa pureza (18k = 0.75)
//   data-gold-trend                      ▲ / ▼ respecto a la lectura anterior
//   data-gold-updated                    hora de la última actualización
//   data-gold-status                     se marca como "live" o "error"

const API = 'https://api.gold-api.com/price/XAU';
const REFRESH_MS = 30_000;
const GRAMS_PER_TROY_OZ = 31.1034768;

const money = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const time = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const usd = (n: number) => `US$ ${money.format(n)}`;

let previous: number | undefined;
let timer: number | undefined;

function render(ozPrice: number, updatedAt: Date) {
  const perGram = ozPrice / GRAMS_PER_TROY_OZ;
  const values: Record<string, number> = { oz: ozPrice, g: perGram, kg: perGram * 1000 };

  document.querySelectorAll<HTMLElement>('[data-gold]').forEach((el) => {
    const v = values[el.dataset.gold!];
    if (v !== undefined) el.textContent = usd(v);
  });
  document.querySelectorAll<HTMLElement>('[data-gold-karat]').forEach((el) => {
    el.textContent = usd(perGram * Number(el.dataset.goldKarat));
  });
  document.querySelectorAll<HTMLElement>('[data-gold-updated]').forEach((el) => {
    el.textContent = time.format(updatedAt);
    el.setAttribute('datetime', updatedAt.toISOString());
  });

  if (previous !== undefined && ozPrice !== previous) {
    const up = ozPrice > previous;
    document.querySelectorAll<HTMLElement>('[data-gold-trend]').forEach((el) => {
      el.textContent = up ? '▲' : '▼';
      el.dataset.dir = up ? 'up' : 'down';
      el.setAttribute('aria-label', up ? 'Sube' : 'Baja');
    });
    // Destello breve en los precios que cambiaron
    document.querySelectorAll<HTMLElement>('[data-gold], [data-gold-karat]').forEach((el) => {
      el.dataset.flash = up ? 'up' : 'down';
      setTimeout(() => delete el.dataset.flash, 1200);
    });
  }
  previous = ozPrice;
  setStatus('live');
}

function setStatus(status: 'live' | 'error') {
  document.querySelectorAll<HTMLElement>('[data-gold-status]').forEach((el) => (el.dataset.goldStatus = status));
}

async function update() {
  try {
    const res = await fetch(API, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const data: { price: number; updatedAt: string } = await res.json();
    if (!Number.isFinite(data.price)) throw new Error('precio inválido');
    render(data.price, new Date(data.updatedAt));
  } catch {
    setStatus('error');
  }
}

function start() {
  if (!document.querySelector('[data-gold], [data-gold-karat]')) return;
  update();
  clearInterval(timer);
  timer = window.setInterval(update, REFRESH_MS);
}

// No consultar la API mientras la pestaña está oculta
document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearInterval(timer);
  else start();
});

start();
