"use client";

import cn from "classnames";
import { isArray } from "lodash";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FC, useState } from "react";
import { Roboto } from "next/font/google";

import { toLocalString } from "@/lib/toLocalString";

import appConfig from "@/appConfig";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", ] });

interface IParamsViewProps {
	type: 'string' | 'number' | 'op-list';
	newOPs?: string[];
	value: string | number | string[] | undefined;
	decimals?: number;
	hideList?: boolean;
	minCount?: number;
	fixedDecimals?: boolean;
}

const NumberView: FC<{ value: number, decimals?: number , fixedDecimals?: boolean}> = ({ value, decimals, fixedDecimals = false }) => {
	const displayValue = decimals ? value / 10 ** decimals : value;
	return <span className={roboto.className}>{toLocalString(displayValue, fixedDecimals)}</span>;
};

const OpListView: FC<{ value: string[], newValues: string[]; hideList?: boolean, minCount?: number }> = ({ value, hideList, minCount = 1, newValues }) => {
	const [visible, setVisible] = useState(false);
	const displayList = hideList && !visible ? value.slice(0, minCount) : value;

	return (
		<>
			<ul className="text-sm font-normal space-y-2">
				{displayList.map((v) => (
					<li key={v} className={cn("text-ellipsis overflow-hidden w-full", { "text-green-600": newValues.includes(v) })}>
						<a
							href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${v}`}
							target="_blank"
							rel="noreferrer"
							className="underline"
						>
							<span className="address">{v}</span>
							{v in appConfig.PROVIDER_DICTIONARY ? <span className="block text-xs">({appConfig.PROVIDER_DICTIONARY[v as keyof typeof appConfig.PROVIDER_DICTIONARY]})</span> : ''}
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

export const ParamsView: FC<IParamsViewProps> = ({ type, value, decimals, hideList, minCount, newOPs, fixedDecimals = false }) => {
	if (typeof value === "undefined" || (type === "number" && typeof value !== "number")) {
		return <>Invalid value</>;
	}

	switch (type) {
		case 'number':
			return <NumberView fixedDecimals={fixedDecimals} value={value as number} decimals={decimals} />;
		case 'op-list':
			return isArray(value) ? <OpListView newValues={(newOPs ?? []) as string[]} value={value as string[]} hideList={hideList} minCount={minCount} /> : <>Invalid value</>;
		default:
			return <>{value}</>;
	}
};
