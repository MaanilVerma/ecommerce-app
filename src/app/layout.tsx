import "~/styles/globals.css";

import { Inter } from "next/font/google";
import NavBar from "~/shared-components/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Ecommerce App",
  description: "Ecommerce App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        {
          <>
            <NavBar />
            {children}
            <ToastContainer />
          </>
        }
      </body>
    </html>
  );
}
