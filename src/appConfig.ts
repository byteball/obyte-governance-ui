interface personalLink {
	url: string;
	text: string;
}

interface IOrderProviderInfo {
	displayName: string;
	personalLinks?: personalLink[];
}

interface IAppConfig {
	TESTNET: boolean;
	VOTING_TOKEN_SYMBOL: string;
	VOTING_TOKEN_DECIMALS: number;
	NUMBER_OF_ORDER_PROVIDERS: number;
	PROVIDER_DICTIONARY: {
		[key: string]: IOrderProviderInfo;
	};
}

// only for testnet
const TESTNET_ORDER_PROVIDERS = {
	"F4KHJUCLJKY4JV7M5F754LAJX4EB7M4N": {
		displayName: "Tony Churyumoff",
		personalLinks: [
			{ url: "https://obyte.org", text: "Obyte" },
			{ url: "https://github.com/byteball", text: "Github" }
		]
	},
	"WMFLGI2GLAB2MDF2KQAH37VNRRMK7A5N": {
		displayName: "Aleksandr Ponomarev",
		personalLinks: [
			{ url: "https://github.com/taump", text: "GitHub" },
			
		]
	},
};

const appConfig: IAppConfig = {
	TESTNET: !!process.env.NEXT_PUBLIC_TESTNET,
	VOTING_TOKEN_SYMBOL: "GBYTE",
	VOTING_TOKEN_DECIMALS: 9,
	NUMBER_OF_ORDER_PROVIDERS: 12,
	PROVIDER_DICTIONARY: !!process.env.NEXT_PUBLIC_TESTNET ? TESTNET_ORDER_PROVIDERS : {
		"4GDZSXHEFVFMHCUCSHZVXBVF5T2LJHMU": {
			displayName: "Rogier Eijkelhof",
		},
		"FAB6TH7IRAVHDLK2AAWY5YBE6CEBUACF": {
			displayName: "Fabien Marino",
		},
		"4FIZC3KZ3ZQSSVOKFEUHKCTQWAWD6YMF": {
			displayName: "Raivo Malter",
		},
		"IMMP5FWQXY6IZ53OIYQ46PHSI5T3MAYQ": {
			displayName: "Demelza Hays",
		},
		"25XDFVFRP7BZ2SNSESFKUTF52W42JCSL": {
			displayName: "Brad Morrison",
		},
		"2TO6NYBGX3NF5QS24MQLFR7KXYAMCIE5": {
			displayName: "Bosch Connectory Stuttgart",
		},
		"DXYWHSZ72ZDNDZ7WYZXKWBBH425C6WZN": {
			displayName: "Altos Engineering (formerly Bind Creative)",
		},
		"APABTE2IBKOIHLS2UNK6SAR4T5WRGH2J": {
			displayName: "PolloPollo",
		},
		"UE25S4GRWZOLNXZKY4VWFHNJZWUSYCQC": {
			displayName: "IFF at University of Nicosia",
		},
		"JMFXY26FN76GWJJG7N36UI2LNONOGZJV": {
			displayName: "CryptoShare Studio",
		},
		"FL3LIHRXYE6PS7AADJLDOYZKDO2UVVNS": {
			displayName: "Travin Keith",
		},
		"TKT4UESIKTTRALRRLWS4SENSTJX6ODCW": {
			displayName: "Tony Churyumoff (Sports oracle)",
		},
		"GFK3RDAPQLLNCMQEVGGD2KCPZTLSG3HN": {
			displayName: "Tony Churyumoff (Flight delay oracle)",
		},
		"BVVJ2K7ENPZZ3VYZFWQWK7ISPCATFIW3": {
			displayName: "Tony Churyumoff (Accredited investor attestation)",
		},
		"I2ADHGP4HL6J37NQAD73J7E5SKFIXJOT": {
			displayName: "Tony Churyumoff (Real name attestation)",
		},
		"OYW2XTDKSNKGSEZ27LMGNOPJSYIXHBHC": {
			displayName: "Tony Churyumoff (Github attestation)",
		},
		"UENJPVZ7HVHM6QGVGT6MWOJGGRTUTJXQ": {
			displayName: "Tony Churyumoff (Username attestation)",
		},
		"JPQKPRI5FMTQRJF4ZZMYZYDQVRD55OTC": {
			displayName: "Tony Churyumoff (Price oracle)",
		},
		"H5EZTQE7ABFH27AUDTQFMZIALANK6RBG": {
			displayName: "Tony Churyumoff (Email attestation)",
		},
		"FOPUBEUPBC6YLIQDLKL6EW775BMV7YOH": {
			displayName: "Tony Churyumoff (Bitcoin oracle)",
		}
	}
};

export default appConfig;