import { BotContext } from "../app/types";

export default async function reply(ctx: BotContext, text: string, data?: {}) {
	try {
		await ctx.reply(text, { ...data, parse_mode: "HTML" });
	} catch (error: any) {
		console.log(error);
	}
}
