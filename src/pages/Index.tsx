import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Wrench, ChevronRight, Shield, Droplets, Brush, Car, ArrowRight, Play } from 'lucide-react';
import GoogleReviews from '@/components/GoogleReviews';
import heroDetailing from '@/assets/hero-detailing.jpg';
import ceramicCoating from '@/assets/ceramic-coating.jpg';
import meca from '@/assets/meca.jpg';

const processSteps = [
  {
    step: 1,
    title: 'Décontamination',
    description: 'Élimination des contaminants ferreux, goudron et autres impuretés incrustées dans la peinture.',
    icon: Droplets,
  },
  {
    step: 2,
    title: 'Nettoyage Intérieur',
    description: 'Aspiration profonde, shampoing des tissus, traitement cuir et désinfection complète.',
    icon: Brush,
  },
  {
    step: 3,
    title: 'Lavage Extérieur',
    description: 'Méthode deux seaux, mousse active et rinçage haute pression sans micro-rayures.',
    icon: Car,
  },
  {
    step: 4,
    title: 'Correction Peinture',
    description: 'Polissage machine multi-étapes pour éliminer les swirls et restaurer la brillance.',
    icon: Sparkles,
  },
  {
    step: 5,
    title: 'Protection',
    description: 'Application de cire carnauba ou protection céramique pour une brillance durable.',
    icon: Shield,
  },
];

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div>
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background Image */}
        <motion.div 
          style={{ y }}
          className="absolute inset-0 scale-110"
        >
          <img
            src={heroDetailing}
            alt="Luxury car in detailing studio"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        {/* Bottom fade for seamless transition */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-background to-transparent" />
        
        {/* Animated light particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-96 h-96 rounded-full blur-3xl"
              style={{
                background: 'radial-gradient(circle, hsl(210 100% 55% / 0.1) 0%, transparent 70%)',
                left: `${20 + i * 30}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <motion.div style={{ opacity }} className="container relative z-10 px-4 md:px-6 pt-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20 text-sm text-primary mb-6">
                <Sparkles className="w-4 h-4" />
                Centre d'Excellence Automobile
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-6"
            >
              <span className="text-metallic">L'Art du</span>
              <br />
              <span className="text-gradient-accent">Detailing</span>
              <br />
              <span className="text-metallic">Automobile</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 normal-case tracking-normal"
            >
              Sublimez votre véhicule avec notre expertise en esthétique premium 
              et mécanique légère de précision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/reservation" className="group relative inline-flex items-center justify-center overflow-hidden">
                {/* Animated border */}
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-primary/50 to-primary animate-pulse" />
                <span className="absolute inset-[2px] rounded-[10px] bg-background" />
                <span className="relative z-10 flex items-center gap-3 px-8 py-4 font-semibold">
                  <Play className="w-5 h-5 text-primary fill-primary" />
                  <span>Réserver maintenant</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link to="/tarifs" className="btn-outline-luxury">
                Voir nos prestations
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-primary rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Two Poles Section */}
      <section className="section-luxury bg-background">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Deux Expertises, Une Excellence
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto normal-case tracking-normal">
              Notre centre réunit le meilleur du detailing esthétique et de la mécanique de précision.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Detailing Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Link to="/tarifs" className="group block h-full">
                <div className="glass-card h-full overflow-hidden">
                  {/* Image header */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={ceramicCoating} 
                      alt="Application céramique"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                      Detailing
                      <span className="block text-sm font-normal text-muted-foreground mt-1 normal-case tracking-normal">
                        Pôle Esthétique
                      </span>
                    </h3>
                    <p className="text-muted-foreground mb-6 normal-case tracking-normal">
                      Restauration et protection de la beauté de votre véhicule. 
                      Correction peinture, protection céramique, nettoyage intérieur premium.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {['Lavage premium', 'Polissage correction', 'Protection céramique', 'Rénovation cuir'].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center text-primary font-medium">
                      Découvrir les prestations
                      <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Mécanique Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Link to="/tarifs" className="group block h-full">
                <div className="glass-card h-full overflow-hidden">
                  {/* Image header */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={meca} 
                      alt="Polissage automobile"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                        <Wrench className="w-6 h-6 text-chrome" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                      Mécanique
                      <span className="block text-sm font-normal text-muted-foreground mt-1 normal-case tracking-normal">
                        Pôle Technique
                      </span>
                    </h3>
                    <p className="text-muted-foreground mb-6 normal-case tracking-normal">
                      Entretien mécanique de qualité pour maintenir les performances 
                      de votre véhicule. Précision et expertise garanties.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {['Vidange moteur', 'Freins & disques', 'Pneumatiques', 'Diagnostic'].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-chrome" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center text-chrome font-medium">
                      Voir les tarifs
                      <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Timeline Section */}
      <section className="section-luxury relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 text-sm text-primary mb-4">
              Notre Processus
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              L'Excellence en 5 Étapes
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto normal-case tracking-normal">
              Un processus méthodique pour des résultats exceptionnels à chaque intervention.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Gradient vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[3px] md:-translate-x-1/2 timeline-line" />

            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center gap-8 mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot with glow */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                  <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/50 flex items-center justify-center timeline-dot">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'} pl-24 md:pl-0`}>
                  <div className={`glass-card p-6 transition-all duration-300 hover:border-primary/30 ${index % 2 === 0 ? 'md:ml-auto' : ''} max-w-md`}>
                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div>
                        <span className="text-xs text-primary font-medium">Étape {step.step}</span>
                        <h3 className="font-display text-xl font-semibold">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground normal-case tracking-normal">{step.description}</p>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews />

      {/* CTA Section */}
      <section className="section-luxury">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-card to-card" />
            <div className="absolute inset-0" style={{
              backgroundImage: `url(${heroDetailing})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
            }} />
            
            {/* Accent glow */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-primary/20 rounded-full blur-3xl" />
            
            <div className="relative p-8 md:p-16 text-center border border-white/10 rounded-3xl">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Prêt à Sublimer Votre Véhicule ?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 normal-case tracking-normal">
                Réservez votre créneau en ligne et confiez-nous votre véhicule 
                pour une transformation spectaculaire.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/reservation" className="btn-premium">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Réserver maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/realisations" className="btn-outline-luxury">
                  Voir nos réalisations
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
