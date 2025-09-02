import { Context, NextFunction } from "grammy";
import { getAllUsers, getUser } from "../../controller/queries/databaseQueries";
import { IUser } from "../../models/schemas/UserSchema";
import { BotContext } from "../types";
import reply from "../../scripts/reply";

export default async function announcementHandler(
	ctx: BotContext,
	next: NextFunction
) {
	if (ctx.session.waitingForAnnouncementMessage) {
		ctx.session.waitingForAnnouncementMessage = false;

		if (ctx.message?.text?.trim().toLowerCase() === "cancel") {
			reply(ctx, "Announcement cancelled");
			return;
		}
		try {
			let users;
			if (process.env.NODE_ENV === "production") {
				users = await getAllUsers();
			} else {
				const testingUserId = await getUser(
					<string>process.env.TESTING_USER_ID
				);
				const myUserId = await getUser(<string>process.env.MY_USER_ID);
				if (!testingUserId || !myUserId) {
					throw Error("");
				}
				users = [testingUserId, myUserId];
			}
			users.forEach((user: IUser, index: number) => {
				setTimeout(async () => {
					try {
						await ctx.api.sendMessage(user.userId, <string>ctx.message?.text, {
							parse_mode: "HTML",
						});
						console.log(`Message sended to ${user.userId}`);
					} catch (error: any) {
						console.log(error);
					}
					if (index === users.length - 1) {
						reply(ctx, "Announcement complete.");
					}
				}, 30000 * index);
			});
		} catch (error: any) {
			console.log(error);
			reportError(error);
		}
	} else {
		next();
	}
}
