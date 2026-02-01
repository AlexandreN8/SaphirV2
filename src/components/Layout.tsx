// components/Layout.tsx
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout = () => {
  
  // Données structurées pour Google 
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "AutoDetaling", 
    "name": "Saphir Detailing",
    "image": "@/assets/logo.webp", 
    "description": "Centre de rénovation esthétique automobile, polissage et céramique à Oust (09).",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Oust",
      "postalCode": "09140",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "42.876", 
      "longitude": "1.212"
    },
    "url": "https://www.saphirdetailing.fr/", 
    "telephone": "+33668840627", 
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "12:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "14:00",
        "closes": "18:00"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <Navbar /> 
      
      <main className="flex-1 relative">
        <Outlet /> 
      </main>
      
      <Footer />
    </div>
  );
};