import type { Metadata, Viewport } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SvgDefs from '@/components/SvgDefs';
import SmoothScroll from '@/components/SmoothScroll';
import ScrollProgress from '@/components/ScrollProgress';
import { FavoritesProvider } from '@/components/FavoritesProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Hamubere Travels — Stay and explore Rwanda',
    template: '%s · Hamubere Travels',
  },
  description:
    'Handpicked hotels, lodges, camps and villas across Rwanda. Gorilla trekking in Musanze, sunsets on Lake Kivu, canopy walks in Nyungwe and safaris in Akagera.',
  keywords: [
    'Rwanda travel',
    'Rwanda hotels',
    'Lake Kivu',
    'Volcanoes National Park',
    'gorilla trekking',
    'Nyungwe',
    'Akagera',
    'Kigali',
  ],
  openGraph: {
    title: 'Hamubere Travels — Stay and explore Rwanda',
    description:
      'Handpicked stays and experiences across the land of a thousand hills.',
    type: 'website',
    locale: 'en_RW',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-white font-sans text-ink">
        <FavoritesProvider>
          <SvgDefs />
          <SmoothScroll />
          <ScrollProgress />
          <a
            href="#main"
            className="sr-only z-[60] rounded-full bg-forest px-5 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </FavoritesProvider>
      </body>
    </html>
  );
}
