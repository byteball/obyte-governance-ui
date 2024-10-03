interface IAppConfig {
	TESTNET: boolean;
	VOTING_TOKEN_SYMBOL: string;
	VOTING_TOKEN_DECIMALS: number;
	NUMBER_OF_ORDER_PROVIDERS: number;
	PROVIDER_DICTIONARY: {
		[key: string]: string;
	};
}

const appConfig: IAppConfig = {
	TESTNET: !!process.env.NEXT_PUBLIC_TESTNET,
	VOTING_TOKEN_SYMBOL: "GBYTE",
	VOTING_TOKEN_DECIMALS: 9,
	NUMBER_OF_ORDER_PROVIDERS: 12,
	PROVIDER_DICTIONARY: {
		"F4KHJUCLJKY4JV7M5F754LAJX4EB7M4N": "Tony Churyumoff",
		"WMFLGI2GLAB2MDF2KQAH37VNRRMK7A5N": "Aleksandr Ponomarev (testnet)"
	}
};

export default appConfig;