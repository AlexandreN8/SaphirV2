import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CarFront, 
  Truck, 
  Van, 
  Car,
  ChevronRight, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Check, 
  Sparkles, 
  Shield, 
  Droplet, 
  Wrench, 
  Disc, 
  Gauge, 
  Clock, 
  Crown, 
  Settings,
  Calendar, 
  Info,
  User,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';


// Vehicle types
const vehicleTypes = [
  {
    id: 'citadine',
    name: 'Citadine',
    description: 'Petites voitures compactes',
    examples: 'Clio, 208, Polo',
    priceModifier: 1,
    icon: CarFront,
  },
  {
    id: 'berline',
    name: 'Berline / Coupé',
    description: 'Véhicules standards',
    examples: 'Classe C, A4, Serie 3',
    priceModifier: 1.15,
    icon: Car,
  },
  {
    id: 'suv',
    name: 'SUV / Break',
    description: 'Véhicules de taille moyenne',
    examples: 'X3, Q5, GLC',
    priceModifier: 1.3,
    icon: Truck,
  },
  {
    id: 'premium',
    name: 'Premium / Utilitaire',
    description: 'Grands véhicules',
    examples: 'Classe S, X5, Range Rover',
    priceModifier: 1.5,
    icon: Van,
  },
];

// Detailing Packs (only one can be selected)
const detailingPacks = [
  {
    id: 'essentiel',
    name: 'Pack Essentiel',
    basePrice: 89,
    duration: '2-3h',
    icon: Droplet,
    features: ['Lavage extérieur', 'Aspiration intérieure', 'Vitres', 'Jantes'],
  },
  {
    id: 'renovation',
    name: 'Pack Rénovation',
    basePrice: 249,
    duration: '1 jour',
    icon: Sparkles,
    features: ['Pack Essentiel +', 'Polissage 1 étape', 'Shampoing sièges', 'Protection cire'],
    popular: true,
  },
  {
    id: 'ceramique',
    name: 'Pack Céramique',
    basePrice: 599,
    duration: '2-3 jours',
    icon: Shield,
    features: ['Pack Rénovation +', 'Polissage 2 étapes', 'Céramique 9H', 'Garantie 3 ans'],
  },
];

// Detailing Options
const detailingOptions = [
  { 
    id: 'phares', 
    name: 'Rénovation phares', 
    basePrice: 79, 
    icon: Crown, 
    desc: 'Restauration clarté & protection UV' 
  },
  { 
    id: 'cuir', 
    name: 'Traitement cuir complet', 
    basePrice: 149, 
    icon: Sparkles, 
    desc: 'Nettoyage profond & soin nourrissant' 
  },
  { 
    id: 'ozone', 
    name: 'Traitement anti-odeur ozone', 
    basePrice: 49, 
    icon: Settings, 
    desc: 'Désinfection & destruction odeurs' 
  },
  { 
    id: 'jantes_ceramique', 
    name: 'Céramique jantes', 
    basePrice: 99, 
    icon: Disc, 
    desc: 'Protection H.T. & facilité de lavage' 
  },
];

// Mechanic Options 
const mechanicOptions = [
  { 
    id: 'vidange', 
    name: 'Vidange + Filtre', 
    basePrice: 79, 
    icon: Droplet, 
    desc: 'Huile constructeur & remplacement filtre' 
  },
  { 
    id: 'plaquettes_av', 
    name: 'Plaquettes AV', 
    basePrice: 89, 
    icon: Disc, 
    desc: 'Remplacement jeu avant complet' 
  },
  { 
    id: 'plaquettes_ar', 
    name: 'Plaquettes AR', 
    basePrice: 79, 
    icon: Disc, 
    desc: 'Remplacement jeu arrière complet' 
  },
  { 
    id: 'geometrie', 
    name: 'Géométrie', 
    basePrice: 89, 
    icon: Gauge, 
    desc: 'Réglage parallélisme & direction' 
  },
  { 
    id: 'diagnostic', 
    name: 'Diagnostic', 
    basePrice: 49, 
    icon: Wrench, 
    desc: 'Lecture codes défauts & bilan santé' 
  },
];


const Reservation = () => {
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<string | null>('renovation');
  const [selectedDetailingOptions, setSelectedDetailingOptions] = useState<string[]>([]);
  const [selectedMechanicOptions, setSelectedMechanicOptions] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });

  const totalSteps = 4;

  // --- 2. LES EFFETS (useEffect) ---
  useEffect(() => {
    const findNextAvailableDate = () => {
      let date = new Date();
      date.setDate(date.getDate() + 1); 
      while (date.getDay() === 0 || date.getDay() === 6) {
        date.setDate(date.getDate() + 1);
      }
      return date;
    };

    const nextDate = findNextAvailableDate();
    setSelectedDate(nextDate);
    setCurrentMonth(nextDate);
  }, []);

  // --- 3. LES FONCTIONS UTILITAIRES ---
  const getVehicle = () => vehicleTypes.find((v) => v.id === selectedVehicle);

  const calculateTotal = () => {
    const vehicle = getVehicle();
    if (!vehicle) return 0;

    let total = 0;
    
    // Pack
    const pack = detailingPacks.find((p) => p.id === selectedPack);
    if (pack) total += pack.basePrice * vehicle.priceModifier;
    
    // Options Detailing
    selectedDetailingOptions.forEach((optionId) => {
      const option = detailingOptions.find((o) => o.id === optionId);
      if (option) total += option.basePrice * vehicle.priceModifier;
    });
    
    // Options Meca
    selectedMechanicOptions.forEach((optionId) => {
      const option = mechanicOptions.find((o) => o.id === optionId);
      if (option) total += option.basePrice;
    });
    
    return Math.round(total);
  };

  const toggleDetailingOption = (optionId: string) => {
    setSelectedDetailingOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  const toggleMechanicOption = (optionId: string) => {
    setSelectedMechanicOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.phone;

  const canProceed = () => {
    switch (step) {
      case 1: return selectedVehicle !== null;
      case 2: return selectedPack !== null; // Simplifié pour la démo
      case 3: return selectedDate !== null && selectedTime !== null;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="container px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 text-sm text-primary mb-6">
              <Calendar className="w-4 h-4" />
              Réservation en ligne
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Réservez Votre Créneau
            </h1>
            <p className="text-muted-foreground normal-case tracking-normal">
              Configurez votre prestation en quelques clics
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container px-4 md:px-6 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {['Véhicule', 'Prestations', 'Date', 'Confirmation'].map((label, index) => (
              <div key={label} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step > index + 1
                      ? 'bg-primary text-primary-foreground'
                      : step === index + 1
                      ? 'bg-primary text-primary-foreground shadow-glow'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`hidden sm:block ml-2 text-sm ${step === index + 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {label}
                </span>
                {index < 3 && (
                  <div className={`hidden sm:block w-12 h-px mx-4 ${step > index + 1 ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 min-h-[60vh]">
        <div className="container px-4 md:px-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Vehicle Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="font-display text-2xl font-bold mb-2 text-center">
                  Quel type de véhicule ?
                </h2>
                <p className="text-muted-foreground text-center mb-8 normal-case tracking-normal">
                  Le tarif est ajusté selon la taille de votre véhicule
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {vehicleTypes.map((vehicle) => (
                    <motion.button
                      key={vehicle.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                      className={`glass-card p-6 text-left transition-all ${
                        selectedVehicle === vehicle.id
                          ? 'border-primary shadow-glow'
                          : 'hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <vehicle.icon className={`w-8 h-8 mt-1  ${selectedVehicle === vehicle.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="flex-1">
                          <h3 className="font-display font-semibold text-lg">{vehicle.name}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{vehicle.description}</p>
                          <p className="text-xs text-muted-foreground">{vehicle.examples}</p>
                        </div>
                        {selectedVehicle === vehicle.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* --- STEP 2: PRESTATIONS  --- */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto"
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold font-display text-white">Sélection des Services</h2>
                  <p className="text-muted-foreground mt-2">Construisez votre formule idéale</p>
                </div>

                {/* SECTION 1 : PACK PRINCIPAL  */}
                <div className="mb-12">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 pl-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    1. Choisissez votre base (Obligatoire)
                  </h3>
                  
                  <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                    {detailingPacks.map((pack) => {
                      const isSelected = selectedPack === pack.id;
                      const price = Math.round(pack.basePrice * (getVehicle()?.priceModifier || 1));

                      return (
                        <motion.div
                          layout 
                          key={pack.id}
                          onClick={() => setSelectedPack(pack.id)}
                          className={`relative cursor-pointer transition-colors duration-300 group ${
                            isSelected ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                          }`}
                        >
                          <div className="p-5 flex items-start gap-5">
                            
                            {/* ICÔNE */}
                            <div className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                              isSelected 
                                ? 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.3)] scale-110' 
                                : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-300'
                            }`}>
                              <pack.icon className="w-6 h-6" />
                            </div>

                            <div className="flex-1 pt-1">
                              <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-3">
                                    <h4 className={`text-lg font-bold transition-colors ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                      {pack.name}
                                    </h4>
                                    {/* BADGE POPULAIRE */}
                                    {pack.popular && (
                                      <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                                        Recommandé
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Résumé court */}
                                  {!isSelected && (
                                    <motion.p 
                                      initial={{ opacity: 0 }} 
                                      animate={{ opacity: 1 }} 
                                      className="text-sm text-muted-foreground mt-1"
                                    >
                                      {pack.features.slice(0, 3).join(' • ')}...
                                    </motion.p>
                                  )}
                                </div>

                                <div className="text-right">
                                  <span className={`block text-xl font-bold transition-colors ${isSelected ? 'text-primary' : 'text-white'}`}>
                                    {price}€
                                  </span>
                                </div>
                              </div>
                              
                              {/* ACCORDÉON DÉTAILS */}
                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pt-4 mt-3 border-t border-white/5">
                                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        INCLUS DANS CE PACK :
                                      </p>
                                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                                        {pack.features.map((f, i) => (
                                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            <span className="opacity-90">{f}</span>
                                          </li>
                                        ))}
                                      </ul>
                                      <div className="mt-4 flex items-center gap-2 text-xs text-primary font-medium bg-primary/10 w-fit px-3 py-1.5 rounded-full">
                                        <Clock className="w-3 h-3" />
                                        Durée estimée : {pack.duration}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                          
                          {/* LIGNE ACTIVE (Barre Gauche) */}
                          {isSelected && (
                            <motion.div 
                              layoutId="active-pack-line"
                              className="absolute left-0 top-0 bottom-0 w-1 bg-primary" 
                              transition={{ 
                                type: "spring", 
                                stiffness: 300, 
                                damping: 30 
                              }}
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* --- BLOC 1 : OPTIONS DETAILING (Esthétique) --- */}
                <div className="mb-10">
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary mb-4 pl-2">
                    <Sparkles className="w-4 h-4" />
                    Options Esthétiques
                  </h3>

                  <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                    {detailingOptions.map((opt) => {
                      const isSelected = selectedDetailingOptions.includes(opt.id);
                      const price = Math.round(opt.basePrice * (getVehicle()?.priceModifier || 1));

                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleDetailingOption(opt.id)}
                          className="group p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-all"
                        >
                          {/* Infos Option */}
                          <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl transition-colors ${
                              isSelected ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-500'
                            }`}>
                              <opt.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className={`font-medium transition-colors ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                {opt.name}
                              </div>
                              {opt.desc && <div className="text-xs text-gray-600 mt-0.5">{opt.desc}</div>}
                            </div>
                          </div>

                          {/* Prix + Switch */}
                          <div className="flex items-center gap-5">
                            <span className="font-bold text-sm text-gray-300">+{price}€</span>
                            
                            {/* Switch Bleu */}
                            <div className={`w-12 h-7 rounded-full transition-colors relative ${
                              isSelected ? 'bg-primary' : 'bg-white/10'
                            }`}>
                              <motion.div 
                                initial={false}
                                animate={{ x: isSelected ? 22 : 2 }}
                                className="absolute top-1 left-0 w-5 h-5 rounded-full bg-white shadow-sm"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* --- BLOC 2 : OPTIONS MECANIQUE (Technique) --- */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-orange-500 mb-4 pl-2">
                    <Wrench className="w-4 h-4" />
                    Entretien Mécanique
                  </h3>

                  <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                    {mechanicOptions.map((opt) => {
                      const isSelected = selectedMechanicOptions.includes(opt.id);
                      
                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleMechanicOption(opt.id)}
                          className="group p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-all"
                        >
                          {/* Infos Option */}
                          <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl transition-colors ${
                              isSelected ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 text-gray-500'
                            }`}>
                              <opt.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className={`font-medium transition-colors ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                {opt.name}
                              </div>
                              <div className="text-xs text-gray-600 mt-0.5">Entretien courant</div>
                            </div>
                          </div>

                          {/* Prix + Switch */}
                          <div className="flex items-center gap-5">
                            <span className="font-bold text-sm text-gray-300">+{opt.basePrice}€</span>
                            
                            {/* Switch Orange */}
                            <div className={`w-12 h-7 rounded-full transition-colors relative ${
                              isSelected ? 'bg-orange-500' : 'bg-white/10'
                            }`}>
                              <motion.div 
                                initial={false}
                                animate={{ x: isSelected ? 22 : 2 }}
                                className="absolute top-1 left-0 w-5 h-5 rounded-full bg-white shadow-sm"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Date Selection  */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto pb-10"
              >
                <style>{`
                  .no-scrollbar::-webkit-scrollbar { display: none; }
                  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>

                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold font-display text-white">
                    Planning
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Sélectionnez votre date d'intervention
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-stretch">
                  
                  {/* --- BLOC CALENDRIER (Gauche) --- */}
                  <div className="w-full md:w-3/5 bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-lg font-bold capitalize text-white pl-2">
                        {new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentMonth)}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            const newDate = new Date(currentMonth);
                            newDate.setMonth(newDate.getMonth() - 1);
                            if (newDate >= new Date(new Date().setDate(1))) setCurrentMonth(newDate); 
                          }}
                          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4"/>
                        </button>
                        <button 
                          onClick={() => {
                            const newDate = new Date(currentMonth);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setCurrentMonth(newDate);
                          }}
                          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                        >
                          <ChevronRight className="w-4 h-4"/>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 mb-2">
                      {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                        <div key={i} className="text-center text-xs font-bold text-gray-500 py-2">{d}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 sm:gap-2 content-start">
                      {(() => {
                        const year = currentMonth.getFullYear();
                        const month = currentMonth.getMonth();
                        const firstDayOfMonth = new Date(year, month, 1).getDay();
                        const daysInMonth = new Date(year, month + 1, 0).getDate();
                        const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
                        const days = [];
                        
                        for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} className="w-full aspect-square" />);

                        for (let d = 1; d <= daysInMonth; d++) {
                          const dateObj = new Date(year, month, d);
                          const isSelected = selectedDate?.toDateString() === dateObj.toDateString();
                          const isToday = new Date().toDateString() === dateObj.toDateString();
                          const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                          const todayReset = new Date(); todayReset.setHours(0,0,0,0);
                          const isPast = dateObj < todayReset;
                          const isAvailable = !isWeekend && !isPast;

                          days.push(
                            <button
                              key={d}
                              disabled={!isAvailable}
                              onClick={() => { setSelectedDate(dateObj); setSelectedTime(null); }}
                              className={`w-full aspect-square relative rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                                isSelected
                                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(var(--primary),0.4)] z-10'
                                  : !isAvailable
                                  ? 'text-gray-700 cursor-not-allowed opacity-50'
                                  : 'text-gray-300 hover:bg-white/10 hover:text-white bg-white/[0.02]'
                              } ${isToday && !isSelected ? 'border border-primary/40 text-primary' : ''}`}
                            >
                              {d}
                              {isAvailable && !isSelected && <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-white/30" />}
                            </button>
                          );
                        }
                        return days;
                      })()}
                    </div>
                  </div>

                  {/* --- BLOC HORAIRES (Droite) --- */}
                  <div className="w-full md:w-2/5 bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 flex flex-col">
                    <div className="mb-4 pb-4 border-b border-white/10 flex-shrink-0">
                       <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Date sélectionnée</h3>
                       <p className="text-white text-lg font-bold capitalize">
                         {selectedDate 
                           ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(selectedDate)
                           : 'Aucune date'}
                       </p>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-[300px]">
                      <AnimatePresence mode="wait">
                        {selectedDate ? (
                          <motion.div
                            key={selectedDate.toString()}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3"
                          >
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 mt-2">
                              Créneaux disponibles
                            </h3>
                            
                            {['09:00', '10:30', '14:00', '16:30'].map((time) => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`w-full py-4 px-5 rounded-xl text-sm font-bold transition-all flex justify-between items-center ${
                                  selectedTime === time
                                    ? 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.4)] scale-[1.02] border-primary' 
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:pl-6 border border-white/5'
                                }`}
                              >
                                {time}
                                {selectedTime === time && <Check className="w-4 h-4 text-white"/>}
                              </button>
                            ))}
                            
                            {/* 1. CALCUL DE LA DURÉE ESTIMÉE */}
                            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                              <p className="text-xs text-blue-200 flex gap-2 leading-relaxed">
                                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>
                                  Durée estimée : <strong className="text-white">
                                    {(() => {
                                      let hours = 0;
                                      // Base Pack
                                      if (selectedPack === 'essentiel') hours += 2.5;
                                      else if (selectedPack === 'renovation') hours += 7;
                                      else if (selectedPack === 'ceramique') hours += 18;
                                      
                                      // + Options (45min par option)
                                      hours += (selectedDetailingOptions.length + selectedMechanicOptions.length) * 0.75;
                                      
                                      // Ajustement taille véhicule
                                      const vehicle = getVehicle();
                                      if (vehicle) hours *= vehicle.priceModifier; // +15%, +30% etc.
                                      
                                      // Formatage
                                      if (hours > 10) return Math.round(hours / 8) + ' jours';
                                      const h = Math.floor(hours);
                                      const m = Math.round((hours - h) * 60);
                                      return `${h}h${m > 0 ? m : ''}`;
                                    })()}
                                  </strong>
                                  . <br/>Merci d'arriver 5min avant.
                                </span>
                              </p>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 text-center">
                             <p>Veuillez choisir une date.</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Coordonnées & Confirmation (Equal Height) */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-6xl mx-auto pb-10"
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold font-display text-white">
                    Finalisation
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Dernière étape avant de valider votre rendez-vous
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                  
                  {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
                  <div className="flex flex-col"> 
                    
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 md:p-8 h-full">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary">
                          <User className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Vos Coordonnées</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-400 ml-1">Prénom *</label>
                          <div className="relative">
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="Jean"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary transition-all"
                            />
                            <User className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-400 ml-1">Nom *</label>
                          <div className="relative">
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Dupont"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary transition-all"
                            />
                            <User className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-medium text-gray-400 ml-1">Email *</label>
                          <div className="relative">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="jean.dupont@email.com"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary transition-all"
                            />
                            <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-medium text-gray-400 ml-1">Téléphone *</label>
                          <div className="relative">
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="06 12 34 56 78"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary transition-all"
                            />
                            <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-2 mt-2">
                          <label className="text-sm font-medium text-gray-400 ml-1">Demande particulière (Optionnel)</label>
                          <div className="relative">
                            <textarea
                              name="notes"
                              value={formData.notes}
                              onChange={handleInputChange}
                              placeholder="Code d'accès, précisions sur le véhicule, siège bébé..."
                              rows={3}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary transition-all resize-none"
                            />
                            <MessageSquare className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --- COLONNE DROITE : RÉCAPITULATIF --- */}
                  <div className="flex flex-col">
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 h-full flex flex-col justify-between">
                      
                      {/* Partie Haute du Ticket */}
                      <div>
                        <h3 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-3">
                          <span className="w-1.5 h-6 bg-primary rounded-full"/>
                          Récapitulatif
                        </h3>

                        <div className="space-y-6">
                          {/* 1. Véhicule */}
                          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                             <div className="p-2 bg-black rounded-lg border border-white/10 text-gray-400">
                               {(() => {
                                 const v = getVehicle();
                                 const Icon = v?.icon || Car;
                                 return <Icon className="w-5 h-5" />;
                               })()}
                             </div>
                             <div>
                               <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Véhicule</p>
                               <p className="text-white font-bold">{getVehicle()?.name || 'Non sélectionné'}</p>
                             </div>
                          </div>

                          {/* 2. Date & Heure */}
                          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                             <div className="p-2 bg-black rounded-lg border border-white/10 text-gray-400">
                               <CalendarIcon className="w-5 h-5" />
                             </div>
                             <div>
                               <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Date & Heure</p>
                               <p className="text-white font-bold capitalize">
                                 {selectedDate 
                                   ? new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(selectedDate)
                                   : '--'}
                               </p>
                               <p className="text-primary text-sm font-medium">
                                 à {selectedTime || '--:--'}
                               </p>
                             </div>
                          </div>

                          <div className="border-t border-white/10 border-dashed my-2" />

                          {/* 3. Liste des Services */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="text-gray-300 font-medium">
                                {detailingPacks.find(p => p.id === selectedPack)?.name}
                              </span>
                              <span className="text-white font-bold">
                                {Math.round((detailingPacks.find(p => p.id === selectedPack)?.basePrice || 0) * (getVehicle()?.priceModifier || 1))}€
                              </span>
                            </div>

                            {selectedDetailingOptions.map(id => {
                              const opt = detailingOptions.find(o => o.id === id);
                              if (!opt) return null;
                              return (
                                <div key={id} className="flex justify-between items-start text-sm text-gray-500">
                                  <span>+ {opt.name}</span>
                                  <span>{Math.round(opt.basePrice * (getVehicle()?.priceModifier || 1))}€</span>
                                </div>
                              );
                            })}

                            {selectedMechanicOptions.map(id => {
                               const opt = mechanicOptions.find(o => o.id === id);
                               if (!opt) return null;
                               return (
                                 <div key={id} className="flex justify-between items-start text-sm text-gray-500">
                                   <span>+ {opt.name}</span>
                                   <span>{opt.basePrice}€</span>
                                 </div>
                               );
                            })}
                          </div>

                          <div className="border-t border-white/10 my-2" />

                          {/* 4. TOTAL */}
                          <div className="flex justify-between items-end mb-8">
                            <span className="text-gray-400 font-medium mb-1">Total estimé</span>
                            <span className="text-4xl font-bold text-primary tracking-tight">
                              {calculateTotal()}€
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Partie Basse (Bouton) */}
                      <div>
                        <button 
                          disabled={!isFormValid}
                          className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                            isFormValid 
                              ? 'bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.3)] transform hover:-translate-y-1' 
                              : 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5'
                          }`}
                        >
                          {isFormValid ? (
                            <>Confirmer le RDV <ChevronRight className="w-5 h-5" /></>
                          ) : (
                            'Remplissez vos infos'
                          )}
                        </button>

                        <p className="text-center text-xs text-gray-600 mt-4">
                          Paiement sur place • Annulation gratuite jusqu'à 24h
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-xl border-t border-border py-4">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                step === 1
                  ? 'text-muted-foreground cursor-not-allowed'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Retour
            </button>

            {/* Price Preview */}
            {(selectedPack || selectedDetailingOptions.length > 0 || selectedMechanicOptions.length > 0) && step < 4 && (
              <div className="text-center">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="block text-xl font-bold text-primary">{calculateTotal()}€</span>
              </div>
            )}

            <button
              onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                canProceed()
                  ? 'btn-premium'
                  : 'bg-secondary text-muted-foreground cursor-not-allowed'
              }`}
            >
              {step === totalSteps ? 'Terminer' : 'Continuer'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
