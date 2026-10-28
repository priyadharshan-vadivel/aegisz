import { Geist, Geist_Mono } from "next/font/google";

// Typeface choice lives here; theme.css maps these variables to --font-sans / --font-mono.
export const fontSans = Geist({ subsets: ["latin"], display: "swap", variable: "--font-geist" });
export const fontMono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--font-geist-mono" });
