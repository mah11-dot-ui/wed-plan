import { Inter, Geist_Mono, Lora } from "next/font/google";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";

// Applies the stored (or system) theme before paint — prevents a flash of
// the wrong theme. Kept in sync with ThemeToggle's storage key.
const themeInitScript = `(function(){try{var t=localStorage.getItem('wedplan-theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})()`;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "WedPlan — Plan Your Dream Wedding",
  description:
    "WedPlan connects couples with trusted wedding vendors — venues, decorators, photographers, caterers and more — so planning the big day feels effortless.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ToastProvider>
          <Navbar />
          <div aria-hidden="true" className="h-[67px] shrink-0" />
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
