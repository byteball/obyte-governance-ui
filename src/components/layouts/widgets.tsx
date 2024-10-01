"use server";

import { FC } from "react";
import maxBy from "lodash/maxBy";
import difference from "lodash/difference";
import isArray from "lodash/isArray";
import isEqual from "lodash/isEqual";
import cn from "classnames";
import { notFound } from "next/navigation";

import { getSystemVars, getSystemVarsVotes } from "@/services/httpHub";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ParamsView } from "../params-view";

import { sysVarConfiguration } from "@/sysVarConfiguration";

import appConfig from "@/appConfig";


import { QRButton } from "../ui/_qr-button";
import { generateSysLink } from "@/lib/generateLink";
import { aggregateOpsData } from "@/lib/aggregateOpsData";
import { getValueWithType } from "@/lib/getValueWithType";

interface IWidgetsProps {
	paramKey: keyof typeof sysVarConfiguration;
}

export const Widgets: FC<IWidgetsProps> = async ({ paramKey }) => {
	if (!sysVarConfiguration[paramKey]) return notFound();
	const { type } = sysVarConfiguration[paramKey];

	const { votes: allVotes, balances } = await getSystemVarsVotes();
	const allValues = await getSystemVars();

	const paramValues = allValues[paramKey] || [];
	const votes = allVotes[paramKey] || [];

	const currentValue = paramValues.length === 1 ? paramValues[0].value : maxBy(paramValues, (p) => p.vote_count_mci)?.value;
	const totalSupport = votes.reduce((acc, curr) => acc + (balances?.[curr.address] ?? 0), 0);

	let leaderValue: string | number | string[] | undefined;

	if (paramKey === "op_list") {
		const opsData = aggregateOpsData(votes, balances)
			.sort((a, b) => b.amount - a.amount)
			.slice(0, 12);

		leaderValue = getValueWithType(paramKey, opsData.map((op) => op.address));
	} else {
		const supportByValue: { [value: string]: number } = {};

		votes.forEach((v) => {
			if (!(String(v.value) in supportByValue)) supportByValue[v.value] = 0;
			supportByValue[v.value] = (supportByValue[v.value] || 0) + (balances?.[v.address] ?? 0);
		});

		const leader = maxBy(Object.entries(supportByValue), function (o) { return o[1]; });

		leaderValue = getValueWithType(paramKey, type === "number" ? Number(leader?.[0] || 0) : String(leader?.[0]));
	}

	const disabledCommit = paramKey === "op_list" && isArray(leaderValue) && isArray(currentValue) ? difference(leaderValue, currentValue).length === 0 : isEqual(leaderValue, currentValue);

	return <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
		<Card className="h-[110px]">
			<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
				<CardTitle className="text-sm font-medium">Total voters balance</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-semibold">
					<ParamsView
						type="number"
						value={Number(totalSupport)}
						decimals={appConfig.VOTING_TOKEN_DECIMALS}
					/> <small>GBYTE</small>
				</div>
			</CardContent>
		</Card>

		<Card className="h-[110px]">
			<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
				<CardTitle className="text-sm font-medium">Count votes</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-semibold">{votes.length}</div>
			</CardContent>
		</Card>

		<Card className={cn({ "": paramKey === "op_list", "h-[110px]": paramKey !== "op_list" })}>
			<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
				<CardTitle className="text-sm font-medium">Current value</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-semibold">
					<ParamsView
						type={type}
						value={currentValue}
						hideList
					/>
				</div>
			</CardContent>
		</Card>

		{leaderValue && <Card className="min-h-[110px]">
			<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
				<CardTitle className="text-sm font-medium">Leader</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-semibold">
					<ParamsView
						type={type}
						newOPs={leaderValue && isArray(leaderValue) && isArray(currentValue) ? difference(leaderValue, currentValue) : undefined}
						value={leaderValue}
						hideList
					/>
				</div>

				<div className={cn(paramKey === "op_list" ? "mt-6" : "mt-2")}>
					<QRButton
						href={generateSysLink({ param_key: String(paramKey), app: "system_vote_count" })}
						disabled={disabledCommit}
						size="sm"
						fluid
						variant="secondary"
					>
						Commit value
					</QRButton>
				</div>
			</CardContent>
		</Card>}
	</div>
}
