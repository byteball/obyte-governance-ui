import { notFound } from "next/navigation";

import { Widgets } from "@/components/layouts/widgets";
import { transformSysVarKeyToName } from "@/lib/transformSysVarKeyToName";
import { sysVarConfiguration } from "@/sysVarConfiguration";

import { UserVotes } from "./userVotes";
import { AddAnotherValueModal } from "@/components/layouts/modals/add-another-value";

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

		<Widgets param_key={params.key} />

		{params.key !== "op_list" ? <>
			<div className="flex justify-end">
				<AddAnotherValueModal paramKey={params.key} />
			</div>

			<nav className="grid grid-cols-5 gap-8">
				<div className="col-span-4">
					<UserVotes param_key={params.key} />
				</div>
			</nav>
		</> : null}
	</div>)
}
