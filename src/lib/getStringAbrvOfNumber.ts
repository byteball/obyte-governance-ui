

export const getStringAbrvOfNumber = (num: number, short: boolean = false): string => {
	let defaultUnit = short ? 'b' : 'bytes';
	const precision = short ? 4 : 6;
	const gap = short ? '' : ' ';

	if (num >= 1e18) {
		return +(num / 1e18).toPrecision(precision) + gap + 'E' + defaultUnit;
	} else if (num >= 1e15) {
		return +(num / 1e15).toPrecision(precision) + gap + 'P' + defaultUnit;
	} else if (num >= 1e12) {
		return +(num / 1e12).toPrecision(precision) + gap + 'T' + defaultUnit;
	} else if (num >= 1e9) {
		return +(num / 1e9).toPrecision(precision) + gap + 'G' + defaultUnit;
	} else if (num >= 1e6) {
		return +(num / 1e6).toPrecision(precision) + gap + 'M' + defaultUnit;
	} else if (num >= 1e3) {
		return +(num / 1e3).toPrecision(precision) + gap + 'K' + defaultUnit;
	} else {
		return +num.toPrecision(precision) + gap + defaultUnit;
	}
}
