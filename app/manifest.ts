import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Explain This Meme',
    short_name: 'Meme Explainer',
    description: 'AI-powered meme explanation tool using Grok Vision AI',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1220',
    theme_color: '#9333ea',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}

