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
import { transformSysVarKeyToName } from "@/lib/transformSysVarKeyToName";

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

	const { type, customName } = sysVarConfiguration[param_key];

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
							<div className="flex justify-between md:items-center flex-col md:flex-row ">
								<div className="space-y-1">
									<div className="text-xl">
										<span className="font-semibold">{customName || transformSysVarKeyToName(param_key)}:</span> <ParamsView
											type={type}
											value={type === "number" ? Number(value) : (type === "op-list" ? value.split("\n") : value)}
											hideList
											minCount={3}
										/>
									</div>

									<div>
										<span>Total support for this value:</span> <ParamsView
											type="number"
											value={totalSupportAmount}
											fixedDecimals
											decimals={appConfig.VOTING_TOKEN_DECIMALS}
										/> {appConfig.VOTING_TOKEN_SYMBOL}
									</div>
								</div>
								<div className="mt-3 md:mt-0">
									<QRButton href={actionUri} variant="secondary">Vote for this value</QRButton>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="font-semibold mb-2">Votes:</div>
							<ScrollArea type="always" className="md:flex md:max-h-[340px] flex-col pr-4">
								{[...votes].sort((a, b) => (balances[b.address] ?? 0) - (balances[a.address] ?? 0)).map(({ address, unit, timestamp }) => (<div key={address + timestamp} className="flex md:justify-between md:items-center mb-4 flex-col-reverse md:flex-row">
									<div>
										<a target="_blank" rel="noreferrer" href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${address}`} className="block font-medium address">
											{address}
										</a>

										<div className="md:flex md:space-x-4 align-middle text-xs space-y-1 md:space-y-0 mt-2 md:mt-0">
											{unit ? <div><a className="hover:text-gray-900" target="_blank" rel="noreferrer" href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/${unit}`}>Unit on explorer <ExternalLink className="inline h-3 w-3" /></a></div> : null}
											{timestamp ? <div>{moment.unix(timestamp).format("LLL")}</div> : null}
										</div>
									</div>

									<div className="">
										<ParamsView
											type="number"
											fixedDecimals
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
