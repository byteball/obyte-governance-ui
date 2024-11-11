import { notFound } from "next/navigation";
import { Metadata } from "next";

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

export function generateMetadata({ params }: ISysVarPageProps): Metadata {
	const { short_description } = sysVarConfiguration[params?.key] ?? {};
	const name = transformSysVarKeyToName(params.key);

	return {
		title: `Obyte governance - ${name}`,
		description: short_description ?? `Vote to change the ${name}`,
		metadataBase: new URL(`https://${process.env.NEXT_PUBLIC_TESTNET ? 'testnet-' : ''}governance.obyte.org`),
		openGraph: {
			images: `https://${process.env.NEXT_PUBLIC_TESTNET ? 'testnet-' : ''}governance.obyte.org/sys/${params.key}/opengraph-image`,
		}
	}
}

export default async function SysVarPage({ params }: ISysVarPageProps) {
	if (!Object.keys(sysVarConfiguration).includes(params.key)) return notFound();

	const { votes: allVotes, balances } = await getSystemVarsVotes();
	const opsData = aggregateOpsData(allVotes.op_list, balances);
	const { short_description, description } = sysVarConfiguration[params.key];

	const allValues = await getSystemVars();

	const paramValues = allValues.op_list || [];

	const currentValue: string[] = paramValues.length === 1 ? paramValues[0].value as string[] : maxBy(paramValues, (p) => p.vote_count_mci)?.value as string[];

	return (<div className="space-y-8">
		<h1 className="text-4xl font-bold tracking-tight scroll-m-20 lg:text-5xl">
			Vote for <span className="lowercase">{transformSysVarKeyToName(params.key)}</span>
		</h1>

		{(short_description || description) ? <div className="max-w-3xl full-description leading-6">
			{description ?? short_description}
		</div> : null}

		<div className="pb-8">
			<Widgets paramKey={String(params.key as keyof typeof sysVarConfiguration)} />
		</div>

		{params.key !== "op_list" ? <>
			<div className="grid grid-cols-5 gap-8">
				<div className="col-span-5 lg:col-span-4">
					<UserVotes param_key={params.key} />
				</div>
			</div>

			<AddAnotherValueModal sysVars={allValues} paramKey={params.key} />
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
