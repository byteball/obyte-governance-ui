import { ReactElement } from "react";

interface ISysVarConfiguration {
	[key: string]: {
		customName?: string;
		description?: string | ReactElement;
		short_description?: string;
		type: "op-list" | "number" | "string";
	}
}

export const sysVarConfiguration: ISysVarConfiguration = {
	op_list: { // list of order providers type: string[]
		customName: "Order Providers",
		description: <div><small>Description</small>, <b>Big</b> description</div>,
		short_description: "List of 12 addresses whose transactions are used to order all other transactions in the DAG.",
		type: "op-list"
	},
	threshold_size: { // OIP-05 We introduce an additional fee, called "oversize fee", paid by transactions whose size exceeds threshold_size. The threshold size is initially set to 10 kB but can be changed by governance (see below). type: number
		customName: "Threshold size",
		description: <div><small>Description</small>, <b>Big</b> description</div>,
		short_description: "Transactions whose size exceeds this threshold are charged an oversize fee.",
		type: "number"
	},
	base_tps_fee: { // OIP-06 - type: number (default 10)
		customName: "Base TPS fee",
		short_description: "A parameter used in calculation of TPS fee. The fee linearly depends on this parameter.",
		type: "number"
	},
	tps_interval: { // OIP-06 - type: number (default 1)
		customName: "TPS interval",
		short_description: "A parameter that determines how steep the growth of the fee is as TPS grows.",
		type: "number"
	},
	tps_fee_multiplier: { // OIP-06 - type: number (default 10)
		customName: "TPS fee multiplier",
		short_description: "A multiplier that determines how many times larger fee should be prepaid compared with the estimated TPS fee.",
		type: "number"
	},
} as const;
