import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const projectId = url.searchParams.get('project_id');
    const fileType = url.searchParams.get('type') || 'all';
    const userId = url.searchParams.get('user_id');

    if (!projectId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing project_id or user_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Vérifier que l'utilisateur a bien acheté ce projet
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .eq('status', 'completed')
      .maybeSingle();

    if (orderError) throw orderError;
    if (!order) {
      return new Response(JSON.stringify({ error: 'Vous devez d\'abord acheter ce projet' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Récupérer les fichiers du projet
    let query = supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId);

    if (fileType !== 'all') {
      query = query.eq('file_type', fileType);
    }

    const { data: files, error: filesError } = await query;

    if (filesError) throw filesError;
    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'Aucun fichier disponible' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Générer des URLs signées pour chaque fichier
    const downloadUrls = await Promise.all(
      files.map(async (file) => {
        const bucket = file.file_type === 'executable' ? 'executables' : 'documentation';
        const { data: signedUrlData } = await supabase.storage
          .from(bucket)
          .createSignedUrl(file.storage_path, 3600); // URL valide 1 heure

        return {
          id: file.id,
          file_name: file.file_name,
          file_type: file.file_type,
          file_size: file.file_size,
          download_url: signedUrlData?.signedUrl || null,
        };
      })
    );

    return new Response(JSON.stringify({ files: downloadUrls }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('Download error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
