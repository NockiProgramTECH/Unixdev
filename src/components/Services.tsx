import Card from "./card";

const services = [
  {
    image: "/images/services/web.jpg",
    title: "Développement Web",
    paragraph:
      "Sites vitrines, applications web progressives (PWA), plateformes e-commerce et portails sur-mesure avec les technologies les plus modernes.",
    color: "red",
  },
  {
    image: "/images/services/mobile.jpg",
    title: "Applications Mobiles",
    paragraph:
      "Applications iOS et Android natives ou cross-platform, de la conception UX/UI au déploiement sur les stores.",
    color: "blue",
  },
  {
    image: "/images/services/network.jpg",
    title: "Réseaux & Infrastructure",
    paragraph:
      "Architecture réseau, déploiement d'infrastructure, VPN, cloud computing et solutions de connectivité sécurisées.",
    color: "purple",
  },
  {
    image: "/images/services/security.jpg",
    title: "Cybersécurité",
    paragraph:
      "Audit de sécurité, tests d'intrusion, mise en conformité RGPD, protection des données et solutions de sécurisation avancées.",
    color: "green",
  },
  {
    image: "/images/services/embedded.jpg",
    title: "Logiciels Embarqués",
    paragraph:
      "Développement de firmware, systèmes temps réel, IoT et solutions logicielles pour dispositifs embarqués industriels.",
    color: "red",
  },
  {
    image: "/images/services/cloud.jpg",
    title: "Cloud & DevOps",
    paragraph:
      "Migration cloud, CI/CD, conteneurisation Docker/Kubernetes, automatisation et gestion d'infrastructure as code.",
    color: "blue",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block glass rounded-full px-4 py-1.5 text-xs font-medium text-gray-300 tracking-wide">
            NOTRE EXPERTISE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Des services adaptés <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-red-500">
              à vos besoins
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            De la conception à la maintenance, nous vous accompagnons sur
            l'ensemble de vos projets technologiques avec une approche sur-mesure
            et des experts dédiés.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.title}
              image={service.image}
              title={service.title}
              paragraph={service.paragraph}
              color={service.color as "red" | "blue" | "purple" | "green"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
