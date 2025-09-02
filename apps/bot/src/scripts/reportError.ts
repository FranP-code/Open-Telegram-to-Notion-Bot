import { BotContext } from "../app/types";
import reply from "./reply";

export default async function reportError(
	ctx: BotContext,
	errorMessage?: string
) {
	await reply(ctx, errorMessage || "Has been an error. Try again later");
}
