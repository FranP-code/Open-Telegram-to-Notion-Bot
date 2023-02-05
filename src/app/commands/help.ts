import { BotContext } from "../types";
import reply from "../../scripts/reply";

export default function help(ctx: BotContext) {
	reply(
		ctx,
		`
• The repository of this bot on <strong>GitHub</strong>:
  https://github.com/FranP-code/Open-Telegram-to-Notion-Bot

• The <strong>website</strong> of this project:
  ${process.env.WEBSITE_URL}
        `,
		{ parse_mode: "HTML" }
	);
}
