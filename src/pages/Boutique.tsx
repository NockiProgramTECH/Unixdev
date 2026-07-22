import { useEffect, useState } from "react";
import {
  ShoppingBag, Shield, Download, BookOpen,
  ChevronRight, Layers, Terminal, Award, Users,
  Loader2, AlertCircle
} from "lucide-react";

interface CharriowProduct {
  id: string;
  name: string;
  description: string;
  pictures: {
    cover: string;
    thumbnail: string;
  };
  price: {
    value: number;
    formatted: string;
    short: string;
    currency: string;
  };
  status: string;
}

// Configuration des produits (IDs Charriow + infos locales)
const PRODUCT_CONFIGS = [
  {
    id: "prd_ivlbtaux",
    subtitle: "40 modules · 7 niveaux · Débutant à Avancé",
    features: [
      "40 fichiers de cours détaillés (.md)",
      "Laboratoires pratiques sur Metasploitable 2",
      "Exercices corrigés et évaluations",
      "Guide d'installation complet inclus",
      "Méthodologie professionnelle (PTES, OWASP)",
      "Scénario de bout en bout",
    ],
    badge: "POPULAIRE",
  },
];

const stats = [
  { icon: Layers, value: "40", label: "Modules" },
  { icon: Terminal, value: "7", label: "Niveaux" },
  { icon: Award, value: "500+", label: "Pages de cours" },
  { icon: Users, value: "100%", label: "Pratique" },
];

export default function Boutique() {
  const [products, setProducts] = useState<Record<string, CharriowProduct>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger le script Charriow
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.chariowcdn.com/v1/widget.min.js";
    script.async = true;
    document.head.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://js.chariowcdn.com/v1/widget.min.css";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  // Charger les produits depuis l'API Charriow
  useEffect(() => {
    async function fetchProducts() {
      try {
        const results = await Promise.all(
          PRODUCT_CONFIGS.map(async (config) => {
            const res = await fetch(`/api/charriow-product?product_id=${config.id}`);
            if (!res.ok) throw new Error(`Erreur produit ${config.id}: ${res.status}`);
            const data: CharriowProduct = await res.json();
            return [config.id, data] as const;
          })
        );
        setProducts(Object.fromEntries(results));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20 mb-6">
            <ShoppingBag className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">Boutique</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Nos <span className="text-red-500">formations</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Des formations techniques, pratiques et structurées pour maîtriser
            la cybersécurité offensive.
          </p>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <stat.icon className="w-5 h-5 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
            <span className="ml-3 text-gray-400">Chargement des produits...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-xl mx-auto p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-medium mb-2">Erreur de chargement</p>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        )}

        {/* Products */}
        {!loading && !error && (
          <div className="grid gap-8 max-w-5xl mx-auto">
            {PRODUCT_CONFIGS.map((config) => {
              const product = products[config.id];
              const coverImage = product?.pictures?.cover;

              return (
                <div
                  key={config.id}
                  className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm"
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image produit (depuis Charriow) */}
                    <div className="p-6 md:p-8 flex items-center">
                      {coverImage ? (
                        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-gray-900">
                          <img
                            src={coverImage}
                            alt={product?.name ?? "Produit"}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-[16/9] rounded-xl bg-gray-900 border border-white/10 flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* Infos produit */}
                    <div className="p-6 md:p-8">
                      {config.badge && (
                        <div className="mb-4">
                          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            {config.badge}
                          </span>
                        </div>
                      )}

                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-red-500/10 shrink-0">
                          <BookOpen className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            {product?.name ?? config.id}
                          </h2>
                          <p className="text-red-400 text-sm font-medium mt-1">
                            {config.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Prix */}
                      {product?.price && (
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-white">
                            {product.price.formatted}
                          </span>
                          {product.price.short && (
                            <span className="text-gray-500 text-sm ml-2">
                              ({product.price.short})
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-gray-400 text-sm mb-6">
                        {product?.description ?? "Formation complète en test d'intrusion"}
                      </p>

                      {/* Features */}
                      <div className="grid gap-2 mb-8">
                        {config.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Widget Charriow */}
                      <div className="border-t border-white/10 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Shield className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-sm font-medium">
                            Paiement sécurisé
                          </span>
                        </div>

                        <div
                          id="chariow-widget"
                          data-product-id={config.id}
                          data-store-domain="camfbzgd.mychariow.co"
                          data-style="tap"
                          data-border-style="rounded"
                          data-cta-width="xs"
                          data-background-color="#FFFFFF"
                          data-cta-animation="shine"
                          data-locale="fr"
                          data-primary-color="#ffcc00"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Infos complémentaires */}
        <div className="max-w-4xl mx-auto mt-16 grid sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
            <Download className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Livraison immédiate</h3>
            <p className="text-gray-400 text-sm">Accès aux fichiers dès l'achat confirmé</p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
            <Shield className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Paiement sécurisé</h3>
            <p className="text-gray-400 text-sm">Transaction via Charriow, données protégées</p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
            <BookOpen className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Support inclus</h3>
            <p className="text-gray-400 text-sm">Assistance par email pour toute question</p>
          </div>
        </div>
      </div>
    </div>
  );
}
