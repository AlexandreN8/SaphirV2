import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import SeoHead from '@/components/SeoHead';
import { Turnstile } from '@marsidev/react-turnstile';

import {
  CarFront, Truck, Car, ChevronRight, ChevronLeft, Calendar as CalendarIcon,
  Check, Sparkles, Shield, Droplet, Wrench, Disc, Settings, User,
  ArrowRight, Zap, Wind, Filter, Activity, Search, Battery, Phone
} from 'lucide-react';

// --- DONNÉES ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
const PHONE_NUMBER = "06 68 84 06 27";
const PHONE_HREF = "tel:+33668840627";

// 1. VÉHICULES
const vehicleTypes = [
  { id: 'citadine', name: 'Citadine / Compacte', description: '2 à 4 places (ex: Clio, 208, Golf)', icon: CarFront },
  { id: 'berline', name: 'Berline / Break', description: '4 à 5 places (ex: Serie 3, Passat, A4)', icon: Car },
  { id: 'suv', name: 'SUV / Monospace', description: '7 places / Grand volume (ex: X5, Q7)', icon: Car },
  { id: 'utilitaire', name: 'Utilitaire / Van', description: 'Gros volumes (ex: Trafic, Vito, V-Class)', icon: Truck },
];

// 2. MATRICE DE PRIX
const pricingMatrix: { [key: string]: { [key: string]: number } } = {
  'interieur_entretenu': { citadine: 120, berline: 140, suv: 150, utilitaire: 220 },
  'interieur_sale': { citadine: 150, berline: 170, suv: 180, utilitaire: 0 },
  'interieur_tres_sale': { citadine: 190, berline: 210, suv: 220, utilitaire: 0 },
  'polissage_1': { citadine: 280, berline: 330, suv: 380, utilitaire: 0 },
  'polissage_2': { citadine: 450, berline: 520, suv: 600, utilitaire: 0 },
  'ceramique_pack': { citadine: 650, berline: 750, suv: 850, utilitaire: 0 },
};

// 3. PACKS
const detailingPacks = [
  { id: 'interieur_entretenu', name: 'Intérieur Entretenu', category: 'Intérieur', icon: Droplet, features: ['Aspiration complète habitacle', 'Dépoussiérage plastiques', 'Nettoyage vitres', 'Coffre standard', 'Finitions'] },
  { id: 'interieur_sale', name: 'Intérieur Sale', category: 'Intérieur', icon: Sparkles, features: ['Formule Entretenu +', 'Détails plastiques profond', 'Aspiration minutieuse', 'Shampoing tapis léger'], popular: true },
  { id: 'interieur_tres_sale', name: 'Très Sale / Insalubre', category: 'Intérieur', icon: Shield, features: ['Formule Sale +', 'Gros dégraissage', 'Extraction moquettes', 'Recoin rails sièges', 'Coffre XXL'] },

  { id: 'polissage_1', name: 'Polissage 1 Étape', category: 'Extérieur', icon: Sparkles, features: ['Lavage minutieux', 'Décontamination chimique/mécanique', 'Brillance (Gloss)', 'Protéction cire rapide'] },
  { id: 'polissage_2', name: 'Polissage 2 Étapes', category: 'Extérieur', icon: Disc, features: ['Correction avancée', 'Suppression micro-rayures', 'Finition miroir', 'Finitions manuelles'] },
  { id: 'ceramique_pack', name: 'Pack Céramique', category: 'Protection', icon: Shield, features: ['Polissage complet inclus', 'Céramique GYEON', 'Protection UV & Acide', 'Hydrophobie extrême', 'Facilité de lavage'] },
];

// 4. OPTIONS
const detailingOptions = [
  { id: 'lessivage', name: 'Lessivage Sièges', basePrice: 60, icon: Droplet, desc: 'Injecteur / Extracteur' },
  { id: 'shampoing_moquette', name: 'Shampoing Moquettes', basePrice: 50, icon: Droplet, desc: 'Injecteur / Extracteur' },
  { id: 'Taches', name: 'Sièges très Tachés', basePrice: 80, icon: Settings, desc: 'Traitement spécifique' },
  { id: 'desinfection', name: 'Désinfection / Odeurs', basePrice: 30, icon: Sparkles, desc: 'Traitement habitacle' },
];

// 5. MECA
const mechanicOptions = [
  { id: 'vidange', name: 'Vidange + Filtre', basePrice: 50, icon: Droplet, desc: 'Main d\'oeuvre seule' },
  { id: 'Filtre à air', name: 'Filtre à air', basePrice: 12.5, icon: Wind, desc: 'Pose (0h15)' },
  { id: 'Filtre habitacle', name: 'Filtre habitacle', basePrice: 15, icon: Wind, desc: 'Pose (0h20)' },
  { id: 'Filtre carburant', name: 'Filtre carburant', basePrice: 25, icon: Filter, desc: 'Pose (0h45)' },
  { id: 'bougies', name: 'Bougies d\'allumage', basePrice: 25, icon: Zap, desc: 'Pose (0h45)' },

  { id: 'freinage', name: 'Freinage (Plaquettes)', basePrice: 50, icon: Disc, desc: 'Pose (1h)' },
  { id: 'Nettoyage Etriers', name: 'Nettoyage Etriers', basePrice: 65.5, icon: Sparkles, desc: 'Main d\'oeuvre (1h15)' },
  { id: 'disques_plaquettes', name: 'Disques + Plaquettes', basePrice: 75, icon: Disc, desc: 'Pose (1h30)' },
  { id: 'quatre_roues', name: '4 Roues (Disques+Plaq)', basePrice: 125, icon: Disc, desc: 'Pose (2h30-3h)' },
  { id: 'purge_frein', name: 'Purge liquide frein', basePrice: 40, icon: Droplet, desc: 'Main d\'oeuvre (0h45-1h)' },

  { id: 'Amortisseur', name: 'Amortisseur (l\'unité)', basePrice: 50, icon: Activity, desc: 'Main d\'oeuvre (1h)' },
  { id: 'Train_avant', name: 'Train avant complet', basePrice: 100, icon: Settings, desc: 'Main d\'oeuvre (2h30)' },
  { id: 'Train_arriere', name: 'Train arrière complet', basePrice: 75, icon: Settings, desc: 'Main d\'oeuvre (1h30)' },
  { id: 'Bielettes', name: 'Bielettes barre stab', basePrice: 50, icon: Activity, desc: 'Main d\'oeuvre (1h)' },

  { id: 'diag', name: 'Diagnostic Valise', basePrice: 25, icon: Activity, desc: 'Lecture codes défauts' },
  { id: 'Recherche', name: 'Recherche panne simple', basePrice: 50, icon: Search, desc: 'Forfait 1h' },
  { id: 'Batterie', name: 'Changement Batterie', basePrice: 25, icon: Battery, desc: 'Pose (0h30)' },
  { id: 'Alternateur', name: 'Alternateur/Démarreur', basePrice: 15, icon: Zap, desc: 'Pose (2h)' },
];

const Reservation = () => {
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<string | null>('interieur_sale');
  const [selectedDetailingOptions, setSelectedDetailingOptions] = useState<string[]>([]);
  const [selectedMechanicOptions, setSelectedMechanicOptions] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', notes: '' });

  // --- STATES SECURITÉ ---
  const [token, setToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const totalSteps = 3;
  const isEmailValid = (email: string) => emailRegex.test(email);
  const isPhoneValid = (phone: string) => phoneRegex.test(phone);

  // --- SCROLL AUTOMATIQUE ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // --- LOGIQUE METIER ---
  const getPackPrice = (packId: string, vehicleId: string | null) => {
    if (!vehicleId || !pricingMatrix[packId]) return 0;
    return pricingMatrix[packId][vehicleId];
  };

  const calculateTotal = () => {
    if (!selectedVehicle) return 0;
    let total = 0;
    if (selectedPack) total += getPackPrice(selectedPack, selectedVehicle);
    selectedDetailingOptions.forEach(id => { const opt = detailingOptions.find(o => o.id === id); if (opt) total += opt.basePrice; });
    selectedMechanicOptions.forEach(id => { const opt = mechanicOptions.find(o => o.id === id); if (opt) total += opt.basePrice; });
    return total;
  };

  const isSurDevis = useMemo(() => {
    if (!selectedVehicle || !selectedPack) return false;
    return getPackPrice(selectedPack, selectedVehicle) === 0;
  }, [selectedPack, selectedVehicle]);

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Veuillez valider la sécurité anti-robot.");
      return;
    }

    if (honeypot) {
      console.log("Honeypot triggered");
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);

    const detailingOptionNames = selectedDetailingOptions
      .map(id => detailingOptions.find(o => o.id === id)?.name)
      .filter(Boolean);
    const mechanicOptionNames = selectedMechanicOptions
      .map(id => mechanicOptions.find(o => o.id === id)?.name)
      .filter(Boolean);

    const { error } = await supabase.functions.invoke('send-quote-request', {
      body: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        vehicle_label: vehicleTypes.find(v => v.id === selectedVehicle)?.name,
        service_name: detailingPacks.find(p => p.id === selectedPack)?.name,
        detailing_options: detailingOptionNames,
        mechanic_options: mechanicOptionNames,
        total_price: calculateTotal(),
        is_sur_devis: isSurDevis,
        notes: formData.notes,
        token,
      }
    });

    setIsSubmitting(false);

    if (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue. Vous pouvez aussi nous appeler directement.");
      return;
    }

    setIsSuccess(true);
    toast.success("Demande envoyée ! Un email de confirmation vous a été transmis.");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid =
    formData.firstName.length >= 2 &&
    formData.lastName.length >= 2 &&
    isEmailValid(formData.email) &&
    isPhoneValid(formData.phone);

  const canProceed = () => {
    if (step === 1) return selectedVehicle !== null;
    if (step === 2) return selectedPack !== null;
    return true;
  };

  return (
    <>
      <SeoHead
        title="Demander un devis en ligne"
        description="Choisissez votre formule et obtenez une estimation immédiate. Nous vous recontactons rapidement pour fixer un rendez-vous, ou appelez-nous directement."
        canonicalUrl="https://www.saphirdetailing.fr/reservation"
      />

      <div className="flex flex-col min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-8 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
          <div className="container px-4 md:px-6 relative">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 text-sm text-primary mb-6">
                <CalendarIcon className="w-4 h-4" /> Demande de devis
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-gray-400">Estimez <br /></span> Votre Prestation
              </h1>
              <p className="text-gray-400 max-w-xl mx-auto mb-2">
                Composez votre prestation et recevez une estimation immédiate. Nous vous recontactons rapidement pour fixer un créneau.
              </p>
              <a href={PHONE_HREF} className="inline-flex items-center gap-2 text-primary font-bold hover:text-white transition-colors mt-2">
                <Phone className="w-4 h-4" /> Ou appelez-nous directement au {PHONE_NUMBER}
              </a>
            </motion.div>
          </div>
        </section>

        {/* Progress Bar */}
        {!isSuccess && (
          <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-xl border-b border-border flex-shrink-0">
            <div className="container px-4 md:px-6 py-4">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                {['Véhicule', 'Prestations', 'Coordonnées'].map((label, index) => (
                  <div key={label} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step > index + 1 ? 'bg-primary text-primary-foreground' : step === index + 1 ? 'bg-primary text-primary-foreground shadow-glow' : 'bg-secondary text-muted-foreground'}`}>
                      {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className={`hidden sm:block ml-2 text-sm ${step === index + 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{label}</span>
                    {index < 2 && <div className={`hidden sm:block w-12 h-px mx-4 ${step > index + 1 ? 'bg-primary' : 'bg-border'}`} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <section className="py-12 flex-grow">
          <div className="container px-4 md:px-6">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center py-20 px-4">
                  <div className="relative mb-10">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                    <div className="relative w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)]">
                      <Check className="w-12 h-12 text-white" strokeWidth={3} />
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6">DEMANDE <span className="text-primary">ENVOYÉE</span></h2>
                  <p className="text-gray-400 text-lg mb-4 leading-relaxed">
                    Merci <span className="text-white font-bold">{formData.firstName}</span>. Nous avons bien reçu votre demande et revenons vers vous rapidement pour convenir d'un créneau.
                  </p>
                  <p className="text-gray-500 mb-10">
                    Besoin d'une réponse immédiate ?{' '}
                    <a href={PHONE_HREF} className="text-primary font-bold hover:text-white transition-colors">Appelez-nous au {PHONE_NUMBER}</a>
                  </p>
                  <button onClick={() => window.location.href = '/'} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold">Retour à l'accueil <ArrowRight className="w-4 h-4" /></button>
                </motion.div>
              ) : (
                <>
                  {/* STEP 1: VEHICLE */}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto">
                      <h2 className="font-display text-2xl font-bold mb-8 text-center">Quel type de véhicule ?</h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {vehicleTypes.map((vehicle) => (
                          <motion.button
                            key={vehicle.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedVehicle(vehicle.id)}
                            className={`glass-card p-6 text-left transition-all ${selectedVehicle === vehicle.id ? 'border-primary shadow-glow' : 'hover:border-primary/30'}`}
                          >
                            <div className="flex items-start gap-4">
                              <vehicle.icon className={`w-8 h-8 mt-1 ${selectedVehicle === vehicle.id ? 'text-primary' : 'text-muted-foreground'}`} />
                              <div className="flex-1">
                                <h3 className="font-display font-semibold text-lg">{vehicle.name}</h3>
                                <p className="text-sm text-muted-foreground mb-1">{vehicle.description}</p>
                              </div>
                              {selectedVehicle === vehicle.id && <Check className="w-5 h-5 text-primary" />}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: PACKS & OPTIONS */}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl mx-auto">
                      <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold font-display text-white">Sélection des Services</h2>
                        <p className="text-muted-foreground mt-2">Tarifs adaptés pour : <span className="text-primary font-bold capitalize">{vehicleTypes.find(v => v.id === selectedVehicle)?.name}</span></p>
                      </div>
                      <div className="space-y-12">
                        {['Intérieur', 'Extérieur', 'Protection'].map(category => (
                          <div key={category}>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 pl-2 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span>{category}</h3>
                            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                              {detailingPacks.filter(p => p.category === category).map((pack) => {
                                const isSelected = selectedPack === pack.id;
                                const price = getPackPrice(pack.id, selectedVehicle);
                                return (
                                  <motion.div layout key={pack.id} onClick={() => setSelectedPack(pack.id)} className={`relative cursor-pointer transition-colors duration-300 group ${isSelected ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}>
                                    <div className="p-5 flex items-start gap-5">
                                      <div className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${isSelected ? 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.3)] scale-110' : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-300'}`}><pack.icon className="w-6 h-6" /></div>
                                      <div className="flex-1 pt-1">
                                        <div className="flex justify-between items-start">
                                          <div><h4 className={`text-lg font-bold transition-colors ${isSelected ? 'text-white' : 'text-gray-300'}`}>{pack.name}</h4>{!isSelected && <p className="text-sm text-muted-foreground mt-1">{pack.features.slice(0, 2).join(' • ')}...</p>}</div>
                                          <div className="text-right">
                                            <span className={`block text-lg font-bold transition-colors ${isSelected ? 'text-primary' : 'text-white'}`}>{price === 0 ? 'Sur Devis' : `${price}€`}</span>
                                            {price > 0 && <span className="text-[10px] text-gray-500 uppercase tracking-wide">Dès</span>}
                                          </div>
                                        </div>
                                        <AnimatePresence>
                                          {isSelected && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                              <div className="pt-4 mt-3 border-t border-white/5"><ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">{pack.features.map((f, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /><span className="opacity-90">{f}</span></li>)}</ul></div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    </div>
                                    {isSelected && <motion.div layoutId="active-pack-line" className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-12">
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary mb-4 pl-2"><Sparkles className="w-4 h-4" /> Options Esthétiques</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {detailingOptions.map((opt) => (
                            <div key={opt.id} onClick={() => setSelectedDetailingOptions(prev => prev.includes(opt.id) ? prev.filter(i => i !== opt.id) : [...prev, opt.id])} className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${selectedDetailingOptions.includes(opt.id) ? 'bg-white/10 border-primary shadow-glow' : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'}`}>
                              <div className="flex items-center gap-3"><opt.icon className="w-5 h-5 text-gray-400" /><span className="text-sm font-bold text-white">{opt.name}</span></div><span className="text-xs font-mono text-gray-400">+{opt.basePrice}€</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-12">
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-orange-500 mb-4 pl-2"><Wrench className="w-4 h-4" /> Entretien Mécanique</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {mechanicOptions.map((opt) => (
                            <div key={opt.id} onClick={() => setSelectedMechanicOptions(prev => prev.includes(opt.id) ? prev.filter(i => i !== opt.id) : [...prev, opt.id])} className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${selectedMechanicOptions.includes(opt.id) ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'}`}>
                              <div className="flex items-center gap-3"><opt.icon className="w-5 h-5" /><span className="text-sm font-bold">{opt.name}</span></div><span className="text-xs font-mono">+{opt.basePrice}€</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: COORDONNÉES & ENVOI */}
                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-6xl mx-auto pb-10">
                      <h2 className="text-3xl font-bold font-display text-white text-center mb-10">Finalisation</h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                        <div className="flex flex-col">
                          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 md:p-8 h-full">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg text-primary"><User className="w-5 h-5" /></div>
                                <h3 className="text-xl font-bold text-white">Vos Coordonnées</h3>
                              </div>
                              <span className="text-xs text-gray-500 font-medium">* Champs obligatoires</span>
                            </div>

                            <div className="space-y-6 relative">
                              {/* --- HONEYPOT FIELD --- */}
                              <div
                                aria-hidden="true"
                                style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
                              >
                                <label htmlFor="hp_field_res_7k1">Laissez ce champ vide</label>
                                <input
                                  type="text"
                                  id="hp_field_res_7k1"
                                  name="hp_field_res_7k1"
                                  tabIndex={-1}
                                  autoComplete="new-password"
                                  value={honeypot}
                                  onChange={(e) => setHoneypot(e.target.value)}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Prénom <span className="text-primary">*</span></label>
                                  <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="Jean"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all placeholder:text-gray-600"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nom <span className="text-primary">*</span></label>
                                  <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Dupont"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all placeholder:text-gray-600"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5 relative">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email <span className="text-primary">*</span></label>
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  placeholder="jean.dupont@email.com"
                                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all placeholder:text-gray-600
                                    ${formData.email && !isEmailValid(formData.email) ? 'border-red-500 focus:border-red-500' : formData.email && isEmailValid(formData.email) ? 'border-green-500/50 focus:border-green-500' : 'border-white/10 focus:border-primary'}`}
                                />
                                {formData.email && !isEmailValid(formData.email) && (
                                  <span className="text-[10px] text-red-400 absolute right-3 top-9">Format invalide</span>
                                )}
                              </div>

                              <div className="space-y-1.5 relative">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Téléphone <span className="text-primary">*</span></label>
                                <input
                                  type="tel"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  placeholder="06 12 34 56 78"
                                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all placeholder:text-gray-600
                                    ${formData.phone && !isPhoneValid(formData.phone) ? 'border-red-500 focus:border-red-500' : formData.phone && isPhoneValid(formData.phone) ? 'border-green-500/50 focus:border-green-500' : 'border-white/10 focus:border-primary'}`}
                                />
                                {formData.phone && !isPhoneValid(formData.phone) && (
                                  <span className="text-[10px] text-red-400 absolute right-3 top-9">Format invalide</span>
                                )}
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Message (Optionnel)</label>
                                <textarea
                                  name="notes"
                                  value={formData.notes}
                                  onChange={handleInputChange}
                                  placeholder="Précisions sur l'état du véhicule, disponibilités..."
                                  rows={3}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none resize-none placeholder:text-gray-600"
                                />
                              </div>
                            </div>

                            {/* --- BOUTON APPEL DIRECT --- */}
                            <a
                              href={PHONE_HREF}
                              className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 text-gray-300 hover:border-primary/50 hover:text-primary transition-all font-medium"
                            >
                              <Phone className="w-4 h-4" /> Ou appelez-nous directement au {PHONE_NUMBER}
                            </a>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 h-full flex flex-col justify-between">
                            <div>
                              <h3 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-3"><span className="w-1.5 h-6 bg-primary rounded-full" /> Récapitulatif</h3>
                              <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5"><div className="p-2 bg-black rounded-lg border border-white/10 text-gray-400"><CarFront className="w-5 h-5" /></div><div><p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Véhicule</p><p className="text-white font-bold">{vehicleTypes.find(v => v.id === selectedVehicle)?.name}</p></div></div>

                                <div className="border-t border-white/10 border-dashed my-2" />
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start text-white font-bold">
                                    <span>{detailingPacks.find(p => p.id === selectedPack)?.name}</span>
                                    <span>{isSurDevis ? 'Sur Devis' : getPackPrice(selectedPack!, selectedVehicle) + '€'}</span>
                                  </div>
                                  {selectedDetailingOptions.map(id => <div key={id} className="flex justify-between text-sm text-gray-400"><span>+ {detailingOptions.find(o => o.id === id)?.name}</span><span>{detailingOptions.find(o => o.id === id)?.basePrice}€</span></div>)}
                                  {selectedMechanicOptions.map(id => <div key={id} className="flex justify-between text-sm text-gray-400"><span>+ {mechanicOptions.find(o => o.id === id)?.name}</span><span>{mechanicOptions.find(o => o.id === id)?.basePrice}€</span></div>)}
                                </div>
                                <div className="flex justify-between items-end mt-6 pt-4 border-t border-white/10">
                                  <div>
                                    <span className="text-gray-400 font-medium block">Total estimé</span>
                                    <span className="text-[10px] text-gray-500">* Prix minimum indicatif, hors délai</span>
                                  </div>
                                  <span className="text-4xl font-bold text-primary tracking-tight">{isSurDevis ? 'Sur Devis' : calculateTotal() + '€'}</span>
                                </div>
                              </div>
                            </div>

                            {/* --- WIDGET CLOUDFLARE TURNSTILE --- */}
                            <div className="mt-6">
                              <Turnstile
                                siteKey="0x4AAAAAACWcVeXiRR2a7qKa"
                                onSuccess={(token) => setToken(token)}
                                theme="dark"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={handleSubmit}
                              disabled={!isFormValid || !token || isSubmitting}
                              className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 mt-4 disabled:cursor-not-allowed ${isFormValid && token && !isSubmitting ? 'bg-primary text-white shadow-glow hover:scale-[1.02]' : 'bg-white/10 text-gray-500'}`}
                            >
                              {isSubmitting ? 'Envoi en cours...' : isFormValid && token ? <>ENVOYER LA DEMANDE <Check className="w-6 h-6" /></> : 'VALIDER LE CAPTCHA'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* BOTTOM NAV */}
        {!isSuccess && (
          <div className="sticky bottom-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border py-4 w-full flex-shrink-0">
            <div className="container px-4 md:px-6 flex justify-between max-w-2xl mx-auto">
              <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${step === 1 ? 'opacity-0' : 'text-foreground hover:bg-secondary'}`}><ChevronLeft className="w-5 h-5" /> Retour</button>
              {step < 3 && (
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="block text-xl font-bold text-primary">{isSurDevis ? 'Devis' : calculateTotal() + '€'}</span>
                </div>
              )}
              {step < 3 ? (
                <button onClick={() => setStep(s => Math.min(totalSteps, s + 1))} disabled={!canProceed()} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${canProceed() ? 'bg-primary text-white shadow-glow' : 'bg-secondary text-muted-foreground'}`}>Continuer <ChevronRight className="w-5 h-5" /></button>
              ) : <div className="w-[120px]" />}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Reservation;