import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Eye } from 'lucide-react';

// Before/After comparisons
const comparisons = [
  {
    id: 1,
    title: 'Mercedes Classe S - Correction Complète',
    description: 'Polissage correction et protection céramique sur peinture noire.',
    before: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&auto=format&fit=crop&q=60',
    after: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c4?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    title: 'Porsche 911 - Rénovation Intérieure',
    description: 'Nettoyage et traitement cuir complet.',
    before: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=60',
    after: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60',
  },
];

// Gallery images
const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=600&auto=format&fit=crop&q=60',
    title: 'BMW M4 Competition',
    category: 'Correction Peinture',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=60',
    title: 'Audi RS6',
    category: 'Protection Céramique',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&auto=format&fit=crop&q=60',
    title: 'Lamborghini Huracán',
    category: 'Detailing Complet',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&auto=format&fit=crop&q=60',
    title: 'Range Rover Sport',
    category: 'Rénovation Intérieure',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&auto=format&fit=crop&q=60',
    title: 'Ferrari 488',
    category: 'Protection Premium',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1592198084033-aade902d1f40?w=600&auto=format&fit=crop&q=60',
    title: 'McLaren 720S',
    category: 'Detailing Complet',
  },
];

// Before/After Slider Component
const BeforeAfterSlider = ({ before, after, title }: { before: string; after: string; title: string }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div
      className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden cursor-ew-resize select-none"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={(e) => {
        if (isDragging) {
          handleMove(e.clientX, e.currentTarget.getBoundingClientRect());
        }
      }}
      onTouchMove={(e) => {
        handleMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
      }}
    >
      {/* After image (background) */}
      <img
        src={after}
        alt={`${title} - Après`}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={before}
          alt={`${title} - Avant`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ minWidth: `${100 / (sliderPosition / 100)}%` }}
        />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-primary shadow-glow cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <Eye className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1 glass-card text-xs font-medium">
        AVANT
      </div>
      <div className="absolute top-4 right-4 px-3 py-1 glass-card text-xs font-medium">
        APRÈS
      </div>
    </div>
  );
};

const Realisations = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="container px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 text-sm text-primary mb-6">
              Portfolio
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Nos Réalisations
            </h1>
            <p className="text-lg text-muted-foreground normal-case tracking-normal">
              Découvrez nos transformations les plus spectaculaires. 
              Chaque véhicule raconte une histoire de renaissance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="section-luxury">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Avant / Après</h2>
            <p className="text-muted-foreground normal-case tracking-normal">Faites glisser pour voir la transformation</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {comparisons.map((comparison, index) => (
              <motion.div
                key={comparison.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <BeforeAfterSlider
                  before={comparison.before}
                  after={comparison.after}
                  title={comparison.title}
                />
                <div className="mt-4">
                  <h3 className="font-display font-semibold">{comparison.title}</h3>
                  <p className="text-sm text-muted-foreground">{comparison.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-luxury relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="container px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Galerie</h2>
            <p className="text-muted-foreground normal-case tracking-normal">Une sélection de nos travaux récents</p>
          </motion.div>

          {/* Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="break-inside-avoid group"
              >
                <div className="glass-card overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500">
                  <div className="relative overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                      <span className="text-xs text-primary font-medium">{image.category}</span>
                      <h3 className="font-display font-semibold">{image.title}</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Realisations;
