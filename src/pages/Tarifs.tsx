import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Check, Sparkles, Crown, Shield, Wrench, Droplet, 
  Disc, Gauge, Settings, ArrowRight, Star, Plus 
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// --- DATA ---
const detailingPackages = [
  {
    name: 'Pack Essentiel',
    price: '89',
    duration: '2-3h',
    description: 'Le nettoyage premium pour entretenir régulièrement votre véhicule.',
    features: ['Lavage extérieur haute pression', 'Nettoyage jantes & pneus', 'Aspiration intérieure', 'Nettoyage vitres int/ext', 'Dépoussiérage tableau de bord'],
    highlighted: false,
    icon: Droplet,
  },
  {
    name: 'Pack Rénovation',
    price: '249',
    duration: '1 journée',
    description: 'Restauration complète pour redonner vie à votre véhicule.',
    features: ['Tout le Pack Essentiel', 'Décontamination clay bar', 'Polissage 1 étape', 'Shampoing sièges & moquettes', 'Traitement plastiques', 'Protection cire 3 mois'],
    highlighted: true,
    badge: 'Recommandé',
    icon: Sparkles,
  },
  {
    name: 'Pack Céramique',
    price: '599',
    duration: '2-3 jours',
    description: 'Protection ultime avec revêtement céramique professionnel.',
    features: ['Tout le Pack Rénovation', 'Polissage correction 2 étapes', 'Protection céramique 9H', 'Traitement vitres hydrophobe', 'Traitement cuir premium', 'Protection 3-5 ans garantie'],
    highlighted: false,
    icon: Shield,
  },
];

const additionalOptions = [
  { name: 'Rénovation phares', price: '79', icon: Crown },
  { name: 'Traitement cuir complet', price: '149', icon: Sparkles },
  { name: 'Traitement anti-odeur ozone', price: '49', icon: Settings },
  { name: 'Polissage jantes céramique', price: '99', icon: Disc },
];

const mechanicServices = [
  {
    category: 'Vidange & Filtres',
    icon: Droplet,
    items: [
      { name: 'Vidange huile + filtre', price: 'À partir de 79€', note: 'Huile 5W30/5W40 incluse' },
      { name: 'Filtre à air', price: '35€', note: 'Pose incluse' },
      { name: 'Filtre habitacle', price: '45€', note: 'Avec désinfection' },
      { name: 'Kit distribution', price: 'Sur devis', note: 'Selon motorisation' },
    ],
  },
  {
    category: 'Freinage',
    icon: Disc,
    items: [
      { name: 'Plaquettes avant', price: 'À partir de 89€', note: 'Pièces qualité origine' },
      { name: 'Plaquettes arrière', price: 'À partir de 79€', note: 'Pièces qualité origine' },
      { name: 'Disques + plaquettes AV', price: 'À partir de 189€', note: 'Kit complet' },
      { name: 'Liquide de frein', price: '59€', note: 'Purge complète' },
    ],
  },
  {
    category: 'Pneumatiques',
    icon: Gauge,
    items: [
      { name: 'Montage équilibrage /pneu', price: '18€', note: 'Jante alu ou tôle' },
      { name: 'Géométrie train avant', price: '89€', note: 'Rapport détaillé' },
      { name: 'Géométrie complète', price: '149€', note: '4 roues' },
      { name: 'Permutation pneus', price: '25€', note: 'Contrôle usure inclus' },
    ],
  },
  {
    category: 'Entretien Courant',
    icon: Settings,
    items: [
      { name: 'Diagnostic électronique', price: '49€', note: 'Lecture défauts' },
      { name: 'Batterie (pose)', price: '29€', note: 'Hors prix batterie' },
      { name: 'Ampoules / LED', price: 'Dès 15€', note: 'Selon type' },
      { name: 'Balais essuie-glace', price: 'Dès 35€', note: 'Qualité premium' },
    ],
  },
];

const Tarifs = () => {
  return (
    <div className="bg-[#050505] min-h-screen relative overflow-x-hidden">
      
      {/* --- BACKGROUND ATMOSPHERE (Corrected & Subtler) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        
        {/* 1. Gradient Orbs (Landing Page Style) */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen" />

        {/* 2. Grid Technique (Fade Out progressive) */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"
          style={{
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)'
          }}
        />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 relative z-10">
        <div className="container px-4 md:px-6 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6 backdrop-blur-md">
              <Star className="w-3 h-3 fill-primary" />
              <span>Tarifs Transparents & Formules Sur-Mesure</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
              Prestations & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400">
                Tarifs
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Des formules claires, sans surprise. Choisissez l'excellence pour votre véhicule.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- DETAILING SECTION --- */}
      <section className="py-10 relative z-10">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Detailing</h2>
              <p className="text-gray-400 text-sm">Esthétique & Protection</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-24 items-stretch">
            {detailingPackages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative z-10 flex flex-col ${
                  pkg.highlighted 
                    ? 'md:-my-6' 
                    : '' 
                }`} 
              >
                {/* Glow Effect pour le Highlighted */}
                {pkg.highlighted && (
                  <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 rounded-full opacity-40 translate-y-10" />
                )}

                <div className={`
                  relative h-full flex flex-col rounded-3xl overflow-visible transition-all duration-300
                  ${pkg.highlighted 
                    ? 'bg-[#121212] border-2 border-primary shadow-2xl z-20' 
                    : 'bg-[#0f0f0f] border border-white/10 hover:border-white/20'
                  }
                `}>
                  
                  {/* BADGE RECOMMANDÉ */}
                  {pkg.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
                      <span className="px-4 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(var(--primary),0.4)] border border-white/10">
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  {/* Padding ajusté  */}
                  <div className={`flex flex-col h-full ${pkg.highlighted ? 'p-8 pt-10' : 'p-8'}`}>
                    
                    {/* Header */}
                    <div className="mb-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                        pkg.highlighted ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'
                      }`}>
                        <pkg.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-white">{pkg.name}</h3>
                      <p className="text-sm text-gray-400 mt-2 leading-relaxed min-h-[40px]">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Prix */}
                    <div className="mb-8 pb-8 border-b border-white/5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl md:text-5xl font-bold text-white">{pkg.price}</span>
                        <span className="text-2xl text-primary font-bold">€</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-mono uppercase tracking-wide">
                        <div className="w-2 h-2 rounded-full bg-gray-600" />
                        Durée : {pkg.duration}
                      </div>
                    </div>

                    {/* Features  */}
                    <ul className="space-y-4 mb-8 flex-1">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                          <Check className={`w-4 h-4 mt-0.5 shrink-0 ${pkg.highlighted ? 'text-primary' : 'text-gray-600'}`} />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Button */}
                    <div className="mt-auto">
                      <Link
                        to="/reservation"
                        className={`w-full py-4 rounded-xl font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                          pkg.highlighted
                            ? 'bg-primary text-white hover:bg-primary/90 shadow-lg'
                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        Réserver
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Options "À la carte" */}
          <div className="mb-20">
             <div className="flex items-center gap-2 mb-6 opacity-80">
                <Plus className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">Options à la carte</h3>
             </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {additionalOptions.map((option, idx) => (
                <motion.div
                  key={option.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-5 hover:border-primary/50 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 group-hover:text-primary transition-colors">
                        <option.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-200 text-sm">{option.name}</span>
                    </div>
                    <span className="font-bold text-white bg-black/20 px-2 py-1 rounded-md text-sm">{option.price}€</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- MECHANIC SECTION (Revu : Palette Argent/Bleu) --- */}
      <section className="py-20 relative border-t border-white/5 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4 mb-12">
            {/* Icône Méca : Gris/Blanc (Chrome) au lieu de Orange */}
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Wrench className="w-6 h-6 text-gray-300" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Mécanique</h2>
              <p className="text-gray-400 text-sm">Entretien & Technique</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {mechanicServices.map((service, index) => (
              <motion.div
                key={service.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[#0f0f0f] rounded-2xl border border-white/5 overflow-hidden hover:border-blue-400/30 transition-colors duration-500 group"
              >
                <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Icône change au survol vers le bleu léger */}
                    <service.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-300 transition-colors" />
                    <h3 className="font-bold text-white text-lg">{service.category}</h3>
                  </div>
                </div>

                <div className="p-2">
                  {service.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 hover:bg-white/5 rounded-xl transition-colors group/item">
                      <div>
                        <div className="text-gray-300 font-medium text-sm group-hover/item:text-white transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">{item.note}</div>
                      </div>
                      <div className="text-right">
                        {/* Prix en bleu clair discret pour rester dans la palette */}
                        <div className="font-mono text-blue-200/80 font-bold text-sm">{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-white transition-all"
            >
              Demander un devis spécifique
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-20 relative z-10">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-white mb-4">Questions Fréquentes</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {[
              { q: "Combien de temps dure une prestation ?", a: "La durée varie selon le pack : 2-3h pour l'Essentiel, 1 jour pour la Rénovation, et jusqu'à 3 jours pour la Céramique." },
              { q: "Quelle différence entre cire et céramique ?", a: "La cire offre une brillance de 3 mois. La céramique est une couche de verre liquide qui protège physiquement la peinture pendant 3 à 5 ans." },
              { q: "Dois-je préparer mon véhicule ?", a: "Non, nous nous occupons de tout. Pensez juste à retirer vos effets personnels de valeur." },
              { q: "Moyens de paiement ?", a: "CB, Espèces, Virement. Paiement en plusieurs fois possible pour les gros montants." }
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-[#0f0f0f] border border-white/5 rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors">
                <AccordionTrigger className="text-white hover:text-primary hover:no-underline py-5 text-left font-medium text-sm">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-5 leading-relaxed text-sm">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default Tarifs;