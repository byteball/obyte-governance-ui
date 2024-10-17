'use client';

import { FC, useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Label } from "recharts";

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "./ui/chart";

import { ISystemVarsList } from "@/services/httpHub";
import { getCurrentParamsBySysVars } from "@/lib/getCurrentParamsBySysVars";
import { getStringAbrvOfNumber } from "@/lib/getStringAbrvOfNumber";
import { generateOversizeFeeDataByParams } from "@/lib/generateOversizeFeeDataByParams";


const chartConfig = {
	newOversizeFee: {
		color: "hsl(var(--link))",
		label: "New value",
	},
	oversizeFee: {
		color: "hsl(var(--chart-3))",
		label: "Current value",
	}
} satisfies ChartConfig;


interface ITpsByFeeChartProps {
	sysVars: ISystemVarsList;
	value: number;
}

export const SizeByOversizeFeeChart: FC<ITpsByFeeChartProps> = ({ sysVars, value }) => {
	const currentParams = getCurrentParamsBySysVars(sysVars);
	const chartData = generateOversizeFeeDataByParams({ currentParams, newParams: { ...currentParams, threshold_size: value } });
	const [max, setMax] = useState<'auto' | number>('auto')

	useEffect(() => {
		const fees: number[] = [];
		chartData.forEach(({ oversizeFee, newOversizeFee }) => {
			fees.push(oversizeFee);

			if (newOversizeFee) {
				fees.push(newOversizeFee);
			}
		});

		setMax(fees.length > 0 ? Math.max(...fees) : 'auto');
	}, [chartData, sysVars]);

	return <div className="max-w-[350px]">
		<ChartContainer config={chartConfig}>
			<AreaChart
				data={chartData}
				margin={{ left: 10, right: 5, bottom: 10 }}
			>
				<CartesianGrid vertical={false} horizontal={false} />

				<XAxis
					dataKey="size"
					tickLine={false}
					domain={[0, 'dataMax']}
					axisLine={false}
					tickFormatter={(value) => getStringAbrvOfNumber(value, true)}
					type="number"
				>
					<Label offset={0} position="bottom" angle={0}>Size</Label>
				</XAxis>
				
				<YAxis
					dataKey="oversizeFee"
					type="number"
					domain={[0, max]}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => getStringAbrvOfNumber(value, true)}
				>
					<Label offset={2} position="left" angle={-90}>Oversize fee</Label>
				</YAxis>

				<ChartTooltip cursor={false} formatter={
					(value, name, item) => <div>{name === 'oversizeFee' ? <div className="mb-2"> <b>Size: {getStringAbrvOfNumber(item.payload.size)}</b></div> : null} <span className="font-semibold">{name !== 'oversizeFee' ? 'New' : 'Current'} oversize fee:</span> {getStringAbrvOfNumber(Number(value))}</div>} content={<ChartTooltipContent />} />

				<defs>
					<linearGradient id="fillOversizeFee" x1="0" y1="0" x2="0" y2="1">
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
					<linearGradient id="fillNewOversizeFee" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="5%"
							stopColor="var(--color-newOversizeFee)"
							stopOpacity={0.8}
						/>
						<stop
							offset="95%"
							stopColor="var(--color-newOversizeFee)"
							stopOpacity={0.2}
						/>
					</linearGradient>
				</defs>
				<Area
					animationDuration={0}
					dataKey="oversizeFee"
					type="monotone"
					fill="url(#fillOversizeFee)"
					fillOpacity={0.6}
					stroke="var(--color-oversizeFee)"
					stackId="2a"
				/>
				<Area
					dataKey="newOversizeFee"
					type="monotone"
					fill="url(#fillNewOversizeFee)"
					fillOpacity={0.6}
					stroke="var(--color-newOversizeFee)"
					stackId="a"
				/>

				<ChartLegend content={<ChartLegendContent />} />
			</AreaChart>
		</ChartContainer>
	</div>
}
