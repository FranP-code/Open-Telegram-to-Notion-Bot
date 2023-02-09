import { databasesKeyboard } from "../../controller/keyboards";
import { removeDefaultDatabase } from "../../controller/queries/databaseQueries";
import { getDatabases } from "../../controller/queries/notionResolvers";
import { propertyValuesResponse } from "../../controller/responses";
import { IUser } from "../../models/schemas/UserSchema";
import deleteMessage from "../../scripts/deleteMessage";
import extractSubstring from "../../scripts/extractSubstring";
import reply from "../../scripts/reply";
import reportError from "../../scripts/reportError";
import { BotContext, GetDatabasesResponse } from "../types";
import cancelSelectionHandler from "./cancelSelectionHandler";
import databaseSelection from "./databaseSelection";
import removeDefaultDatabaseSelectionHandler from "./removeDefaultDatabaseSelectionHandler";
import sendSelectionHandler from "./sendSelectionHandler";

const propertySelectionHandler = async (
	ctx: BotContext,
	userId: string,
	messageId: number
) => {
	if (!ctx.update.callback_query?.data) {
		return;
	}
	const index = parseInt(
		extractSubstring(ctx.update.callback_query.data, "in_", false),
		10
	);
	if (!index && typeof index !== "number") {
		reportError(ctx);
		return;
	}
	const operation = extractSubstring(
		ctx.update.callback_query.data,
		"pr_",
		"in_"
	);
	/**
	 * * db_ = database_prefix
	 * * dt_ = dataType
	 * * in_ = indexOnSession
	 * * co_ = cancel_operation
	 * * rd_ = remove default database
	 * * ds_ = database selection
	 */
	switch (true) {
		case operation === "co_":
			await cancelSelectionHandler(ctx, messageId, index);
			break;
		case operation === "sd_":
			await sendSelectionHandler(ctx, userId, messageId, index);
			break;
		case operation === "ds_":
			await databaseSelection(ctx, userId, messageId, index);
			break;
		case operation === "rd_":
			await removeDefaultDatabaseSelectionHandler(
				ctx,
				userId,
				messageId,
				index
			);
			break;
		default:
			await propertyValuesResponse({ ctx });
			await deleteMessage(ctx, messageId);
			break;
	}
	// if (operation === "co_") {
	// 	await cancelSelectionHandler(ctx, messageId, index);
	// 	return;
	// }
	// if (operation === "sd_") {
	// 	await sendSelectionHandler(ctx, userId, messageId, index);
	// 	return;
	// }
	// if (operation === "ds_") {
	// 	await databaseSelection(ctx, userId, messageId, index);
	// }
	// if (operation === "rd_") {
	// 	await removeDefaultDatabaseSelectionHandler(ctx, userId, messageId, index);
	// }
};

export default propertySelectionHandler;
