const CHARRIOW_API = 'https://api.chariow.com/v1';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const apiKey = process.env.CHARRIOW_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Cle API non configuree' });
      return;
    }

    const response = await fetch(`${CHARRIOW_API}/products?per_page=50`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      res.status(response.status).json({ error: `Erreur Charriow: ${response.status}` });
      return;
    }

    const json = await response.json();
    const products = (json.data ?? [])
      .filter(p => p.status === 'published')
      .map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.pricing?.current_price ?? p.price,
        pictures: p.pictures,
      }));

    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.json({ products });

  } catch (err) {
    res.status(500).json({ error: err.message ?? 'Erreur inconnue' });
  }
}
