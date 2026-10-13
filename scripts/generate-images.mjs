// Genera la imagen para redes sociales (og-image.png) y los íconos PNG.
// Uso: npm run images   (vuelve a ejecutarlo cuando tengas el logo definitivo)
import sharp from 'sharp';

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

const icon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" fill="${RED}"/>
  <text x="32" y="45" font-family="Georgia, serif" font-size="36" fill="#fff" text-anchor="middle">R</text>
</svg>`;

await sharp(Buffer.from(og)).png().toFile(out('og-image.png'));
for (const [file, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await sharp(Buffer.from(icon(size))).png().toFile(out(file));
}
console.log('Imágenes generadas en public/');
