import "./globals.css";
import Providers from "@/app/providers";

export const metadata = {
  title: "Shop Hole",
  description: "Ultra-Modern E-Commerce Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
