import { MoveRight, ShieldCheck, Code, Zap } from "lucide-react";
import TypeWriter from "./TypeWriter";

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* Background avec overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/back.png"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a1a] via-[#0a0a1a]/90 to-[#0a0a1a]/60" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a1a] via-transparent to-transparent" />
      </div>

      {/* Éléments décoratifs animés */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-soft animate-delay-3" />

      {/* Contenu */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 animate-fade-up">
              <Zap size={14} className="text-red-500" />
              <span className="text-xs font-medium text-gray-300 tracking-wide">
                INNOVATION & SÉCURITÉ
              </span>
            </div>

            {/* Title */}
            <div className="animate-fade-up animate-delay-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Nous construisons <br />
                des solutions{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-red-500">
                  <TypeWriter
                    texts={[
                      "technologiques",
                      "sécurisées",
                      "innovantes",
                      "évolutives",
                      "sur-mesure",
                    ]}
                    typeSpeed={85}
                    deleteSpeed={40}
                    pauseDuration={2000}
                  />
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-lg leading-relaxed max-w-xl animate-fade-up animate-delay-2">
              Spécialistes en réseaux informatiques, développement web & mobile,
              logiciels embarqués et cybersécurité. Nous donnons vie à vos
              projets les plus ambitieux.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-fade-up animate-delay-3">
              <a
                href="#services"
                className="btn bg-red-500 hover:bg-red-600 text-white border-none rounded-full px-8 py-3 h-auto text-base font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5"
              >
                Découvrir nos services
              </a>
              <a
                href="#projets"
                className="btn bg-transparent hover:bg-white/10 text-white border border-white/30 hover:border-white/50 rounded-full px-8 py-3 h-auto text-base font-semibold transition-all duration-200"
              >
                Voir nos projets <MoveRight size={18} />
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4 animate-fade-up animate-delay-4">
              <div>
                <span className="text-2xl font-bold text-white">150+</span>
                <p className="text-xs text-gray-400 mt-1">Projets livrés</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">50+</span>
                <p className="text-xs text-gray-400 mt-1">Clients satisfaits</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">8+</span>
                <p className="text-xs text-gray-400 mt-1">Ans d'expertise</p>
              </div>
            </div>
          </div>

          {/* Right: Illustration / Cards flottantes */}
          <div className="hidden lg:block animate-fade-right">
            <div className="relative">
              {/* Carte 1 */}
              <div className="glass rounded-2xl p-6 max-w-sm ml-auto animate-float">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <ShieldCheck size={24} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Sécurité avancée</p>
                    <p className="text-gray-400 text-sm">
                      Protection des données
                    </p>
                  </div>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-linear-to-r from-red-500 to-blue-500 h-2 rounded-full w-3/4" />
                </div>
                <p className="text-right text-xs text-gray-400 mt-1">
                  Efficacité 75%
                </p>
              </div>

              {/* Carte 2 */}
              <div className="glass rounded-2xl p-6 max-w-sm mt-6 ml-12 animate-float animate-delay-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Code size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      Développement sur-mesure
                    </p>
                    <p className="text-gray-400 text-sm">
                      Web & Mobile & Embarqué
                    </p>
                  </div>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-linear-to-r from-blue-500 to-red-500 h-2 rounded-full w-[90%]" />
                </div>
                <p className="text-right text-xs text-gray-400 mt-1">
                  Satisfaction 95%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <a href="#services" aria-label="Scroll to services">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-red-500 rounded-full mt-2 animate-pulse-soft" />
          </div>
        </a>
      </div>
    </section>
  );
}
