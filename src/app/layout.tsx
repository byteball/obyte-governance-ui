import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layouts/header";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Obyte governance",
	description: "Obyte governance",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
					storageKey="obyte-governance-theme"
				>
					<div className="flex flex-col w-full min-h-screen">
						<Header />

						<main className="flex container max-w-6xl min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
							{children}
						</main>
						<Toaster />
						<footer className="p-4 text-center">
							Made with ❤️ by <a target="_blank" rel="noreferrer" href="https://obyte.org">Obyte</a>
						</footer>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
