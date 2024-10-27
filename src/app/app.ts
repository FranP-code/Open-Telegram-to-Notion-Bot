/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
import {
	Bot,
	session,
	GrammyError,
	HttpError,
	Context,
	SessionFlavor,
} from "grammy";
import IORedis from 'ioredis';
import { RedisAdapter } from "@grammyjs/storage-redis";

import { BotContext, SessionData } from "./types";
import reply from "../scripts/reply";

// Middlewares
import announcementHandler from "./middlewares/announcementHandler";
import authCodeHandler from "./middlewares/authCodeHandler";
import chatAction from "./middlewares/chatAction";
import checkSessionsSize from "./middlewares/checkSessionsSize";
import clearHandler from "./middlewares/clearHandler";
import developmentMsg from "./middlewares/developmentMsg";
import oldBotMessage from "./middlewares/oldBotMessage";

// Commands
import announcement from "./commands/announcement";
import auth from "./commands/auth";
import clear from "./commands/clear";
import defaultDatabase from "./commands/defaultDatabase";
import feedback from "./commands/feedback";
import help from "./commands/help";
import roadmap from "./commands/roadmap";
import start from "./commands/start";

// Events
import onCallbackQuery from "./events/onCallbackQuery";
import onPhoto from "./events/onPhoto";
import onText from "./events/onText";

import reportError from "../scripts/reportError";
import { dbConnection } from "../models/dbConnection";
import { errorMessages } from "../utils";
import { checkAuthCodeCommand } from "./commands/checkAuthCode";

type MyContext = Context & SessionFlavor<SessionData>;

if (!process.env.REDIS_URL) {
	throw new Error("Please provide REDIS_URL");
}

const redis = new IORedis(process.env.REDIS_URL);
const storage = new RedisAdapter({ instance: redis });

// Setting default session for user
function initialSesionValues(): SessionData {
	return {
		dataForAdd: [],
		waitingForAnnouncementMessage: false,
		waitingForAuthCode: false,
		waitingForClearConfirmation: false,
		waitingForDefaultDatabaseSelection: false,
		waitingForPropiertyValue: false,
	};
}

const bot = new Bot<MyContext>(
	<string>(
		(process.env.OLD_BOT === "true"
			? process.env.BOT_TOKEN_OLD
			: process.env.NODE_ENV === "production"
			? process.env.BOT_TOKEN_PROD
			: process.env.BOT_TOKEN_DEV)
	)
);

bot.use(session({ initial: initialSesionValues, storage }));

bot.api.sendMessage(<string>process.env.MY_USER_ID, "working", {
	parse_mode: "HTML",
});

bot.catch((err) => {
	const { ctx } = err;
	console.log(`Error while handling update ${ctx.update.update_id}:`);
	bot.api.sendMessage(<string>process.env.MY_USER_ID, `broke 💀\n\n${err}`, {
		parse_mode: "HTML",
	});
	const e = err.error;
	if (e instanceof GrammyError) {
		console.log("Error in request:", e.description);
	} else if (e instanceof HttpError) {
		console.log("Could not contact Telegram:", e);
	} else {
		console.log("Unknown error:", e);
	}
});

//* ---------------- MIDDLEWARES ----------------

bot.use(developmentMsg);
bot.use(authCodeHandler);
bot.use(announcementHandler);
bot.use(clearHandler);
bot.use(chatAction);
bot.use(oldBotMessage);
bot.use(checkSessionsSize); //! Keep at bottom of the middlewares

//* ---------------- COMMANDS ----------------

bot.command("start", start);
bot.command("auth", auth);
bot.command("help", help);
bot.command("announcement", announcement);
bot.command("roadmap", roadmap);
bot.command("feedback", feedback);
bot.command("clear", clear);
bot.command("defaultdatabase", defaultDatabase);
bot.command("checkauthcode", checkAuthCodeCommand);

//* ---------------- EVENTS ----------------

const eventFunctionContext = async (
	eventFunction: Function,
	ctx: BotContext
) => {
	try {
		await eventFunction(ctx);
	} catch (error: any) {
		console.log(error);
		const text = error?.message && errorMessages[error.message];
		reportError(ctx, text);
	}
};

bot.on(":text", (ctx) => eventFunctionContext(onText, ctx));
bot.on("callback_query:data", (ctx) =>
	eventFunctionContext(onCallbackQuery, ctx)
);
bot.on(":photo", (ctx) => eventFunctionContext(onPhoto, ctx));
bot.on(":sticker", (ctx) => {
	reply(ctx, "❤️");
});

process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());

(async () => {
	await dbConnection();
	bot.start();
})();

// Fuck Telegraf
// My hommies and I hate Telegraf
// Grammy for the win
