import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jira tools",
  description: "Miscellaneous tools using the Jira API for Invoice Simple",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-gray-100 min-h-screen w-screen text-black">
          <div className="max-w-screen-2xl m-auto bg-white">{children}</div>
        </div>
      </body>
    </html>
  );
}
