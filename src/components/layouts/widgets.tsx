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
	param_key: string;
}

export const Widgets: FC<IWidgetsProps> = async ({ param_key }) => {
	if (!sysVarConfiguration[param_key]) return notFound();
	const { type } = sysVarConfiguration[param_key];

	const { votes: allVotes, balances } = await getSystemVarsVotes();
	const allValues = await getSystemVars();

	const paramValues = allValues[param_key] || [];
	const votes = allVotes[param_key] || [];

	const currentValue = paramValues.length === 1 ? paramValues[0].value : maxBy(paramValues, (p) => p.vote_count_mci)?.value;
	const totalSupport = votes.reduce((acc, curr) => acc + (balances?.[curr.address] ?? 0), 0);

	return <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
		<Card className="h-[110px]">
			<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
				<CardTitle className="text-sm font-medium">Total voters balance</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">
					<ParamsView
						type="number"
						value={Number(totalSupport)}
						decimals={appConfig.VOTING_TOKEN_DECIMALS}
					/> <small>GBYTE</small>
				</div>
				{/* <p className="text-xs text-muted-foreground">$500,000</p> */}
			</CardContent>
		</Card>

		<Card className="h-[110px]">
			<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
				<CardTitle className="text-sm font-medium">Count votes</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{votes.length}</div>
			</CardContent>
		</Card>

		<Card className={cn({ "": param_key === "op_list", "h-[110px]": param_key !== "op_list" })}>
			<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
				<CardTitle className="text-sm font-medium">Current value</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">
					<ParamsView
						type={type}
						value={currentValue}
						hideList
					/>
				</div>
			</CardContent>
		</Card>
	</div>
}
