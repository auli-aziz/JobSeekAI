import "~/styles/globals.css";
import { ThemeProvider } from "~/components/ThemeProvider";
import { type Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Header } from "~/components/Header";
import { SessionProvider } from "next-auth/react";

import { Space_Grotesk } from "next/font/google";
import Footer from "~/components/footer";

export const metadata: Metadata = {
  title: "JobSeekAI",
  description: "Easily find your dream job with the help of AI",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="light"
          themes={["light", "dark"]}
        >
          <SessionProvider>
            <NextTopLoader
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              easing="ease"
              speed={200}
              shadow="0 0 10px #2299DD,0 0 5px #2299DD"
              color="var(--primary)"
              showSpinner={false}
            />
            <Header />
            <main className="mx-auto max-w-screen-2xl">{children}</main>
            <Footer />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
