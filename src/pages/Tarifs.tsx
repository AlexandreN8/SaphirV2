import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Check, Sparkles, Shield, Wrench, Droplet, 
  Disc, Gauge, Settings, ArrowRight, Star, Plus, AlertCircle, Clock, Info 
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SeoHead from '@/components/SeoHead';

// --- DATA ---

// 4 TYPES DE VÉHICULES 
const vehicleTypes = [
  { id: 'citadine', label: 'Citadine / Compacte', desc: '2 à 4 places' },
  { id: 'berline', label: 'Berline / Break', desc: '4 à 5 places' },
  { id: 'suv', label: 'SUV / Monospace', desc: '7 places / Grand volume' },
  { id: 'utilitaire', label: 'Utilitaire / 7 Places', desc: 'Gros volumes / Vans' },
];

// DONNÉES INTÉRIEUR 
const interiorPackages = [
  {
    name: 'Intérieur Entretenu',
    description: 'Rafraîchissement pour véhicule sain. Aspiration et poussières.',
    prices: { citadine: '120 à 220', berline: '140', suv: '150', utilitaire: 'Sur Devis' }, 
    duration: { citadine: '3h30 à 5h30', berline: '4h à 6h', suv: '5h à 7h', utilitaire: '8h+' },
    features: ['Aspiration complète habitacle', 'Dépoussiérage plastiques', 'Nettoyage vitres', 'Coffre standard', 'Finitions'],
    icon: Droplet,
    highlighted: false,
  },
  {
    name: 'Intérieur Sale',
    description: 'Nettoyage approfondi. Idéal pour le quotidien ou vente.',
    prices: { citadine: '150 à 170', berline: '170 à 190', suv: '180 à 200', utilitaire: 'Sur Devis' }, 
    duration: { citadine: '5h', berline: '5h30', suv: '6h30', utilitaire: '7h+' },
    features: ['Tout la formule Entretenu', 'Détails plastiques approfondis', 'Aspiration minutieuse', 'Shampoing tapis léger'],
    icon: Sparkles,
    highlighted: true,
    badge: 'Populaire',
  },
  {
    name: 'Très Sale / Insalubre',
    description: 'Remise à neuf totale (Terre, moisissures, gros dégâts).',
    prices: { citadine: '190 à 220', berline: '210 à 240', suv: '220 à 260', utilitaire: 'Sur Devis' }, 
    duration: { citadine: '1 Jour', berline: '1 Jour', suv: '1.5 Jours', utilitaire: '1.5 Jours+' },
    features: ['Formule Sale +', 'Gros dégraissage plastiques', 'Extraction des moquettes', 'Recoin rails de sièges', 'Coffre XXL'],
    icon: Shield,
    highlighted: false,
  },
];

// DONNÉES EXTÉRIEUR 
const exteriorPackages = [
  {
    name: 'Polissage 1 Étape',
    description: 'Correction légère & Brillance. Supprime le voile terne.',
    prices: { citadine: '280 à 300', berline: '330 à 350', suv: '380 à 400', utilitaire: 'Sur Devis' }, 
    duration: '1 Journée (6h-8h)',
    features: ['Lavage minutieux', 'Décontamination chimique/mécanique', 'Polissage finition (Gloss)', 'Protection cire rapide'],
    icon: Sparkles,
    highlighted: false,
  },
  {
    name: 'Polissage 2 Étapes',
    description: 'Correction avancée. Supprime les micro-rayures profondes.',
    prices: { citadine: '450', berline: '520', suv: '600', utilitaire: 'Sur Devis' }, 
    duration: '1.5 à 2 Jours (9h-12h)',
    features: ['Lavage & Décontamination', 'Polissage Cut (Correction)', 'Polissage Finition (Miroir)', 'Finitions manuelles'],
    icon: Disc,
    highlighted: false,
    badge: 'Rénovation',
  },
  {
    name: 'Pack Céramique',
    description: 'Le summum : Polissage + Protection GYEON longue durée.',
    prices: { citadine: '650', berline: '750', suv: '850', utilitaire: 'Sur Devis' }, 
    duration: '3 Jours Complets',
    features: ['Polissage complet inclus', 'Pose Céramique GYEON', 'Protection UV & Acide', 'Hydrophobie extrême', 'Facilité de lavage'],
    icon: Shield,
    highlighted: true,
    badge: 'Recommandé',
  },
];

// OPTIONS 
const interiorOptions = [
  { name: 'Lessivage Sièges Tissu', price: '+60 à 80€', note: 'Injecteur / Extracteur', icon: Droplet },
  { name: 'Sièges très tachés', price: '+80 à 100€', note: 'Traitement spécifique', icon: AlertCircle },
  { name: 'Poils animaux excessifs', price: '+30 à 50€', note: 'Aspiration turbine', icon: Settings },
  { name: 'Désinfection / Odeurs', price: '+30€', note: 'Traitement habitacle', icon: Sparkles },
];

// MÉCANIQUE 
const mechanicServices = [
  {
    category: 'Entretien Courant',
    icon: Droplet,
    items: [
      { name: 'Vidange moteur + filtre', price: '50€', note: 'Main d\'oeuvre (0h45-1h)' },
      { name: 'Filtre à air', price: '12,50€', note: 'Pose (0h15)' },
      { name: 'Filtre habitacle', price: '15€', note: 'Pose (0h20)' },
      { name: 'Filtre carburant', price: '25 à 37€', note: 'Pose (0h30-0h45)' },
      { name: 'Bougies (Essence x4)', price: '25 à 37€', note: 'Pose (0h30-0h45)' },
      { name: 'Accès difficile / Moteur spécifique', price: '50€', note: 'Pose (1h)' },
      { name: 'Préchauffage Diesel', price: '50€ - 75€', note: 'Main d\'oeuvre (1h-1h30)' },
    ],
  },
  {
    category: 'Freinage',
    icon: Disc,
    items: [
      { name: 'Plaquettes (AV ou AR)', price: '50€', note: 'Pose (1h)' },
      { name: 'Nettoyage Etriers', price: '62.50€', note: 'Main d\'oeuvre (1h15)' },
      { name: 'Disques + Plaquettes', price: '75€', note: 'Pose (1h30)' },
      { name: '4 Roues (Disques+Plaq)', price: '125 à 150€', note: 'Pose (2h30-3h)' },
      { name: 'Purge liquide frein', price: '40 à 50€', note: 'Main d\'oeuvre (0h45-1h)' },
    ],
  },
  {
    category: 'Suspension / Direction',
    icon: Settings,
    items: [
      { name: 'Amortisseur (l\'unité)', price: '50€', note: 'Pose (1h)' },
      { name: 'Train avant complet', price: '100 à 125€', note: 'Pose (2h-2h30)' },
      { name: 'Train arrière complet', price: '75 à 100€', note: 'Pose (1h30-2h)' },
      { name: 'Biellettes barre stab', price: '50€', note: 'La paire (1h)' },
    ],
  },
  {
    category: 'Élec & Diag',
    icon: Gauge,
    items: [
      { name: 'Diagnostic Valise', price: '25 à 50€', note: 'Lecture défauts (30min)' },
      { name: 'Recherche panne simple', price: '50€', note: 'Forfait 1h' },
      { name: 'Changement Batterie', price: '25€', note: 'Pose (30min)' },
      { name: 'Alternateur / Démarreur', price: '75 à 100€', note: 'Pose (1h30-2h)' },
    ],
  },
];

const Tarifs = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('citadine');

  return (
    <>
    <SeoHead 
      title="Tarifs Detailing & Nettoyage Auto - Saphir Detailing"
      description="Découvrez nos forfaits : Nettoyage intérieur, Polissage carrosserie et Traitement Céramique. Prix transparents pour Citadine, Berline, SUV et Utilitaire en Ariège."
      canonicalUrl="https://www.saphirdetailing.fr/tarifs"
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
            
            <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-2">
              Une tarification transparente et adaptée. <br/>
              <span className="text-primary font-medium opacity-90 text-sm md:text-base">* Tous les tarifs sont indicatifs et confirmés sur place selon l'état du véhicule.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- VEHICLE SELECTOR --- */}
      <section className="sticky top-20 z-20 py-6 bg-[#050505]/90 backdrop-blur-xl border-y border-white/5 shadow-2xl">
        <div className="container px-4 md:px-6 flex justify-center overflow-x-auto no-scrollbar">
          <div className="inline-flex bg-[#0f0f0f] p-1.5 rounded-2xl border border-white/10 shadow-2xl">
            {vehicleTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedVehicle(type.id)}
                className={`relative px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex flex-col items-center min-w-[100px] md:min-w-[130px] whitespace-nowrap ${
                  selectedVehicle === type.id 
                    ? 'text-black bg-primary shadow-glow' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
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
        <p className="text-center text-xs text-gray-400 mt-3 font-medium">Sélectionnez votre type de véhicule</p>
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
              <p className="text-gray-300 text-sm flex items-center gap-2">
                <Info className="w-3 h-3" />
                Tarifs de départ, ajustables selon l'état réel (poils, terre, moisissures).
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16 items-stretch">
            {interiorPackages.map((pkg, index) => (
              <PricingCard key={pkg.name} pkg={pkg} selectedVehicle={selectedVehicle} index={index} />
            ))}
          </div>

          {/* Options Intérieur */}
          <div className="mb-20">
             <div className="flex items-center gap-2 mb-6 opacity-90">
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
      <section className="py-20 relative z-10 bg-white/[0.03]">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Polissage & Céramique GYEON</h2>
              <p className="text-gray-300 text-sm">Rénovation Carrosserie & Protection</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 to-transparent border-l-4 border-primary shadow-lg">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-primary mt-1" />
              <div>
                <h4 className="text-white font-bold mb-1 text-lg">Pourquoi choisir le Pack Céramique ?</h4>
                <p className="text-sm text-gray-200">C'est notre formule recommandée. Elle inclut <span className="text-white font-bold">2 à 3 jours de travail</span> : lavage, correction complète des défauts et la pose de la protection céramique GYEON.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {exteriorPackages.map((pkg, index) => (
              <PricingCard key={pkg.name} pkg={pkg} selectedVehicle={selectedVehicle} index={index} isExterior />
            ))}
          </div>
        </div>
      </section>

      {/* --- MECHANIC SECTION --- */}
      <section className="py-20 relative border-t border-white/10 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Wrench className="w-6 h-6 text-gray-200" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Mécanique Générale</h2>
              <p className="text-gray-300 text-sm">Tarifs Main d'oeuvre & Forfaits (Hors pièces spécifiques)</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {mechanicServices.map((service) => (
              <div key={service.category} className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden hover:border-blue-400/40 transition-colors duration-500 group">
                <div className="p-5 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <service.icon className="w-5 h-5 text-gray-400 group-hover:text-blue-300 transition-colors" />
                    <h3 className="font-bold text-white text-lg">{service.category}</h3>
                  </div>
                </div>
                <div className="p-2">
                  {service.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 hover:bg-white/5 rounded-xl transition-colors">
                      <div>
                        <div className="text-gray-200 font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.note}</div>
                      </div>
                      <div className="font-mono text-blue-200 font-bold text-sm text-right whitespace-nowrap">
                        {item.price.includes('-') || item.price.includes('à') 
                          ? `Dès ${item.price.split(/[-à]/)[0].trim()}` 
                          : item.price}
                      </div>
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
              { q: "Pourquoi les tarifs sont 'À partir de' ?", a: "Chaque véhicule est unique. Un intérieur très encrassé (poils d'animaux, moisissures) ou une carrosserie très rayée demande plus de temps et de produits. Le prix définitif est validé ensemble devant le véhicule." },
              { q: "Combien de temps dure la céramique ?", a: "Nous utilisons la céramique GYEON qui offre une protection durable entre 6 et 12 mois selon l'entretien et le stockage du véhicule." }
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-[#111] border border-white/10 rounded-xl px-6 data-[state=open]:border-primary/40 transition-colors">
                <AccordionTrigger className="text-white hover:text-primary hover:no-underline py-5 text-left font-medium text-sm">{item.q}</AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-5 leading-relaxed text-sm">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
    </>
  );
};

// --- SUB COMPONENTS ---

const PricingCard = ({ pkg, selectedVehicle, index, isExterior = false }: any) => {
  const rawPrice = pkg.prices[selectedVehicle];
  const duration = typeof pkg.duration === 'string' ? pkg.duration : pkg.duration[selectedVehicle];
  
  // LOGIQUE "COMMERCIALE" :
  const isRange = rawPrice.includes('à') || rawPrice.includes('-');
  const isDevis = rawPrice.toLowerCase().includes('devis');
  
  const match = rawPrice.match(/\d+/); 
  const basePrice = match ? match[0] : rawPrice; 
  
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
          ? 'bg-[#151515] border-2 border-primary shadow-2xl z-20' 
          : 'bg-[#111] border border-white/10 hover:border-white/20'
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
              pkg.highlighted ? 'bg-primary text-white' : 'bg-white/5 text-gray-300'
            }`}>
              <pkg.icon className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white">{pkg.name}</h3>
            <p className="text-sm text-gray-300 mt-2 leading-relaxed min-h-[40px]">
              {pkg.description}
            </p>
          </div>

          <div className="mb-4 pb-6 border-b border-white/10">
            <div className="flex flex-col items-start">
              {!isDevis && (
                <span className="text-xs text-primary font-bold uppercase tracking-wider mb-1">
                  {isRange ? 'À partir de' : 'Tarif Fixe'}
                </span>
              )}

              <div className="flex items-baseline gap-1">
                {isDevis ? (
                  <span className="text-2xl font-bold text-white uppercase">{rawPrice}</span>
                ) : (
                  <>
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      {basePrice}
                    </span>
                    <span className="text-2xl text-primary font-bold">€</span>
                    <span className="text-lg text-gray-500 font-normal self-start -mt-1 ml-1" title="Prix indicatif selon état">*</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-3 text-xs font-medium text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg w-fit">
              <Clock className="w-3 h-3" />
              <span>Durée : {duration}</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            {pkg.features.map((feature: string) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-gray-200">
                <Check className={`w-4 h-4 mt-0.5 shrink-0 ${pkg.highlighted ? 'text-primary' : 'text-gray-500'}`} />
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
              Réserver ce forfait
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
    className="group relative overflow-hidden rounded-xl bg-[#111] border border-white/10 p-5 hover:border-primary/50 hover:bg-white/5 transition-all duration-300"
  >
    <div className="flex items-center justify-between relative z-10">
      <div className="flex items-center gap-3">
        <div className="text-gray-400 group-hover:text-primary transition-colors">
          <option.icon className="w-5 h-5" />
        </div>
        <div>
           <span className="font-medium text-gray-200 text-sm block">{option.name}</span>
           <span className="text-[12px] text-gray-400 block">{option.note}</span>
        </div>
      </div>
      <div className="text-right">
        <span className="font-bold text-white bg-white/10 px-2 py-1 rounded-md text-xs whitespace-nowrap block">
           {option.price}
        </span>
      </div>
    </div>
  </motion.div>
);

export default Tarifs;