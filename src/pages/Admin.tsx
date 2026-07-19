import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Project, Order } from "../lib/types";
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  Loader2,
  AlertCircle,
  Package,
  Eye,
} from "lucide-react";

export default function Admin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  // Simple admin check via environment variable
  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }
        // Check if user's email matches admin email
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        if (adminEmail && user.email === adminEmail) {
          setIsAdmin(true);
          loadData();
        } else {
          setIsAdmin(false);
          setChecking(false);
        }
      } catch {
        setIsAdmin(false);
        setChecking(false);
      }
    }
    checkAdmin();
  }, [navigate]);

  async function loadData() {
    try {
      const [projectsRes, ordersRes] = await Promise.all([
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*, project:projects(*)").order("created_at", { ascending: false }),
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (ordersRes.error) throw ordersRes.error;

      setProjects(projectsRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce projet définitivement ?")) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      alert("Erreur lors de la suppression");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Access denied or checking
  if (!checking && !isAdmin) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <AlertCircle size={48} className="text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-white">Accès refusé</h1>
          <p className="text-gray-400">Vous n'avez pas les droits d'administration.</p>
          <Link to="/" className="text-red-400 hover:text-red-300 transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </section>
    );
  }

  if (loading || checking) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <Loader2 size={40} className="text-red-500 animate-spin mx-auto" />
          <p className="text-gray-400">Chargement...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-32 overflow-hidden min-h-screen">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-red-500">
                Administration
              </span>
            </h1>
            <p className="text-gray-400 mt-1">Gérez vos projets et commandes</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="btn btn-sm glass text-gray-300 hover:text-red-400 border-none rounded-full"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Projects Management */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Package size={20} className="text-red-500" />
              Projets ({projects.length})
            </h2>
            <button className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none rounded-full">
              <Plus size={16} />
              Nouveau projet
            </button>
          </div>

          {projects.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucun projet pour le moment. Cliquez sur "Nouveau projet" pour commencer.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-white/5">
                    <th className="text-left py-3 px-2">Titre</th>
                    <th className="text-left py-3 px-2 hidden sm:table-cell">Catégorie</th>
                    <th className="text-right py-3 px-2">Prix</th>
                    <th className="text-center py-3 px-2 hidden md:table-cell">Fichiers</th>
                    <th className="text-right py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-2">
                        <span className="text-white font-medium">{project.title}</span>
                      </td>
                      <td className="py-3 px-2 text-gray-400 hidden sm:table-cell">
                        {project.category || "—"}
                      </td>
                      <td className="py-3 px-2 text-right text-white font-medium">
                        {project.price.toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-2 text-center text-gray-400 hidden md:table-cell">
                        —
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/projects/${project.slug}`}
                            className="btn btn-ghost btn-xs text-gray-400 hover:text-white"
                          >
                            <Eye size={14} />
                          </Link>
                          <button className="btn btn-ghost btn-xs text-gray-400 hover:text-blue-400">
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="btn btn-ghost btn-xs text-gray-400 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Orders Management */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            Commandes ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune commande pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-white/5">
                    <th className="text-left py-3 px-2">Client</th>
                    <th className="text-left py-3 px-2 hidden sm:table-cell">Projet</th>
                    <th className="text-right py-3 px-2">Montant</th>
                    <th className="text-center py-3 px-2">Statut</th>
                    <th className="text-right py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-2 text-gray-300">{order.user_id.slice(0, 8)}...</td>
                      <td className="py-3 px-2 text-gray-400 hidden sm:table-cell">
                        {order.project?.title || "—"}
                      </td>
                      <td className="py-3 px-2 text-right text-white font-medium">
                        {order.amount.toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : order.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {order.status === "completed" ? "Payé" : order.status === "pending" ? "En attente" : "Échoué"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right text-gray-400 text-xs">
                        {new Date(order.created_at).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
