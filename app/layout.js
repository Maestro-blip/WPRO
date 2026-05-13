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

const siteTitle = "Роман & Оксана • 10.07.2026";
const siteDescription =
  "Запрошуємо Вас на наше весілля 10 липня 2026 — Львів та Явір Резорт.";
const ogImage = "/IMG_8548.JPG";

export const metadata = {
  title: siteTitle,
  description: siteDescription,
  applicationName: "Roman & Oksana Wedding",
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: "Roman & Oksana Wedding",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: ogImage, alt: "Роман та Оксана" }]
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage]
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f1ea"
};

/**
 * Невидимий редірект для Android-In-App браузерів (Telegram, Instagram, Facebook тощо).
 * Виконується в `<head>` до рендеру, щоб користувач не бачив миготіння сторінки.
 * iOS не зачіпається — там Apple блокує перехід у Safari з WebView, тож ми лишаємось і робимо WebView ідеальним.
 */
const androidWebviewRedirect = `(function(){
  try {
    if (typeof window === 'undefined') return;
    var loc = window.location;
    if (loc.search.indexOf('noredirect=1') !== -1) return;
    var ua = navigator.userAgent || '';
    if (!/Android/i.test(ua)) return;
    var isWebView = /; wv\\)/i.test(ua);
    var isTelegram = /Telegram\\//i.test(ua) || typeof window.TelegramWebviewProxy !== 'undefined';
    var isInstagram = /Instagram/i.test(ua);
    var isFacebook = /(FBAN|FBAV|FB_IAB)/i.test(ua);
    if (!isWebView && !isTelegram && !isInstagram && !isFacebook) return;
    var sep = loc.search ? '&' : '?';
    var target = 'intent://' + loc.host + loc.pathname + loc.search + sep + 'noredirect=1#Intent;scheme=https;action=android.intent.action.VIEW;end';
    loc.replace(target);
  } catch (e) {}
})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="uk"
      className={`${manrope.variable} ${cormorantGaramond.variable} ${parisienne.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: androidWebviewRedirect }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
