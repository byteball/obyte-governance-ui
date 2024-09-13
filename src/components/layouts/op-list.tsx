"use client"

import * as React from "react"
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import appConfig from "@/appConfig"
import { X } from "lucide-react"
import { QRButton } from "../ui/_qr-button"
import { AddAnotherOrderProviderModal } from "./modals/add-another-op"
import { ParamsView } from "../params-view"
import { generateSysLink } from "@/lib/generateLink"

export type IOrderProvider = {
	amount: number;
	address: string;
	description?: string
}

export const columns: ColumnDef<IOrderProvider>[] = [
	{
		id: "select",
		header: () => null,
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "address",
		header: "Address",
		cell: ({ row }) => (
			<div>
				<a href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${row.getValue("address")}`} target="_blank" className="address underline">{row.getValue("address")}</a> <div><small className="text-muted-foreground">{row.original.description}</small></div>
			</div>
		),
	},
	{
		accessorKey: "amount",
		header: () => <div className="text-right">Amount (GBYTE)</div>,
		cell: ({ row }) => <div className="text-right font-medium">
			<ParamsView
				value={row.getValue("amount")}
				type="number"
				decimals={9}
			/>
		</div>
		,
		enableSorting: true,
		sortDescFirst: true,
		enableResizing: true,
		sortingFn: (a, b) => b.getValue<number>("amount") - a.getValue<number>("amount"),
	}
]

interface IOrderProviderListProps {
	data: IOrderProvider[];
}

export const OrderProviderList: React.FC<IOrderProviderListProps> = ({ data }) => {

	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)

	const [rowSelection, setRowSelection] = React.useState({})
	const [tableRows, setTableRows] = React.useState<IOrderProvider[]>(data);

	const table = useReactTable({
		rowCount: tableRows.length,
		data: tableRows,
		columns,
		getRowId: (row) => row.address,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
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
			columnFilters,
			rowSelection,
		},
	});

	const addOrderProviderAndSelect = (address: string) => {
		if (!tableRows.map((r => r.address)).includes(address)) {
			setTableRows((prev) => ([...prev, { address, amount: 0 }]));
		}

		setRowSelection((prev) => ({ ...prev, [address]: true }));
	}

	const uri = generateSysLink({ app: "system_vote", param_key: "op_list", value: Object.entries(rowSelection).filter(([_, value]) => value).map(([address])=> `${address}`).join("\n") });

	return (
		<div className="grid grid-cols-6 gap-8">
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
				</div>
			</div>
			<div className="col-span-2">
				<Card className="z-50 sticky top-[79px] w-full">
					<CardHeader className="pb-2">
						<CardTitle className="text-xl">Selected order providers</CardTitle>
						<CardDescription>
							Select 12 order providers to vote or add new ones.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{table.getFilteredSelectedRowModel().rows.length ? <div>
							{table.getFilteredSelectedRowModel().rows.map((row, index) => {
								const address = row.getValue<string>("address");

								return (<div className="w-full">{index + 1}. <a href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${address}`} target="_blank" className="underline">
									{address.slice(0, 8)}... {address.slice(-8, address.length)}
								</a> <span className="cursor-pointer text-red-700 inline-block align-middle" onClick={() => row.toggleSelected(false)}><X /></span></div>)
							})}
						</div> : <div>No order providers selected</div>}
						<AddAnotherOrderProviderModal handler={addOrderProviderAndSelect} />

						<div className="mt-8">
							<QRButton fluid href={uri} disabled={table.getFilteredSelectedRowModel().rows.length !== 12}>Vote</QRButton>
							{table.getFilteredSelectedRowModel().rows.length !== 12
								? <div className="text-center"><small className="text-red-700">Select 12 order providers</small></div>
								: null}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
