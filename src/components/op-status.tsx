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

export const OrderProviderStatus: FC<IOrderProviderStatusProps> = ({ validations_count: validationsCount = "0", isActive = false, status = "Unknown", total_witnessing_fees: totalWitnessingFees = "", last_seen_mci_timestamp: lastSeenMciTimestamp = "" }) => {

	if (!isActive) return <StatusDot status={"unknown"} />

	const lastSeenMci = moment(lastSeenMciTimestamp).isValid() ? moment.utc(lastSeenMciTimestamp).fromNow() : "> 12h";

	return <TooltipProvider>
		<Tooltip>
			<TooltipTrigger>
				<StatusDot status={+validationsCount > 0 ? "active" : "inactive"} />
			</TooltipTrigger>
			<TooltipContent>
				<div className="text-xs">
					<div><b>Transactions:</b> {validationsCount}</div>
					<div><b>Last seen:</b> {lastSeenMci}</div>
					<div><b>Origin:</b> {status}</div>
					<div><b>Income (in bytes):</b> {totalWitnessingFees}</div>
				</div>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
}

OrderProviderStatus.displayName = 'OrderProviderStatus';