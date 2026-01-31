import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Check, Sparkles, Shield, Wrench, Droplet, 
  Disc, Gauge, Settings, ArrowRight, Star, Plus, Car 
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SeoHead from '@/components/SeoHead';

// --- DATA FROM IMAGE ---

// Vehicle Types to switch pricing
const vehicleTypes = [
  { id: 'citadine', label: 'Citadine / Compacte', desc: '2 à 4 places' },
  { id: 'berline', label: 'Berline / Break', desc: '4 à 5 places' },
  { id: 'suv', label: 'SUV / Monospace', desc: '7 places / Grand volume' },
];

const interiorPackages = [
  {
    name: 'Formule Entretien',
    description: 'Lavage sièges, moquettes, tableau de bord (Véhicule peu sale)',
    prices: { citadine: '120', berline: '140', suv: '220' }, // SUV is 'Devis à partir de 220'
    features: ['Aspiration complète habitacle', 'Dépoussiérage tableau de bord', 'Nettoyage vitres intérieures', 'Nettoyage entrées de portes'],
    icon: Droplet,
    highlighted: false,
  },
  {
    name: 'Formule Sale',
    description: 'Nettoyage approfondi pour véhicules du quotidien.',
    prices: { citadine: '140', berline: '160', suv: 'Sur devis' },
    features: ['Tout la formule Entretien', 'Shampoing sièges & moquettes', 'Nettoyage plastiques en profondeur', 'Traitement odeurs léger'],
    icon: Sparkles,
    highlighted: true,
    badge: 'Populaire',
  },
  {
    name: 'Formule Très Sale',
    description: 'Remise à neuf (Poils, tâches tenaces, odeurs, terre...)',
    prices: { citadine: '180', berline: '200', suv: 'Sur devis' },
    features: ['Tout la formule Sale', 'Extraction injecteur/extracteur', 'Traitement poils animaux', 'Désinfection complète', 'Pressing complet'],
    icon: Shield,
    highlighted: false,
  },
];

const exteriorPackages = [
  {
    name: 'Polissage 1 Étape',
    description: 'Correction légère & Brillance complète.',
    prices: { citadine: '280', berline: '330', suv: '380' }, // Estimated SUV based on trends
    features: ['Lavage extérieur manuel', 'Décontamination', 'Polissage finition (supprime voile terne)', 'Protection cire rapide'],
    icon: Sparkles,
    highlighted: false,
  },
  {
    name: 'Polissage 2 Étapes',
    description: 'Correction avancée : suppression des micro-rayures.',
    prices: { citadine: '450', berline: '520', suv: '600' }, // Estimated SUV
    features: ['Lavage & Décontamination', 'Polissage Cut (Correction)', 'Polissage Finition (Brillance)', 'Suppression micro-rayures ~85%'],
    icon: Disc,
    highlighted: true,
    badge: 'Rénovation',
  },
  {
    name: 'Céramique Gyeon',
    description: 'Protection 6-12 mois contre UV, pluies acides & rayures.',
    prices: { citadine: '450', berline: '750', suv: '850' }, // Prices from image (Berline/Break column)
    features: ['Préparation carrosserie complète', 'Pose céramique GYEON Q2', 'Hydrophobie extrême', 'Facilité de lavage', 'Brillance miroir'],
    icon: Shield,
    highlighted: false,
  },
];

const interiorOptions = [
  { name: 'Lessivage Sièges Tissu', price: '+15€', note: 'Extraction injecteur/extracteur', icon: Droplet },
  { name: 'Sièges très tachés / Poils', price: '+20 à 100€', note: 'Par siège, selon état', icon: AlertCircle }, // Using AlertCircle as placeholder
  { name: 'Poils animaux excessifs', price: '+30 à 50€', note: 'Aspirateur turbine, temps passé', icon: Settings },
  { name: 'Désinfection / Odeurs', price: 'Sur devis', note: 'Traitement vapeur ou ozone', icon: Sparkles },
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

import { AlertCircle } from 'lucide-react'; 

const Tarifs = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('citadine');

  return (
    <>
    <SeoHead 
      title="Tarifs Detailing & Nettoyage Auto - Saphir Detailing"
      description="Découvrez nos forfaits : Nettoyage intérieur, Polissage carrosserie et Traitement Céramique. Prix transparents pour Citadine, Berline et SUV en Ariège."
    />

    <div className="bg-[#050505] min-h-screen relative overflow-x-hidden">
      
      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen" />
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"
          style={{
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)'
          }}
        />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-12 relative z-10">
        <div className="container px-4 md:px-6 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6 backdrop-blur-md">
              <Star className="w-3 h-3 fill-primary" />
              <span>Saphir Detailing • Oust 09140</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight leading-tight">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400">Tarifs</span>
            </h1>
            
            <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-2">
              Travail professionnel et minutieux. Pas de compromis sur la qualité.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- VEHICLE SELECTOR --- */}
      <section className="sticky top-20 z-40 py-6 bg-[#050505]/80 backdrop-blur-lg border-y border-white/5">
        <div className="container px-4 md:px-6 flex justify-center">
          <div className="inline-flex bg-[#0f0f0f] p-1.5 rounded-2xl border border-white/10 shadow-2xl">
            {vehicleTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedVehicle(type.id)}
                className={`relative px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex flex-col items-center min-w-[100px] md:min-w-[140px] ${
                  selectedVehicle === type.id 
                    ? 'text-black bg-primary shadow-glow' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="uppercase tracking-wide text-[10px] md:text-xs">{type.label}</span>
                {selectedVehicle === type.id && (
                  <span className="text-[9px] font-medium opacity-80 mt-0.5 hidden md:block">{type.desc}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-3">Sélectionnez votre type de véhicule pour voir les tarifs adaptés</p>
      </section>

      {/* --- SECTION 1: NETTOYAGE INTÉRIEUR --- */}
      <section className="py-20 relative z-10">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
              <Droplet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Nettoyage Intérieur</h2>
              <p className="text-gray-400 text-sm">Formules adaptées à l'état du véhicule</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16 items-stretch">
            {interiorPackages.map((pkg, index) => (
              <PricingCard key={pkg.name} pkg={pkg} selectedVehicle={selectedVehicle} index={index} />
            ))}
          </div>

          {/* Options Intérieur */}
          <div className="mb-20">
             <div className="flex items-center gap-2 mb-6 opacity-80">
                <Plus className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">Options en supplément (Intérieur)</h3>
             </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {interiorOptions.map((option, idx) => (
                <OptionCard key={option.name} option={option} idx={idx} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: POLISSAGE & CÉRAMIQUE --- */}
      <section className="py-20 relative z-10 bg-white/[0.02]">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Polissage & Céramique GYEON</h2>
              <p className="text-gray-400 text-sm">Correction défauts & Protection longue durée</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 to-transparent border-l-4 border-primary">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-primary mt-1" />
              <div>
                <h4 className="text-white font-bold mb-1">Pack Recommandé : Polissage + Céramique</h4>
                <p className="text-sm text-gray-300">Profitez de <span className="text-primary font-bold">-80€ de remise</span> en combinant brillance et protection complète.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {exteriorPackages.map((pkg, index) => (
              <PricingCard key={pkg.name} pkg={pkg} selectedVehicle={selectedVehicle} index={index} isExterior />
            ))}
          </div>
          
          <p className="text-center text-gray-500 text-xs mt-12 italic">
            * Une préparation complète est obligatoire pour la pose de céramique GYEON.
          </p>
        </div>
      </section>

      {/* --- MECHANIC SECTION (Original kept) --- */}
      <section className="py-20 relative border-t border-white/5 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Wrench className="w-6 h-6 text-gray-300" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Mécanique</h2>
              <p className="text-gray-400 text-sm">Entretien & Technique</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {mechanicServices.map((service) => (
              <div key={service.category} className="bg-[#0f0f0f] rounded-2xl border border-white/5 overflow-hidden hover:border-blue-400/30 transition-colors duration-500 group">
                <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <service.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-300 transition-colors" />
                    <h3 className="font-bold text-white text-lg">{service.category}</h3>
                  </div>
                </div>
                <div className="p-2">
                  {service.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 hover:bg-white/5 rounded-xl transition-colors">
                      <div>
                        <div className="text-gray-300 font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-600 mt-0.5">{item.note}</div>
                      </div>
                      <div className="font-mono text-blue-200/80 font-bold text-sm text-right">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
              { q: "Qu'est-ce qu'une décontamination ?", a: "C'est l'étape clé avant un polissage. Elle retire les particules incrustées (goudron, résine, ferreux) que le lavage seul ne peut pas enlever." },
              { q: "Quelle différence entre 'Sale' et 'Très Sale' ?", a: "La formule 'Très Sale' inclut le traitement des poils d'animaux, des tâches tenaces sur les tissus et une désinfection complète. La formule 'Sale' convient à un usage quotidien standard." },
              { q: "Puis-je payer en plusieurs fois ?", a: "Oui, nous acceptons les paiements échelonnés pour les grosses prestations (Céramique, gros detailing)." }
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-[#0f0f0f] border border-white/5 rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors">
                <AccordionTrigger className="text-white hover:text-primary hover:no-underline py-5 text-left font-medium text-sm">{item.q}</AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-5 leading-relaxed text-sm">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
    </>
  );
};

// --- SUB COMPONENTS FOR CLEANER CODE ---

const PricingCard = ({ pkg, selectedVehicle, index, isExterior = false }: any) => {
  const price = pkg.prices[selectedVehicle];
  const isNumber = !isNaN(price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative z-10 flex flex-col ${pkg.highlighted ? 'md:-my-6' : ''}`} 
    >
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
        {pkg.badge && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
            <span className="px-4 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(var(--primary),0.4)] border border-white/10">
              {pkg.badge}
            </span>
          </div>
        )}

        <div className={`flex flex-col h-full ${pkg.highlighted ? 'p-8 pt-10' : 'p-8'}`}>
          
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

          <div className="mb-8 pb-8 border-b border-white/5">
            <div className="flex items-baseline gap-1">
              {isNumber && !price.includes('partir') ? (
                <>
                  <span className="text-4xl md:text-5xl font-bold text-white">{price}</span>
                  <span className="text-2xl text-primary font-bold">€</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-white">{price}</span>
              )}
            </div>
            {isExterior && selectedVehicle !== 'citadine' && isNumber && (
               <div className="text-xs text-primary mt-1 font-medium">À partir de</div>
            )}
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            {pkg.features.map((feature: string) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                <Check className={`w-4 h-4 mt-0.5 shrink-0 ${pkg.highlighted ? 'text-primary' : 'text-gray-600'}`} />
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>

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
  );
};

const OptionCard = ({ option, idx }: any) => (
  <motion.div
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
        <div>
           <span className="font-medium text-gray-200 text-sm block">{option.name}</span>
           <span className="text-[10px] text-gray-500 block">{option.note}</span>
        </div>
      </div>
      <span className="font-bold text-white bg-black/20 px-2 py-1 rounded-md text-xs whitespace-nowrap">{option.price}</span>
    </div>
  </motion.div>
);

export default Tarifs;