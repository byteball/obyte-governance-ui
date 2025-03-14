import cn from "classnames";
import { forwardRef } from "react";

const statuses = {
	active: 'text-green-400 bg-green-400/10',
	inactive: 'text-rose-400 bg-rose-400/10',
	unknown: 'text-gray-400 bg-gray-400/10'
}

interface StatusDotProps {
	status?: keyof typeof statuses;
}

export const StatusDot = forwardRef<HTMLDivElement, StatusDotProps>(
	({ status = "unknown" }, ref) => {
		return (
			<div ref={ref} className={cn(statuses[status], 'flex-none rounded-full p-1')}>
				<div className="size-1.5 rounded-full bg-current animate-pulse" />
			</div>
		)
	}
);