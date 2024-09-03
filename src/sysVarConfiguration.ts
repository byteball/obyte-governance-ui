interface ISysVarConfiguration {
	[key: string]: {
		customName?: string;
		description?: string;
	}
}

export const sysVarConfiguration: ISysVarConfiguration = {
	op_list: { // list of order providers type: string[]
		customName: "Order providers",
		description: "33An extension of Obyte consensus protocol is proposed which allows users to continuously vote for their preferred list of Order Providers (OPs)."
	},
	threshold_size: { // OIP-05 We introduce an additional fee, called "oversize fee", paid by transactions whose size exceeds threshold_size. The threshold size is initially set to 10 kB but can be changed by governance (see below). type: number
		customName: "Threshold size",
		description: "The size of the threshold unit."
	},
	base_tps_fee: { // OIP-06 - type: number (default 10)
		customName: "Base TPS fee",
		description: "The base fee per transaction."
	},
	tps_interval: { // OIP-06 - type: number (default 1)
		customName: "TPS interval",
		description: "The interval between two consecutive transactions."
	},
	tps_fee_multiplier: { // OIP-06 - type: number (default 10)
		customName: "TPS fee multiplier",
		description: "The fee multiplier per transaction."
	},
}
