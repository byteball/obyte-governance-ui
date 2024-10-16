interface IOversizeFeeParams {
	threshold_size?: number;
}

interface IGenerateTpsFeeDataByParams {
	currentParams: IOversizeFeeParams;
	newParams?: IOversizeFeeParams;
}

interface TpsFeeDataResult {
	oversizeFee: number;
	newOversizeFee?: number;
	size: number;
}

export const generateOversizeFeeDataByParams = ({ currentParams, newParams }: IGenerateTpsFeeDataByParams = { currentParams: {}, newParams: {} }): TpsFeeDataResult[] => {
	const { threshold_size: current_threshold_size = 10000 } = currentParams ?? {};
	const { threshold_size: new_threshold_size = 10000 } = newParams ?? {};

	const maxThresholdSize = Math.max(current_threshold_size, new_threshold_size);

	const sizes = Array(5).fill(1).map((_, i) => maxThresholdSize * (i + 1));

	return [0, ...sizes]
	.map((size: number) => ({
		size,
		oversizeFee: Math.ceil(size !== 0 ? size * (Math.exp(size / current_threshold_size - 1) - 1) : 0),
		newOversizeFee: Math.ceil(size !== 0 ? size * (Math.exp(size / new_threshold_size - 1) - 1) : 0),
	})) satisfies TpsFeeDataResult[];
}
