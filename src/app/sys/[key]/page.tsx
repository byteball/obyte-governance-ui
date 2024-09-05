import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transformSysVarKeyToName } from "@/lib/transformSysVarKeyToName";
import { sysVarConfiguration } from "@/sysVarConfiguration";
import { notFound } from "next/navigation";

interface ISysVarPageProps {
	params: {
		key: string;
	}
}

export default function SysVarPage({ params }: ISysVarPageProps) {
	if (!Object.keys(sysVarConfiguration).includes(params.key)) return notFound();

	return (<div className="space-y-8">
		<h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">
			Vote for <span className="lowercase">{transformSysVarKeyToName(params.key)}</span>
		</h1>

		<div className="max-w-3xl text-muted-foreground">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi quibusdam impedit maiores recusandae accusamus dolorem praesentium a excepturi distinctio, rem qui aliquid ipsam iure iste eaque dolorum commodi officiis in!
		</div>

		<div className="grid grid-cols-4 gap-8">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-sm font-medium">Total voters balance</CardTitle>
					<small>GBYTE</small>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">45,231.89</div>
					{/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-sm font-medium">Count votes</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">432</div>
				</CardContent>
			</Card>

			<Card className="max-w-xs">
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-sm font-medium">Current value</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">423423</div>
				</CardContent>
			</Card>
		</div>
	</div>)
}
