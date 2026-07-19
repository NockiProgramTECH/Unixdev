import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Project } from "../lib/types";
import { Download, ShoppingCart, ExternalLink } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        if (message.includes("Failed to fetch") || message.includes("not found")) {
          setError("Supabase n'est pas encore configuré");
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Chargement des projets...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 min-h-[40vh] flex flex-col items-center justify-center">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center">
              <ShoppingCart size={32} className="text-red-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Boutique
            </h1>
            <p className="text-gray-400 max-w-md mx-auto">
              {error === "Supabase n'est pas encore configuré"
                ? "La boutique sera disponible dès la configuration de la base de données."
                : "Une erreur est survenue lors du chargement."}
            </p>
            <Link
              to="/"
              className="btn bg-red-500 hover:bg-red-600 text-white border-none rounded-full px-6"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 min-h-[40vh] flex flex-col items-center justify-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-red-500">
                Boutique
              </span>
            </h1>
            <p className="text-gray-400 max-w-md mx-auto">
              Aucun projet disponible pour le moment. Revenez bientôt !
            </p>
            <Link
              to="/"
              className="btn bg-red-500 hover:bg-red-600 text-white border-none rounded-full px-6"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-soft" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <span className="inline-block glass rounded-full px-4 py-1.5 text-xs font-medium text-gray-300 tracking-wide">
            NOS LOGICIELS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-red-500">
              Boutique
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Découvrez nos logiciels et solutions prêtes à l'emploi.
            Téléchargement immédiat après paiement.
          </p>
          <div className="w-16 h-1 bg-linear-to-r from-blue-500 to-red-500 rounded-full mx-auto" />
        </div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className="group glass rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/5"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0a1a] to-transparent z-10" />
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center">
                    <ExternalLink size={48} className="text-gray-600" />
                  </div>
                )}
                {/* Price badge */}
                <div className="absolute top-4 right-4 z-20 glass rounded-full px-3 py-1">
                  <span className="text-white font-bold text-sm">
                    {project.price.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {project.description || "Aucune description"}
                </p>

                {/* Category tag */}
                {project.category && (
                  <div className="inline-block glass rounded-full px-3 py-1 text-xs text-gray-400">
                    {project.category}
                  </div>
                )}

                {/* Buy button */}
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-sm text-red-400 font-medium group-hover:gap-3 transition-all">
                    <ShoppingCart size={16} />
                    Voir l'offre
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
