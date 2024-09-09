import { notFound } from "next/navigation";

import { Widgets } from "@/components/layouts/widgets";
import { transformSysVarKeyToName } from "@/lib/transformSysVarKeyToName";
import { sysVarConfiguration } from "@/sysVarConfiguration";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { UserVotes } from "./userVotes";

interface ISysVarPageProps {
	params: {
		key: string;
		tab: string;
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

		<Widgets
			param_key={params.key}
		/>

		<div className="flex justify-end">
			<Button className="mt-[50px]"><Plus className="mr-2 h-4 w-4" /> Suggest another value</Button>
		</div>

		<nav className="grid grid-cols-5 gap-8">
			<div className="flex space-y-4 flex-col text-sm text-muted-foreground">
				<div className="font-semibold text-primary">
					Menu
				</div>
				<Link href={`/sys/${params.key}/user_votes`}>User votes</Link>
				<Link href={`/sys/${params.key}/recent`}>Recent votes</Link>
				<Link href={`/sys/${params.key}/count`}>Count request</Link>
				<Link href={`/sys/${params.key}/stats`}>Statistic</Link>
			</div>

			<div className="col-span-4">
				{params.tab === 'user_votes' ? <div>
					<UserVotes
						param_key={params.key}
					/>
				</div> : null}

				{params.tab === 'recent' ? <div>
					Recent votes
				</div> : null}

				{params.tab === 'stats' ? <div>
					Stats
				</div> : null}

				{params.tab === 'count' ? <div>
					Count
				</div> : null}
			</div>
		</nav>
	</div>)
}