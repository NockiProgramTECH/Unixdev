import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { project_id, amount, description } = await req.json();

    if (!project_id || !amount) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Créer une commande en statut pending
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        project_id,
        amount,
        currency: 'XOF',
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Mode démo (sans CinetPay configuré)
    const cinetpayApiKey = process.env.CINETPAY_API_KEY;
    const cinetpaySiteId = process.env.CINETPAY_SITE_ID;

    if (!cinetpayApiKey || !cinetpaySiteId) {
      // Retourner un mode démo pour les tests
      return new Response(JSON.stringify({
        payment_url: null,
        order_id: order.id,
        demo: true,
        message: 'Mode démo : paiement simulé. Configurez CINETPAY_API_KEY et CINETPAY_SITE_ID pour les paiements réels.',
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Appel API CinetPay pour créer un paiement
    const transactionId = `ORD-${order.id.slice(0, 8)}-${Date.now()}`;
    const callbackUrl = `${req.headers.get('origin') || 'https://unixdev.vercel.app'}/api/payment-webhook`;

    const cinetpayResponse = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey: cinetpayApiKey,
        site_id: parseInt(cinetpaySiteId),
        transaction_id: transactionId,
        amount: amount,
        currency: 'XOF',
        description: description || 'Achat logiciel',
        notify_url: callbackUrl,
        return_url: `${req.headers.get('origin') || 'https://unixdev.vercel.app'}/dashboard`,
        channels: 'ALL',
        lang: 'FR',
      }),
    });

    const cinetpayData = await cinetpayResponse.json();

    if (!cinetpayResponse.ok || !cinetpayData?.data?.payment_url) {
      throw new Error(cinetpayData?.message || 'Erreur API CinetPay');
    }

    // Mettre à jour la commande avec le transaction_id
    await supabase
      .from('orders')
      .update({ transaction_id: transactionId })
      .eq('id', order.id);

    return new Response(JSON.stringify({
      payment_url: cinetpayData.data.payment_url,
      order_id: order.id,
      transaction_id: transactionId,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('Payment error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
