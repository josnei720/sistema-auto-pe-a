import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoPeças Dashboard",
  description: "Sistema de Controle de Autopeças",
};

import prisma from "@/lib/prisma";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await prisma.config.findFirst({ where: { id: 1 } });
  const companyName = config?.nome_empresa || "AutoSystem";

  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-background text-foreground flex h-screen overflow-hidden`}>
        <Sidebar companyName={companyName} />
        <main className="flex-1 overflow-y-auto bg-[#0B1120] p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
