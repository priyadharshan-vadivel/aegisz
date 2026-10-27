import { Inter, JetBrains_Mono } from "next/font/google";

// Typeface choice lives here; theme.css maps these variables to --font-sans / --font-mono.
export const fontSans = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
export const fontMono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-jetbrains" });
