"use server";

import { sysVarConfiguration } from "@/sysVarConfiguration"
import { SysVarItem } from "./sys-var-item"
import { getSystemVarsList } from "@/services/httpHub";

export const SysVarItemList = async () => {
	const sysVars = await getSystemVarsList();

	return <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-2">
		{sysVars.map((key) => <SysVarItem
			name={transformSysVarKeyToName(key)}
			key={key}
			sysVarKey={key}
			description={sysVarConfiguration[key]?.description ?? "No description"}
		/>)}
	</div>
}

export const transformSysVarKeyToName = (key: string) => {
	return sysVarConfiguration[key]?.customName || key.split("_").join(" ");
}
