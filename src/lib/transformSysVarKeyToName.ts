import { sysVarConfiguration } from "@/sysVarConfiguration";

export const transformSysVarKeyToName = (key: string) => {
	return sysVarConfiguration[key]?.customName || key.split("_").join(" ");
}
