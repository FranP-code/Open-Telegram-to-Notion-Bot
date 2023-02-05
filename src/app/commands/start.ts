import { BotContext } from "../types";
import reply from '../../scripts/reply';

export default function start(ctx: BotContext) {
  reply(ctx, 'Welcome to the <strong>Open Telegram to Notion Bot</strong>\n\nType /auth for authorize the bot', { parse_mode: 'HTML' });
}
