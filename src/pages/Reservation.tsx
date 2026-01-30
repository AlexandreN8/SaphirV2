import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { 
  Car, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  Check, 
  Sparkles, 
  Shield,
  Droplet,
  Wrench,
  Disc,
  Gauge,
  Clock,
  Crown,
  Settings
} from 'lucide-react';

// Vehicle types
const vehicleTypes = [
  {
    id: 'citadine',
    name: 'Citadine',
    description: 'Petites voitures compactes',
    examples: 'Clio, 208, Polo',
    priceModifier: 1,
    icon: '🚗',
  },
  {
    id: 'berline',
    name: 'Berline / Coupé',
    description: 'Véhicules standards',
    examples: 'Classe C, A4, Serie 3',
    priceModifier: 1.15,
    icon: '🚘',
  },
  {
    id: 'suv',
    name: 'SUV / Break',
    description: 'Véhicules de taille moyenne',
    examples: 'X3, Q5, GLC',
    priceModifier: 1.3,
    icon: '🚙',
  },
  {
    id: 'premium',
    name: 'Premium / Utilitaire',
    description: 'Grands véhicules',
    examples: 'Classe S, X5, Range Rover',
    priceModifier: 1.5,
    icon: '🏎️',
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

// Detailing Options (multiple can be selected)
const detailingOptions = [
  { id: 'phares', name: 'Rénovation phares', basePrice: 79, icon: Crown },
  { id: 'cuir', name: 'Traitement cuir complet', basePrice: 149, icon: Sparkles },
  { id: 'ozone', name: 'Traitement anti-odeur ozone', basePrice: 49, icon: Settings },
  { id: 'jantes_ceramique', name: 'Céramique jantes', basePrice: 99, icon: Disc },
];

// Mechanic Options (multiple can be selected)
const mechanicOptions = [
  { id: 'vidange', name: 'Vidange + Filtre', basePrice: 79, icon: Droplet },
  { id: 'plaquettes_av', name: 'Plaquettes AV', basePrice: 89, icon: Disc },
  { id: 'plaquettes_ar', name: 'Plaquettes AR', basePrice: 79, icon: Disc },
  { id: 'geometrie', name: 'Géométrie', basePrice: 89, icon: Gauge },
  { id: 'diagnostic', name: 'Diagnostic', basePrice: 49, icon: Wrench },
];

// Calendar mock data
const generateCalendarDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date,
      available: Math.random() > 0.3,
      slots: Math.random() > 0.5 ? ['09:00', '14:00'] : ['09:00', '11:00', '14:00', '16:00'],
    });
  }
  return days;
};

const calendarDays = generateCalendarDays();

const Reservation = () => {
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [selectedDetailingOptions, setSelectedDetailingOptions] = useState<string[]>([]);
  const [selectedMechanicOptions, setSelectedMechanicOptions] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const totalSteps = 4;

  const getVehicle = () => vehicleTypes.find((v) => v.id === selectedVehicle);

  const calculateTotal = () => {
    const vehicle = getVehicle();
    if (!vehicle) return 0;

    let total = 0;
    
    // Add pack price
    const pack = detailingPacks.find((p) => p.id === selectedPack);
    if (pack) {
      total += pack.basePrice * vehicle.priceModifier;
    }
    
    // Add detailing options
    selectedDetailingOptions.forEach((optionId) => {
      const option = detailingOptions.find((o) => o.id === optionId);
      if (option) {
        total += option.basePrice * vehicle.priceModifier;
      }
    });
    
    // Add mechanic options (no vehicle modifier)
    selectedMechanicOptions.forEach((optionId) => {
      const option = mechanicOptions.find((o) => o.id === optionId);
      if (option) {
        total += option.basePrice;
      }
    });
    
    return Math.round(total);
  };

  const toggleDetailingOption = (optionId: string) => {
    setSelectedDetailingOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const toggleMechanicOption = (optionId: string) => {
    setSelectedMechanicOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedVehicle !== null;
      case 2:
        return selectedPack !== null || selectedDetailingOptions.length > 0 || selectedMechanicOptions.length > 0;
      case 3:
        return selectedDate !== null && selectedTime !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  const getAllSelectedServices = () => {
    const services: { name: string; price: number }[] = [];
    const vehicle = getVehicle();
    if (!vehicle) return services;

    const pack = detailingPacks.find((p) => p.id === selectedPack);
    if (pack) {
      services.push({
        name: pack.name,
        price: Math.round(pack.basePrice * vehicle.priceModifier),
      });
    }

    selectedDetailingOptions.forEach((optionId) => {
      const option = detailingOptions.find((o) => o.id === optionId);
      if (option) {
        services.push({
          name: option.name,
          price: Math.round(option.basePrice * vehicle.priceModifier),
        });
      }
    });

    selectedMechanicOptions.forEach((optionId) => {
      const option = mechanicOptions.find((o) => o.id === optionId);
      if (option) {
        services.push({
          name: option.name,
          price: option.basePrice,
        });
      }
    });

    return services;
  };

  return (
    <Layout>
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
                        <span className="text-4xl">{vehicle.icon}</span>
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

            {/* Step 2: Service Selection */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-5xl mx-auto"
              >
                <h2 className="font-display text-2xl font-bold mb-2 text-center">
                  Choisissez vos prestations
                </h2>
                <p className="text-muted-foreground text-center mb-8 normal-case tracking-normal">
                  Sélectionnez un pack detailing et ajoutez des options selon vos besoins
                </p>

                {/* Detailing Packs Section (Single Selection) */}
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-semibold">Packs Detailing</h3>
                    <span className="text-xs text-muted-foreground">(1 seul choix possible)</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {detailingPacks.map((pack) => (
                      <motion.button
                        key={pack.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPack(selectedPack === pack.id ? null : pack.id)}
                        className={`glass-card p-6 text-left transition-all relative ${
                          selectedPack === pack.id
                            ? 'border-primary shadow-glow'
                            : 'hover:border-primary/30'
                        }`}
                      >
                        {pack.popular && (
                          <span className="absolute -top-2 right-4 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                            Populaire
                          </span>
                        )}
                        <pack.icon className={`w-8 h-8 mb-4 ${selectedPack === pack.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        <h4 className="font-display font-semibold mb-1">{pack.name}</h4>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl font-bold">
                            {Math.round(pack.basePrice * (getVehicle()?.priceModifier || 1))}€
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {pack.duration}
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {pack.features.map((f) => (
                            <li key={f} className="text-xs text-muted-foreground flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-primary" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        {selectedPack === pack.id && (
                          <div className="absolute top-4 right-4">
                            <Check className="w-5 h-5 text-primary" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Detailing Options Section (Multiple Selection) */}
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-semibold">Options Detailing</h3>
                    <span className="text-xs text-muted-foreground">(cumulables)</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {detailingOptions.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleDetailingOption(option.id)}
                        className={`glass-card p-4 text-center transition-all ${
                          selectedDetailingOptions.includes(option.id)
                            ? 'border-primary shadow-glow'
                            : 'hover:border-primary/30'
                        }`}
                      >
                        <option.icon className={`w-6 h-6 mx-auto mb-2 ${selectedDetailingOptions.includes(option.id) ? 'text-primary' : 'text-muted-foreground'}`} />
                        <h4 className="text-sm font-medium mb-1">{option.name}</h4>
                        <span className="text-lg font-bold">
                          {Math.round(option.basePrice * (getVehicle()?.priceModifier || 1))}€
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Mechanic Options Section (Multiple Selection) */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Wrench className="w-5 h-5 text-chrome" />
                    <h3 className="font-display font-semibold">Mécanique Légère</h3>
                    <span className="text-xs text-muted-foreground">(cumulables)</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {mechanicOptions.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleMechanicOption(option.id)}
                        className={`glass-card p-4 text-center transition-all ${
                          selectedMechanicOptions.includes(option.id)
                            ? 'border-chrome shadow-[0_0_30px_hsl(220_5%_75%/0.2)]'
                            : 'hover:border-chrome/30'
                        }`}
                      >
                        <option.icon className={`w-6 h-6 mx-auto mb-2 ${selectedMechanicOptions.includes(option.id) ? 'text-chrome' : 'text-muted-foreground'}`} />
                        <h4 className="text-sm font-medium mb-1">{option.name}</h4>
                        <span className="text-lg font-bold">{option.basePrice}€</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Date Selection */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="font-display text-2xl font-bold mb-2 text-center">
                  Choisissez votre créneau
                </h2>
                <p className="text-muted-foreground text-center mb-8 normal-case tracking-normal">
                  Sélectionnez une date et un horaire disponible
                </p>

                {/* Calendar */}
                <div className="glass-card p-6 mb-6">
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.slice(0, 14).map((day, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!day.available}
                        onClick={() => {
                          setSelectedDate(day.date);
                          setSelectedTime(null);
                        }}
                        className={`p-3 rounded-xl text-center transition-all ${
                          !day.available
                            ? 'opacity-30 cursor-not-allowed'
                            : selectedDate?.toDateString() === day.date.toDateString()
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary hover:bg-secondary/80'
                        }`}
                      >
                        <span className="text-[10px] uppercase text-muted-foreground">
                          {new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(day.date)}
                        </span>
                        <span className="block text-lg font-semibold">{day.date.getDate()}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                  >
                    <h3 className="font-semibold mb-4">{formatDate(selectedDate)}</h3>
                    <div className="flex flex-wrap gap-3">
                      {calendarDays
                        .find((d) => d.date.toDateString() === selectedDate.toDateString())
                        ?.slots.map((time) => (
                          <motion.button
                            key={time}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTime(time)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${
                              selectedTime === time
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary hover:bg-secondary/80'
                            }`}
                          >
                            {time}
                          </motion.button>
                        ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <h2 className="font-display text-2xl font-bold mb-2 text-center">
                  Récapitulatif
                </h2>
                <p className="text-muted-foreground text-center mb-8 normal-case tracking-normal">
                  Vérifiez votre réservation avant confirmation
                </p>

                <div className="glass-card p-8">
                  {/* Vehicle */}
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Car className="w-5 h-5 text-muted-foreground" />
                      <span>Véhicule</span>
                    </div>
                    <span className="font-semibold">{getVehicle()?.name}</span>
                  </div>

                  {/* Services */}
                  <div className="py-4 border-b border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-5 h-5 text-muted-foreground" />
                      <span>Prestations</span>
                    </div>
                    <div className="space-y-2 ml-8">
                      {getAllSelectedServices().map((service, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{service.name}</span>
                          <span className="font-medium">{service.price}€</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <span>Date & Heure</span>
                    </div>
                    <span className="font-semibold">
                      {selectedDate && formatDate(selectedDate)} à {selectedTime}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between py-6">
                    <span className="text-lg font-semibold">Total estimé</span>
                    <span className="text-3xl font-bold text-primary">{calculateTotal()}€</span>
                  </div>

                  <button className="btn-premium w-full text-center mt-4">
                    Confirmer la réservation
                  </button>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Paiement sur place. Annulation gratuite jusqu'à 24h avant.
                  </p>
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
    </Layout>
  );
};

export default Reservation;
