import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Crown, Shield, Wrench, Droplet, Disc, Gauge, Settings, ArrowRight, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// Detailing Packages
const detailingPackages = [
  {
    name: 'Pack Essentiel',
    price: '89',
    duration: '2-3h',
    description: 'Le nettoyage premium pour entretenir régulièrement votre véhicule.',
    features: [
      'Lavage extérieur haute pression',
      'Nettoyage jantes & pneus',
      'Aspiration intérieure',
      'Nettoyage vitres int/ext',
      'Dépoussiérage tableau de bord',
    ],
    highlighted: false,
    icon: Droplet,
  },
  {
    name: 'Pack Rénovation',
    price: '249',
    duration: '1 journée',
    description: 'Restauration complète pour redonner vie à votre véhicule.',
    features: [
      'Tout le Pack Essentiel',
      'Décontamination clay bar',
      'Polissage 1 étape',
      'Shampoing sièges & moquettes',
      'Traitement plastiques',
      'Protection cire 3 mois',
    ],
    highlighted: true,
    badge: 'Recommandé',
    icon: Sparkles,
  },
  {
    name: 'Pack Céramique',
    price: '599',
    duration: '2-3 jours',
    description: 'Protection ultime avec revêtement céramique professionnel.',
    features: [
      'Tout le Pack Rénovation',
      'Polissage correction 2 étapes',
      'Protection céramique 9H',
      'Traitement vitres hydrophobe',
      'Traitement cuir premium',
      'Protection 3-5 ans garantie',
    ],
    highlighted: false,
    icon: Shield,
  },
];

// Options supplémentaires
const additionalOptions = [
  { name: 'Rénovation phares', price: '79', icon: Crown },
  { name: 'Traitement cuir complet', price: '149', icon: Sparkles },
  { name: 'Traitement anti-odeur ozone', price: '49', icon: Settings },
  { name: 'Polissage jantes céramique', price: '99', icon: Disc },
];

// Mécanique services
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
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="container px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 text-sm text-primary mb-6">
              Nos Offres
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Prestations & Tarifs
            </h1>
            <p className="text-lg text-muted-foreground normal-case tracking-normal">
              Des formules adaptées à tous les besoins, du nettoyage express 
              à la protection céramique premium.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Detailing Section */}
      <section className="section-luxury">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Detailing</h2>
              <p className="text-muted-foreground normal-case tracking-normal">Esthétique & Protection</p>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {detailingPackages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative ${pkg.highlighted ? 'md:-mt-4 md:mb-4' : ''} ${pkg.badge ? 'pt-4' : ''}`}
              >
                {pkg.badge && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full shadow-lg">
                      {pkg.badge}
                    </span>
                  </div>
                )}
                <div
                  className={`glass-card h-full p-8 flex flex-col transition-all duration-300 ${
                    pkg.highlighted 
                      ? 'border-primary/40 shadow-[0_8px_40px_hsl(210_100%_55%/0.2)] mt-4' 
                      : 'border-white/10 hover:border-primary/30 hover:shadow-[0_8px_32px_hsl(210_100%_55%/0.1)]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg ${
                      pkg.highlighted ? 'bg-primary/20' : 'bg-secondary'
                    } flex items-center justify-center`}>
                      <pkg.icon className={`w-5 h-5 ${pkg.highlighted ? 'text-primary' : 'text-foreground'}`} />
                    </div>
                    <h3 className="font-display text-xl font-semibold">{pkg.name}</h3>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl font-bold">{pkg.price}</span>
                      <span className="text-muted-foreground">€</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{pkg.duration}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">{pkg.description}</p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${
                          pkg.highlighted ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/reservation"
                    className={pkg.highlighted ? 'btn-premium w-full text-center' : 'btn-outline-luxury w-full text-center'}
                  >
                    Réserver
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Options */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-xl font-semibold mb-6">Options Supplémentaires</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {additionalOptions.map((option) => (
                <div key={option.name} className="glass-card p-4 flex items-center justify-between border border-white/10 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <option.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm">{option.name}</span>
                  </div>
                  <span className="font-semibold">{option.price}€</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mécanique Section */}
      <section className="section-luxury relative overflow-hidden">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Wrench className="w-6 h-6 text-chrome" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Mécanique Légère</h2>
              <p className="text-muted-foreground normal-case tracking-normal">Entretien & Réparations</p>
            </div>
          </motion.div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {mechanicServices.map((service, index) => (
              <motion.div
                key={service.category}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card overflow-hidden border border-white/10 hover:border-chrome/30 transition-all duration-500"
              >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                    <service.icon className="w-5 h-5 text-chrome" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{service.category}</h3>
                </div>

                {/* Table */}
                <div className="divide-y divide-white/5">
                  {service.items.map((item) => (
                    <div key={item.name} className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                      <span className="font-mono text-sm text-chrome font-medium">{item.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground mb-4">
              Besoin d'un devis personnalisé pour votre véhicule ?
            </p>
            <Link to="/contact" className="btn-outline-luxury inline-flex">
              Demander un devis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-luxury">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Questions Fréquentes</h2>
              <p className="text-muted-foreground normal-case tracking-normal">Tout ce que vous devez savoir</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="glass-card border-white/10 px-6 rounded-xl overflow-hidden">
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  Combien de temps dure une prestation detailing ?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 normal-case tracking-normal">
                  La durée varie selon le pack choisi : le Pack Essentiel prend 2 à 3 heures, le Pack Rénovation une journée complète, 
                  et le Pack Céramique nécessite 2 à 3 jours pour un résultat optimal. Nous vous informons toujours du temps estimé 
                  lors de la réservation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="glass-card border-white/10 px-6 rounded-xl overflow-hidden">
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  Quelle est la différence entre cire et céramique ?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 normal-case tracking-normal">
                  La cire carnauba offre une brillance exceptionnelle mais dure 2 à 3 mois. La protection céramique 9H crée 
                  une couche permanente sur la peinture, résistante aux rayures légères, aux UV et aux produits chimiques, 
                  avec une garantie de 3 à 5 ans.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="glass-card border-white/10 px-6 rounded-xl overflow-hidden">
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  Dois-je préparer mon véhicule avant de venir ?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 normal-case tracking-normal">
                  Non, amenez simplement votre véhicule tel quel. Nous nous occupons de tout, du nettoyage initial à la 
                  finition. Pensez simplement à retirer vos effets personnels de l'habitacle.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="glass-card border-white/10 px-6 rounded-xl overflow-hidden">
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  Proposez-vous un service de véhicule de courtoisie ?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 normal-case tracking-normal">
                  Pour les prestations de plus d'une journée (Pack Céramique), nous proposons un véhicule de courtoisie 
                  sur réservation préalable, selon disponibilité. Contactez-nous pour en savoir plus.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="glass-card border-white/10 px-6 rounded-xl overflow-hidden">
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  Comment fonctionne la garantie sur les protections céramiques ?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 normal-case tracking-normal">
                  Notre protection céramique est garantie 3 à 5 ans selon le produit choisi. Cette garantie couvre 
                  l'hydrophobie, la brillance et la résistance aux contaminants. Un entretien annuel est recommandé 
                  pour maintenir les performances optimales.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="glass-card border-white/10 px-6 rounded-xl overflow-hidden">
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  Quels moyens de paiement acceptez-vous ?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 normal-case tracking-normal">
                  Nous acceptons les paiements par carte bancaire, espèces et virement. Pour les prestations importantes, 
                  un paiement en plusieurs fois sans frais peut être proposé. Le règlement s'effectue à la restitution 
                  du véhicule.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Tarifs;
