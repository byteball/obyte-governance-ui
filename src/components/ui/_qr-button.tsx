'use client';

import { forwardRef, useRef } from "react";
import { QrCode as QrCodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import cn from "classnames";

import { Button, ButtonProps } from "./button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";

interface IQRButtonProps extends ButtonProps {
	href: string;
	fluid?: boolean;
}

export const QRButton = forwardRef<HTMLAnchorElement, IQRButtonProps>(({ className, fluid, children, href, disabled = false, ...props }, ref) => {
	const insideLinkRef = useRef<HTMLButtonElement>(null);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === 'Enter') {
			insideLinkRef && insideLinkRef?.current?.click();
		}
	};

	return (<div onKeyDown={handleKeyDown} tabIndex={0} className="inline-flex rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0">
		<Dialog>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
							<Button tabIndex={-1} {...props} disabled={disabled} className="px-3 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-tr-none rounded-br-none">
								<QrCodeIcon className="w-4 h-4" />
							</Button>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent className="max-w-[250px]">
						<p>Send the transaction from your mobile phone</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="max-w-[200px] text-center mx-auto leading-6">Scan this QR code with your mobile phone</DialogTitle>
				</DialogHeader>
				<div className="mx-auto">
					<a href={href}>
						<QRCodeSVG size={240} className="qr" bgColor='#fff' marginSize={1} value={href} />
					</a>
				</div>

				<div className='text-xs text-foreground max-w-[220px] mx-auto text-center'>
					Install Obyte wallet for <a className='text-blue-700 dark:text-blue-400' href="https://itunes.apple.com/us/app/byteball/id1147137332?ls=1&mt=8" target="_blank" rel="noopener">iOS</a> or <a className='text-blue-700 dark:text-blue-400' href="https://play.google.com/store/apps/details?id=org.byteball.wallet" target="_blank" rel="noopener">Android</a> if you don&apos;t have one yet
				</div>
			</DialogContent>
		</Dialog>
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button {...props} ref={insideLinkRef} tabIndex={-1} disabled={disabled} asChild className={cn("pl-2 rounded-tl-none rounded-bl-none cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0", { "pointer-events-none opacity-50 select-none": disabled }, { "w-full": fluid })}>
						<a href={href} ref={ref}>
							{children}
						</a>
					</Button>
				</TooltipTrigger>
				<TooltipContent className="max-w-[250px]">
					<p>This will open your Obyte wallet installed on this computer and send the transaction</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	</div>)
});

QRButton.displayName = "QRButton";