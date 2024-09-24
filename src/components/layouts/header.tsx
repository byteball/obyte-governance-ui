"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { usePathname } from "next/navigation";
import cn from "classnames";
import { useRef } from "react";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import { sysVarConfiguration } from "@/sysVarConfiguration";
import { transformSysVarKeyToName } from "@/lib/transformSysVarKeyToName";

export const Header = () => {
	const pathname = usePathname();
	const ref = useRef<HTMLButtonElement>(null);

	return (
		<>
			<ProgressBar
				height="5px"
				color="#0284c7"
				options={{ showSpinner: true }}
				targetPreprocessor={(url) => {
					if (url.protocol === 'obyte:') {
						return new URL(window.location.href);
					} else {
						return url;
					}
				}}
			/>

		<header className="sticky top-0 z-50 flex items-center h-16 gap-4 px-4 border-b bg-background md:px-6">
			<nav className="flex-col w-full hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
				<Link
					href="/"
					className="flex items-center h-8 text-lg font-medium md:text-base flex-shrink-0"
				>
					<img src="/logo.svg" alt="Obyte governance logo" className="inline-block h-8" />
				</Link>
				{Object.entries(sysVarConfiguration).map(([key, { customName }]) => (<Link
					href={`/sys/${key}`}
					key={key}
					className={cn("hover:text-foreground block flex-shrink-0", { "text-foreground text-gray-950 dark:text-gray-300": pathname === `/sys/${key}` }, { "text-muted-foreground": pathname !== `/sys/${key}` })}
				>
					{customName || transformSysVarKeyToName(key)}
				</Link>))}
			</nav>
			<Sheet>
				<VisuallyHidden.Root>
					<SheetTitle />
				</VisuallyHidden.Root>
				<SheetTrigger asChild>
					<Button
						variant="outline"
						ref={ref}
						size="icon"
						className="shrink-0 md:hidden"
					>
						<Menu className="w-5 h-5" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left">
					<nav className="grid gap-6 text-lg font-medium">
						<Link
							href="/"
							onClick={() => ref.current?.click()}
							className="flex items-center gap-2 text-lg font-semibold"
						>
							<img src="/logo.svg" alt="Obyte governance logo" className="h-8" />
							<span className="sr-only">Obyte governance</span>
						</Link>
						{Object.entries(sysVarConfiguration).map(([key, { customName }]) => (<Link
							href={`/sys/${key}`}
							key={key}
							onClick={() => ref.current?.click()}
							className={cn("text-muted-foreground hover:text-foreground", { "font-bold text-foreground text-gray-950 dark:text-gray-300": pathname === `/sys/${key}` })}
						>
							{customName || key}
						</Link>))}
					</nav>
				</SheetContent>
			</Sheet>
			<div className="flex flex-1">
				<div className="flex justify-end w-full">
					<ModeToggle />
				</div>
			</div>
		</header>
		</>
	)
}
