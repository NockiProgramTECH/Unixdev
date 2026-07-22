const CHARRIOW_API = 'https://api.chariow.com/v1';

export default async function handler(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get('product_id');

    if (!productId) {
      return new Response(JSON.stringify({ error: 'Paramètre product_id requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.CHARRIOW_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Clé API Charriow non configurée' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(`${CHARRIOW_API}/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Charriow API error:', response.status, errorText);
      return new Response(JSON.stringify({
        error: `Erreur API Charriow: ${response.status}`,
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const json = await response.json();
    const product = json.data ?? json;

    // On retourne seulement les infos utiles pour la boutique
    return new Response(JSON.stringify({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price ?? product.pricing?.current_price,
      pictures: product.pictures, // contient cover et thumbnail
      currency: product.currency,
      status: product.status,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('Charriow product proxy error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
