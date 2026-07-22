const CHARRIOW_API = 'https://api.chariow.com/v1';

export default async function handler(req) {
  try {
    const apiKey = process.env.CHARRIOW_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Cle API Charriow non configuree' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(`${CHARRIOW_API}/products?per_page=50`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Charriow API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: `Erreur API: ${response.status}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const json = await response.json();
    const products = json.data ?? [];

    const formatted = products
      .filter((p) => p.status === 'published')
      .map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.pricing?.current_price ?? p.price,
        pictures: p.pictures,
        status: p.status,
      }));

    return new Response(JSON.stringify({ products: formatted }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('Charriow products error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
