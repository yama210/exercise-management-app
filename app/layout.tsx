// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "運動記録アプリ",
  description: "日々の運動と消費カロリーを記録できるアプリです",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-black`}>
        <header className="border-b bg-slate-50 backdrop-blur">
          <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg sm:text-xl font-semibold text-black hover:opacity-80">
              運動記録アプリ
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6">
              <Link href="/" className="text-sm text-black hover:underline underline-offset-4">ホーム</Link>
              <Link href="/add" className="text-sm inline-flex items-center rounded-lg border bg-white px-3 py-1.5 text-black hover:bg-gray-50">
                追加
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto px-6 py-6 sm:py-8 bg-blue-500 text-black">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>

        <footer className="mt-8 border-t bg-slate-50">
          <div className="mx-auto max-w-5xl px-6 py-4 text-xs text-black">
            © {new Date().getFullYear()} 運動記録アプリ
          </div>
        </footer>
      </body>
    </html>
  );
}
