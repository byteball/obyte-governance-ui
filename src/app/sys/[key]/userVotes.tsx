"use server";

import { ParamsView } from "@/components/params-view"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { getSystemVarsVotes, IVoteInfo } from "@/services/httpHub";
import { sysVarConfiguration } from "@/sysVarConfiguration";
import { groupBy } from "lodash";
import { notFound } from "next/navigation";
import { FC } from "react"
import moment from "moment";
import { ExternalLink } from "lucide-react";
import appConfig from "@/appConfig";
import { QRButton } from "@/components/ui/_qr-button";
import { generateSysLink } from "@/lib/generateLink";

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
				{Object.entries(uniqVotes).map(([value, votes]) => {
					const actionUri = generateSysLink({ param_key, value });
					const totalSupportAmount = votes.reduce((prev, value) => prev + (balances[value.address] ?? 0), 0);
					return (<Card key={value}>
						<CardHeader>
							<div className="flex justify-between items-center">
								<div>
									<b>Parameter value:</b> <ParamsView
										type={type}
										value={type === "number" ? Number(value) : (type === "op-list" ? value.split("\n") : value)}
										hideList
										minCount={3}
									/>
								</div>
								<div>
									<QRButton href={actionUri} variant="secondary">Vote for this value</QRButton>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="font-bold mb-2">Votes:</div>
							<div className="flex flex-col gap-4">
								{votes.sort((a, b) => balances[b.address] - balances[a.address]).map(({ address, unit, timestamp }) => (
									<div key={unit + timestamp} className="flex justify-between items-center">
										<div className="">
											<a target="_blank" rel="noreferrer" href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${address}`} className="block font-medium">
												{address}
											</a>

											<div className="flex space-x-4 align-middle text-xs text-gray-500">
												{unit ? <a className="hover:text-gray-900" target="_blank" href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/${unit}`}>Unit on explorer <ExternalLink className="inline h-3 w-3" /></a> : null}
												{timestamp ? <div className="">{moment.unix(timestamp).format("LLL")}</div> : null}
											</div>
										</div>

										<div className="font-bold">
											<ParamsView
												type="number"
												value={balances[address] || 0}
												decimals={appConfig.VOTING_TOKEN_DECIMALS}
											/> {appConfig.VOTING_TOKEN_SYMBOL}
										</div>
									</div>
								))}
							</div>
						</CardContent>
						<CardFooter>
							Total support this value: <ParamsView
								type="number"
								value={totalSupportAmount}
								decimals={appConfig.VOTING_TOKEN_DECIMALS}
							/> {appConfig.VOTING_TOKEN_SYMBOL}
						</CardFooter>
					</Card>)
				})}
			</div>
		</>
	)
}
