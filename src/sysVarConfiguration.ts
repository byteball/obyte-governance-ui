interface ISysVarConfiguration {
	[key: string]: {
		customName?: string;
		description: string;
	}
}

export const sysVarConfiguration: ISysVarConfiguration = {
	op_list: {
		customName: "Order providers",
		description: "An extension of Obyte consensus protocol is proposed which allows users to continuously vote for their preferred list of Order Providers (OPs)."
	}
}
