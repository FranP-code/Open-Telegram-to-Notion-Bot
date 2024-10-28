import { Context, NextFunction } from "grammy";

export default async function chatAction(ctx: Context, next: NextFunction) {
	if (!ctx.update.callback_query) {
		try {
			if (ctx.chat?.id) await ctx.api.sendChatAction(ctx.chat?.id, "typing");
		} catch (error: any) {
			console.log(error);
		}
	}
	next();
}
