import { useState } from "react";
import { Send, Phone, Mail, Check, Loader2 } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://formsubmit.co/ajax/unixdev38@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch {
      // Fallback : ouvre le client mail
      const mailto = `mailto:unixdev38@gmail.com?subject=${encodeURIComponent(
        formData.subject || "Demande de contact"
      )}&body=${encodeURIComponent(
        `Nom : ${formData.name}\nEmail : ${formData.email}\n\nMessage :\n${formData.message}`
      )}`;
      window.location.href = mailto;
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-950/5 to-transparent" />

      {/* Blobs décoratifs - cachés sur mobile pour éviter les débordements */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse-soft hidden sm:block" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-soft hidden sm:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 lg:mb-16">
          <span className="inline-block glass rounded-full px-3 sm:px-4 py-1.5 text-xs font-medium text-gray-300 tracking-wide">
            CONTACT
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white px-2">
            Parlons de votre{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-red-500">
              projet
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto px-2">
            Vous avez un projet en tête ? Une idée à concrétiser ?
            N'hésitez pas à me contacter. Je suis disponible pour échanger
            sur vos besoins.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* --- INFOS DE CONTACT RAPIDE --- */}
          <div className="space-y-6 sm:space-y-8">
            <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Contactez-moi directement
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Que ce soit pour un projet, une collaboration ou simplement
                pour échanger, je suis à votre écoute.
              </p>

              {/* WhatsApp */}
              <a
                href="https://wa.me/22658497477"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-green-500/10 border border-white/10 hover:border-green-500/30 transition-all duration-300 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone size={20} className="text-green-400 sm:w-[22px] sm:h-[22px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-sm sm:text-base">WhatsApp</p>
                  <p className="text-gray-400 text-xs sm:text-sm truncate">+226 58 49 74 77</p>
                </div>
                <span className="hidden sm:inline ml-auto text-xs text-green-400 bg-green-500/10 px-2 sm:px-3 py-1 rounded-full shrink-0">
                  Disponible
                </span>
              </a>

              {/* Email */}
              <a
                href="mailto:unixdev38@gmail.com"
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail size={20} className="text-blue-400 sm:w-[22px] sm:h-[22px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-sm sm:text-base">Email</p>
                  <p className="text-gray-400 text-xs sm:text-sm truncate">unixdev38@gmail.com</p>
                </div>
                <span className="hidden sm:inline ml-auto text-xs text-blue-400 bg-blue-500/10 px-2 sm:px-3 py-1 rounded-full shrink-0">
                  Envoyer
                </span>
              </a>
            </div>

            {/* Carte d'information supplémentaire */}
            <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 text-center space-y-3 sm:space-y-4">
              <p className="text-gray-400 text-xs sm:text-sm">
                Je réponds généralement sous{" "}
                <span className="text-white font-medium">24 à 48 heures</span>
              </p>
              <div className="flex justify-center items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                <span className="text-xs text-gray-500">Disponible pour de nouveaux projets</span>
              </div>
            </div>
          </div>

          {/* --- FORMULAIRE DE CONTACT --- */}
          <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 sm:py-16 space-y-4 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check size={28} className="text-green-400 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  Message envoyé !
                </h3>
                <p className="text-gray-400 text-sm max-w-sm px-2">
                  Merci pour votre message. Je vous répondrai dans les plus
                  brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                  Envoyez-moi un message
                </h3>

                {/* Nom */}
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-1.5">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                      placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1
                      focus:ring-red-500/20 transition-all duration-200"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                      placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1
                      focus:ring-red-500/20 transition-all duration-200"
                  />
                </div>

                {/* Sujet */}
                <div>
                  <label htmlFor="subject" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-1.5">
                    Sujet
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                      focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20
                      transition-all duration-200 appearance-none
                      bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20d%3D%22M4.5%206.5L8%2010l3.5-3.5%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-10"
                  >
                    <option value="" disabled className="bg-[#0a0a1a] text-gray-400">
                      Choisissez un sujet
                    </option>
                    <option value="Developpement Web" className="bg-[#0a0a1a]">
                      Développement Web
                    </option>
                    <option value="Application Mobile" className="bg-[#0a0a1a]">
                      Application Mobile
                    </option>
                    <option value="Reseaux & Infrastructure" className="bg-[#0a0a1a]">
                      Réseaux & Infrastructure
                    </option>
                    <option value="Cybersecurite" className="bg-[#0a0a1a]">
                      Cybersécurité
                    </option>
                    <option value="Cloud & DevOps" className="bg-[#0a0a1a]">
                      Cloud & DevOps
                    </option>
                    <option value="Autre" className="bg-[#0a0a1a]">
                      Autre
                    </option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre projet ou votre besoin..."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                      placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1
                      focus:ring-red-500/20 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Bouton d'envoi */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn bg-linear-to-r from-blue-500 to-red-500 hover:from-blue-600
                    hover:to-red-600 text-white border-none rounded-xl py-2.5 sm:py-3 h-auto font-medium text-sm sm:text-base
                    transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25
                    disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Envoi en cours...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send size={18} />
                      Envoyer le message
                    </span>
                  )}
                </button>

                <p className="text-center text-xs text-gray-500">
                  ou envoyez directement un email à{" "}
                  <a
                    href="mailto:unixdev38@gmail.com"
                    className="text-red-400 hover:text-red-300 underline"
                  >
                    unixdev38@gmail.com
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
