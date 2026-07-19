import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { supabase } from "../lib/supabase";

const navLinks = [
  { label: "Accueil", href: "/", active: true },
  { label: "Services", href: "/#services" },
  { label: "Boutique", href: "/projects" },
  { label: "À propos", href: "/#apropos" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href.startsWith("/#")) {
      return location.pathname === "/" && location.hash === href.substring(1);
    }
    return location.pathname === href;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 group">
            <span className="text-red-500 font-bold text-2xl">&lt;/</span>
            <span className="text-white font-bold text-2xl group-hover:text-red-400 transition-colors">
              unixdev
            </span>
            <span className="text-red-500 font-bold text-2xl">&gt;</span>
          </Link>

          {/* Desktop menu */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                    isActive(link.href)
                      ? "text-red-500"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {/* Auth / Dashboard links */}
            {user ? (
              <li>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                    isActive("/dashboard") ? "text-red-500" : "text-gray-300 hover:text-white"
                  }`}
                >
                  Mon espace
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  to="/auth"
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                    isActive("/auth") ? "text-red-500" : "text-gray-300 hover:text-white"
                  }`}
                >
                  Connexion
                </Link>
              </li>
            )}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Link
              to="/#contact"
              className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none rounded-full px-6 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
            >
              Nous contacter
            </Link>
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
                  <Link
                    to={link.href}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-red-500 bg-red-500/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Mobile auth */}
              {user ? (
                <li>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5"
                    onClick={() => setIsOpen(false)}
                  >
                    Mon espace
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    to="/auth"
                    className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5"
                    onClick={() => setIsOpen(false)}
                  >
                    Connexion
                  </Link>
                </li>
              )}
              <li className="px-4 pt-2">
                <Link
                  to="/#contact"
                  className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none rounded-full w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
