"use client";

import { Plus } from "lucide-react";
import { FC, useRef, useState } from "react";
import obyte from "obyte";

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

interface IAddAnotherOrderProviderModalProps {
	handler: (value: string) => void;
}

export const AddAnotherOrderProviderModal: FC<IAddAnotherOrderProviderModalProps> = ({ handler }) => {
	const [value, setValue] = useState<{ value: string; valid: boolean }>({ value: "", valid: true });
	const ref = useRef<HTMLAnchorElement>(null);

	const handleChangeValue = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const value = ev.target.value.toUpperCase();
		setValue({ value, valid: obyte.utils.isValidAddress(value) });
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
				<Button variant="link" className="px-0"><Plus className="mr-2 h-4 w-4" /> Suggest another op</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Suggest another Order Provider</DialogTitle>
					<DialogDescription>

					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="items-center gap-4">
						<Input onChange={handleChangeValue} onKeyDown={onKeyDownHandle} value={value.value} />
					</div>
				</div>
				<DialogFooter>
					<DialogClose>
						<Button disabled={!value.value || !value.valid} onClick={() => handler(value.value)}>Add to list</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
