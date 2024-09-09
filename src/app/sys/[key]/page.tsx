import { notFound, redirect } from "next/navigation";

export default function ({ params }: { params: { key: string } }) {
	if (params.key) {
		redirect(`/sys/${params.key}/user_votes`);
	} else {
		return notFound();
	}
}