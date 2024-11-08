import { isArray } from "lodash";

import { IOrderProvider } from "@/components/layouts/op-list";
import { IBalances, IVoteInfo } from "@/services/httpHub";

import appConfig from "@/appConfig";

export const aggregateOpsData = (votes: IVoteInfo[], balances: IBalances) => {
	const allOps: { [address: string]: number } = {};

	votes.forEach(({ value = [], address }) => {
		if (isArray(value)) {
			value.forEach(op => {
				allOps[op] = (allOps[op] ?? 0) + (balances[address] ?? 0);
			});
		}
	});

	return Object.entries(allOps).map(([address, amount]) => ({ address, amount, description: address in appConfig.PROVIDER_DICTIONARY ? appConfig.PROVIDER_DICTIONARY[address].displayName as string : "" })) as IOrderProvider[];
}