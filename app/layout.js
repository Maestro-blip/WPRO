import { Cormorant_Garamond, Manrope, Parisienne } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap"
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif-display",
  display: "swap"
});

const parisienne = Parisienne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap"
});

export const metadata = {
  title: "Roman & Oksana Wedding",
  description: "Modern elegant wedding landing page"
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="uk"
      className={`${manrope.variable} ${cormorantGaramond.variable} ${parisienne.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
