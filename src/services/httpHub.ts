const CACHE_REVALIDATE_TIME = 12 * 3600; // 12 hours

export const getSystemVarsList = async (): Promise<string[]> => {
	const data = await fetch('https://testnet.obyte.org/api/get_system_vars', { next: { revalidate: CACHE_REVALIDATE_TIME, tags: ['list'] }, method: "POST" }).then(res => res.json()).then(({ data }) => data);
	return Object.keys(data);
}
