import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
    variable: "--font-body",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
    weight: ["400", "500"],
});

export const metadata: Metadata = {
    title: "Elecciones Perú 2026 — Resultados en Vivo",
    description:
        "Resultados oficiales en tiempo real de las Elecciones Generales 2026 del Perú. Datos de ONPE actualizados cada 30 segundos.",
    openGraph: {
        title: "Resultados Oficiales Electorales — Perú 2026",
        description:
            "Resultados en vivo de las Elecciones Generales 2026. Datos oficiales ONPE actualizados cada 30 segundos.",
        type: "website",
        locale: "es_PE",
    },
    twitter: {
        card: "summary_large_image",
        title: "Resultados Oficiales Electorales — Perú 2026",
        description:
            "Resultados en vivo de las Elecciones Generales 2026. Datos oficiales ONPE.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="es"
            className={`${dmSans.variable} ${dmMono.variable} h-full antialiased`}
        >
            <body className="min-h-full bg-[#0a0a0f] font-[family-name:var(--font-body)]">
                {children}
            </body>
        </html>
    );
}
