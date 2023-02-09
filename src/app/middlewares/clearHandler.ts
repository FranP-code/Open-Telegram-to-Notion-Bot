import { NextFunction } from "grammy";
import { BotContext } from "../types";
import reply from "../../scripts/reply";

export default async function clearHandler(
	ctx: BotContext,
	next: NextFunction
) {
	if (ctx.session.waitingForClearConfirmation) {
		if (ctx.update.message?.text?.toLowerCase() === "yes") {
			ctx.session.dataForAdd = [];
			reply(ctx, "Cleared the cache 👌");
		} else {
			reply(ctx, "Operation canceled. The cache wasn't cleaned");
		}
		ctx.session.waitingForClearConfirmation = false;
	} else {
		next();
	}
}
