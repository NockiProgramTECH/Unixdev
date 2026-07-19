import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'GET') {
    // Vérification de la transaction après redirection
    const url = new URL(req.url);
    const transactionId = url.searchParams.get('transaction_id');
    const token = url.searchParams.get('token');

    if (transactionId && token) {
      // Vérifier le statut via CinetPay
      const cinetpayApiKey = process.env.CINETPAY_API_KEY;
      const cinetpaySiteId = process.env.CINETPAY_SITE_ID;

      if (cinetpayApiKey && cinetpaySiteId) {
        const verifyResponse = await fetch('https://api-checkout.cinetpay.com/v2/payment/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apikey: cinetpayApiKey,
            site_id: parseInt(cinetpaySiteId),
            transaction_id: transactionId,
            token: token,
          }),
        });

        const verifyData = await verifyResponse.json();

        if (verifyData?.code === '00' && verifyData?.data?.status === 'ACCEPTED') {
          // Paiement réussi
          await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('transaction_id', transactionId);
        }
      } else {
        // Mode démo : marquer comme complété
        await supabase
          .from('orders')
          .update({ status: 'completed' })
          .eq('transaction_id', transactionId);
      }
    }

    // Rediriger vers le dashboard
    return new Response(null, {
      status: 302,
      headers: { Location: '/dashboard' },
    });
  }

  // Webhook POST de CinetPay
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { transaction_id, status, token, code } = body;

      if (code === '00' && status === 'ACCEPTED') {
        await supabase
          .from('orders')
          .update({ status: 'completed' })
          .eq('transaction_id', transaction_id);

        // Mettre à jour l'utilisateur si présent
        if (body?.customer_id) {
          await supabase
            .from('orders')
            .update({ user_id: body.customer_id })
            .eq('transaction_id', transaction_id);
        }
      } else {
        await supabase
          .from('orders')
          .update({ status: 'failed' })
          .eq('transaction_id', transaction_id);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Webhook error:', err);
      return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
}
