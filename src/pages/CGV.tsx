import SeoHead from '@/components/SeoHead';
import { Scale } from 'lucide-react';

const CGV = () => {
  return (
    <>
      <SeoHead 
        title="Conditions Générales de Vente - Saphir Detailing"
        description="CGV applicables aux prestations de detailing et mécanique automobile."
        canonicalUrl="https://www.saphirdetailing.fr/cgv"
      />

      <div className="min-h-screen bg-[#050505] text-gray-300 py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
              <Scale className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Conditions Générales de Vente</h1>
            <p className="text-gray-500">Mises à jour le 01/02/2026</p>
          </div>

          <div className="space-y-8 text-sm md:text-base leading-relaxed">
            
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-primary pl-4">Article 1 : Objet</h2>
              <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre <strong>Saphir Detailing</strong> et ses clients.</p>
              <p>Elles couvrent l'ensemble des prestations suivantes :</p>
              <ul className="list-disc pl-5 marker:text-primary space-y-1">
                <li>Rénovation esthétique automobile (Detailing intérieur/extérieur).</li>
                <li>Services spécifiques : Rénovation d'optiques, nettoyage moteur, traitement céramique.</li>
                <li>Mécanique rapide et entretien courant.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-primary pl-4">Article 2 : Devis et Réservation</h2>
              <p>La réservation effectuée en ligne constitue une demande de prise en charge. Elle ne devient définitive qu'après validation par Saphir Detailing.</p>
              <p><strong>Validité des devis :</strong> Conformément à nos conditions historiques, les devis émis sont valables pour une durée de <strong>30 jours</strong> à compter de leur date d'émission. Passé ce délai, Saphir Detailing se réserve le droit de modifier ses tarifs.</p>
            </section>

            <section className="space-y-4 bg-primary/5 p-6 rounded-2xl border border-primary/20">
              <h2 className="text-xl font-bold text-primary uppercase tracking-wider mb-2">Article 3 : Tarifs et État du Véhicule</h2>
              <p><strong>3.1 Tarifs Indicatifs :</strong> Les prix affichés sont des tarifs "à partir de", calculés pour des véhicules dans un état de saleté standard.</p>
              <p><strong>3.2 Inspection sur Place :</strong> Le prix définitif est validé avant le début de la prestation après inspection visuelle. Le prestataire se réserve le droit d'ajuster le tarif si l'état du véhicule diffère de la description (poils d'animaux excessifs, boue, déchets, rayures profondes).</p>
              <p><strong>3.3 Suppléments :</strong> Tout travail supplémentaire nécessaire pour atteindre le résultat escompté sera facturé en supplément après accord du client.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-primary pl-4">Article 4 : Durée d'Intervention</h2>
              <p>Les durées d'intervention sont données à titre indicatif. Saphir Detailing ne saurait être tenu responsable d'un dépassement raisonnable lié à l'état du véhicule ou à des contraintes techniques (pièces grippées, temps de séchage).</p>
            </section>

            <section className="space-y-4 bg-red-900/10 p-6 rounded-2xl border border-red-900/20">
              <h2 className="text-xl font-bold text-red-400 uppercase tracking-wider mb-2">Article 5 : Annulation et Retard</h2>
              <p>Tout retard du client supérieur à <strong>30 minutes</strong> pourra entraîner l'annulation de la prestation sans remboursement de l'acompte.</p>
              <p>En cas d'annulation moins de <strong>48 heures</strong> avant le rendez-vous, l'acompte versé reste acquis à Saphir Detailing. En l'absence d'acompte, une indemnité forfaitaire correspondant à 50% du montant de la prestation pourra être facturée.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-primary pl-4">Article 6 : Responsabilité et Réclamations</h2>
              <p><strong>Responsabilité :</strong> Le prestataire est tenu à une obligation de moyens. Il ne pourra être tenu responsable des dommages liés à un mauvais état initial du véhicule non signalé.</p>
              <p><strong>Objets personnels :</strong> Le client doit retirer ses effets personnels du véhicule. Saphir Detailing décline toute responsabilité en cas de perte.</p>
              <p className="bg-white/5 p-4 rounded-xl border-l-2 border-primary mt-4">
                <strong>Réclamations :</strong> Conformément à nos conditions, toute réclamation concernant la qualité de la prestation devra être formulée par écrit dans un délai rigoureux de <strong>7 jours</strong> après la restitution du véhicule. Passé ce délai, aucune réclamation ne sera recevable.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-primary pl-4">Article 7 : Paiement</h2>
              <p>Le règlement s'effectue intégralement à la restitution du véhicule (Espèces, CB, Virement Instantané). Aucun crédit n'est accordé.</p>
              <p><strong>Retard de paiement :</strong> En cas de défaut de paiement ou de rejet de prélèvement, des pénalités de retard égales à 10% du montant dû seront exigibles de plein droit, sans qu'un rappel soit nécessaire.</p>
            </section>

          </div>
        </div>
      </div>
    </>
  );
};

export default CGV;