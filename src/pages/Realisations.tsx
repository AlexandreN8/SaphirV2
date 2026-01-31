import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Camera, Wand2, ArrowRight, Layers, Sparkles } from 'lucide-react';
import SeoHead from '@/components/SeoHead';

// --- DATA ---
const comparisons = [
  {
    id: 1,
    title: 'Mercedes Classe S',
    subtitle: 'Correction Complète',
    description: 'Suppression des micro-rayures (swirls) et application céramique Gtechniq.',
    before: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&auto=format&fit=crop&q=80',
    after: 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Porsche 911 Turbo',
    subtitle: 'Rénovation Cuir',
    description: 'Nettoyage en profondeur, repigmentation et soin nourrissant des cuirs.',
    before: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80',
    after: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
  },
];

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=800&auto=format&fit=crop&q=80',
    title: 'BMW M4 Competition',
    category: 'Correction Peinture',
    size: 'large' 
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80',
    title: 'Audi RS6',
    category: 'Protection Céramique',
    size: 'small'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&auto=format&fit=crop&q=80',
    title: 'Lamborghini Huracán',
    category: 'Detailing Complet',
    size: 'small'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&auto=format&fit=crop&q=80',
    title: 'Range Rover Sport',
    category: 'Rénovation Intérieure',
    size: 'small'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop&q=80',
    title: 'Ferrari 488',
    category: 'Protection Premium',
    size: 'large'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1592198084033-aade902d1f40?w=800&auto=format&fit=crop&q=80',
    title: 'McLaren 720S',
    category: 'Detailing Complet',
    size: 'small'
  },
];

// --- COMPONENT SLIDER AVANT/APRÈS ---
const BeforeAfterSlider = ({ before, after }: { before: string; after: string }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group select-none">
      
      {/* Interaction Layer */}
      <div
        className="absolute inset-0 z-20 cursor-ew-resize"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={(e) => isDragging && handleMove(e.clientX, e.currentTarget.getBoundingClientRect())}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
        onClick={(e) => handleMove(e.clientX, e.currentTarget.getBoundingClientRect())}
      />

      {/* Image APRÈS (Fond) */}
      <img src={after} alt="Après" className="absolute inset-0 w-full h-full object-cover" />

      {/* Image AVANT (Masquée) */}
      <div
        className="absolute inset-0 overflow-hidden border-r-2 border-primary/50"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={before}
          alt="Avant"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ minWidth: `${100 / (sliderPosition / 100)}%` }}
        />
        
        <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Slider Handle (Le bouton central) */}
      <div
        className="absolute top-0 bottom-0 w-1 pointer-events-none z-30"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110">
           <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg text-white">
             <Eye className="w-4 h-4" />
           </div>
        </div>
      </div>

      {/* Labels Flottants */}
      <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold tracking-widest text-white/80 pointer-events-none">
        AVANT
      </div>
      <div className="absolute bottom-6 right-6 px-4 py-2 bg-primary/80 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold tracking-widest text-white pointer-events-none">
        APRÈS
      </div>
    </div>
  );
};

const Realisations = () => {
  return (
    <>
      <SeoHead 
        title="Nos Réalisations & Avant/Après - Saphir Detailing"
        description="Galerie de nos rénovations automobiles : Porsches, Audi, BMW sublimées. Photos de polissages, corrections de rayures et protections céramique Gyeon."
      />
      
      <div className="bg-[#050505] min-h-screen relative overflow-x-hidden">
        
        {/* --- BACKGROUND ATMOSPHERE --- */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen opacity-50" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[100px] rounded-full mix-blend-screen opacity-40" />
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"
            style={{ maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)' }}
          />
        </div>

        {/* --- HERO SECTION --- */}
        <section className="pt-32 pb-20 relative z-10">
          <div className="container px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6 backdrop-blur-md">
                <Camera className="w-3 h-3" />
                <span>Portfolio & Galerie</span>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight leading-tight">
                L'Art de la <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-gray-400">
                  Transformation
                </span>
              </h1>
              
              <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-2">
                La perfection n'est pas un détail, c'est l'accumulation de détails.
                Découvrez la métamorphose des véhicules qui passent entre nos mains.
              </p>
            </motion.div>
          </div>
        </section>

        {/* --- BEFORE / AFTER SECTION (Focus) --- */}
        <section className="py-20 relative z-10">
          <div className="container px-4 md:px-6">
            {/* Titre de section stylisé */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg">
                  <Wand2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Avant / Après</h2>
                  <p className="text-gray-400 text-sm">Le pouvoir du detailing en image</p>
                </div>
              </div>
            </div>

            <div className="space-y-24">
              {comparisons.map((comparison, index) => (
                <motion.div
                  key={comparison.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className="group"
                >
                  {/* Header du projet */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 px-2 gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-display text-2xl md:text-3xl font-bold text-white">{comparison.title}</h3>
                        <div className="h-px w-12 bg-white/20 hidden md:block" />
                        <span className="text-primary font-medium tracking-wide text-sm uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                          {comparison.subtitle}
                        </span>
                      </div>
                      <p className="text-gray-400">{comparison.description}</p>
                    </div>
                  </div>

                  {/* Le Slider */}
                  <BeforeAfterSlider 
                    before={comparison.before}
                    after={comparison.after}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- GALLERY SECTION --- */}
        <section className="py-20 relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-black/50">
          <div className="container px-4 md:px-6">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Galerie</h2>
                <p className="text-gray-400 text-sm">Sélection de projets récents</p>
              </div>
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="break-inside-avoid"
                >
                  <div className="group relative rounded-2xl overflow-hidden bg-[#121212] border border-white/10 hover:border-white/30 transition-all duration-500 cursor-zoom-in">
                    
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Contenu au survol */}
                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                            {image.category}
                          </p>
                          <h3 className="font-display text-xl font-bold text-white group-hover:text-white transition-colors">
                            {image.title}
                          </h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rotate-45 group-hover:rotate-0">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.5),transparent_70%)]" />
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-gray-500 text-sm mb-6">Suivez-nous sur Instagram pour voir nos stories quotidiennes</p>
              <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-medium">
                <Sparkles className="w-4 h-4" />
                Voir plus sur Instagram
              </a>
            </div>

          </div>
        </section>
      </div>
    </>
  );
};

export default Realisations;