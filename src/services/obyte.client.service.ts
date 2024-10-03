'use client'

import appConfig from "@/appConfig";
import obyte from "obyte";

let client = new obyte.Client(
	`wss://obyte.org/bb${appConfig.TESTNET ? "-test" : ""}`,
	{
		testnet: appConfig.TESTNET,
		reconnect: true,
	}
);

client.onConnect(() => {
	console.log("log: obyte ws connect");

	const heartbeat = setInterval(function () {
		client.api.heartbeat();
	}, 10 * 1000);

	client.justsaying("watch_system_vars", null);

	// @ts-ignore
	client.client.ws.addEventListener("close", () => {
		clearInterval(heartbeat);
	});
});

export default client;
