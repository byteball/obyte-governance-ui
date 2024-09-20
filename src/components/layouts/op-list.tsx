"use client"

import * as React from "react";
import { nanoid } from 'nanoid';

import {
	ColumnDef,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Checkbox } from "@/components/ui/checkbox"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import appConfig from "@/appConfig"
import { Dot, Plus, X } from "lucide-react"
import { QRButton } from "../ui/_qr-button"
import { ParamsView } from "../params-view"
import { generateSysLink } from "@/lib/generateLink"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import obyte from "obyte"
import { OrderProviderListDiff } from "./op-list-diff";

import { getWalletDefinition, IBalances, IVoteInfo } from "@/services/httpHub";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import moment from "moment";

export type IOrderProvider = {
	amount: number;
	address: string;
	description?: string;
	editable?: boolean;
	editableFieldId?: string;
	editableFieldError?: string;
	editableFieldCheckLoading?: boolean;
	isValidEditableField?: boolean;
}

interface IOrderProviderListProps {
	data: IOrderProvider[];
	currentValue: string[];
	votes: IVoteInfo[];
	balances: IBalances;
}

export const OrderProviderList: React.FC<IOrderProviderListProps> = ({ data, votes, currentValue, balances }) => {
	const [sorting, setSorting] = React.useState<SortingState>([{ id: "amount", desc: false }]);
	const [rowSelection, setRowSelection] = React.useState<{ [rowID: string]: boolean; }>(currentValue.reduce((a, v) => ({ ...a, [v]: true }), {}))
	const [tableRows, setTableRows] = React.useState<IOrderProvider[]>(data);

	const columns: ColumnDef<IOrderProvider>[] = React.useMemo(() => [
		{
			id: "select",
			header: () => null,
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					disabled={row.original.editableFieldCheckLoading || row.original.editable && !row.original.isValidEditableField || row.original.editableFieldError !== undefined}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "address",
			header: "Address",
			id: "address",
			cell: ({ row }) => (
				row.original.editable ?
					<>
						<div className="space-x-4 flex items-center">
							<Input
								value={row.getValue("address")}
								loading={row.original.editableFieldCheckLoading}
								className={obyte.utils.isValidAddress(row.getValue("address")) && row.original.editableFieldError === undefined ? "border-green-700 ring-green-700 focus-visible:ring-green-700 focus-visible:ring-offset-0" : "border-red-800 focus-visible:ring-red-800 focus-visible:ring-offset-0"}
								onChange={(ev: React.ChangeEvent<HTMLInputElement>) => changeEditableField(ev, row.original.editableFieldId || "unknownId", ev.target.value)}
							/>
							<div>
								<X
									className="w-6 h-6 cursor-pointer stroke-red-700"
									onClick={() => setTableRows(rows => rows.filter(r => r.editableFieldId !== row.original.editableFieldId))} />
							</div>
						</div>
						{row.original.editableFieldError ? <div className="text-xs text-red-700 mt-1">{row.original.editableFieldError}</div> : null}
					</> :
					<div className="min-h-[25px]">
						<a href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${row.getValue("address")}`} target="_blank" rel="noreferrer" className="address underline">{row.getValue("address")}</a> <div><small className="text-muted-foreground">{row.original.description}</small></div>
					</div>
			),
		},
		{
			accessorKey: "amount",
			header: () => <div className="text-right">Votes (GBYTE)</div>,
			cell: ({ row }) => <div className="text-right font-medium">
				{row.original.editable ? <span>Your GBYTE balance</span> :
					<Dialog>
						<DialogTrigger>
							<span className="underline">
								<ParamsView
								value={row.getValue("amount")}
								type="number"
								decimals={9}
							/>
							</span>
						</DialogTrigger>

						<DialogContent className="max-w-[700px]">
							<DialogHeader>
								<DialogTitle>Supporters</DialogTitle>
							</DialogHeader>
							<DialogDescription>Order provider: <a href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${row.getValue("address")}`} target="_blank" className="address underline">{row.getValue("address")}</a></DialogDescription>
							<ScrollArea className="max-h-[400px]">
								<div className="space-y-3 pr-5">
									{votes.filter((v) => v.ops?.includes(row.getValue("address"))).map(({ address, timestamp, unit }) => (<div key={address} className="flex justify-between items-center border-b pb-3">
										<div>
											<a href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${address}`} target="_blank" className="address underline">{address}</a>
											<div className="space-x-2">
												{appConfig.PROVIDER_DICTIONARY[address] && <><small className="text-muted-foreground">{appConfig.PROVIDER_DICTIONARY[address]}</small> <Dot className="w-4 h-4 inline-block" /> </>}
												
												<small className="text-muted-foreground">
													<a href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/${unit}`} target="_blank">{moment.unix(timestamp).format("LLL")}</a>
												</small>
											</div>
										</div>
										<div>
											<ParamsView
												value={balances[address] ?? 0}
												type="number"
												decimals={9}
											/> {" "}
											<small>GBYTE</small>
										</div>
									</div>))}
								</div>
							</ScrollArea>
						</DialogContent>
					</Dialog>
				}
			</div>,
			enableSorting: true,
			sortDescFirst: true,
			enableResizing: true,
			sortingFn: (a, b) => b.getValue<number>("amount") - a.getValue<number>("amount"),
		}
	], []);

	const table = useReactTable({
		rowCount: tableRows.length,
		data: tableRows,
		columns,
		getRowId: (row) => row.editableFieldId || row.address,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: (...props) => {
			if (props.length < 12) {
				setRowSelection(...props)
			}
		},
		state: {
			sorting,
			rowSelection,
		},
	});

	const createEmptyOrderProviderField: React.MouseEventHandler<HTMLButtonElement> = () => {
		setTableRows((prev) => ([...prev, { address: "", amount: 0, editable: true, editableFieldId: nanoid() }]));
	}

	const checkWalletDefinition = React.useCallback(async (address: string, id: string) => {
		const definitionExists = await getWalletDefinition(address)//.then(() => true)//.catch(() => false);

		if (definitionExists.error || definitionExists.data === null) {
			setTableRows(tableRows => {
				const index = tableRows.findIndex((row) => row.editableFieldId === id);
				if (index !== -1) {
					const newTableRows = [...tableRows];
					newTableRows[index].editableFieldError = "This wallet is empty, top it up with any amount of GBYTEs";
					newTableRows[index].editableFieldCheckLoading = false;
					return newTableRows;
				} else {
					return tableRows;
				}
			});
		} else {
			setTableRows(tableRows => {
				const index = tableRows.findIndex((row) => row.editableFieldId === id);
				if (index !== -1) {
					const newTableRows = [...tableRows];
					newTableRows[index].editableFieldError = undefined;
					newTableRows[index].editableFieldCheckLoading = false;
					return newTableRows;
				} else {
					return tableRows;
				}
			});
		}
	}, []);

	const changeEditableField = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>, editableFieldId: string, value: string) => {
		setTableRows(tableRows => {
			const index = tableRows.findIndex((row) => row.editableFieldId === editableFieldId);
			setRowSelection((prev) => ({ ...prev, [editableFieldId]: false }));

			if (index !== -1) {
				const isValid = obyte.utils.isValidAddress(value);
				const newTableRows = [...tableRows];
				newTableRows[index].address = value;
				newTableRows[index].isValidEditableField = isValid;

				if (isValid) {
					const newTableRowsWithTheSameAddress = newTableRows.filter((row) => row.address === value);

					if (newTableRowsWithTheSameAddress.length > 1) {
						newTableRows[index].editableFieldError = "This address is already in the list";
					} else {
						newTableRows[index].editableFieldCheckLoading = true;

						checkWalletDefinition(value, editableFieldId);
					}
				} else {
					newTableRows[index].editableFieldError = undefined;
				}

				return newTableRows;
			} else {
				console.log("Editable field not found");
				return tableRows;
			}
		});
	}, []);

	const selectedAddresses = tableRows
		.filter((row) => !!rowSelection[row.editableFieldId || row.address])
		.map((row) => row.address);

	const uri = generateSysLink({ app: "system_vote", param_key: "op_list", value: selectedAddresses.map((address) => `${address}`).join("\n") });

	return (
		<div className="grid grid-cols-5 gap-8">
			<div className="w-full col-span-4">
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
											</TableHead>
										)
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No order providers.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
					<div className="w-full pl-[53px] border-t border-r-0">
						<Button onClick={createEmptyOrderProviderField} variant="link" className="">Suggest another order provider</Button>
						{/* <Plus className="mr-2 h-4 w-4" /> */}
					</div>
				</div>

				<div className="mt-4">
					<OrderProviderListDiff currentAddresses={currentValue} newAddresses={selectedAddresses} />

					<QRButton href={uri} disabled={selectedAddresses.length !== 12}>Vote</QRButton>

					{selectedAddresses.length !== 12
						? <div className="mt-2"><small className="text-red-700">Select 12 order providers</small></div>
						: null}
				</div>
			</div>
		</div>
	)
}

