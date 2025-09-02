import { BotContext } from "../types";
import reply from "../../scripts/reply";

export default function roadmap(ctx: BotContext) {
	reply(
		ctx,
		"Here is the next features for this bot 👇\n\nhttps://franpcode.notion.site/franpcode/3ef68732c1f9426dbdaba21e20dc3509?v=660b09746d4d4ede877a477d3b628f02",
		{ parse_mode: "HTML" }
	);
}
