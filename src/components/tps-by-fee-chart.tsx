'use client';

import { FC, useEffect, useState } from "react";

import { generateTpsFeeDataByParams } from "@/lib/generateTpsFeeDataByParams";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Label } from "recharts";

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "./ui/chart";

import { ISystemVarsList } from "@/services/httpHub";
import { getCurrentParamsBySysVars } from "@/lib/getCurrentParamsBySysVars";
import { getStringAbrvOfNumber } from "@/lib/getStringAbrvOfNumber";


const chartConfig = {
	newFee: {
		color: "hsl(var(--link))",
		label: "New value",
	},
	fee: {
		color: "hsl(var(--chart-3))",
		label: "Current value",
	}
} satisfies ChartConfig;


interface ITpsByFeeChartProps {
	sysVars: ISystemVarsList;
	paramKey: string;
	value: number | string | string[];
}

export const TpsByFeeChart: FC<ITpsByFeeChartProps> = ({ sysVars, paramKey, value }) => {
	const currentParams = getCurrentParamsBySysVars(sysVars);
	const chartData = generateTpsFeeDataByParams({ currentParams, newParams: { ...currentParams, [paramKey]: value } });
	const [max, setMax] = useState<'auto' | number>('auto')

	useEffect(() => {
		const fees: number[] = [];
		chartData.forEach(({ fee, newFee }) => {
			fees.push(fee);

			if (newFee) {
				fees.push(newFee);
			}
		});

		setMax(Math.max(...fees))
	}, [chartData, value, sysVars, paramKey]);

	return <div className="max-w-[350px]">
		<ChartContainer config={chartConfig}>
			<AreaChart
				data={chartData}
				accessibilityLayer
				margin={{ left: 10, right: 5, bottom: 10 }}
			>
				<CartesianGrid vertical={false} horizontal={false} />

				<XAxis
					dataKey="tps"
					tickLine={false}
					axisLine={false}
					type="number"
				>
					<Label offset={0} position="bottom" angle={0}>TPS</Label>
				</XAxis>

				<YAxis
					dataKey="fee"
					type="number"
					domain={[0, max]}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => getStringAbrvOfNumber(value, true)}
				>
					<Label offset={2} position="left" angle={-90}>TPS fee</Label>
				</YAxis>

				<ChartTooltip cursor={false} formatter={
					(value, name, item) => <div>{name === 'fee' ? <div className="underline mb-2"> <b>TPS: {item.payload.tps}</b></div> : null} <span className="font-semibold">{name !== 'fee' ? 'New' : 'Current'} TPS fee:</span> {getStringAbrvOfNumber(Number(value))}</div>} content={<ChartTooltipContent />} />

				<defs>
					<linearGradient id="fillFee" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="5%"
							stopColor="var(--color-fee)"
							stopOpacity={0.8}
						/>
						<stop
							offset="95%"
							stopColor="var(--color-fee)"
							stopOpacity={0.1}
						/>
					</linearGradient>
					<linearGradient id="fillNewFee" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="5%"
							stopColor="var(--color-newFee)"
							stopOpacity={0.8}
						/>
						<stop
							offset="95%"
							stopColor="var(--color-newFee)"
							stopOpacity={0.2}
						/>
					</linearGradient>
				</defs>
				<Area
					animationDuration={0}
					dataKey="fee"
					type="monotone"
					fill="url(#fillFee)"
					fillOpacity={0.6}
					stroke="var(--color-fee)"
					stackId="2a"
				/>
				<Area
					dataKey="newFee"
					type="monotone"
					fill="url(#fillNewFee)"
					fillOpacity={0.6}
					stroke="var(--color-newFee)"
					stackId="a"
				/>

				<ChartLegend content={<ChartLegendContent />} />
			</AreaChart>
		</ChartContainer>
	</div>
}
