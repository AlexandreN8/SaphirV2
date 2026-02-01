import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Camera, Wand2, Sparkles } from 'lucide-react';
import SeoHead from '@/components/SeoHead';

// IMAGES
import imgInterieur1 from '@/assets/realisations/mot_before.jpeg';
import imgInterieur2 from '@/assets/realisations/mot_after.jpeg';
import imgExterieur1 from '@/assets/realisations/ext_before.jpeg';
import imgExterieur2 from '@/assets/realisations/ext_after.jpeg';

import imgExtB1 from '@/assets/grid/exterieur_before.jpeg';
import imgExtB2 from '@/assets/grid/exterieur_after.jpeg';
import imgIntI1 from '@/assets/grid/pe2.jpeg';
import imgIntI2 from '@/assets/grid/pe1.jpeg';
import phare1 from '@/assets/grid/phare_before.jpeg';
import phare2 from '@/assets/grid/phare_after.jpeg';
import dacia1 from '@/assets/grid/dacia1.jpeg';
import dacia2 from '@/assets/grid/dacia2.jpeg';
import coffre1 from '@/assets/grid/coffre1.jpeg';
import coffre2 from '@/assets/grid/coffre2.jpeg';
import board1 from '@/assets/grid/boardB1.jpeg';
import board2 from '@/assets/grid/boardB2.jpeg';

// --- DATA ---
const comparisons = [
  {
    id: 1,
    title: 'Soin Exterieur',
    subtitle: 'Correction Complète',
    description: 'Suppression des micro-rayures (swirls) et application céramique Gtechniq.',
    alt: 'Rénovation Extérieure d\'une citadine',
    before: imgExterieur1,
    after: imgExterieur2,
  },
  {
    id: 2,
    title: 'Soin du détail',
    subtitle: 'Rénovation Moteur',
    description: 'Nettoyage complet du compartiment moteur avec produits spécifiques.',
    alt: 'Rénovation Moteur d\'un véhicule',
    before: imgInterieur1,
    after: imgInterieur2,
  },
];

// --- GALERIE ---
const galleryImages = [
  {
    id: 1,
    after: imgExtB2, 
    before: imgExtB1, 
    title: 'Utilitaire',
    category: 'Rénovation Extérieure',
  },
  {
    id: 2,
    after: imgIntI2, 
    before: imgIntI1, 
    title: 'Rénovation Intérieure',
    category: 'Pédalier Boueux',
  },
  {
    id: 3,
    after: phare2, 
    before: phare1,
    title: 'Rénovation Optiques',
    category: 'Polissage Phare',
  },
  {
    id: 4,
    after: dacia2, 
    before: dacia1, 
    title: 'Rénovation Intérieure',
    category: 'Soin Intérieur',
  },
  {
    id: 5,
    after: coffre2, 
    before: coffre1, 
    title: 'Rénovation Coffre',
    category: 'Poils d\'Animaux',
  },
  {
    id: 6,
    after: board2, 
    before: board1,
    title: 'Rénovation Plastiques',
    category: 'Protection Premium',
  },
];

// --- COMPONENT SLIDER ---
const BeforeAfterSlider = ({ before, after, alt }: { before: string; after: string; alt: string }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group select-none">
      <div
        className="absolute inset-0 z-20 cursor-ew-resize"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={(e) => isDragging && handleMove(e.clientX, e.currentTarget.getBoundingClientRect())}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
        onClick={(e) => handleMove(e.clientX, e.currentTarget.getBoundingClientRect())}
      />
      <img src={after} alt={`Après - ${alt}`} className="absolute inset-0 w-full h-full object-cover" />
      <div
        className="absolute inset-0 overflow-hidden border-r-2 border-primary/50"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={before}
          alt={`Avant - ${alt}`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ minWidth: `${100 / (sliderPosition / 100)}%` }}
        />
        <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
      </div>
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
        description="Galerie de nos rénovations automobiles."
      />
      
      <div className="bg-[#050505] min-h-screen relative overflow-x-hidden">
        
        {/* Background Atmosphere */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen opacity-50" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[100px] rounded-full mix-blend-screen opacity-40" />
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"
            style={{ maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)' }}
          />
        </div>

        {/* HERO SECTION */}
        <section className="pt-32 pb-20 relative z-10">
          <div className="container px-4 md:px-6 text-center mx-auto max-w-6xl">
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
            </motion.div>
          </div>
        </section>

        {/* --- SECTION AVANT / APRÈS --- */}
        <section className="py-20 relative z-10">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg">
                <Wand2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Avant / Après</h2>
                <p className="text-gray-400 text-sm">Le pouvoir du detailing en image</p>
              </div>
            </div>

            <div className="space-y-24">
              {comparisons.map((comparison) => (
                <motion.div
                  key={comparison.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className="group"
                >
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
                  <BeforeAfterSlider before={comparison.before} after={comparison.after} alt={comparison.alt} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SECTION GALERIE --- */}
        <section className="py-24 px-4 bg-[#080808]">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold font-display">Notre Galerie</h2>
                <p className="text-gray-500">Un aperçu de notre travail minutieux</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }} 
                >
                  <div className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:border-primary/50 cursor-pointer">
                    <img
                      src={image.after}
                      alt={`${image.title} - Après Detailing`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                      <img
                        src={image.before}
                        alt={`${image.title} - Avant Detailing`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-bold text-white tracking-widest">
                        ÉTAT INITIAL
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">
                        {image.category}
                      </p>
                      <h3 className="font-display text-lg font-bold text-white">
                        {image.title}
                      </h3>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent_70%)]" />
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <a 
                href="https://www.instagram.com/saphir_detailing09/?utm_source=ig_web_button_share_sheet" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-medium"
              >
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