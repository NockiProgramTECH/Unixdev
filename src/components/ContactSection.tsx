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
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-950/5 to-transparent" />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-soft" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center space-y-4 mb-16">
          <span className="inline-block glass rounded-full px-4 py-1.5 text-xs font-medium text-gray-300 tracking-wide">
            CONTACT
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Parlons de votre{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-red-500">
              projet
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Vous avez un projet en tête ? Une idée à concrétiser ?
            N'hésitez pas à me contacter. Je suis disponible pour échanger
            sur vos besoins.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* --- INFOS DE CONTACT RAPIDE --- */}
          <div className="space-y-8">
            <div className="glass rounded-2xl p-8 space-y-6">
              <h3 className="text-xl font-semibold text-white">
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
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-green-500/10 border border-white/10 hover:border-green-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone size={22} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">WhatsApp</p>
                  <p className="text-gray-400 text-sm">+226 58 49 74 77</p>
                </div>
                <span className="ml-auto text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                  Disponible
                </span>
              </a>

              {/* Email */}
              <a
                href="mailto:unixdev38@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail size={22} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-gray-400 text-sm">unixdev38@gmail.com</p>
                </div>
                <span className="ml-auto text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                  Envoyer
                </span>
              </a>
            </div>

            {/* Carte d'information supplémentaire */}
            <div className="glass rounded-2xl p-8 text-center space-y-4">
              <p className="text-gray-400 text-sm">
                Je réponds généralement sous{" "}
                <span className="text-white font-medium">24 à 48 heures</span>
              </p>
              <div className="flex justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-500">Disponible pour de nouveaux projets</span>
              </div>
            </div>
          </div>

          {/* --- FORMULAIRE DE CONTACT --- */}
          <div className="glass rounded-2xl p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check size={32} className="text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Message envoyé !
                </h3>
                <p className="text-gray-400 text-sm max-w-sm">
                  Merci pour votre message. Je vous répondrai dans les plus
                  brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Envoyez-moi un message
                </h3>

                {/* Nom */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
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
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white
                      placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1
                      focus:ring-red-500/20 transition-all duration-200"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
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
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white
                      placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1
                      focus:ring-red-500/20 transition-all duration-200"
                  />
                </div>

                {/* Sujet */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Sujet
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white
                      focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20
                      transition-all duration-200"
                  >
                    <option value="" disabled className="bg-[#0a0a1a]">
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
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre projet ou votre besoin..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white
                      placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1
                      focus:ring-red-500/20 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Bouton d'envoi */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn bg-linear-to-r from-blue-500 to-red-500 hover:from-blue-600
                    hover:to-red-600 text-white border-none rounded-xl py-3 h-auto font-medium
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
