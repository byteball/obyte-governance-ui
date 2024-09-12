import { Menu } from "lucide-react"
import Link from "next/link"

import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import { ModeToggle } from "../mode-toggle"
import { sysVarConfiguration } from "@/sysVarConfiguration"
import { transformSysVarKeyToName } from "@/lib/transformSysVarKeyToName"

export const Header = () => {
	return (
		<header className="sticky top-0 z-50 flex items-center h-16 gap-4 px-4 border-b bg-background md:px-6">
			<nav className="flex-col w-full hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
				<Link
					href="/"
					className="flex items-center w-8 h-8 text-lg font-medium md:text-base"
				>
					<img src="/logo.svg" alt="Obyte governance logo" className="inline-block w-8 h-8" />
				</Link>
				<Link
					href="/"
					className="transition-colors text-muted-foreground hover:text-foreground"
				>
					Home
				</Link>
				{Object.entries(sysVarConfiguration).map(([key, { customName }]) => (<Link
					href={`/sys/${key}`}
					key={key}
					className="text-muted-foreground hover:text-foreground block flex-shrink-0"
				>
					{customName || transformSysVarKeyToName(key)}
				</Link>))}
			</nav>
			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant="outline"
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
							className="flex items-center gap-2 text-lg font-semibold"
						>
							<img src="/logo.svg" alt="Obyte governance logo" className="w-8 h-8" />
							<span className="sr-only">Obyte governance</span>
						</Link>
						<Link
							href="/"
							className="text-muted-foreground hover:text-foreground"
						>
							Dashboard
						</Link>
						{Object.entries(sysVarConfiguration).map(([key, { customName }]) => (<Link
							href={`/sys/${key}`}
							className="text-muted-foreground hover:text-foreground"
						>
							{customName || key}
						</Link>))}
					</nav>
				</SheetContent>
			</Sheet>
			<div className="flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
				<form className="flex-1 ml-auto sm:flex-initial">
					<div className="relative">
						<ModeToggle />
					</div>
				</form>
			</div>
		</header>
	)
}