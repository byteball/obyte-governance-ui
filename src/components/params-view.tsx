"use client";

import appConfig from "@/appConfig";
import { toLocalString } from "@/lib/toLocalString";
import { isArray } from "lodash";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FC, useState } from "react";

interface IParamsViewProps {
	type: 'string' | 'number' | 'op-list';
	value: string | number | string[] | undefined;
	decimals?: number;
	hideList?: boolean;
	minCount?: number;
}

const NumberView: FC<{ value: number, decimals?: number }> = ({ value, decimals }) => {
	const displayValue = decimals ? value / 10 ** decimals : value;
	return <>{toLocalString(displayValue)}</>;
};

const OpListView: FC<{ value: string[], hideList?: boolean, minCount?: number }> = ({ value, hideList, minCount = 1}) => {
	const [visible, setVisible] = useState(false);
	const displayList = hideList && !visible ? value.slice(0, minCount) : value;

	return (
		<>
			<ul className="text-sm font-normal space-y-2">
				{displayList.map((v) => (
					<li key={v} className="text-ellipsis overflow-hidden w-full">
						<a
							href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${v}`}
							target="_blank"
							rel="noreferrer"
							className="underline"
						>
							<span className="address">{v}</span>
							{v in appConfig.PROVIDER_DICTIONARY ? <span className="block text-xs text-foreground text-gray-600">({appConfig.PROVIDER_DICTIONARY[v as keyof typeof appConfig.PROVIDER_DICTIONARY]})</span> : ''}
						</a>
					</li>
				))}
			</ul>
			{hideList && (
				<div className="cursor-pointer mb-[-20px] flex justify-center" onClick={() => setVisible(!visible)}>
					{visible ? <ChevronUp /> : <ChevronDown />}
				</div>
			)}
		</>
	);
};

export const ParamsView: FC<IParamsViewProps> = ({ type, value, decimals, hideList, minCount }) => {
	if (typeof value === "undefined" || (type === "number" && typeof value !== "number")) {
		return <>Invalid value</>;
	}

	switch (type) {
		case 'number':
			return <NumberView value={value as number} decimals={decimals} />;
		case 'op-list':
			return isArray(value) ? <OpListView value={value as string[]} hideList={hideList} minCount={minCount} /> : <>Invalid value</>;
		default:
			return <>{value}</>;
	}
};
