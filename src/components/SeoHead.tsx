import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  image?: string;
}

const SeoHead = ({ title, description, canonicalUrl, image }: SeoHeadProps) => {
  const siteName = "Saphir Detailing";
    const siteUrl = import.meta.env.PROD 
        ? 'https://saphirdetailing.fr' 
        : 'http://localhost:5173';       

    const fullTitle = `${title} | ${siteName}`;
    const currentUrl = canonicalUrl || window.location.href;
    
    // 2. Construction de l'image
    const rawImage = image || '/og-default.jpg'; 
    const socialImage = rawImage.startsWith('http') ? rawImage : `${siteUrl}${rawImage}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={socialImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={socialImage} />
    </Helmet>
  );
};

export default SeoHead;