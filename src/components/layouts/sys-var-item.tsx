import Link from "next/link";
import { FC } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface ISysVarItemProps {
	description: string;
	name: string;
	sysVarKey: string;
}

export const SysVarItem: FC<ISysVarItemProps> = ({ name, sysVarKey, description }) => (<Card className="flex flex-col justify-between">
	<CardHeader>
		<CardTitle>
			<Link href={`/sys/${sysVarKey}`} className="underline">{name}</Link>
		</CardTitle>
		<CardDescription>{description}</CardDescription>
	</CardHeader>
</Card>)