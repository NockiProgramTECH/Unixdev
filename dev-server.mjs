/**
 * Serveur de développement pour les API routes Unixdev
 * Usage : node dev-server.mjs
 *        + dans un autre terminal : npm run dev
 */

import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3001;

// Charger les variables d'environnement depuis .env
function loadEnv() {
  const envPath = resolve(__dirname, '.env');
  if (!existsSync(envPath)) return {};

  const env = {};
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    env[key] = value;
  }
  return env;
}

const env = loadEnv();
const CHARRIOW_API_KEY = env.CHARRIOW_API_KEY || process.env.CHARRIOW_API_KEY;
const CHARRIOW_API = 'https://api.chariow.com/v1';

const server = http.createServer(async (req, res) => {
  // CORS pour le dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  // Route : GET /api/charriow-product?product_id=XXX
  if (path === '/api/charriow-product' && req.method === 'GET') {
    const productId = url.searchParams.get('product_id');

    if (!productId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Paramètre product_id requis' }));
      return;
    }

    if (!CHARRIOW_API_KEY) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'CHARRIOW_API_KEY non définie dans .env' }));
      return;
    }

    try {
      console.log(`[dev] Fetching Charriow product: ${productId}`);
      const apiRes = await fetch(`${CHARRIOW_API}/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${CHARRIOW_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!apiRes.ok) {
        const errText = await apiRes.text();
        console.error(`[dev] Charriow API error ${apiRes.status}: ${errText}`);
        res.writeHead(apiRes.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Charriow API: ${apiRes.status}` }));
        return;
      }

      const json = await apiRes.json();
      const product = json.data ?? json;
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      });
      res.end(JSON.stringify({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price ?? product.pricing?.current_price,
        pictures: product.pictures,
        status: product.status,
      }));
    } catch (err) {
      console.error('[dev] Proxy error:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║  🔧 Serveur API Unixdev (dev)              ║
║  http://localhost:${PORT}                      ║
║                                              ║
║  Endpoint :                                  ║
║  GET /api/charriow-product?product_id=XXX   ║
╚══════════════════════════════════════════════╝
  `);
});
