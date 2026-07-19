import Hero from "../components/Hero";
import Services from "../components/Services";
import ContactSection from "../components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />

      {/* Section Projets (placeholder) */}
      <section id="projets" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-red-950/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block glass rounded-full px-4 py-1.5 text-xs font-medium text-gray-300 tracking-wide">
            NOS RÉALISATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Projets à venir
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Nous préparons quelque chose de grand. Revenez bientôt pour
            découvrir nos dernières réalisations.
          </p>
          <div className="w-16 h-1 bg-linear-to-r from-blue-500 to-red-500 rounded-full mx-auto" />
        </div>
      </section>

      {/* Section À propos (placeholder) */}
      <section id="apropos" className="relative py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block glass rounded-full px-4 py-1.5 text-xs font-medium text-gray-300 tracking-wide">
            QUI SOMMES-NOUS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-red-500">
              Unixdev
            </span>{" "}
            en quelques mots
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Nous sommes une équipe passionnée d'ingénieurs et de
            développeurs, spécialisés dans la création de solutions
            technologiques innovantes. Notre mission : transformer vos idées
            en réalités numériques robustes, sécurisées et performantes.
          </p>
          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <div className="glass rounded-2xl p-6 text-center min-w-35">
              <span className="text-3xl font-bold text-white">8+</span>
              <p className="text-gray-400 text-sm mt-1">Ans d'expérience</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center min-w-35">
              <span className="text-3xl font-bold text-white">150+</span>
              <p className="text-gray-400 text-sm mt-1">Projets livrés</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center min-w-35">
              <span className="text-3xl font-bold text-white">50+</span>
              <p className="text-gray-400 text-sm mt-1">Clients satisfaits</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center min-w-35">
              <span className="text-3xl font-bold text-white">15+</span>
              <p className="text-gray-400 text-sm mt-1">Experts dédiés</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <ContactSection />
    </>
  );
}
