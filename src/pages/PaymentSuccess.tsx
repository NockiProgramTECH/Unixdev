import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Download,
  Package,
  FileText,
  ShoppingCart,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

interface DownloadFile {
  id: string;
  file_name: string;
  file_type: "executable" | "documentation";
  file_size: number | null;
  download_url: string | null;
}

interface ProjectInfo {
  title: string;
  price: number;
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("transaction_id");

  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [files, setFiles] = useState<DownloadFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!transactionId) {
      setLoading(false);
      setError("Aucun identifiant de transaction fourni.");
      return;
    }

    async function fetchDownloads() {
      try {
        const res = await fetch(`/api/download?transaction_id=${encodeURIComponent(transactionId ?? "")}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Erreur lors de la récupération des fichiers");
        if (!data.files || data.files.length === 0) throw new Error("Aucun fichier disponible");

        setProject(data.project || null);
        setFiles(data.files);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchDownloads();
  }, [transactionId]);

  const hasExecutables = files.some((f) => f.file_type === "executable");
  const hasDocumentations = files.some((f) => f.file_type === "documentation");

  return (
    <section className="relative py-32 overflow-hidden min-h-screen">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <Loader2 size={40} className="text-green-500 animate-spin" />
            <p className="text-gray-400">Vérification de votre paiement...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center space-y-6 min-h-[40vh] flex flex-col items-center justify-center">
            <AlertCircle size={48} className="text-red-500" />
            <h1 className="text-2xl font-bold text-white">Paiement non trouvé</h1>
            <p className="text-gray-400 max-w-md">
              {error}
            </p>
            <p className="text-gray-500 text-sm max-w-md">
              Si vous venez d'effectuer un paiement, veuillez réessayer dans quelques instants.
              Si le problème persiste, contactez-nous.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 btn bg-red-500 hover:bg-red-600 text-white border-none rounded-full"
            >
              <ShoppingCart size={16} />
              Retour à la boutique
            </Link>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            {/* Success header */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={40} className="text-green-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Paiement réussi !
              </h1>
              <p className="text-gray-400">
                Merci pour votre achat. Vous pouvez maintenant télécharger vos fichiers.
              </p>
            </div>

            {/* Project info */}
            {project && (
              <div className="glass rounded-2xl p-6 text-center">
                <Package size={24} className="text-red-500 mx-auto mb-2" />
                <h2 className="text-xl font-bold text-white">{project.title}</h2>
                <p className="text-gray-400 text-sm">
                  {project.price.toLocaleString()} FCFA
                </p>
              </div>
            )}

            {/* Download cards */}
            <div className="space-y-4">
              {hasExecutables && (
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Package size={18} className="text-red-500" />
                    Fichiers exécutables
                  </h3>
                  <div className="grid gap-3">
                    {files
                      .filter((f) => f.file_type === "executable")
                      .map((file) => (
                        <DownloadCard key={file.id} file={file} />
                      ))}
                  </div>
                </div>
              )}

              {hasDocumentations && (
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <FileText size={18} className="text-blue-500" />
                    Documentation technique
                  </h3>
                  <div className="grid gap-3">
                    {files
                      .filter((f) => f.file_type === "documentation")
                      .map((file) => (
                        <DownloadCard key={file.id} file={file} />
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Back to shop */}
            <div className="text-center pt-4">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                Retour à la boutique
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && !transactionId && (
          <div className="text-center space-y-6 min-h-[40vh] flex flex-col items-center justify-center">
            <AlertCircle size={48} className="text-yellow-500" />
            <h1 className="text-2xl font-bold text-white">Aucune transaction</h1>
            <p className="text-gray-400">
              Vous avez effectué un achat ? Utilisez le lien qui vous a été fourni après le paiement.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 btn bg-red-500 hover:bg-red-600 text-white border-none rounded-full"
            >
              <ShoppingCart size={16} />
              Voir la boutique
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function DownloadCard({ file }: { file: DownloadFile }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (!file.download_url) return;
    setDownloading(true);
    window.open(file.download_url, "_blank");
    setTimeout(() => setDownloading(false), 1500);
  };

  return (
    <div className="glass rounded-xl p-4 flex items-center justify-between group hover:bg-white/10 transition-all">
      <div className="flex items-center gap-3">
        {file.file_type === "executable" ? (
          <Package size={20} className="text-red-500" />
        ) : (
          <FileText size={20} className="text-blue-500" />
        )}
        <div>
          <p className="text-white text-sm">{file.file_name}</p>
          {file.file_size && (
            <p className="text-gray-500 text-xs">
              {(file.file_size / 1024 / 1024).toFixed(1)} Mo
            </p>
          )}
        </div>
      </div>
      <button
        onClick={handleDownload}
        disabled={!file.download_url || downloading}
        className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Download size={14} />
        )}
        Télécharger
      </button>
    </div>
  );
}
