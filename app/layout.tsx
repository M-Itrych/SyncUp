import {Open_Sans, Poppins} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {ThemeProvider} from "next-themes";
import {ClerkProvider} from "@clerk/nextjs";
import {ModalProvider} from "@/components/providers/modal-provider";
import { Metadata } from 'next';


const poppins = Poppins({subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]});


 
export const metadata: Metadata = {
  title: 'SyncUp',
  description: 'The Excellent platform for collaboration, communication, and building connections.',
  metadataBase: new URL('https://syncup.bieda.it/'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body
                    className={cn(poppins.className, "bg-gradient-to-br from-blue-200 via-white to-blue-200 dark:from-gray-800 dark:via-black dark:to-gray-700 min-h-screen")}
                >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                >
                    <ModalProvider/>
                    {children}
                </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
        
        
    );
}
