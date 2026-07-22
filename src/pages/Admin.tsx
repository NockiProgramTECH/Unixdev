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
  X,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function Admin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    description: "",
    price: "",
  });

  // Simple admin check via environment variable
  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }
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
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Générer un slug à partir du titre
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price) {
      alert("Le titre et le prix sont obligatoires.");
      return;
    }

    setSaving(true);
    setSaveSuccess(null);

    try {
      const { error } = await supabase.from("projects").insert({
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        category: form.category || null,
        description: form.description || null,
        price: parseInt(form.price, 10),
      });

      if (error) throw error;

      setSaveSuccess(`Projet "${form.title}" créé avec succès !`);
      setForm({ title: "", slug: "", category: "", description: "", price: "" });
      setShowModal(false);
      loadData(); // Recharger la liste

      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      alert(`Erreur : ${message}`);
    } finally {
      setSaving(false);
    }
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

        {/* Success notification */}
        {saveSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-400 shrink-0" />
            <p className="text-green-400 text-sm">{saveSuccess}</p>
          </div>
        )}

        {/* Projects Management */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Package size={20} className="text-red-500" />
              Projets ({projects.length})
            </h2>
            <button
              onClick={() => {
                setForm({ title: "", slug: "", category: "", description: "", price: "" });
                setShowModal(true);
              }}
              className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none rounded-full"
            >
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
                      <td className="py-3 px-2 text-center text-gray-400 hidden md:table-cell">—</td>
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
                      <td className="py-3 px-2 text-gray-300">{(order.user_id ?? "N/A").slice(0, 8)}...</td>
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

      {/* Modal : Nouveau projet */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          {/* Modal content */}
          <div className="relative w-full max-w-lg bg-[#0f0f23] border border-white/10 rounded-2xl shadow-2xl p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Nouveau projet</h3>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-ghost btn-sm btn-square text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Titre <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                  placeholder="Ex: Formation Pentest Complet"
                  required
                />
              </div>

              {/* Slug (auto-généré) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors font-mono text-sm"
                  placeholder="formation-pentest-complet"
                />
                <p className="text-xs text-gray-500 mt-1">Généré automatiquement à partir du titre</p>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Catégorie</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                  placeholder="Ex: Cybersécurité, Formation"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                  placeholder="Description du projet..."
                />
              </div>

              {/* Prix */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Prix (FCFA) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                  placeholder="Ex: 5000"
                  min="0"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-sm glass text-gray-300 hover:text-white border-none rounded-full"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-sm bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white border-none rounded-full flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
