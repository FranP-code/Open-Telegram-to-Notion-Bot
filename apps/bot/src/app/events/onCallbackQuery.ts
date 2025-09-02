import deleteMessage from "../../scripts/deleteMessage";
import reportError from "../../scripts/reportError";
import { BotContext } from "../types";
import defaultDatabaseSelectionHandler from "../handlers/defaultDatabaseSelectionHandler";
import propertySelectionHandler from "../handlers/propertySelectionHandler";
import valueSelectionHandler from "../handlers/valueSelectionHandler";

export default async function onCallbackQuery(ctx: BotContext) {
	if (!ctx.update.callback_query?.data) {
		return;
	}
	const userId = (<number>ctx.from?.id).toString();
	const prefix = ctx.update.callback_query.data.substring(0, 3);
	/**
	 * * "db_" = database selection
	 * * "pr_" = propierty selection
	 * * "vl_" = value selection
	 */
	const messageId = ctx.update.callback_query.message?.message_id;
	if (!messageId) return;
	try {
		switch (prefix) {
			case "db_": {
				await defaultDatabaseSelectionHandler(ctx, userId, messageId);
				break;
			}
			case "pr_": {
				await propertySelectionHandler(ctx, userId, messageId);
				break;
			}
			case "vl_": {
				await valueSelectionHandler(ctx, userId, messageId);
				break;
			}
			default:
				reportError(ctx);
				break;
		}
	} catch (error: any) {
		console.log(error);
		deleteMessage(ctx, messageId);
		reportError(ctx);
	}
}
