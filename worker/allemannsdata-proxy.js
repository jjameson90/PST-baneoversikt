// Cloudflare Worker: proxy for Allemannsdata 3D-bygg (3D Tiles: tileset-JSON og GLB).
//
// Hvorfor: Allemannsdata tillater ikke at nettleseren henter byggene fra en annen nettside (CORS).
// Denne lille proxyen henter fliser på vegne av kartet, legger på CORS for PST-kartet, cacher dem
// i Cloudflare sitt nettverk i 30 dager og prøver på nytt ved forbigående feil.
//
// Oppsett (gratis Cloudflare-konto, ca. 5 minutter):
//   1. dash.cloudflare.com → Workers & Pages → Create → Worker → gi den navnet «pst-bygg» → Deploy.
//   2. «Edit code», lim inn hele denne fila, Deploy.
//   3. Kopier adressen (https://pst-bygg.<ditt-navn>.workers.dev/) inn i BYGG_PROXY øverst i index.html.
// Gratisplanen dekker 100 000 forespørsler per dag.

const UPSTREAM = 'https://allemannsdata.com/norge/tiles/';
const TILLAT_STI = /^[A-Za-z0-9_\-./]+\.(json|glb|b3dm|subtree)$/;
const TILLAT_OPPRINNELSE = ['https://jjameson90.github.io', 'http://localhost', 'http://127.0.0.1'];
const CACHE_SEKUNDER = 30 * 24 * 3600;
const FORBIGAENDE = new Set([408, 425, 429, 500, 502, 503, 504]);

function cors(req) {
  const o = req.headers.get('origin') || '';
  const ok = TILLAT_OPPRINNELSE.some((t) => o === t || o.startsWith(t + ':'));
  return ok ? { 'access-control-allow-origin': o, 'access-control-allow-methods': 'GET, HEAD, OPTIONS', vary: 'origin' } : { vary: 'origin' };
}

async function hentMedForsok(url) {
  let sist;
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'PST-baneoversikt/1.0' }, cf: { cacheTtl: CACHE_SEKUNDER, cacheEverything: true } });
      if (!FORBIGAENDE.has(r.status) || i === 3) return r;
      const ra = Number(r.headers.get('retry-after'));
      await new Promise((ok) => setTimeout(ok, ra > 0 ? Math.min(ra * 1000, 8000) : 300 * 2 ** i));
    } catch (e) {
      sist = e;
      await new Promise((ok) => setTimeout(ok, 300 * 2 ** i));
    }
  }
  throw sist || new Error('ukjent feil');
}

export default {
  async fetch(req, _env, ctx) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(req) });
    if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Metode ikke tillatt', { status: 405 });
    const u = new URL(req.url);
    const sti = decodeURIComponent(u.pathname.replace(/^\/+/, ''));
    if (!TILLAT_STI.test(sti) || sti.includes('..')) return new Response('Ugyldig sti', { status: 400, headers: cors(req) });

    const nokkel = new Request(UPSTREAM + sti + u.search);
    const cache = caches.default;
    let svar = await cache.match(nokkel);
    if (!svar) {
      let r;
      try { r = await hentMedForsok(nokkel.url); } catch { return new Response('Kilden svarte ikke', { status: 502, headers: cors(req) }); }
      svar = new Response(r.body, r);
      if (r.status === 200) {
        svar.headers.set('cache-control', `public, max-age=${CACHE_SEKUNDER}`);
        ctx.waitUntil(cache.put(nokkel, svar.clone()));
      }
    }
    const ut = new Response(svar.body, svar);
    for (const [k, v] of Object.entries(cors(req))) ut.headers.set(k, v);
    return ut;
  },
};
