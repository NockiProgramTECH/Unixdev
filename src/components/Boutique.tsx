import { ShoppingBag, Shield, Download, BookOpen, ChevronRight } from "lucide-react";

const product = {
  id: "prd_ivlbtaux",
  name: "Formation Complète en Test d'Intrusion",
  subtitle: "40 modules · 7 niveaux · Débutant à Avancé",
  price: "F CFA 4,000",
  originalPrice: "5,000",
  description:
    "Une formation progressive et pratique pour apprendre le pentest de zéro. Linux, réseaux, exploitation web, Active Directory, rapport professionnel.",
  features: [
    "40 fichiers de cours détaillés (.md)",
    "Laboratoires pratiques sur Metasploitable 2",
    "Exercices corrigés et évaluations",
    "Guide d'installation complet inclus",
    "Méthodologie professionnelle (PTES, OWASP)",
    "Scénario de bout en bout",
  ],
  image:
    "https://images.chariowcdn.com/cdn-cgi/image/format=auto,onerror=redirect,quality=medium-high,slow-connection-quality=50/https://assets.chariowcdn.com/assets/store_2pa0brkrts5j/cUuQzPL8g0TD1NaNs2tNXhoxdx8OnA14sNafqUEF.png",
};

export default function Boutique() {
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

        {/* Product Card */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="p-6 md:p-8 flex items-center">
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-gray-900">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Infos */}
            <div className="p-6 md:p-8">
              <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full mb-4">
                POPULAIRE
              </span>

              <h3 className="text-2xl font-bold text-white mb-2">
                {product.name}
              </h3>
              <p className="text-red-400 text-sm font-medium mb-4">
                {product.subtitle}
              </p>

              {/* Prix */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">
                  {product.price}
                </span>
                <span className="text-gray-500 line-through text-sm ml-2">
                  {product.originalPrice} FCFA
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-6">{product.description}</p>

              {/* Features */}
              <div className="grid gap-2 mb-8">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Charriow Widget */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">
                    Paiement sécurisé
                  </span>
                </div>

                <div
                  id="chariow-widget"
                  data-product-id={product.id}
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

        {/* Infos complémentaires */}
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
            <p className="text-gray-400 text-sm">Assistance par email pour toute question</p>
          </div>
        </div>
      </div>
    </section>
  );
}
