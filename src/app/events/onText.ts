import messageHandler from "../handlers/messageHandler";
import propertyValueHandler from "../handlers/propertyValueHandler";
import { BotContext } from "../types";

export default async function onText(ctx: BotContext) {
	const userId = <string>ctx?.from?.id.toString();
	const userText = <string>ctx.message?.text?.trim();
	switch (true) {
		case !!ctx.session.waitingForPropiertyValue: {
			await propertyValueHandler(ctx, userId);
			break;
		}
		default:
			await messageHandler(ctx, userId, userText);
			break;
	}
}
