import { Context, NextFunction } from "grammy";

export default async function chatAction(ctx: Context, next: NextFunction) {
	if (!ctx.update.callback_query) {
		try {
			await ctx.replyWithChatAction("typing");
		} catch (error: any) {
			console.log(error);
		}
	}
	next();
}
