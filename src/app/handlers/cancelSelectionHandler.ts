import deleteMessage from "../../scripts/deleteMessage";
import reply from "../../scripts/reply";
import { BotContext } from "../types";

const cancelSelectionHandler = async (
	ctx: BotContext,
	messageId: number,
	index: number
) => {
	await reply(ctx, "Operation canceled");
	ctx.session.dataForAdd[index].isDeleted = true;
	await deleteMessage(ctx, messageId);
};

export default cancelSelectionHandler;
