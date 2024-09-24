import { SysVarItemList } from "@/components/layouts/sys-var-item-list";

export const metadata = {
  title: 'Obyte governance',
	description: 'Vote for system parameters such as Order Providers and variables that determine the fees. The weight of your vote is equal to the GBYTE balance of your address(es).'
}

export default function Home() {
	return (<div className="space-y-16">
		<div className="space-y-8 mt-14">
			<h1 className="text-5xl font-semibold tracking-tight scroll-m-20 lg:text-6xl">
				Obyte network governance
			</h1>

			<p className="max-w-3xl text-xl text-muted-foreground">
				Vote for system parameters such as Order Providers and variables that determine the fees. The weight of your vote is equal to the GBYTE balance of your address(es).
			</p>

			<div className="hidden mb-8 sm:mt-32 sm:flex lg:mt-16">
				<div className="relative px-3 py-1 text-sm leading-6 text-gray-500 rounded-full ring-1 ring-gray-900/10 dark:ring-white/10 hover:ring-gray-900/20">
					We wrote an article about it.{' '}
					<a href="https://medium.com/" target="_blank" rel="noreferrer" className="font-bold whitespace-nowrap">
						<span aria-hidden="true" className="absolute inset-0" />
						Read on Medium <span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</div>
		</div>

		<div>
			<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
				List of parameters
			</h2>

			<SysVarItemList />
		</div>
	</div>
	);
}