// Genera la imagen para redes sociales (og-image.png), el favicon y los íconos
// a partir del logo oficial (src/assets/logo) y de public/logoblanco.png.
// Uso: npm run images
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const RED = '#8a1002'; // Rojo oscuro del manual de marca (variante logo blanco sobre rojo)
const RED_BRIGHT = '#e30613';
const out = (f) => new URL(`../public/${f}`, import.meta.url).pathname;

// Imagen para redes: logo oficial a la izquierda, mensaje a la derecha.
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="bar" x1="0" x2="1"><stop offset="0" stop-color="${RED}"/><stop offset=".5" stop-color="${RED_BRIGHT}"/><stop offset="1" stop-color="${RED}"/></linearGradient></defs>
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect width="1200" height="12" fill="url(#bar)"/>
  <rect x="610" y="190" width="4" height="250" fill="${RED}"/>
  <text x="650" y="280" font-family="Century Gothic, Avenir Next, Helvetica, Arial, sans-serif" font-size="44" font-weight="700" fill="#1b1d1f">Compra, venta y</text>
  <text x="650" y="335" font-family="Century Gothic, Avenir Next, Helvetica, Arial, sans-serif" font-size="44" font-weight="700" fill="#1b1d1f">exportación de oro</text>
  <text x="650" y="400" font-family="Century Gothic, Avenir Next, Helvetica, Arial, sans-serif" font-size="24" font-style="italic" font-weight="700" fill="#394e59">Transparencia · Trazabilidad</text>
  <rect y="590" width="1200" height="40" fill="#f3f5f6"/>
</svg>`;
const LOGO_COLOR = new URL('../src/assets/logo/logo-fondo-claro.png', import.meta.url).pathname;

// Íconos: la montaña del logo (sin el texto, que no se lee en tamaños pequeños)
// en blanco sobre un cuadrado rojo.
const LOGO = out('logoblanco.png');
const { width, height } = await sharp(LOGO).metadata();
const top = await sharp(LOGO).extract({ left: 0, top: 0, width, height: Math.round(height * 0.64) }).toBuffer();
const mountain = await sharp(top).trim().toBuffer();

async function icon(size, file, padding = 0.16) {
  const inner = Math.round(size * (1 - padding * 2));
  const glyph = await sharp(mountain).resize(inner, inner, { fit: 'inside' }).toBuffer();
  const buf = await sharp({ create: { width: size, height: size, channels: 4, background: RED } })
    .composite([{ input: glyph, gravity: 'center' }])
    .png()
    .toBuffer();
  if (file) await sharp(buf).toFile(out(file));
  return buf;
}

const logo = await sharp(LOGO_COLOR).resize({ width: 480 }).toBuffer();
await sharp(Buffer.from(og))
  .composite([{ input: logo, left: 80, top: Math.round((630 - (await sharp(logo).metadata()).height) / 2) }])
  .png()
  .toFile(out('og-image.png'));
for (const [file, size] of [['favicon-32.png', 32], ['favicon-48.png', 48], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await icon(size, file, size <= 48 ? 0.1 : 0.16);
}

// favicon.ico (el que piden por defecto navegadores antiguos y algunos buscadores):
// contenedor ICO con PNG de 16, 32 y 48 px.
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => icon(s, null, 0.08)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
writeFileSync(out('favicon.ico'), Buffer.concat([header, ...pngs]));
console.log('Imágenes generadas en public/');
