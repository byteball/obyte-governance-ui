import appConfig from "@/appConfig";

const CACHE_LIST_REVALIDATE_TIME = 12 * 3600; // 12 hours
const CACHE_VARS_REVALIDATE_TIME = 1 * 3600; // 1 hour
const CACHE_VARS_VOTES_REVALIDATE_TIME = 360; // 6 minutes

export const getSystemVarsList = async (): Promise<string[]> => {
	const data = await fetch(`https://${appConfig.TESTNET ? 'testnet.' : ''}obyte.org/api/get_system_vars`, { next: { revalidate: CACHE_LIST_REVALIDATE_TIME, tags: ['list'] }, method: "POST" }).then(res => res.json()).then(({ data }) => data);
	return Object.keys(data);
}

interface ISystemVarsList {
	[key: string]: {
		vote_count_mci: number;
		value: number | string[];
		is_emergency: number;
	}[]
}

export const getSystemVars = async (): Promise<ISystemVarsList> => {
	const data = await fetch(`https://${appConfig.TESTNET ? 'testnet.' : ''}obyte.org/api/get_system_vars`, { next: { revalidate: CACHE_VARS_REVALIDATE_TIME, tags: ['vars'] }, method: "POST" }).then(res => res.json()).then(({ data }) => data);
	return data;
}

export interface IVoteInfo {
	address: string;
	unit: string;
	timestamp: string;
	ops?: string[];
	value: number;
}
interface IVotes {
	votes: {
		[key: string]: IVoteInfo[];
	},
	balances: {
		[address: string]: number;
	}
}

export const getSystemVarsVotes = async (): Promise<IVotes> => {
	const data = await fetch(`https://${appConfig.TESTNET ? 'testnet.' : ''}obyte.org/api/get_system_var_votes`, { next: { revalidate: CACHE_VARS_VOTES_REVALIDATE_TIME, tags: ['votes'] }, method: "POST" }).then(res => res.json()).then(({ data }) => data);
	return data;
}