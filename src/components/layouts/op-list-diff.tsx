import { difference } from "lodash";
import { FC, memo } from "react";

import appConfig from "@/appConfig";

interface IOrderProviderListDiffProps {
	currentAddresses: string[];
	newAddresses: string[];
}

export const OrderProviderListDiff: FC<IOrderProviderListDiffProps> = memo(({ currentAddresses = [], newAddresses = [] }) => {
	if (newAddresses.length !== appConfig.NUMBER_OF_ORDER_PROVIDERS) return null;

	const removedOp = difference(currentAddresses, newAddresses);
	const addedOp = difference(newAddresses, currentAddresses);

	if (removedOp.length === 0 || addedOp.length === 0) return null;

	return <>
		<h4 className="text-xl font-semibold leading-none tracking-tight">List of changes</h4>

		<div className="mb-4 space-y-2 mt-2">
			{removedOp.map((address, index) => (
				<div className="text-xs" key={address}>
					<a className="text-red-700 line-through" href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${address}`} target="_blank" rel="noreferrer"><span className="address">{address}</span> {address in appConfig.PROVIDER_DICTIONARY ? <span> ({appConfig.PROVIDER_DICTIONARY[address]})</span> : null}</a>
					{" -> "}
					<a className="text-green-700" href={`https://${appConfig.TESTNET ? 'testnet' : ''}explorer.obyte.org/address/${addedOp[index]}`} target="_blank" rel="noreferrer"><span className="address">{addedOp[index]}</span> {addedOp[index] in appConfig.PROVIDER_DICTIONARY ? <span> ({appConfig.PROVIDER_DICTIONARY[addedOp[index]]})</span> : null}</a>
				</div>
			))}
		</div>
	</>
});

OrderProviderListDiff.displayName = "OrderProviderListDiff";