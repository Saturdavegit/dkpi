export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Politique de Confidentialité</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Utilisation des Cookies</h2>
        <p className="mb-4">
          Notre site utilise deux types de cookies :
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">
            <strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (session utilisateur, panier d&apos;achat, authentification).
          </li>
          <li className="mb-2">
            <strong>Cookies tiers :</strong> Utilisés par Stripe pour le traitement sécurisé des paiements.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Protection des Données</h2>
        <p className="mb-4">
          Nous nous engageons à protéger vos données personnelles. Les informations collectées sont utilisées uniquement pour :
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Traiter vos commandes</li>
          <li className="mb-2">Gérer votre compte</li>
          <li className="mb-2">Traiter les paiements de manière sécurisée</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Vos Droits</h2>
        <p className="mb-4">
          Conformément au RGPD, vous disposez des droits suivants :
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Droit d&apos;accès à vos données</li>
          <li className="mb-2">Droit de rectification</li>
          <li className="mb-2">Droit à l&apos;effacement</li>
          <li className="mb-2">Droit à la portabilité des données</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p className="mb-4">
          Pour toute question concernant notre politique de confidentialité ou pour exercer vos droits, 
          vous pouvez nous contacter à : contact@dkpilite.com
        </p>
      </section>
    </div>
  );
}
