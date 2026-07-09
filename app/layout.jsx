import { Inter } from "next/font/google";
import Providers from "./providers";
import { OrganizationJsonLd } from "@/components/seo/SiteJsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/utils/metadata";
import "@/index.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "local business directory",
    "India local businesses",
    "hyperlocal directory",
    "shops near me",
    "business listings India"
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <OrganizationJsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
