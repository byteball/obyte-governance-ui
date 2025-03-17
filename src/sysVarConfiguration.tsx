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
		description: <div>List of 12 addresses whose transactions are used to order all other transactions on the DAG. <a href="https://obyte.org/technology/order-providers" target="_blank" rel="noopener">Order providers</a> frequently post waypoint transactions that determine the order of other transactions that are not already ordered on the DAG. Order providers do not have the power to approve or confirm transactions, and are unable to block them. However, they are generally expected to be non-anonymous people or organizations interested in Obyte&apos;s well-being.</div>,
		short_description: "List of 12 addresses whose transactions are used to order all other transactions on the DAG.",
		type: "op-list"
	},
	threshold_size: { // OIP-05 We introduce an additional fee, called "oversize fee", paid by transactions whose size exceeds threshold_size. The threshold size is initially set to 10 kB but can be changed by governance (see below). type: number
		customName: "Threshold size",
		description: <div>Threshold size is a parameter that affects protection against spamming the network with excessively large transactions. Transactions whose size exceeds this threshold are charged an oversize fee that rises exponentially with the growing size. See <a href="https://github.com/byteball/OIPs/blob/master/oip-0005.md" target="_blank" rel="noopener">Obyte improvement proposal 5</a> for details.</div>,
		short_description: "Transactions whose size exceeds this threshold are charged an oversize fee.",
		type: "number"
	},
	base_tps_fee: { // OIP-06 - type: number (default 10)
		customName: "Base TPS fee",
		description: <div>Base TPS fee is a parameter that affects protection against spamming the network with too many transactions. As the load on the network (measured in transactions per second — TPS) grows, users have to pay an exponentially growing TPS fee as described in <a href="https://github.com/byteball/OIPs/blob/master/oip-0006.md" target="_blank" rel="noopener">Obyte improvement proposal 6</a>. The fee linearly depends on this parameter, which is measured in Bytes.</div>,
		short_description: "A parameter used in calculation of TPS fee. The fee linearly depends on this parameter.",
		type: "number"
	},
	tps_interval: { // OIP-06 - type: number (default 1)
		customName: "TPS interval",
		description: <div>TPS interval is a parameter that affects protection against spamming the network with too many transactions. As the load on the network (measured in transactions per second — TPS) grows, users have to pay an exponentially growing TPS fee as described in <a href="https://github.com/byteball/OIPs/blob/master/oip-0006.md" target="_blank" rel="noopener">Obyte improvement proposal 6</a>. Every time the TPS grows by TPS interval, the TPS fee grows <i>e</i> (≈2.71828) times.</div>,
		short_description: "A parameter that determines how steep the growth of the fee is as TPS grows.",
		type: "number"
	},
	tps_fee_multiplier: { // OIP-06 - type: number (default 10)
		customName: "TPS fee multiplier",
		description: <div>TPS fee multiplier is a parameter that affects protection against spamming the network with too many transactions. As the load on the network (measured in transactions per second — TPS) grows, users have to pay an exponentially growing TPS fee as described in <a href="https://github.com/byteball/OIPs/blob/master/oip-0006.md" target="_blank" rel="noopener">Obyte improvement proposal 6</a>. Since the TPS, and therefore the TPS fee, becomes known only after the transaction stabilizes, users prepay a multiple of the estimated TPS fee, and TPS fee multiplier determines this multiple. If any fees are overpaid, they are used to pay for TPS fees of the future transactions.</div>,
		short_description: "A multiplier that determines how many times larger fee should be prepaid compared with the estimated TPS fee.",
		type: "number"
	},
} as const;
