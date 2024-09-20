import { notFound } from "next/navigation";

import { Widgets } from "@/components/layouts/widgets";
import { transformSysVarKeyToName } from "@/lib/transformSysVarKeyToName";
import { sysVarConfiguration } from "@/sysVarConfiguration";

import { UserVotes } from "./userVotes";
import { AddAnotherValueModal } from "@/components/layouts/modals/add-another-value";
import { OrderProviderList } from "@/components/layouts/op-list";
import { getSystemVars, getSystemVarsVotes } from "@/services/httpHub";
import { aggregateOpsData } from "@/lib/aggregateOpsData";
import maxBy from "lodash/maxBy";

interface ISysVarPageProps {
	params: {
		key: string;
	}
}

export default async function SysVarPage({ params }: ISysVarPageProps) {
	if (!Object.keys(sysVarConfiguration).includes(params.key)) return notFound();

	const { votes: allVotes, balances } = await getSystemVarsVotes();
	const opsData = aggregateOpsData(allVotes.op_list, balances);

	const allValues = await getSystemVars();

	const paramValues = allValues.op_list || [];

	const currentValue: string[] = paramValues.length === 1 ? paramValues[0].value as string[] : maxBy(paramValues, (p) => p.vote_count_mci)?.value as string[];

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
		</> : <>
			<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
				Order provider list
			</h2>

			<OrderProviderList
				data={opsData}
				votes={allVotes.op_list}
				balances={balances}
				currentValue={currentValue}
			/>
		</>}
	</div>)
}
