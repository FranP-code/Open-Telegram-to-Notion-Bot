import { databasesKeyboard } from "../../controller/keyboards";
import { removeDefaultDatabase } from "../../controller/queries/databaseQueries";
import { getDatabases } from "../../controller/queries/notionResolvers";
import { IUser } from "../../models/schemas/UserSchema";
import deleteMessage from "../../scripts/deleteMessage";
import reply from "../../scripts/reply";
import { BotContext, GetDatabasesResponse } from "../types";

const removeDefaultDatabaseSelectionHandler = async (
	ctx: BotContext,
	userId: string,
	messageId: number,
	index: number
) => {
	const databases = <GetDatabasesResponse>await getDatabases(userId);
	if (!ctx.session.dataForAdd[index]) {
		reportError(ctx);
		return;
	}
	const text = <string>ctx.session.dataForAdd[index]?.data.title;
	const botReply = text.length > 20 ? `\n\n${text}` : text;
	const keyboard = databasesKeyboard({
		databases: databases.results,
		dataType: "text",
		sessionStorage: ctx.session.dataForAdd,
	});
	await deleteMessage(ctx, messageId);
	try {
		const response = <IUser>await removeDefaultDatabase(ctx.from?.id);
		await reply(
			ctx,
			`Removed <strong>${response.defaultDatabaseName}</strong> as default database`
		);
		await reply(
			ctx,
			`Select the <strong>database</strong> to save <strong>${botReply}</strong>`,
			{ ...keyboard, parse_mode: "HTML" }
		);
	} catch (error: any) {
		console.log(error);
		deleteMessage(ctx, messageId);
		reportError(ctx);
	}
};

export default removeDefaultDatabaseSelectionHandler;
