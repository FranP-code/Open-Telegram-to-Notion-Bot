import { addDefaultDatabase } from "../../controller/queries/databaseQueries";
import { propertiesResponse } from "../../controller/responses";
import deleteMessage from "../../scripts/deleteMessage";
import extractSubstring from "../../scripts/extractSubstring";
import reply from "../../scripts/reply";
import { BotContext } from "../types";

const defaultDatabaseSelectionHandler = async (
	ctx: BotContext,
	userId: string,
	messageId: number | undefined
) => {
	if (!ctx.update.callback_query?.data) {
		return;
	}
	const { waitingForDefaultDatabaseSelection } = ctx.session;
	if (waitingForDefaultDatabaseSelection) {
		const databaseId = extractSubstring(
			ctx.update.callback_query.data,
			"db_",
			"dt_"
		);
		const response = await addDefaultDatabase(databaseId, userId);
		if (!response.data) {
			reportError(ctx);
			return;
		}
		reply(
			ctx,
			`Added the database <strong>${response.data.defaultDatabaseName}</strong> as default`
		);
		deleteMessage(ctx, messageId);
		ctx.session.waitingForDefaultDatabaseSelection = false;
		return;
	}
	await propertiesResponse({ ctx, userId });
	await deleteMessage(ctx, messageId);
};

export default defaultDatabaseSelectionHandler;
