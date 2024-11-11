"use client";

import { Plus } from "lucide-react";
import { isNumber } from "lodash";
import { FC, useRef, useState } from "react";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { QRButton } from "@/components/ui/_qr-button";

import { getCountOfDecimals } from "@/lib/getCountOfDecimals";
import { generateSysLink } from "@/lib/generateLink";

import { sysVarConfiguration } from "@/sysVarConfiguration";

import { ISystemVarsList } from "@/services/httpHub";
import { TpsByFeeChart } from "@/components/tps-by-fee-chart";
import { SizeByOversizeFeeChart } from "@/components/size-by-oversize-fee-chart";

interface IAddAnotherValueModalProps {
	defaultValue?: string;
	paramKey: string;
	sysVars: ISystemVarsList;
}

export const AddAnotherValueModal: FC<IAddAnotherValueModalProps> = ({ defaultValue = "", paramKey, sysVars }) => {
	const [value, setValue] = useState<{ value: string; valid: boolean }>({ value: defaultValue, valid: true });
	const ref = useRef<HTMLAnchorElement>(null);

	if (!sysVarConfiguration[paramKey]) return notFound();

	const { type, short_description, customName } = sysVarConfiguration[paramKey];
	const actionUri = generateSysLink({ param_key: paramKey, value: type === "number" ? Number(value.value) : value.value });

	const pattern = /^\d+(\.?)\d*$/g;

	const handleChangeValue = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const value = ev.target.value.replace(',', '.');

		if ((getCountOfDecimals(value) <= 4 && value.match(pattern) || value === "") && Number(value) <= 10 ** 6 && value.length <= 6) {
			let valid = true;

			if (!isNumber(Number(value)) || Number(value) < 0) {
				valid = false;
			} 

			if (paramKey === "threshold_size" && Number(value) < 1000) {
				valid = false;
			}
			
			setValue({ value, valid });
		}
	}

	const onKeyDownHandle = (ev: React.KeyboardEvent<HTMLInputElement>) => {
		if (ev.code === "Enter" && value.valid && value.value !== "") {
			// @ts-ignore
			ref.current?.click();
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="mt-[50px]"><Plus className="mr-2 h-4 w-4" /> Suggest another value</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Suggest another {customName}</DialogTitle>
					{short_description ? <DialogDescription className="leading-6">
						{short_description} {paramKey === "threshold_size" ? " Minimum value 1000." : null}
					</DialogDescription> : null}
				</DialogHeader>
				{paramKey === "base_tps_fee" || paramKey === "tps_interval" ? <TpsByFeeChart sysVars={sysVars} paramKey={paramKey} value={value.value} /> : null}
				{paramKey === "threshold_size" ? <SizeByOversizeFeeChart sysVars={sysVars} value={Number(value.value || 0)} /> : null}

				<div className="grid gap-4 py-4">
					<div className="items-center gap-4">
						<Input onChange={handleChangeValue} onKeyDown={onKeyDownHandle} value={value.value} />
					</div>
				</div>
				<DialogFooter>
					<DialogClose>
						<QRButton ref={ref} disabled={!value.valid || value.value === ""} href={actionUri}>Vote</QRButton>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
