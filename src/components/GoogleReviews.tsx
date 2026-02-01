import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Melvyn R.',
    rating: 5,
    date: 'Il y a 2 semaines',
    text: 'Mon intérieur était vraiment sale plein de poil de chien il a reussi à tout le ravoir le véhicule et sortit comme neuf même des traces sur les jantes était impossible à sortir il me les a enlever et rendu nickel.',
    avatar: 'MR',
    vehicle: 'Nettoyage Intérieur Complet',
  },
  {
    id: 2,
    name: 'Cecile D.',
    rating: 5,
    date: 'Il y a 1 mois',
    text: 'très beau travail soigné rapport qualité prix défiant toute concurrence je recommande travail irréprochable',
    avatar: 'CD',
    vehicle: 'Detailing Premium',
  },
  {
    id: 3,
    name: 'Laure H.',
    rating: 5,
    date: 'Il y a 1 mois',
    text: 'Au top ! Ma voiture était bien dégueu avec les poils du chien...ect...ect...j\'ai récupéré après 1h mon véhicule quasi neuf et parfumé ! Je recommande fortement Saphir Detailing ! Il n\'a pas un atelier \"de riche\" mais pour moi le résultat est là, et c\'était bien ma priorité à prix correcte.',
    avatar: 'LH',
    vehicle: 'BMW M4',
  },
  {
    id: 4,
    name: 'Alexandre N.',
    rating: 5,
    date: 'Il y a 2 mois',
    text: 'Travail soigné et de qualité. Je recommande vivement Saphir Detailing pour le nettoyage intérieur et extérieur de votre véhicule. Professionnel, à l\'écoute et passionné par son métier.',
    avatar: 'AN',
    vehicle: 'Golf 7',
  },
];

const GoogleReviews = () => {
  return (
    <section className="section-luxury relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <span className="text-2xl font-bold">4.9</span>
            <span className="text-muted-foreground">sur Google</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            La satisfaction de nos clients est notre meilleure carte de visite.
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-6 h-full border border-white/10 hover:border-primary/50 hover:shadow-[0_0_30px_hsl(210_100%_55%/0.2)] transition-all duration-500">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-primary/30 mb-4" />

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-sm text-muted-foreground mb-6 line-clamp-4">
                  "{review.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.vehicle}</p>
                  </div>
                </div>

                {/* Date */}
                <p className="text-xs text-muted-foreground mt-4">{review.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <a
            href="https://google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 glass-card border border-white/10 hover:border-primary/50 transition-all duration-300"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-medium">Voir tous les avis sur Google</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GoogleReviews;
