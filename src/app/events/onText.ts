import { NextFunction } from "grammy";
import messageHandler from "../handlers/messageHandler";
import propertyValueHandler from "../handlers/propertyValueHandler";
import authCodeHandler from "../middlewares/authCodeHandler";
import { BotContext } from "../types";
import clearHandler from "../middlewares/clearHandler";

export default async function onText(ctx: BotContext) {
	const userId = <string>ctx?.from?.id.toString();
	const userText = <string>ctx.message?.text?.trim();
	console.log(ctx.session);
	switch (true) {
		case ctx.session.waitingForAuthCode: {
			await authCodeHandler(ctx, (() => {}) as NextFunction);
			break;
		}
			
		case ctx.session.waitingForClearConfirmation: {
			await clearHandler(ctx, (() => {}) as NextFunction);
			break;
		}

		case !!ctx.session.waitingForPropiertyValue: {
			await propertyValueHandler(ctx, userId);
			break;
		}
		default:
			await messageHandler(ctx, userId, userText);
			break;
	}
}
