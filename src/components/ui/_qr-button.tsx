'use client';

import { FC, forwardRef } from "react";
import { QrCode as QrCodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import cn from "classnames";

import { Button, ButtonProps } from "./button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";

interface IQRButtonProps extends ButtonProps {
	href: string;
}

export const QRButton = forwardRef<HTMLAnchorElement, IQRButtonProps>(({ className, children, href, disabled = false, ...props }, ref) => (<div className="flex">
	<Dialog>
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button {...props} disabled={disabled} className="px-3 rounded-tr-none rounded-br-none">
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
				<DialogTitle className="max-w-[200px] text-center mx-auto">Scan this QR code with your mobile phone</DialogTitle>
			</DialogHeader>
			<div className="mx-auto">
				<a href={href}>
					<QRCodeSVG size={240} className="qr" bgColor='#24292e' fgColor='#fff' value={href} />
				</a>
			</div>

			<div className='text-xs text-foreground max-w-[220px] mx-auto text-center'>
				Install Obyte wallet for <a className='text-blue-700' href="#">iOS</a> or <a className='text-blue-700' href="#">Android</a> if you don't have one yet
			</div>
		</DialogContent>
	</Dialog>
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger asChild>
				<Button {...props} disabled asChild className={cn("pl-2 rounded-tl-none rounded-bl-none cursor-pointer", { "text-primary-foreground pointer-events-none opacity-50 bg-primary select-none": disabled })}>
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
</div>));
