/** @type {import('next').NextConfig} */
const nextConfig = {
  // Abilita output statico per Vercel/Netlify
  // output: 'export', // decommentare solo per deploy statico puro

  // Headers di sicurezza
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
