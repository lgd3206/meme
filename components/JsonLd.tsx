'use client';

export default function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Meme Explainer',
    description: 'AI-powered meme analysis tool using Grok Vision AI',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://explainthismeme.online',
    applicationCategory: 'EntertainmentApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
