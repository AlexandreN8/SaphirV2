import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import SeoHead from '@/components/SeoHead';
import { Turnstile } from '@marsidev/react-turnstile';

import { 
  CarFront, Truck, Car, ChevronRight, ChevronLeft, Calendar as CalendarIcon, 
  Check, Sparkles, Shield, Droplet, Wrench, Disc, Settings, User, 
  ArrowRight, Clock
} from 'lucide-react';

// --- DONNÉES ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

const vehicleTypes = [
  { id: 'citadine', name: 'Citadine / Compacte', description: '2 à 4 places (ex: Clio, 208, Golf)', icon: CarFront },
  { id: 'berline', name: 'Berline / Break', description: '4 à 5 places (ex: Serie 3, Passat, A4)', icon: Car },
  { id: 'suv', name: 'SUV / Monospace', description: '7 places / Grand volume (ex: X5, Q7)', icon: Truck },
];

const pricingMatrix: { [key: string]: { [key: string]: number } } = {
  'entretien': { citadine: 120, berline: 140, suv: 220 },
  'sale': { citadine: 140, berline: 160, suv: 0 },
  'tres_sale': { citadine: 180, berline: 220, suv: 0 },
  'polissage_1': { citadine: 280, berline: 330, suv: 380 },
  'polissage_2': { citadine: 450, berline: 520, suv: 600 },
  'ceramique_gyeon': { citadine: 450, berline: 750, suv: 850 },
};

const detailingPacks = [
  { id: 'entretien', name: 'Formule Entretien', category: 'Intérieur', durationHours: 2.5, icon: Droplet, features: ['Aspiration habitacle', 'Dépoussiérage tableau de bord', 'Vitres intérieures'] },
  { id: 'sale', name: 'Formule Sale', category: 'Intérieur', durationHours: 4, icon: Sparkles, features: ['Formule Entretien +', 'Shampoing sièges/moquettes', 'Nettoyage plastiques', 'Odeurs léger'], popular: true },
  { id: 'tres_sale', name: 'Formule Très Sale', category: 'Intérieur', durationHours: 6, icon: Shield, features: ['Formule Sale +', 'Extraction injecteur', 'Poils animaux', 'Désinfection'] },
  { id: 'polissage_1', name: 'Polissage 1 Étape', category: 'Extérieur', durationHours: 8, icon: Sparkles, features: ['Correction légère', 'Brillance complète'] },
  { id: 'polissage_2', name: 'Polissage 2 Étapes', category: 'Extérieur', durationHours: 16, icon: Disc, features: ['Correction avancée', 'Suppression micro-rayures'] },
  { id: 'ceramique_gyeon', name: 'Céramique GYEON', category: 'Protection', durationHours: 24, icon: Shield, features: ['Protection 6-12 mois', 'Anti-UV & Pluies acides'] },
];

const detailingOptions = [
  { id: 'lessivage', name: 'Lessivage Sièges', basePrice: 15, icon: Droplet, desc: 'Extraction injecteur', durationHours: 1 },
  { id: 'poils', name: 'Poils Animaux', basePrice: 30, icon: Settings, desc: 'Supplément si excessif', durationHours: 1 },
  { id: 'desinfection', name: 'Désinfection / Odeurs', basePrice: 49, icon: Sparkles, desc: 'Traitement vapeur/ozone', durationHours: 0.5 },
];

const mechanicOptions = [
  { id: 'vidange', name: 'Vidange + Filtre', basePrice: 79, icon: Droplet, desc: 'Huile constructeur', durationHours: 1 },
  { id: 'freinage', name: 'Freinage (Plaquettes)', basePrice: 89, icon: Disc, desc: 'Jeu avant ou arrière', durationHours: 1 },
  { id: 'diag', name: 'Diagnostic Élec.', basePrice: 49, icon: Wrench, desc: 'Lecture codes défauts', durationHours: 0.5 },
];

const Reservation = () => {
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<string | null>('sale');
  const [selectedDetailingOptions, setSelectedDetailingOptions] = useState<string[]>([]);
  const [selectedMechanicOptions, setSelectedMechanicOptions] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSuccess, setIsSuccess] = useState(false);
  const [monthReservations, setMonthReservations] = useState<any[]>([]);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', notes: '' });
  
  // --- STATES SECURITÉ ---
  const [token, setToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState(""); 

  const totalSteps = 4;
  const isEmailValid = (email: string) => emailRegex.test(email);
  const isPhoneValid = (phone: string) => phoneRegex.test(phone);

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

  const totalDuration = useMemo(() => {
    let h = detailingPacks.find(p => p.id === selectedPack)?.durationHours || 2;
    selectedDetailingOptions.forEach(id => h += detailingOptions.find(o => o.id === id)?.durationHours || 0);
    selectedMechanicOptions.forEach(id => h += mechanicOptions.find(o => o.id === id)?.durationHours || 0);
    if (selectedVehicle === 'suv') h *= 1.2;
    return Math.round(h * 2) / 2;
  }, [selectedPack, selectedDetailingOptions, selectedMechanicOptions, selectedVehicle]);

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h > 10) return `${Math.ceil(h/8)} jours`; 
    return `${h}h${m > 0 ? m : ''}`;
  };

  // --- LOGIQUE CALENDRIER ---
  const changeMonth = (offset: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setDate(1); 
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
    setSelectedDate(null);
    setSelectedTime(null);
  };

  useEffect(() => {
    const fetchMonthData = async () => {
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59);
      const bufferStart = new Date(startOfMonth); bufferStart.setDate(bufferStart.getDate() - 5);
      const bufferEnd = new Date(endOfMonth); bufferEnd.setDate(bufferEnd.getDate() + 5);

      const { data } = await supabase
        .from('reservations')
        .select('start_at, end_at')
        .neq('status', 'cancelled')
        .or(`start_at.lte.${bufferEnd.toISOString()},end_at.gte.${bufferStart.toISOString()}`);

      setMonthReservations(data || []);
    };
    fetchMonthData();
  }, [currentMonth]);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 9; h < 12; h += 0.5) slots.push(`${Math.floor(h).toString().padStart(2, '0')}:${h % 1 === 0 ? '00' : '30'}`);
    for (let h = 14; h < 18; h += 0.5) slots.push(`${Math.floor(h).toString().padStart(2, '0')}:${h % 1 === 0 ? '00' : '30'}`);
    return slots;
  }, []);

  const calculateEndDate = (startDate: Date, durationHours: number) => {
    let end = new Date(startDate);
    let remaining = durationHours;
    
    while (remaining > 0) {
      end.setMinutes(end.getMinutes() + 30);
      const h = end.getHours() + end.getMinutes() / 60;
      const day = end.getDay();

      if (day === 6 || day === 0) {
        end.setDate(end.getDate() + (day === 6 ? 2 : 1));
        end.setHours(9, 0, 0, 0);
        continue;
      }
      if (h > 12 && h < 14) {
        end.setHours(14, 0, 0, 0);
        continue;
      }
      if (h > 18 || (h === 18 && end.getMinutes() > 0)) {
        end.setDate(end.getDate() + 1);
        end.setHours(9, 0, 0, 0);
        const nextDay = end.getDay();
        if (nextDay === 6 || nextDay === 0) {
            end.setDate(end.getDate() + (nextDay === 6 ? 2 : 1));
        }
        continue;
      }
      remaining -= 0.5;
    }
    return end;
  };

  const isRangeAvailable = (start: Date, end: Date) => {
    for (const res of monthReservations) {
      const resStart = new Date(res.start_at);
      const resEnd = new Date(res.end_at);
      if (start < resEnd && end > resStart) return false;
    }
    return true;
  };

  const isDayAvailable = (date: Date) => {
    const today = new Date(); today.setHours(0,0,0,0);
    if (date < today || date.getDay() === 0 || date.getDay() === 6) return false;

    const slotsToCheck = [];
    for (let h = 9; h < 12; h += 0.5) slotsToCheck.push(h);
    for (let h = 14; h < 18; h += 0.5) slotsToCheck.push(h);

    return slotsToCheck.some(h => {
      const simStart = new Date(date);
      simStart.setHours(Math.floor(h), (h % 1) * 60, 0, 0);
      const simEnd = calculateEndDate(simStart, totalDuration);
      return isRangeAvailable(simStart, simEnd);
    });
  };

  const handleSubmit = async () => {
    // 1. SECURITÉ CLIENT : Token Turnstile requis
    if (!token) {
        toast.error("Veuillez valider la sécurité anti-robot.");
        return;
    }

    // 2. SECURITÉ HONEYPOT : Si rempli, on simule un succès (Bot)
    if (honeypot) {
        console.log("Honeypot triggered");
        setIsSuccess(true); // Fake success
        return;
    }

    if (!selectedDate || !selectedTime) return;
    const startDate = new Date(selectedDate);
    const [h, m] = selectedTime.split(':').map(Number);
    startDate.setHours(h, m, 0, 0);
    const endDate = calculateEndDate(startDate, totalDuration);

    // 3. ENREGISTREMENT DB 
    const { data, error } = await supabase.rpc('reserve_multi_day', {
      p_client_name: `${formData.firstName} ${formData.lastName}`,
      p_client_email: formData.email,
      p_client_phone: formData.phone || null,
      p_start_at: startDate.toISOString(),
      p_end_at: endDate.toISOString(),
      p_service_name: detailingPacks.find(p => p.id === selectedPack)?.name || "Détailing",
      p_total_price: isSurDevis ? 0 : calculateTotal(),
      p_duration: totalDuration,
      p_vehicle_info: { type: selectedVehicle, label: vehicleTypes.find(v => v.id === selectedVehicle)?.name },
      p_service_details: { pack: selectedPack, detailing_options: selectedDetailingOptions, mechanic_options: selectedMechanicOptions, notes: formData.notes, is_sur_devis: isSurDevis }
    });

    if (error || (data && data.error)) {
      toast.error(data?.error || "Erreur de connexion.");
      const { data: newData } = await supabase.from('reservations').select('start_at, end_at').neq('status', 'cancelled');
      if (newData) setMonthReservations(newData);
    } else {
      
      // 4. ENVOI EMAILS (via Edge Function)
      const reservationData = {
        client_name: `${formData.firstName} ${formData.lastName}`,
        client_email: formData.email,
        client_phone: formData.phone,
        start_at: startDate.toISOString(),
        service_name: detailingPacks.find(p => p.id === selectedPack)?.name,
        total_price: isSurDevis ? 0 : calculateTotal(),
        duration_hours: totalDuration,
        vehicle_info: { label: vehicleTypes.find(v => v.id === selectedVehicle)?.name },
        service_details: { notes: formData.notes }
      };

      supabase.functions.invoke('manage-reservation', {
        body: { type: 'create', record: reservationData, token }
      });

      setIsSuccess(true);
      toast.success("Réservation effectuée ! Un email vous a été envoyé.");
    }
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
    if (step === 3) return selectedDate !== null && selectedTime !== null;
    return true;
  };

  return (
    <>
      <SeoHead 
        title="Réserver votre prestation en ligne"
        description="Choisissez votre formule et votre créneau en ligne. Réservation simple et rapide pour l'entretien esthétique de votre véhicule."
        canonicalUrl="https://www.saphirdetailing.fr/reservation"
      />
      
      <div className="flex flex-col min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-8 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
          <div className="container px-4 md:px-6 relative">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 text-sm text-primary mb-6">
                <CalendarIcon className="w-4 h-4" /> Réservation en ligne
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-gray-400">Réservez <br /></span> Votre Créneau
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Progress Bar */}
        <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-xl border-b border-border flex-shrink-0">
          <div className="container px-4 md:px-6 py-4">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {['Véhicule', 'Prestations', 'Date', 'Confirmation'].map((label, index) => (
                <div key={label} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step > index + 1 ? 'bg-primary text-primary-foreground' : step === index + 1 ? 'bg-primary text-primary-foreground shadow-glow' : 'bg-secondary text-muted-foreground'}`}>
                    {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`hidden sm:block ml-2 text-sm ${step === index + 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{label}</span>
                  {index < 3 && <div className={`hidden sm:block w-12 h-px mx-4 ${step > index + 1 ? 'bg-primary' : 'bg-border'}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

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
                  <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6">DEMANDE <span className="text-primary">ENREGISTRÉE</span></h2>
                  <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                    Merci <span className="text-white font-bold">{formData.firstName}</span>. Votre demande pour le <span className="text-white font-bold">{selectedDate && new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(selectedDate)}</span> est bien arrivée.
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
                                          <div className="text-right"><span className={`block text-lg font-bold transition-colors ${isSelected ? 'text-primary' : 'text-white'}`}>{price === 0 ? 'Sur Devis' : `${price}€`}</span></div>
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

                  {/* STEP 3: DATE */}
                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto pb-10">
                      <h2 className="text-3xl font-bold font-display text-white text-center mb-8">Planning</h2>
                      <div className="flex flex-col md:flex-row gap-6 items-stretch">
                        <div className="w-full md:w-3/5 bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 flex flex-col">
                          <div className="flex items-center justify-between mb-6">
                            <span className="text-lg font-bold capitalize text-white pl-2">{new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentMonth)}</span>
                            <div className="flex gap-2">
                              <button onClick={() => changeMonth(-1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white"><ChevronLeft className="w-4 h-4"/></button>
                              <button onClick={() => changeMonth(1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white"><ChevronRight className="w-4 h-4"/></button>
                            </div>
                          </div>
                          <div className="grid grid-cols-7 mb-2 text-center text-xs font-bold text-gray-500 py-2">{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <div key={i}>{d}</div>)}</div>
                          <div className="grid grid-cols-7 gap-1 sm:gap-2 content-start">
                            {(() => {
                              const year = currentMonth.getFullYear();
                              const month = currentMonth.getMonth();
                              const firstDay = new Date(year, month, 1).getDay();
                              const daysInMonth = new Date(year, month + 1, 0).getDate();
                              const startDay = firstDay === 0 ? 6 : firstDay - 1;
                              const days = [];
                              for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} className="w-full aspect-square" />);
                              for (let d = 1; d <= daysInMonth; d++) {
                                const dateObj = new Date(year, month, d);
                                const isSelected = selectedDate?.toDateString() === dateObj.toDateString();
                                const isAvailable = isDayAvailable(dateObj);
                                days.push(
                                  <button key={d} disabled={!isAvailable} onClick={() => { setSelectedDate(dateObj); setSelectedTime(null); }} className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all ${isSelected ? 'bg-primary text-white shadow-glow' : !isAvailable ? 'text-gray-700 cursor-not-allowed opacity-50 bg-white/[0.01]' : 'text-gray-300 hover:bg-white/10 bg-white/[0.02]'}`}>
                                    {d}
                                  </button>
                                );
                              }
                              return days;
                            })()}
                          </div>
                        </div>
                        <div className="w-full md:w-2/5 bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 flex flex-col">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Date : {selectedDate ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(selectedDate) : 'Aucune'}</h3>
                          <div className="flex-1 overflow-y-auto min-h-[300px]">
                            {selectedDate ? (
                              <div className="grid grid-cols-3 gap-2">
                                {timeSlots.map((time) => {
                                  const [h, m] = time.split(':').map(Number);
                                  const slotStart = new Date(selectedDate); slotStart.setHours(h, m, 0, 0);
                                  const slotEnd = calculateEndDate(slotStart, totalDuration);
                                  const isAvailable = isRangeAvailable(slotStart, slotEnd);
                                  return (
                                    <button key={time} disabled={!isAvailable} onClick={() => setSelectedTime(time)} className={`py-2 rounded-lg text-xs font-bold border transition-all ${selectedTime === time ? 'bg-primary border-primary text-black' : isAvailable ? 'bg-white/5 border-white/10 text-white hover:border-primary/50' : 'opacity-20 cursor-not-allowed border-red-900/50 text-red-900'}`}>
                                      {time}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : <p className="text-center text-gray-600 mt-10">Veuillez choisir une date.</p>}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 text-gray-400">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-xs font-medium">Durée estimée</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-bold text-white block">{formatDuration(totalDuration)}</span>
                                  <span className="text-[9px] text-gray-600 uppercase tracking-wide block">Indicatif</span>
                                </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: RECAP & CONFIRMATION */}
                  {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-6xl mx-auto pb-10">
                      <h2 className="text-3xl font-bold font-display text-white text-center mb-10">Finalisation</h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                        <div className="flex flex-col">
                          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 md:p-8 h-full">
                            <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-primary/20 rounded-lg text-primary"><User className="w-5 h-5" /></div><h3 className="text-xl font-bold text-white">Vos Coordonnées</h3></div>
                            
                            <div className="space-y-4 relative">
                              {/* --- HONEYPOT FIELD --- */}
                              <div className="absolute opacity-0 -z-50 select-none pointer-events-none h-0 w-0 overflow-hidden">
                                <label htmlFor="confirm_email_res">Ne pas remplir</label>
                                <input
                                    type="text"
                                    id="confirm_email_res"
                                    name="confirm_email"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={honeypot}
                                    onChange={(e) => setHoneypot(e.target.value)}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <input 
                                  type="text" 
                                  name="firstName" 
                                  value={formData.firstName} 
                                  onChange={handleInputChange} 
                                  placeholder="Prénom" 
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" 
                                />
                                <input 
                                  type="text" 
                                  name="lastName" 
                                  value={formData.lastName} 
                                  onChange={handleInputChange} 
                                  placeholder="Nom" 
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" 
                                />
                              </div>
                              
                              <div className="relative">
                                <input 
                                  type="email" 
                                  name="email" 
                                  value={formData.email} 
                                  onChange={handleInputChange} 
                                  placeholder="Email (ex: jean@mail.com)" 
                                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all
                                    ${formData.email && !isEmailValid(formData.email) ? 'border-red-500 focus:border-red-500' : formData.email && isEmailValid(formData.email) ? 'border-green-500/50 focus:border-green-500' : 'border-white/10 focus:border-primary'}`} 
                                />
                                {formData.email && !isEmailValid(formData.email) && (
                                  <span className="text-[10px] text-red-400 absolute right-3 top-3.5">Format invalide</span>
                                )}
                              </div>

                              <div className="relative">
                                <input 
                                  type="tel" 
                                  name="phone" 
                                  value={formData.phone} 
                                  onChange={handleInputChange} 
                                  placeholder="Téléphone (ex: 06 12 34 56 78)" 
                                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all
                                    ${formData.phone && !isPhoneValid(formData.phone) ? 'border-red-500 focus:border-red-500' : formData.phone && isPhoneValid(formData.phone) ? 'border-green-500/50 focus:border-green-500' : 'border-white/10 focus:border-primary'}`} 
                                />
                                {formData.phone && !isPhoneValid(formData.phone) && (
                                  <span className="text-[10px] text-red-400 absolute right-3 top-3.5">Format invalide</span>
                                )}
                              </div>

                              <textarea 
                                name="notes" 
                                value={formData.notes} 
                                onChange={handleInputChange} 
                                placeholder="Demande particulière..." 
                                rows={3} 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none resize-none" 
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 h-full flex flex-col justify-between">
                            <div>
                              <h3 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-3"><span className="w-1.5 h-6 bg-primary rounded-full"/> Récapitulatif</h3>
                              <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5"><div className="p-2 bg-black rounded-lg border border-white/10 text-gray-400"><CarFront className="w-5 h-5" /></div><div><p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Véhicule</p><p className="text-white font-bold">{vehicleTypes.find(v => v.id === selectedVehicle)?.name}</p></div></div>
                                
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <div className="p-2 bg-black rounded-lg border border-white/10 text-gray-400"><CalendarIcon className="w-5 h-5" /></div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Date & Heure</p>
                                        <p className="text-white font-bold capitalize">{selectedDate ? new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(selectedDate) : '--'}</p>
                                        <p className="text-primary text-sm font-medium">à {selectedTime || '--:--'}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Durée Est.</p>
                                        <p className="text-white font-bold">{formatDuration(totalDuration)}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="border-t border-white/10 border-dashed my-2" />
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start text-white font-bold"><span>{detailingPacks.find(p => p.id === selectedPack)?.name}</span><span>{isSurDevis ? 'Sur Devis' : getPackPrice(selectedPack!, selectedVehicle) + '€'}</span></div>
                                  {selectedDetailingOptions.map(id => <div key={id} className="flex justify-between text-sm text-gray-400"><span>+ {detailingOptions.find(o => o.id === id)?.name}</span><span>{detailingOptions.find(o => o.id === id)?.basePrice}€</span></div>)}
                                  {selectedMechanicOptions.map(id => <div key={id} className="flex justify-between text-sm text-gray-400"><span>+ {mechanicOptions.find(o => o.id === id)?.name}</span><span>{mechanicOptions.find(o => o.id === id)?.basePrice}€</span></div>)}
                                </div>
                                <div className="flex justify-between items-end mt-6 pt-4 border-t border-white/10"><span className="text-gray-400 font-medium">Total estimé</span><span className="text-4xl font-bold text-primary tracking-tight">{isSurDevis ? 'Sur Devis' : calculateTotal() + '€'}</span></div>
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
                                disabled={!isFormValid || !token} 
                                className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 mt-4 ${isFormValid && token ? 'bg-primary text-white shadow-glow hover:scale-[1.02]' : 'bg-white/10 text-gray-500 cursor-not-allowed'}`}
                            >
                                {isFormValid && token ? <>CONFIRMER <Check className="w-6 h-6" /></> : 'VALIDER LE CAPTCHA'}
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
        <div className="sticky bottom-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border py-4 w-full flex-shrink-0">
          <div className="container px-4 md:px-6 flex justify-between max-w-2xl mx-auto">
            <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${step === 1 ? 'opacity-0' : 'text-foreground hover:bg-secondary'}`}><ChevronLeft className="w-5 h-5" /> Retour</button>
            {step < 4 && (
              <div className="text-center">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="block text-xl font-bold text-primary">{isSurDevis ? 'Devis' : calculateTotal() + '€'}</span>
              </div>
            )}
            {step < 4 ? (
              <button onClick={() => setStep(s => Math.min(totalSteps, s + 1))} disabled={!canProceed()} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${canProceed() ? 'bg-primary text-white shadow-glow' : 'bg-secondary text-muted-foreground'}`}>Continuer <ChevronRight className="w-5 h-5" /></button>
            ) : <div className="w-[120px]" />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Reservation;