import { databasesKeyboard } from "../../controller/keyboards";
import { getDefaultDatabase } from "../../controller/queries/databaseQueries";
import { getDatabases } from "../../controller/queries/notionResolvers";
import { propertiesResponse } from "../../controller/responses";
import reply from "../../scripts/reply";
import { BotContext, GetDefaultDatabaseResponse } from "../types";

const messageHandler = async (
	ctx: BotContext,
	userId: string,
	userText: string
) => {
	const defaultDatabase = <GetDefaultDatabaseResponse>(
		await getDefaultDatabase(userId)
	);
	if (
		defaultDatabase.defaultDatabaseId &&
		defaultDatabase.defaultDatabaseName
	) {
		const { defaultDatabaseId, defaultDatabaseName } = defaultDatabase;
		ctx.session.dataForAdd.push({
			isDeleted: false,
			type: "text",
			data: { title: userText },
			propertiesValues: {},
		});
		await propertiesResponse({
			userId,
			callbackQuery: `db_${defaultDatabaseId}dt_textin_${
				ctx.session.dataForAdd.length - 1
			}`,
			databaseName: defaultDatabaseName,
			ctx,
		});
		return;
	}
	const databases = await getDatabases(userId);
	ctx.session.dataForAdd.push({
		data: { title: userText },
		isDeleted: false,
		type: "text",
		propertiesValues: {},
	});
	const botReply = userText.length > 20 ? `\n\n${userText}` : userText;
	const keyboard = databasesKeyboard({
		databases: databases.results,
		dataType: "text",
		sessionStorage: ctx.session.dataForAdd,
	});

	try {
		await reply(
			ctx,
			`Select the <strong>database</strong> to save <strong>${botReply}</strong>`,
			{ ...keyboard, parse_mode: "HTML" }
		);
	} catch (error: any) {
		console.log(error);
		await reportError(ctx);
	}
};

export default messageHandler;
