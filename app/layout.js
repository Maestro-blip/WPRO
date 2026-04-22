import "./globals.css";

export const metadata = {
  title: "Roman & Oksana Wedding",
  description: "Modern elegant wedding landing page"
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
