"use server";

import { groupBy } from "lodash";
import { notFound } from "next/navigation";
import { FC } from "react"
import moment from "moment";
import { ExternalLink } from "lucide-react";

import { ParamsView } from "@/components/params-view"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area";
import { QRButton } from "@/components/ui/_qr-button";

import { generateSysLink } from "@/lib/generateLink";

import { getSystemVarsVotes, IVoteInfo } from "@/services/httpHub";

import { sysVarConfiguration } from "@/sysVarConfiguration";

import appConfig from "@/appConfig";

interface IUserVotesProps {
	param_key: string;
}

interface IUniqVotes {
	[uniqValue: string]: IVoteInfo[];
}

export const UserVotes: FC<IUserVotesProps> = async ({ param_key }) => {
	if (!sysVarConfiguration[param_key]) return notFound();

	const { type } = sysVarConfiguration[param_key];

	const { votes: allVotes, balances } = await getSystemVarsVotes();
	const votes = allVotes[param_key] || [];

	let uniqVotes: IUniqVotes = {};

	if (type !== "op-list") {
		uniqVotes = groupBy(votes, (v) => v.value);
	} else if (type === "op-list") {
		uniqVotes = groupBy(votes, (v) => v.ops?.sort().join('\n'));
	}

	return (
		<>
			<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
				User votes
			</h2>

			<div className="space-y-4">
				{Object.entries(uniqVotes).sort((a, b) => {
					const totalSupportAmountA = a[1].reduce((prev, value) => prev + (balances[value.address] ?? 0), 0);
					const totalSupportAmountB = b[1].reduce((prev, value) => prev + (balances[value.address] ?? 0), 0);
					return totalSupportAmountB - totalSupportAmountA;
				}).map(([value, votes]) => {
					const actionUri = generateSysLink({ param_key, value });
					const totalSupportAmount = votes.reduce((prev, value) => prev + (balances[value.address] ?? 0), 0);
					return (<Card key={value}>
						<CardHeader>
							<div className="flex justify-between items-center">
								<div className="space-y-1">
									<div>
										<b>Parameter value:</b> <ParamsView
											type={type}
											value={type === "number" ? Number(value) : (type === "op-list" ? value.split("\n") : value)}
											hideList
											minCount={3}
										/>
									</div>

									<div>
										<b>Total support for this value:</b> <ParamsView
											type="number"
											value={totalSupportAmount}
											decimals={appConfig.VOTING_TOKEN_DECIMALS}
										/> {appConfig.VOTING_TOKEN_SYMBOL}
									</div>
								</div>
								<div>
									<QRButton href={actionUri} variant="secondary">Vote for this value</QRButton>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="font-bold mb-2">Votes:</div>
							<ScrollArea type="always" className="flex max-h-[340px] flex-col pr-4">
								{[...votes].sort((a, b) => (balances[b.address] ?? 0) - (balances[a.address] ?? 0)).map(({ address, unit, timestamp }) => (<div key={unit + timestamp} className="flex justify-between items-center mb-4">
									<div>
										<a target="_blank" rel="noreferrer" href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${address}`} className="block font-medium">
											{address}
										</a>

										<div className="flex space-x-4 align-middle text-xs text-gray-500">
											{unit ? <a className="hover:text-gray-900" target="_blank" rel="noreferrer" href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/${unit}`}>Unit on explorer <ExternalLink className="inline h-3 w-3" /></a> : null}
											{timestamp ? <div>{moment.unix(timestamp).format("LLL")}</div> : null}
										</div>
									</div>

									<div className="font-bold">
										<ParamsView
											type="number"
											value={balances[address] || 0}
											decimals={appConfig.VOTING_TOKEN_DECIMALS}
										/> {appConfig.VOTING_TOKEN_SYMBOL}
									</div>
								</div>)
								)}
							</ScrollArea>
						</CardContent>
					</Card>)
				})}
			</div>
		</>
	)
}
