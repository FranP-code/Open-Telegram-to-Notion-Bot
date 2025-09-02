import { NextFunction } from "grammy";
import { BotContext } from "../types";

import reply from '../../scripts/reply';

export default function oldBotMessage(ctx: BotContext, next: NextFunction) {
  if (process.env.OLD_BOT === 'true') {
    reply(ctx, 'Hello, this bot <strong>it\'s not working anymore on this username</strong>.\nPlease use it in his new username 👇\n\nhttps://t.me/OpenTelegramToNotionBot', { parse_mode: 'HTML' });
  } else {
    next();
  }
}