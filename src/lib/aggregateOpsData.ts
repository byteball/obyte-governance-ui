import appConfig from "@/appConfig";
import { IOrderProvider } from "@/components/layouts/op-list";
import { IBalances, IVoteInfo } from "@/services/httpHub";

export const aggregateOpsData = (votes: IVoteInfo[], balances: IBalances) => {
	const allOps: { [address: string]: number } = {};

	votes.forEach(({ ops = [], address }) => {
		ops.forEach(op => {
			allOps[op] = (allOps[op] ?? 0) + (balances[address] ?? 0);
		});
	});


	return Object.entries(allOps).map(([address, amount]) => ({ address, amount, description: address in appConfig.PROVIDER_DICTIONARY ? appConfig.PROVIDER_DICTIONARY[address] as string : "" })) as IOrderProvider[];
}