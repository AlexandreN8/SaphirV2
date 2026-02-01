import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';
import logo from '@/assets/logo.png';

// --- ICÔNES PERSONNALISÉES (TikTok & Snapchat) ---
const TiktokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.84-3.11 6.15-2.12 1.35-4.75 1.57-7.05.67-2.33-.95-3.8-3.32-3.8-5.83 0-2.89 1.83-5.38 4.63-6.16v4.07c-1.45.27-2.35 1.74-2.07 3.16.2 1.05 1.12 1.85 2.18 1.9.96.06 1.88-.42 2.45-1.19.65-.92.55-2.16.55-3.23V.02h2.14z"/>
  </svg>
);

const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.08 1.8c-3.6 0-6.17 2.44-6.17 5.25 0 1.67.92 3.17 2.14 4.09-.16.85-.75 2.05-1.78 2.51-.55.24-1.24.16-1.57-.38-.38-.63-1.41-.3-1.62.43-.16.57.17.97.58 1.25.79.54 2.18.67 3.24.03.49-.3.94-.92 1.48-1.13.7.83 1.82 1.21 2.91 1.25.29.35.59.81.59 1.26 0 .5-.38.82-.91.95-.91.22-2.15-.12-3.18-.32-1.02-.2-1.89.28-1.89 1.3 0 .7.49 1.18 1.02 1.43 1.83.84 4.07.82 5.16.82 1.1 0 3.32.02 5.16-.82.53-.25 1.02-.73 1.02-1.43 0-1.03-.87-1.5-1.89-1.3-1.03.2-2.27.54-3.18.32-.53-.13-.91-.45-.91-.95 0-.45.3-.91.59-1.26 1.09-.04 2.21-.42 2.91-1.25.54.21.99.83 1.48 1.13 1.06.64 2.45.51 3.24-.03.41-.28.74-.68.58-1.25-.21-.73-1.24-1.06-1.62-.43-.33.54-1.02.62-1.57.38-1.03-.46-1.62-1.66-1.78-2.51 1.22-.92 2.14-2.42 2.14-4.09 0-2.81-2.57-5.25-6.17-5.25z"/>
  </svg>
);

export const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 bg-[#050505]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <img
                    src={logo}
                    alt="Detailing automobile professionnel"
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-xl font-bold tracking-tight text-white">
                    SAPHIR DETAILING
                  </span>
                  <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">
                    Detailing & Mécanique
                  </span>
                </div>
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed">
                L'excellence automobile au service de votre véhicule. 
                Detailing premium et mécanique légère de précision.
              </p>
              
              {/* RESEAUX SOCIAUX */}
              <div className="flex gap-3">
                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/saphir_detailing09/?utm_source=ig_web_button_share_sheet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all text-gray-400"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>

                {/* Facebook */}
                <a 
                  href="https://www.facebook.com/profile.php?id=61581544058425" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all text-gray-400"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>

                {/* TikTok */}
                <a 
                  href="https://www.tiktok.com/@saphir_detailing?_r=1&_t=ZN-93XexnhUHMU" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all text-gray-400"
                  aria-label="TikTok"
                >
                  <TiktokIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-display font-semibold mb-6 text-white">Navigation</h4>
              <ul className="space-y-3">
                {[
                  { href: '/', label: 'Accueil' },
                  { href: '/tarifs', label: 'Prestations & Tarifs' },
                  { href: '/realisations', label: 'Réalisations' },
                  { href: '/reservation', label: 'Réservation' },
                  { href: '/contact', label: 'Contact' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-display font-semibold mb-6 text-white">Services</h4>
              <ul className="space-y-3">
                {[
                  'Lavage Premium',
                  'Correction Peinture',
                  'Protection Céramique',
                  'Nettoyage Intérieur',
                  'Vidange & Entretien',
                  'Freinage',
                ].map((service) => (
                  <li key={service}>
                    <span className="text-sm text-gray-400">
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-semibold mb-6 text-white">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400">
                    295 route d'Aulus<br />
                    09140 Oust, France
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a href="tel:+33668840627" className="text-sm text-gray-400 hover:text-primary transition-colors">
                    06 68 84 06 27
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a href="mailto:contact@saphirdetailing.fr" className="text-sm text-gray-400 hover:text-primary transition-colors">
                    contact@saphirdetailing.fr
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400">
                    Lundi au Vendredi:<br />
                    09h00 - 12h00<br />
                    14h00 - 18h00<br />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Saphir Detailing. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link to="/mentions-legales" className="text-gray-500 hover:text-primary transition-colors text-sm">
              Mentions Légales
            </Link>
            <Link to="/cgv" className="text-gray-500 hover:text-primary transition-colors text-sm">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};