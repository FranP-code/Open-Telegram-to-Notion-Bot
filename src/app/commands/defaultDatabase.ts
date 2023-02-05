import { BotContext } from "../types";
import reply from "../../scripts/reply";
import { getDatabases } from "../../controller/queries/notionResolvers";
import { databasesKeyboard } from "../../controller/keyboards";

export default async function defaultDatabase(ctx: BotContext) {
	const databases = await getDatabases(<string>ctx?.from?.id.toString());
	const keyboard = databasesKeyboard({
		databases: databases.results,
		dataType: "text",
		sessionStorage: ctx.session.dataForAdd,
	});
	await reply(
		ctx,
		"Select a <strong>database</strong> to set as default",
		keyboard
	);
	ctx.session.waitingForDefaultDatabaseSelection = true;
}
