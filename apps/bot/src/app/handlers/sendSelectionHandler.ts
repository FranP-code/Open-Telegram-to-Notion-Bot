import {
	addImageToDatabase,
	addMessageToDatabase,
} from "../../controller/queries/notionResolvers";
import deleteMessage from "../../scripts/deleteMessage";
import reply from "../../scripts/reply";
import { AddMessageToDatabaseResponse, BotContext } from "../types";

const sendSelectionHandler = async (
	ctx: BotContext,
	userId: string,
	messageId: number,
	index: number
) => {
	const dataForAdd = ctx.session.dataForAdd[index];
	if (!dataForAdd || !dataForAdd.databaseId) {
		reportError(ctx);
		return;
	}
	let messageText;
	switch (dataForAdd.type) {
		case "text": {
			const text = dataForAdd.data.title;
			const response = <AddMessageToDatabaseResponse>(
				await addMessageToDatabase(userId, dataForAdd.databaseId, {
					title: text,
					propertiesValues: dataForAdd.propertiesValues || {},
				})
			);
			messageText = `<strong>${
				text.length > 20 ? `${text}\n\n</strong>` : `${text}</strong> `
			}added to <strong>${response.databaseTitle}</strong> database 👍`;
			break;
		}
		case "image":
			const {
				file: image,
				data: { title },
			} = dataForAdd;
			if (!image) throw Error("");
			const imageTitle = title;
			const response = await addImageToDatabase(
				userId,
				dataForAdd.databaseId,
				`https://api.telegram.org/file/bot${
					process.env.NODE_ENV === "production"
						? process.env.BOT_TOKEN_PROD
						: process.env.BOT_TOKEN_DEV
				}/${image.file_path}`,
				imageTitle,
				dataForAdd.propertiesValues
			);
			messageText = `<strong>${
				imageTitle.length > 20
					? `${imageTitle}\n\n</strong>`
					: `${imageTitle}</strong> `
			}added to <strong>${response.databaseTitle}</strong> database 👍`;
			break;
		default:
			reportError(ctx);
			return;
	}
	reply(ctx, messageText);
	ctx.session.dataForAdd[index].isDeleted = true;
	deleteMessage(ctx, messageId);
};

export default sendSelectionHandler;
