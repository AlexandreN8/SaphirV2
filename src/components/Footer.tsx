import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';
import logo from '@/assets/logo.png';

export const Footer = () => {
  return (
    <footer className="relative border-t border-white/10">
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
                    className=" h-12 w-auto object-contain "
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-xl font-bold tracking-tight">
                    SAPHIR DETAILING
                  </span>
                  <span className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                    Detailing & Mécanique
                  </span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                L'excellence automobile au service de votre véhicule. 
                Detailing premium et mécanique légère de précision.
              </p>
              <div className="flex gap-4">
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-display font-semibold mb-6">Navigation</h4>
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
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-display font-semibold mb-6">Services</h4>
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
                    <span className="text-sm text-muted-foreground">
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-semibold mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    123 Avenue de l'Excellence<br />
                    75008 Paris, France
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a href="tel:+33123456789" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    +33 1 23 45 67 89
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a href="mailto:contact@prestige-detailing.fr" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    contact@prestige-detailing.fr
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Lundi au Vendredi:<br />
                    09h00 - 12h00 <br/>
                    14h00 - 18h00
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Prestige Detailing & Mécanique. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link to="/mentions-legales" className="text-gray-500 hover:text-primary transition-colors">
              Mentions Légales
            </Link>
            <Link to="/cgv" className="text-gray-500 hover:text-primary transition-colors">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
