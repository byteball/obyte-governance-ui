import maxBy from "lodash/maxBy";

import { ISystemVarsList } from "@/services/httpHub";

interface ICurrentParamsByVotes extends ISystemVarsList { };
type getCurrentParamsBySysVarsResult = { [key: string]: number | string[] | undefined };

export const getCurrentParamsBySysVars = (allCommittedValues: ICurrentParamsByVotes): getCurrentParamsBySysVarsResult => {
	const currentParams: { [key: string]: number | string[] | undefined } = {};

	for (const key in allCommittedValues) {
		currentParams[key] = allCommittedValues[key].length === 1 ? allCommittedValues[key][0].value : maxBy(allCommittedValues[key], (p) => p.vote_count_mci)?.value;
	}

	return currentParams;
}
