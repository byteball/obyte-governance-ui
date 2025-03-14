import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layouts/header";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const openSans = Open_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
	title: "Obyte governance",
	description: "Obyte governance",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { fontFamily, fontStyle } = openSans.style;
	
	return (
		<html lang="en" suppressHydrationWarning>
			<body style={{ fontFamily: `"SF Pro Text", "SF Pro Icons", ${fontFamily}`, fontStyle }}>
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
							<a target="_blank" rel="noopener" href="https://obyte.org">Obyte — a fully decentralized, DAG based crypto</a>
						</footer>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
