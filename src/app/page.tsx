import { SysVarItemList } from "@/components/layouts/sys-var-item-list";

export default function Home() {
	return (<main>
		<h1 className="text-4xl font-semibold tracking-tight scroll-m-20 lg:text-5xl">
			Obyte governance
		</h1>
		<p className="max-w-xl mt-8 text-xl text-muted-foreground">
			A modal dialog that interrupts the user with important content and expects
			a response.
		</p>

		<SysVarItemList />
	</main>
	);
}