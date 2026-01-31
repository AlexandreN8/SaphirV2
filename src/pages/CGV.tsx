import SeoHead from '@/components/SeoHead';
import { Scale } from 'lucide-react';

const CGV = () => {
  return (
    <>
      <SeoHead 
        title="Conditions Générales de Vente - Saphir Detailing"
        description="CGV applicables aux prestations de detailing et mécanique automobile."
      />

      <div className="min-h-screen bg-[#050505] text-gray-300 py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
              <Scale className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Conditions Générales de Vente</h1>
            <p className="text-gray-500">Applicables aux prestations de services automobiles</p>
          </div>

          <div className="space-y-8 text-sm md:text-base leading-relaxed">
            
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-primary pl-4">Article 1 : Objet</h2>
              <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre <strong>Saphir Detailing</strong> et ses clients, dans le cadre de prestations de :</p>
              <ul className="list-disc pl-5 marker:text-primary">
                <li>Rénovation esthétique automobile (Detailing, Polissage, Céramique).</li>
                <li>Nettoyage intérieur et extérieur.</li>
                <li>Entretien mécanique rapide (Vidange, Freinage, etc.).</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-primary pl-4">Article 2 : Devis et Réservation</h2>
              <p>Toute prestation fait l'objet d'une réservation préalable via le site internet, par téléphone ou sur place. Pour les prestations complexes (Polissage, Céramique), un devis préalable peut être établi après inspection du véhicule.</p>
              <p>La réservation en ligne vaut acceptation des présentes CGV et des tarifs en vigueur au jour de la réservation.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-primary pl-4">Article 3 : Tarifs et Paiement</h2>
              <p>Les prix sont indiqués en euros (€). Saphir Detailing se réserve le droit de modifier ses prix à tout moment, mais le service sera facturé sur la base des tarifs en vigueur au moment de la validation de la réservation.</p>
              <p>Le paiement s'effectue au comptant à la restitution du véhicule (Espèces, CB, Virement instantané).</p>
            </section>

            <section className="space-y-4 bg-red-900/10 p-6 rounded-2xl border border-red-900/20">
              <h2 className="text-xl font-bold text-red-400 uppercase tracking-wider mb-2">Article 4 : Annulation et Retard</h2>
              <p>Tout retard supérieur à <strong>30 minutes</strong> pourra entraîner l'annulation de la prestation ou la réduction de sa durée, sans réduction de prix.</p>
              <p>En cas d'annulation moins de <strong>48 heures</strong> avant le rendez-vous, Saphir Detailing se réserve le droit de facturer des frais d'immobilisation ou de conserver l'acompte éventuellement versé.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-primary pl-4">Article 5 : Responsabilité</h2>
              <p><strong>Detailing :</strong> Le prestataire s'engage à une obligation de moyens. Il ne saurait être tenu responsable des dommages liés à un mauvais état initial du véhicule non signalé (vernis décollé, plastiques cassants, infiltrations d'eau préexistantes).</p>
              <p><strong>Mécanique :</strong> Le prestataire est tenu à une obligation de résultat concernant les interventions mécaniques effectuées. La garantie ne couvre pas l'usure normale ou les défauts liés à d'autres pièces non changées.</p>
              <p>Le client doit retirer tous ses effets personnels du véhicule avant la prestation. Saphir Detailing décline toute responsabilité en cas de perte d'objets de valeur laissés dans l'habitacle.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-primary pl-4">Article 6 : Droit applicable</h2>
              <p>Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire devant les tribunaux compétents de l'Ariège.</p>
            </section>

          </div>
        </div>
      </div>
    </>
  );
};

export default CGV;