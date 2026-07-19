import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Project, ProjectFile } from "../lib/types";
import {
  ShoppingCart,
  Download,
  FileText,
  Package,
  ArrowLeft,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Check current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        // Fetch project by slug
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .single();

        if (projectError) throw projectError;
        if (!projectData) throw new Error("Projet introuvable");
        setProject(projectData);

        // Fetch project files
        const { data: filesData } = await supabase
          .from("project_files")
          .select("*")
          .eq("project_id", projectData.id);

        setFiles(filesData || []);

        // Check if user has purchased this project
        if (currentUser) {
          const { data: orderData } = await supabase
            .from("orders")
            .select("*")
            .eq("project_id", projectData.id)
            .eq("user_id", currentUser.id)
            .eq("status", "completed")
            .maybeSingle();

          setHasPurchased(!!orderData);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleBuy = async () => {
    if (!project) return;
    setBuying(true);
    try {
      // Initier le paiement via l'API
      const response = await fetch("/api/payment-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project.id,
          amount: project.price,
          description: `Achat de ${project.title}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      if (data?.payment_url) {
        window.location.href = data.payment_url;
      } else if (data?.demo) {
        alert("✅ Mode démo : Paiement simulé avec succès !");
        setHasPurchased(true);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      alert(`Erreur de paiement: ${message}`);
    } finally {
      setBuying(false);
    }
  };

  const handleDownloadFile = async (file: ProjectFile) => {
    if (!project || !user) return;
    try {
      const res = await fetch(`/api/download?project_id=${project.id}&user_id=${user.id}&type=${file.file_type}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
      if (data.files?.[0]?.download_url) {
        window.open(data.files[0].download_url, "_blank");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      alert(`Erreur de téléchargement: ${message}`);
    }
  };

  if (loading) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <Loader2 size={40} className="text-red-500 animate-spin" />
            <p className="text-gray-400">Chargement...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !project) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 min-h-[40vh] flex flex-col items-center justify-center">
            <AlertCircle size={48} className="text-red-500" />
            <h1 className="text-3xl font-bold text-white">Projet introuvable</h1>
            <p className="text-gray-400">{error || "Ce projet n'existe pas."}</p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <ArrowLeft size={16} />
              Retour à la boutique
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const executables = files.filter((f) => f.file_type === "executable");
  const documentations = files.filter((f) => f.file_type === "documentation");

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/3 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Retour à la boutique
        </Link>

        {/* Main content */}
        <div className="glass rounded-2xl overflow-hidden">
          {/* Header image */}
          <div className="relative h-64 sm:h-80">
            <div className="absolute inset-0 bg-linear-to-t from-[#0a0a1a] via-[#0a0a1a]/50 to-transparent z-10" />
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center">
                <Package size={64} className="text-gray-600" />
              </div>
            )}
            {/* Price badge */}
            <div className="absolute bottom-6 right-6 z-20">
              <span className="text-3xl font-bold text-white">
                {project.price.toLocaleString()} FCFA
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Title & description */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {project.title}
              </h1>
              {project.category && (
                <span className="inline-block glass rounded-full px-3 py-1 text-xs text-gray-400">
                  {project.category}
                </span>
              )}
              <p className="text-gray-300 leading-relaxed">
                {project.long_description || project.description || "Aucune description disponible."}
              </p>
            </div>

            {/* What's included */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Ce qui est inclus</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4 flex items-start gap-3">
                  <Package size={20} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Logiciel</p>
                    <p className="text-gray-400 text-sm">
                      {executables.length > 0
                        ? `${executables.length} fichier(s) exécutable(s)`
                        : "Exécutable inclus"}
                    </p>
                  </div>
                </div>
                <div className="glass rounded-xl p-4 flex items-start gap-3">
                  <FileText size={20} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Documentation</p>
                    <p className="text-gray-400 text-sm">
                      {documentations.length > 0
                        ? `${documentations.length} fichier(s) technique(s)`
                        : "Fiche technique incluse"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="border-t border-white/5 pt-8">
              {hasPurchased ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-green-400 font-medium">
                    <CheckCircle size={20} />
                    Vous avez déjà acheté ce projet
                  </div>

                  {/* Download buttons */}
                  <div className="space-y-3">
                    <h3 className="text-white font-medium">Téléchargements</h3>
                    {executables.map((file) => (
                      <button
                        key={file.id}
                        className="w-full glass rounded-xl p-4 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer"
                        onClick={() => handleDownloadFile(file)}
                      >
                        <div className="flex items-center gap-3">
                          <Download size={20} className="text-red-500" />
                          <div className="text-left">
                            <p className="text-white text-sm">{file.file_name}</p>
                            <p className="text-gray-500 text-xs">
                              {file.file_size
                                ? `${(file.file_size / 1024 / 1024).toFixed(1)} Mo`
                                : "Fichier exécutable"}
                            </p>
                          </div>
                        </div>
                        <span className="text-red-400 text-sm group-hover:underline">
                          Télécharger
                        </span>
                      </button>
                    ))}
                    {documentations.map((file) => (
                      <button
                        key={file.id}
                        className="w-full glass rounded-xl p-4 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer"
                        onClick={() => handleDownloadFile(file)}
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-blue-500" />
                          <div className="text-left">
                            <p className="text-white text-sm">{file.file_name}</p>
                            <p className="text-gray-500 text-xs">
                              {file.file_size
                                ? `${(file.file_size / 1024 / 1024).toFixed(1)} Mo`
                                : "Documentation technique"}
                            </p>
                          </div>
                        </div>
                        <span className="text-red-400 text-sm group-hover:underline">
                          Télécharger
                        </span>
                      </button>
                    ))}
                    {files.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        Les fichiers seront disponibles après l'upload.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {user ? (
                    <button
                      onClick={handleBuy}
                      disabled={buying}
                      className="w-full btn bg-red-500 hover:bg-red-600 text-white border-none rounded-full py-3 h-auto text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {buying ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          Acheter - {project.price.toLocaleString()} FCFA
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      className="w-full btn bg-red-500 hover:bg-red-600 text-white border-none rounded-full py-3 h-auto text-base"
                    >
                      Connectez-vous pour acheter
                    </Link>
                  )}
                  <p className="text-gray-500 text-xs text-center">
                    Paiement sécurisé via Orange Money (CinetPay)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
