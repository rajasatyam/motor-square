import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter=Inter({subsets:["latin"]})

export const metadata = {
  title: "MotorSquare",
  description: "Find Your Dream Car",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}`}
      >
        <Header/>
        <main className="min-h-screen"> {children}</main>
        <footer className="bg-blue-50 py-12">
          <div className="container mx-auto px-4 text-center text-gray-600">Made with 💌 by Piyush Kumar</div>
        </footer>
       
      </body>
    </html>
  );
}
