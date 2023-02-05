import { NextFunction } from "grammy";
import {
	addUser,
	removeDefaultDatabase,
} from "../../controller/queries/databaseQueries";
import reply from "../../scripts/reply";
import { BotContext } from "../types";

export default async function authCodeHandler(
	ctx: BotContext,
	next: NextFunction
) {
	if (ctx.session.waitingForAuthCode) {
		ctx.session.waitingForAuthCode = false;
		let responseMessage;
		try {
			await addUser(ctx?.from?.id.toString(), ctx.message?.text);
			await removeDefaultDatabase(ctx.from?.id);
			responseMessage =
				"Auth code registered 👍\n\nSend a message to <strong>add it to the database you select</strong>";
		} catch (error: any) {
			console.log(error);
			if (error.message === "auth code invalid") {
				responseMessage = "Auth code not valid, type /auth again";
			} else {
				responseMessage = "Unknow error, please try again later";
			}
		}
		reply(ctx, responseMessage);
	} else {
		await next();
	}
}
