// Genera la imagen para redes sociales (og-image.png), el favicon y los íconos
// a partir de public/logoblanco.png.
// Uso: npm run images   (vuelve a ejecutarlo cuando tengas el logo definitivo)
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const RED = '#a1161c';
const out = (f) => new URL(`../public/${f}`, import.meta.url).pathname;

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect width="1200" height="12" fill="${RED}"/>
  <rect x="80" y="150" width="6" height="330" fill="${RED}"/>
  <text x="130" y="250" font-family="Georgia, serif" font-size="96" fill="#1d1d1f"><tspan fill="${RED}">Red</tspan>Gold</text>
  <text x="134" y="300" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="8" fill="#5b5b60">S.R.L.</text>
  <text x="134" y="400" font-family="Georgia, serif" font-size="40" fill="#1d1d1f">Compra, venta y exportación de oro</text>
  <text x="134" y="455" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#5b5b60">Transparencia · Trazabilidad · Origen responsable</text>
  <rect y="590" width="1200" height="40" fill="#f7f6f3"/>
</svg>`;

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

await sharp(Buffer.from(og)).png().toFile(out('og-image.png'));
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
