import Link from "next/link"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { FC } from "react"

interface ISysVarItemProps {
	description: string;
	name: string;
	sysVarKey: string;
}

export const SysVarItem: FC<ISysVarItemProps> = ({ name, sysVarKey, description }) => (<Card className="flex flex-col justify-between">
	<CardHeader>
		<CardTitle className="uppercase">{name}</CardTitle>
		<CardDescription>{description}</CardDescription>
	</CardHeader>
	<CardContent>
		<Link className="underline" href={`/sys/${sysVarKey}`}>Vote now</Link>
	</CardContent>
</Card>)