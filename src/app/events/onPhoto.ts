import { databasesKeyboard } from "../../controller/keyboards";
import { getDatabases } from "../../controller/queries/notionResolvers";
import reply from "../../scripts/reply";
import reportError from "../../scripts/reportError";
import { BotContext, GetDatabasesResponse } from "../types";

export default async function onPhoto(ctx: BotContext) {
	try {
		const file = await ctx.getFile();
		const userId = <string>ctx?.from?.id.toString();
		const databases = <GetDatabasesResponse>await getDatabases(userId);
		const imageTitle = ctx.update?.message?.caption || file.file_path || "";
		ctx.session.dataForAdd.push({
			type: "image",
			file,
			data: {
				title: imageTitle,
			},
			isDeleted: false,
			propertiesValues: {},
		});
		const keyboard = databasesKeyboard({
			databases: databases.results,
			dataType: "image",
			cancelOperationText: "❌ Don't upload image",
			sessionStorage: ctx.session.dataForAdd,
		});
		reply(
			ctx,
			"Select the <strong>database</strong> to save this image\n\nIf you atached an caption to this image, <strong>it's gonna be the title of the new page</strong> in the Database\n\n<strong>Remember that this image keeps public</strong>\nDon't upload sensitive data!",
			{ ...keyboard, parse_mode: "HTML" }
		);
	} catch (error: any) {
		console.log(error);
		await reportError(ctx);
		throw Error(error.message);
	}
}
