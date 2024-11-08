import Link from "next/link";
import { FC } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface ISysVarItemProps {
	short_description: string;
	name: string;
	sysVarKey: string;
}

export const SysVarItem: FC<ISysVarItemProps> = ({ name, sysVarKey, short_description }) => (<Card className="flex flex-col justify-between">
	<CardHeader>
		<CardTitle className="mb-4">
			<Link href={`/sys/${sysVarKey}`} className="underline">{name}</Link>
		</CardTitle>
		<CardDescription className="leading-6">{short_description}</CardDescription>
	</CardHeader>
</Card>)