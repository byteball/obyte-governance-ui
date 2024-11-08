"use server";

import { sysVarConfiguration } from "@/sysVarConfiguration"
import { SysVarItem } from "./sys-var-item"
import { getSystemVarsList } from "@/services/httpHub";
import { transformSysVarKeyToName } from "@/lib/transformSysVarKeyToName";

export const SysVarItemList = async () => {
	const sysVars = await getSystemVarsList();

	return <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
		{sysVars.map((key) => <SysVarItem
			name={transformSysVarKeyToName(key)}
			key={key}
			sysVarKey={key}
			short_description={sysVarConfiguration[key]?.short_description ?? "No description"}
		/>)}
	</div>
}
