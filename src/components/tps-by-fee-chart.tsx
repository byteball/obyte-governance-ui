'use client';

import { FC } from "react";

import { generateTpsFeeDataByParams } from "@/lib/generateTpsFeeDataByParams";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Label } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

import { ISystemVarsList } from "@/services/httpHub";
import { getCurrentParamsBySysVars } from "@/lib/getCurrentParamsBySysVars";


const chartConfig = {
	new: {
		color: "hsl(var(--link))",
	},
	current: {
		color: "hsl(var(--border))",
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
					className="mt-2"
					tickLine={false}
					axisLine={false}
					type="number"
				>
					<Label offset={0} position="bottom" angle={0}>TPS</Label>
				</XAxis>

				<YAxis
					dataKey="fee"
					type="number"
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => value >= 1000 ? (value / 1000) + 'K' : value}
				>
					<Label offset={2} position="left" angle={-90}>TPS fee</Label>
				</YAxis>

				<ChartTooltip cursor={false} formatter={(value, name, item) => typeof value === 'number' && value >= 1000 ? `${name !== 'fee' ? 'New ' : ''}TPS fee: ` + (value / 1000).toFixed(4) + 'Kbytes' : `${name !== 'fee' ? 'New ' : ''}TPS fee: ` + +Number(value).toFixed(4) + 'bytes'} content={<ChartTooltipContent />} />

				<defs>
					<linearGradient id="fillCurrent" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="5%"
							stopColor="var(--color-current)"
							stopOpacity={0.8}
						/>
						<stop
							offset="95%"
							stopColor="var(--color-current)"
							stopOpacity={0.1}
						/>
					</linearGradient>
					<linearGradient id="fillNew" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="5%"
							stopColor="var(--color-new)"
							stopOpacity={0.8}
						/>
						<stop
							offset="95%"
							stopColor="var(--color-new)"
							stopOpacity={0.2}
						/>
					</linearGradient>
				</defs>
				<Area
					animationDuration={0}
					dataKey="fee"
					type="monotone"
					fill="url(#fillCurrent)"
					fillOpacity={0.6}
					stroke="var(--color-current)"
					stackId="2a"
				/>
				<Area
					dataKey="newFee"
					type="monotone"
					fill="url(#fillNew)"
					fillOpacity={0.6}
					stroke="var(--color-new)"
					stackId="a"
				/>
			</AreaChart>
		</ChartContainer>
	</div>
}
