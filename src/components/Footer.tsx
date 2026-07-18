import { Code2, Briefcase, MessageCircle, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  services: [
    { label: "Développement Web", href: "#" },
    { label: "Applications Mobiles", href: "#" },
    { label: "Réseaux & Infrastructure", href: "#" },
    { label: "Cybersécurité", href: "#" },
    { label: "Cloud & DevOps", href: "#" },
  ],
  company: [
    { label: "À propos", href: "#apropos" },
    { label: "Projets", href: "#projets" },
    { label: "Blog", href: "#blog" },
    { label: "Carrières", href: "#" },
    { label: "Contact", href: "#contact" },
  ],
  legal: [
    { label: "Mentions légales", href: "#" },
    { label: "Politique de confidentialité", href: "#" },
    { label: "CGV", href: "#" },
    { label: "RGPD", href: "#" },
  ],
};

const socialLinks = [
  { icon: Code2, href: "https://github.com/unixdev38", label: "GitHub" },
  { icon: Briefcase, href: "#", label: "LinkedIn" },
  { icon: MessageCircle, href: "https://wa.me/22658497477", label: "WhatsApp" },
  { icon: Mail, href: "mailto:unixdev38@gmail.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-white/5">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-red-950/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-white/5">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <a href="#accueil" className="inline-flex items-center gap-1">
              <span className="text-red-500 font-bold text-2xl">&lt;/</span>
              <span className="text-white font-bold text-2xl">unixdev</span>
              <span className="text-red-500 font-bold text-2xl">&gt;</span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Unixdev est une entreprise spécialisée dans les solutions
              technologiques sur-mesure : développement web & mobile, réseaux,
              logiciels embarqués et cybersécurité.
            </p>

            {/* Contact infos */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="text-red-500 shrink-0" />
                <span>Abidjan, Côte d'Ivoire</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={16} className="text-red-500 shrink-0" />
                <a href="https://wa.me/22658497477" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">+226 58 49 74 77</a>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={16} className="text-red-500 shrink-0" />
                <a href="mailto:unixdev38@gmail.com" className="hover:text-red-400 transition-colors">unixdev38@gmail.com</a>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center
                    text-gray-400 hover:text-white hover:bg-red-500/20 transition-all duration-200"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-red-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-red-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-red-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Unixdev. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-xs">
            Conçu avec passion par{" "}
            <span className="text-red-400">l'équipe Unixdev</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
