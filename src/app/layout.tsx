import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const fireCode = Fira_Code({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Simulated Linux",
  description: "Simuluated Linux Shell CTF for Infrastructure exploitation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fireCode.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
