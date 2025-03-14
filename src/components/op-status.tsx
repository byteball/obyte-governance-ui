import { FC } from "react";
import moment from "moment";

import { StatusDot } from "./status-dot";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";


export interface IOrderProviderStats {
	total_witnessing_fees: string;
	status: string;
	validations_count: string;
	text: string;
	last_seen_mci_timestamp: string;
}

interface IOrderProviderStatusProps extends IOrderProviderStats {
	isActive: boolean;
}

export const OrderProviderStatus: FC<IOrderProviderStatusProps> = ({ validations_count: validationsCount = "0", isActive = false, total_witnessing_fees: totalWitnessingFees = "" }) => {

	if (!isActive) return <StatusDot status={"unknown"} />

	return <TooltipProvider>
		<Tooltip>
			<TooltipTrigger>
				<StatusDot status={+validationsCount > 0 ? "active" : "inactive"} />
			</TooltipTrigger>
			<TooltipContent>
				<div className="text-xs">
					<div><b>Transactions in 12 hours:</b> {validationsCount}</div>
					<div><b>Income (in bytes):</b> {totalWitnessingFees}</div>
				</div>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
}

OrderProviderStatus.displayName = 'OrderProviderStatus';