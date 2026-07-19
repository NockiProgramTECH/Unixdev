import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Order } from "../lib/types";
import {
  Download,
  FileText,
  Package,
  LogOut,
  Loader2,
  ShoppingCart,
  ArrowLeft,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          navigate("/auth");
          return;
        }
        setUser(currentUser);

        const { data, error } = await supabase
          .from("orders")
          .select("*, project:projects(*)")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        if (message.includes("Failed to fetch")) {
          setError("Supabase n'est pas encore configuré.");
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <Loader2 size={40} className="text-red-500 animate-spin" />
            <p className="text-gray-400">Chargement de vos achats...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 min-h-[40vh] flex flex-col items-center justify-center">
            <AlertCircle size={48} className="text-red-500" />
            <h1 className="text-2xl font-bold text-white">Erreur</h1>
            <p className="text-gray-400">{error}</p>
            <Link to="/" className="text-red-400 hover:text-red-300 transition-colors">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-red-500">
                Mon espace
              </span>
            </h1>
            <p className="text-gray-400 mt-1">
              {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/projects"
              className="btn btn-sm glass text-gray-300 hover:text-white border-none rounded-full"
            >
              <ShoppingCart size={16} />
              Boutique
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-sm glass text-gray-300 hover:text-red-400 border-none rounded-full"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto">
              <Package size={28} className="text-gray-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Aucun achat pour le moment</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Parcourez notre boutique et trouvez le logiciel qu'il vous faut.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 btn bg-red-500 hover:bg-red-600 text-white border-none rounded-full"
            >
              <ShoppingCart size={16} />
              Voir la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="glass rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      order.status === "completed"
                        ? "bg-green-500/20"
                        : order.status === "pending"
                        ? "bg-yellow-500/20"
                        : "bg-red-500/20"
                    }`}>
                      {order.status === "completed" ? (
                        <CheckCircle size={24} className="text-green-400" />
                      ) : order.status === "pending" ? (
                        <Clock size={24} className="text-yellow-400" />
                      ) : (
                        <XCircle size={24} className="text-red-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {order.project?.title || "Projet"}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {order.amount.toLocaleString()} FCFA
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === "pending" && (
                      <span className="text-xs glass rounded-full px-3 py-1 text-yellow-400">
                        En attente
                      </span>
                    )}
                    {order.status === "failed" && (
                      <span className="text-xs glass rounded-full px-3 py-1 text-red-400">
                        Échoué
                      </span>
                    )}
                    {order.status === "completed" && (
                      <Link
                        to={`/projects/${order.project?.slug}`}
                        className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none rounded-full"
                      >
                        <Download size={14} />
                        Télécharger
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
