interface IOrderProviderInfo {
	displayName: string;
	personalLink?: {
		url: string;
		text: string;
	};
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
		personalLink: { url: "https://github.com/byteball", text: "Github" }
	},
	"WMFLGI2GLAB2MDF2KQAH37VNRRMK7A5N": {
		displayName: "Aleksandr Ponomarev",
		personalLink: { url: "https://github.com/taump", text: "GitHub" }
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
			personalLink: {
				url: "https://blog.obyte.org/first-decentralized-witness-candidate-rogier-eijkelhof-9e5619166334",
				text: "First Decentralized Witness Candidate — Rogier Eijkelhof"
			}
		},
		"FAB6TH7IRAVHDLK2AAWY5YBE6CEBUACF": {
			displayName: "Fabien Marino",
			personalLink: {
				url: "https://blog.obyte.org/second-independent-witness-candidate-fabien-marino-d4e8dccadee",
				text: "Second Independent Witness Candidate — Fabien Marino"
			}
		},
		"4FIZC3KZ3ZQSSVOKFEUHKCTQWAWD6YMF": {
			displayName: "Raivo Malter",
			personalLink: {
				url: "https://blog.obyte.org/raivo-malter-announces-candidacy-to-become-obyte-witness-a7f7471cef4e",
				text: "Raivo Malter announces candidacy to become Obyte witness"
			}
		},
		"IMMP5FWQXY6IZ53OIYQ46PHSI5T3MAYQ": {
			displayName: "Demelza Hays",
		},
		"25XDFVFRP7BZ2SNSESFKUTF52W42JCSL": {
			displayName: "Brad Morrison",
		},
		"2TO6NYBGX3NF5QS24MQLFR7KXYAMCIE5": {
			displayName: "Bosch Connectory Stuttgart",
			personalLink: {
				url: "https://medium.com/@stgtconnectory/autonomous-auctioneer-stuttgart-connectory-hackathon-e5a703c6217a#2cc1",
				text: "Autonomous Auctioneer @Stuttgart Connectory Hackathon"
			}
		},
		"DXYWHSZ72ZDNDZ7WYZXKWBBH425C6WZN": {
			displayName: "Altos Engineering (formerly Bind Creative)",
			personalLink: {
				url: "https://blog.obyte.org/bind-creative-announces-candidacy-to-become-obyte-witness-c06109bf8de1",
				text: "Bind Creative announces candidacy to become Obyte witness"
			}
		},
		"APABTE2IBKOIHLS2UNK6SAR4T5WRGH2J": {
			displayName: "PolloPollo",
			personalLink: {
				url: "https://blog.obyte.org/dlt-based-charity-platform-pollopollo-announces-candidacy-to-become-obyte-witness-7dc60480684f",
				text: "DLT-Based Charity Platform PolloPollo Announces Candidacy To Become Obyte Witness"
			}
		},
		"UE25S4GRWZOLNXZKY4VWFHNJZWUSYCQC": {
			displayName: "IFF at University of Nicosia",
			personalLink: { url: "https://medium.com/@klitos/the-institute-for-the-future-iff-at-the-university-of-nicosia-announces-candidacy-to-become-an-ec5a3342070b", text: "The Institute For the Future (IFF) at the University of Nicosia announces candidacy to become an Order Provider on the Obyte Public Network" }
		},
		"JMFXY26FN76GWJJG7N36UI2LNONOGZJV": {
			displayName: "CryptoShare Studio",
		},
		"FL3LIHRXYE6PS7AADJLDOYZKDO2UVVNS": {
			displayName: "Travin Keith",
			personalLink: {
				url: "https://medium.com/@TravinKeith/obyte-order-provider-candidacy-7b81e2860cd5",
				text: "Obyte Order Provider Candidacy"
			}
		},
		"XY6JXVBITD4EKY3DFT27XS65D2M3FJ5V": {
			displayName: "CariPower (Luc Chase)",
			personalLink: {
				url: "https://www.linkedin.com/pulse/powering-future-obyte-caripower-seeks-become-your-trusted-order-dmobe",
				text: "Powering the Future of Obyte: CariPower Seeks to Become Your Trusted Order Provider"
			}
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