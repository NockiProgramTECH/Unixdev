import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Accueil", href: "#accueil", active: true },
  { label: "Services", href: "#services" },
  { label: "Projets", href: "#projets" },
  { label: "À propos", href: "#apropos" },
  { label: "Boutique", href: "#boutique" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#accueil" className="flex items-center gap-1 group">
            <span className="text-red-500 font-bold text-2xl">&lt;/</span>
            <span className="text-white font-bold text-2xl group-hover:text-red-400 transition-colors">
              unixdev
            </span>
            <span className="text-red-500 font-bold text-2xl">&gt;</span>
          </a>

          {/* Desktop menu */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                    link.active
                      ? "text-red-500"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <a
              href="#contact"
              className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none rounded-full px-6 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
            >
              Nous contacter
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden btn btn-ghost btn-square text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 animate-fade-up">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      link.active
                        ? "text-red-500 bg-red-500/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="px-4 pt-2">
                <a
                  href="#contact"
                  className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none rounded-full w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Nous contacter
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
