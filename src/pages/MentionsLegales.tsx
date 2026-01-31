import SeoHead from '@/components/SeoHead';
import { Shield } from 'lucide-react';

const MentionsLegales = () => {
  return (
    <>
      <SeoHead 
        title="Mentions Légales - Saphir Detailing"
        description="Informations légales, éditeur du site, hébergeur et politique de confidentialité de Saphir Detailing."
      />

      <div className="min-h-screen bg-[#050505] text-gray-300 py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Mentions Légales</h1>
            <p className="text-gray-500">En vigueur au 01/02/2026</p>
          </div>

          <div className="space-y-8">
            <section className="bg-[#0f0f0f] border border-white/5 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-white mb-4">1. Éditeur du Site</h2>
              <p className="mb-2">Le site <strong>saphir-detailing.fr</strong> est édité par :</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                <li><strong>Raison sociale / Nom :</strong> Saphir Detailing</li>
                <li><strong>Statut Juridique :</strong> Auto-entrepreneur </li>
                <li><strong>Siège Social :</strong> 295 Route d'Aulus, Oust 09140</li>
                <li><strong>SIRET :</strong> 79834517900047 </li>
                <li><strong>Email :</strong> saphir.detailing@gmail.com</li>
                <li><strong>Téléphone :</strong> 06 68 04 84 06 27</li>
                <li><strong>Directeur de publication :</strong> Novais</li>
              </ul>
            </section>

            <section className="bg-[#0f0f0f] border border-white/5 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-white mb-4">2. Hébergement</h2>
              <p>Le site est hébergé par :</p>
              <p className="mt-2 text-white font-bold">Vercel Inc.</p>
              <p>440 N Barranca Ave #4133<br/>Covina, CA 91723<br/>États-Unis</p>
            </section>

            <section className="bg-[#0f0f0f] border border-white/5 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-white mb-4">3. Propriété Intellectuelle</h2>
              <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques (photos des réalisations).</p>
            </section>

            <section className="bg-[#0f0f0f] border border-white/5 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-white mb-4">4. Données Personnelles (RGPD)</h2>
              <p className="mb-4">Les informations recueillies via le formulaire de réservation (Nom, Email, Téléphone, Immatriculation) sont enregistrées dans un fichier informatisé par <strong>Saphir Detailing</strong> pour la gestion de la clientèle et des prestations.</p>
              <p className="mb-4">Elles sont conservées pendant <strong>3 ans</strong> et sont destinées uniquement à la gestion interne. Conformément à la loi « informatique et libertés », vous pouvez exercer votre droit d'accès aux données vous concernant et les faire rectifier en contactant : saphir.detailing@gmail.com.</p>
            </section>
          </div>

        </div>
      </div>
    </>
  );
};

export default MentionsLegales;