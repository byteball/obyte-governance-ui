import { SysVarItemList } from "@/components/layouts/sys-var-item-list";

export default function Home() {
	return (<div className="space-y-16">
		<div className="space-y-8">
			<div className="hidden mb-8 sm:mt-32 sm:flex lg:mt-16">
				<div className="relative px-3 py-1 text-sm leading-6 text-gray-500 rounded-full ring-1 ring-gray-900/10 dark:ring-white/10 hover:ring-gray-900/20">
					We wrote an article about it.{' '}
					<a href="#" className="font-bold whitespace-nowrap">
						<span aria-hidden="true" className="absolute inset-0" />
						Read on Medium <span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</div>

			<h1 className="text-4xl font-semibold tracking-tight scroll-m-20 lg:text-6xl">
				Obyte network <br /> governance
			</h1>

			<p className="max-w-xl text-xl text-muted-foreground">
				A modal dialog that interrupts the user with important content and expects
				a response.
			</p>
		</div>

		<div>
			<SysVarItemList />
		</div>
	</div>
	);
}