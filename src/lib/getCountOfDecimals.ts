export const getCountOfDecimals = (x: number | string) => {
	return ~(x + "").indexOf(".") ? (x + "").split(".")[1].length : 0;
};