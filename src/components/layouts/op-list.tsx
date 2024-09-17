"use client"

import * as React from "react"
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"

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
import { Plus, X } from "lucide-react"
import { QRButton } from "../ui/_qr-button"
import { ParamsView } from "../params-view"
import { generateSysLink } from "@/lib/generateLink"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import obyte from "obyte"
import { OrderProviderListDiff } from "./op-list-diff";
import { getWalletDefinition } from "@/services/httpHub";

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
}

export const OrderProviderList: React.FC<IOrderProviderListProps> = ({ data, currentValue }) => {
	const [rowSelection, setRowSelection] = React.useState<{ [rowID: string]: boolean; }>(currentValue.reduce((a, v) => ({ ...a, [v]: true }), {}))
	const [tableRows, setTableRows] = React.useState<IOrderProvider[]>(data);

	const columns: ColumnDef<IOrderProvider>[] = React.useMemo(() => [
		{
			id: "select",
			header: () => null,
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					disabled={row.original.editable && !row.original.isValidEditableField}
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
					<div className="space-x-4 flex items-center">
						<Input
							value={row.getValue("address")}
							className={obyte.utils.isValidAddress(row.getValue("address")) ? "border-green-700 ring-green-700 focus-visible:ring-green-700 focus-visible:ring-offset-0" : "border-red-800 focus-visible:ring-red-800 focus-visible:ring-offset-0"}
							onChange={(ev: React.ChangeEvent<HTMLInputElement>) => changeEditableField(ev, row.original.editableFieldId || "unknownId", ev.target.value)}
						/>
						<div>
							<X
								className="w-6 h-6 cursor-pointer stroke-red-700"
								onClick={() => setTableRows(rows => rows.filter(r => r.editableFieldId !== row.original.editableFieldId))} />
						</div>
					</div> :
					<div className="min-h-[25px]">
						<a href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${row.getValue("address")}`} target="_blank" className="address underline">{row.getValue("address")}</a> <div><small className="text-muted-foreground">{row.original.description}</small></div>
					</div>
			),
		},
		{
			accessorKey: "amount",
			header: () => <div className="text-right">Votes (GBYTE)</div>,
			cell: ({ row }) => <div className="text-right font-medium">
				{row.original.editable ? <span>Your GBYTE balance</span> : <ParamsView
					value={row.getValue("amount")}
					type="number"
					decimals={9}
				/>}
			</div>
			,
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
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: (...props) => {
			if (props.length < 12) {
				setRowSelection(...props)
			}
		},
		state: {
			sorting: [{ id: "amount", desc: false }],
			rowSelection,
		},
	});

	const createEmptyOrderProviderField: React.MouseEventHandler<HTMLButtonElement> = () => {
		setTableRows((prev) => ([...prev, { address: "", amount: 0, editable: true, editableFieldId: Math.random().toString(36).substring(7) }]));
	}

	const changeEditableField = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>, editableFieldId: string, value: string) => {
		setTableRows(tableRows => {
			const index = tableRows.findIndex((row) => row.editableFieldId === editableFieldId);
			setRowSelection((prev) => ({ ...prev, [editableFieldId]: false }));
			if (index !== -1) {
				const newTableRows = [...tableRows];
				newTableRows[index].address = value;
				newTableRows[index].isValidEditableField = obyte.utils.isValidAddress(value);
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
					<div className="w-full px-1 border-t border-r-0">
						<Button onClick={createEmptyOrderProviderField} variant="link" className=""><Plus className="mr-2 h-4 w-4" /> Suggest another order provider</Button>
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

