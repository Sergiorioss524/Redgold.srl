// Datos de la empresa. Edita aquí y se actualiza en todo el sitio
// (textos, SEO, datos estructurados para Google, sitemap).
export const site = {
  name: 'RedGold S.R.L.',
  shortName: 'RedGold',
  legalName: 'RedGold S.R.L.',
  tagline: 'Comercialización de oro con transparencia y trazabilidad',
  description:
    'RedGold S.R.L. es una comercializadora de oro dedicada a la compra, venta y exportación de oro con procesos transparentes, trazables y de origen responsable.',
  url: 'https://redgold.example', // TODO: dominio real, sin "/" al final
  email: 'info@redgold.example', // TODO
  phone: '+000 000 0000', // TODO
  whatsapp: '', // TODO: número internacional sin "+", ej. 18095551234
  hours: 'Lunes a viernes, 8:00 – 17:00',
  // Formato schema.org para Google: días y horas
  openingHours: [{ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' }],

  // Ubicación: MUY importante para SEO local ("compra de oro en <ciudad>")
  address: {
    street: 'Calle y número', // TODO
    city: 'Ciudad', // TODO
    region: 'Provincia / Departamento', // TODO
    postalCode: '', // TODO
    country: 'XX', // TODO: código ISO de 2 letras, ej. DO, BO, PE, CO
    countryName: 'País', // TODO
  },
  geo: { lat: 0, lng: 0 }, // TODO: coordenadas de la oficina (Google Maps → clic derecho)
  locale: 'es', // ej. es_DO, es_BO

  // Perfiles oficiales (ayudan a Google a confirmar la identidad de la empresa)
  social: [] as string[], // TODO: ej. ['https://www.linkedin.com/company/redgold', 'https://www.facebook.com/redgold']
  foundingDate: '', // TODO: ej. '2020'

  // Pega aquí el código de verificación de Google Search Console / Bing
  googleVerification: '', // TODO
  bingVerification: '', // TODO

  // Crea un formulario gratis en https://formspree.io y pega aquí el endpoint
  formEndpoint: '', // TODO: ej. https://formspree.io/f/xxxxxxx
};

export const fullAddress = [site.address.street, site.address.city, site.address.region, site.address.countryName]
  .filter(Boolean)
  .join(', ');

export const nav = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/cumplimiento', label: 'Cumplimiento' },
  { href: '/preguntas-frecuentes', label: 'Preguntas' },
  { href: '/contacto', label: 'Contacto' },
];
