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
import obyte from "obyte";
import moment from "moment";
import { Dot, Link, X } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { QRButton } from "../ui/_qr-button";
import { ParamsView } from "../params-view";
import { generateSysLink } from "@/lib/generateLink";
import { Input } from "../ui/input";
import { OrderProviderListDiff } from "./op-list-diff";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "../ui/dialog";

import {
	getWalletDefinition,
	IBalances,
	IVoteInfo
} from "@/services/httpHub";

import { useToast } from "@/hooks/use-toast";

import appConfig from "@/appConfig"
import { isArray } from "lodash";

import { IOrderProviderStats, OrderProviderStatus } from "../op-status";

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

interface IOrderProviderStatsData {
	[address: string]: IOrderProviderStats;
}

const ORDER_PROVIDERS_STATS_URL = "https://stats.obyte.org/op_stats.json";
const DEV_PROXY_URL = "https://cors.eu.org"; // to fix CORS issue in development 

export const OrderProviderList: React.FC<IOrderProviderListProps> = ({ data, votes, currentValue, balances }) => {
	const [sorting, setSorting] = React.useState<SortingState>([{ id: "amount", desc: false }]);
	const [rowSelection, setRowSelection] = React.useState<{ [rowID: string]: boolean; }>(currentValue.reduce((a, v) => ({ ...a, [v]: true }), {}))
	const [tableRows, setTableRows] = React.useState<IOrderProvider[]>(data);
	const [opStats, setOpStats] = React.useState<IOrderProviderStatsData>({});
	const { toast } = useToast();

	React.useEffect(() => {
		fetch(ORDER_PROVIDERS_STATS_URL, { headers: {}, cache: "no-store" })
			.then((response) => response.json())
			.then((data) => {
				if ("witnesses_stats" in data) {
					setOpStats(data.witnesses_stats);
				} else {
					throw new Error("Unknown error", data);
				}
			}).catch((error) => {
				console.error("Error fetching order providers stats", error);
				setOpStats({});
			});
	}, []);

	const checkWalletDefinition = React.useCallback(async (address: string, id: string) => {
		const definitionExists = await getWalletDefinition(address);

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

	const changeEditableField = React.useCallback((editableFieldId: string, value: string) => {
		setTableRows(tableRows => {
			const index = tableRows.findIndex((row) => row.editableFieldId === editableFieldId);
			const isValid = obyte.utils.isValidAddress(value);

			setRowSelection((prev) => ({ ...prev, [editableFieldId]: isValid }));

			if (index !== -1) {
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

				return tableRows;
			}
		});
	}, [checkWalletDefinition]);

	const columns: ColumnDef<IOrderProvider>[] = React.useMemo(() => [
		{
			id: "select",
			header: () => null,
			cell: ({ row, table }) => (
				<Checkbox
					checked={row.getIsSelected()}
					disabled={row.original.editableFieldCheckLoading || row.original.editable && !row.original.isValidEditableField || row.original.editableFieldError !== undefined}
					onCheckedChange={(value) => {
						const selected = table.getSelectedRowModel();

						if (selected.rows.length >= appConfig.NUMBER_OF_ORDER_PROVIDERS && value === true) {
							toast({
								title: `You can select only ${appConfig.NUMBER_OF_ORDER_PROVIDERS} order providers`,
								variant: "destructive"
							});
						} else {
							row.toggleSelected(!!value)
						}
					}}
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "address",
			header: "Address",
			id: "address",
			cell: ({ row }) => {
				const address: string = row.getValue("address");
				const personalLink = appConfig.PROVIDER_DICTIONARY[address]?.personalLink;
				const opAddressStats = opStats[address] ?? {};

				return (
					row.original.editable ?
						<>
							<div className="space-x-4 flex items-center">
								<Input
									value={row.getValue("address")}
									loading={row.original.editableFieldCheckLoading}
									className={obyte.utils.isValidAddress(address) && row.original.editableFieldError === undefined ? "border-green-700 ring-green-700 focus-visible:ring-green-700 focus-visible:ring-offset-0" : "border-red-800 focus-visible:ring-red-800 focus-visible:ring-offset-0"}
									onChange={(ev: React.ChangeEvent<HTMLInputElement>) => changeEditableField(row.original.editableFieldId || "unknownId", ev.target.value)}
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
							<div className="flex items-center space-x-2">
								<div>
									<a href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${address}`} target="_blank" rel="noopener" className="address">{address}</a>
								</div>

								<OrderProviderStatus isActive={"validations_count" in opAddressStats} {...opAddressStats} />
							</div>
							<div><small className="text-muted-foreground">{row.original.description}</small>
								{personalLink ? <div className="text-xs mt-1 space-x-1 flex items-center"><Link className="inline-block shrink-0 w-3 h-3" /> <span className="group"><a className="text-link" target="_blank" rel="noopener" href={personalLink.url}>{personalLink.text}</a></span></div> : null}
							</div>
						</div>
				)
			},
		},
		{
			accessorKey: "amount",
			header: () => <div className="text-right">Votes (GBYTE)</div>,
			cell: ({ row }) => <div className="text-right font-medium">
				{row.original.editable ? <span>Your GBYTE balance</span> :
					<Dialog>
						<DialogTrigger>
							<span className="text-link">
								<ParamsView
									value={row.getValue("amount")}
									type="number"
									decimals={9}
									fixedDecimals
								/>
							</span>
						</DialogTrigger>

						<DialogContent className="max-w-[700px]">
							<DialogHeader>
								<DialogTitle>Supporters</DialogTitle>
							</DialogHeader>
							<DialogDescription>
								Order provider: <a href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${row.getValue("address")}`} target="_blank" rel="noopener" className="address">{row.getValue("address")}</a>
								<div>{appConfig.PROVIDER_DICTIONARY[String(row.getValue("address"))]?.displayName}</div>
							</DialogDescription>
							<ScrollArea className="max-h-[400px] mt-4">
								<div className="space-y-3 pr-5">
									{votes
										.filter((v) => isArray(v.value) && v.value?.includes(row.getValue("address")))
										.sort((a, b) => (balances[b.address] ?? 0) - (balances[a.address] ?? 0))
										.map(({ address, timestamp, unit }) => (<div key={address} className="flex justify-between items-center border-b pb-3">
											<div>
												<a href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${address}`} target="_blank" rel="noopener" className="address">{address}</a>
												<div className="space-x-2">
													{appConfig.PROVIDER_DICTIONARY[address] && <><small className="text-muted-foreground">{appConfig.PROVIDER_DICTIONARY[address].displayName}</small> <Dot className="w-4 h-4 inline-block" /> </>}

													<small className="text-muted-foreground">
														<a href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/${unit}`} target="_blank" rel="noopener">{moment.unix(timestamp).format("LLL")}</a>
													</small>
												</div>
											</div>
											<div>
												<ParamsView
													value={balances[address] ?? 0}
													type="number"
													fixedDecimals
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
	], [balances, votes, toast, opStats, changeEditableField]);

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
			setRowSelection(...props);
		},
		state: {
			sorting,
			rowSelection,
		},
	});

	const createEmptyOrderProviderField = () => {
		setTableRows((prev) => ([...prev, { address: "", amount: 0, editable: true, editableFieldId: nanoid() }]));
	}


	const selectedAddresses = tableRows
		.filter((row) => !!rowSelection[row.editableFieldId || row.address])
		.map((row) => row.address);

	const uri = generateSysLink({ app: "system_vote", param_key: "op_list", value: selectedAddresses.map((address) => `${address}`).join("\n") });

	return (
		<div className="grid grid-cols-5 gap-8">
			<div className="w-full col-span-5 lg:col-span-4">
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
							<TableRow>
								<TableCell> <span></span> </TableCell>
								<TableCell>
									<span onClick={createEmptyOrderProviderField} className="font-medium text-link cursor-pointer">Suggest another order provider</span>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>

				<div className="mt-4">
					<OrderProviderListDiff currentAddresses={currentValue} newAddresses={selectedAddresses} />

					<div>
						<QRButton href={uri} disabled={selectedAddresses.length !== appConfig.NUMBER_OF_ORDER_PROVIDERS}>Vote</QRButton>
					</div>
					{selectedAddresses.length !== appConfig.NUMBER_OF_ORDER_PROVIDERS
						? <div className="mt-2"><small className="text-red-700">Select {appConfig.NUMBER_OF_ORDER_PROVIDERS} order providers</small></div>
						: null}
				</div>
			</div>
		</div>
	)
}

