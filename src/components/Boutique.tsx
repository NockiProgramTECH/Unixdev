import { useEffect, useState } from "react";
import {
  ShoppingBag, Shield, Download, BookOpen,
  ChevronRight, Loader2, AlertCircle
} from "lucide-react";

interface Produit {
  id: string;
  name: string;
  description: string;
  pictures: { cover?: string; thumbnail?: string };
  price: {
    value: number;
    formatted: string;
    short: string;
  };
}

interface ApiResponse {
  products: Produit[];
  error?: string;
}

const features = [
  "Fichiers de cours détaillés (.md)",
  "Laboratoires pratiques inclus",
  "Exercices corrigés et évaluations",
  "Guide d'installation complet",
  "Méthodologie professionnelle",
  "Scénario de bout en bout",
];

export default function Boutique() {
  const [products, setProducts] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger le widget Charriow APRES que le rendu React soit fait
  useEffect(() => {
    if (document.querySelector('script[src*="chariowcdn"]')) return;

    const script = document.createElement("script");
    script.src = "https://js.chariowcdn.com/v1/widget.min.js";
    script.async = true;
    document.head.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://js.chariowcdn.com/v1/widget.min.css";
    document.head.appendChild(link);
  }, []);

  // Charger les produits depuis l'API Charriow
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/charriow-products");
        if (!res.ok) throw new Error(`Erreur: ${res.status}`);
        const data: ApiResponse = await res.json();
        if (data.error) throw new Error(data.error);
        setProducts(data.products ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section id="boutique" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-red-950/5 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block glass rounded-full px-4 py-1.5 text-xs font-medium text-gray-300 tracking-wide mb-6">
            <ShoppingBag className="w-3.5 h-3.5 inline mr-1.5" />
            BOUTIQUE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Nos <span className="text-red-500">formations</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Des formations techniques, pratiques et structurées pour maîtriser
            la cybersécurité offensive.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-red-400 animate-spin" />
            <span className="ml-3 text-gray-400">Chargement des produits...</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="max-w-xl mx-auto p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
            <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-red-400 text-sm font-medium mb-1">Erreur de chargement</p>
            <p className="text-gray-500 text-xs">{error}</p>
          </div>
        )}

        {/* Produits vides */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">Aucun produit disponible pour le moment.</p>
          </div>
        )}

        {/* Grille de produits */}
        {!loading && !error && products.length > 0 && (
          <div className="grid gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm overflow-hidden"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="p-6 md:p-8 flex items-center">
                    {product.pictures?.cover ? (
                      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-gray-900">
                        <img
                          src={product.pictures.cover}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[16/9] rounded-xl bg-gray-900 border border-white/10 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {product.name}
                    </h3>

                    {/* Prix */}
                    {product.price && (
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-white">
                          {product.price.formatted}
                        </span>
                      </div>
                    )}

                    <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                      {product.description?.replace(/<[^>]*>/g, "").slice(0, 200) || "Formation complète"}
                    </p>

                    {/* Features */}
                    <div className="grid gap-2 mb-8">
                      {features.map((feature, i) => (
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
                        id={`chariow-widget-${product.id}`}
                        data-product-id={product.id}
                        data-store-domain="camfbzgd.mychariow.co"
                        data-style="button"
                        data-border-style="rounded"
                        data-cta-width="xs"
                        data-background-color="#ffcc00"
                        data-cta-animation="shine"
                        data-locale="fr"
                        data-primary-color="#ffcc00"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Infos complémentaires */}
        {!loading && !error && products.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12 grid sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
              <Download className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-2">Livraison immédiate</h4>
              <p className="text-gray-400 text-sm">Accès aux fichiers dès l'achat confirmé</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
              <Shield className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-2">Paiement sécurisé</h4>
              <p className="text-gray-400 text-sm">Transaction via Charriow, données protégées</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
              <BookOpen className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-2">Support inclus</h4>
              <p className="text-gray-400 text-sm">Assistance par email</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
