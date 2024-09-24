export const toLocalString = (numberOrString: number | string, fixedDecimals: boolean = false) => {
	const value = +(Number(numberOrString).toFixed(9));

	if (typeof numberOrString !== "number" && typeof numberOrString !== "string") {
		return "Invalid value";
	} else if (value === 0) {
		return 0;
	}

	if (fixedDecimals) {
		return value.toLocaleString(undefined, {
			minimumFractionDigits: 9,
			maximumFractionDigits: 9,
		});

	} else {
		return value.toLocaleString(undefined, {
			maximumFractionDigits: 18,
			maximumSignificantDigits: 9
		});
	}
};