import { BotContext } from "../app/types";

export default async function deleteMessage(
	ctx: BotContext,
	messageId: number | undefined
) {
	if (!ctx.chat?.id || !messageId) {
		return;
	}
	try {
		await ctx.api.deleteMessage(ctx.chat?.id, messageId);
	} catch (error: any) {
		console.log(error);
	}
}
