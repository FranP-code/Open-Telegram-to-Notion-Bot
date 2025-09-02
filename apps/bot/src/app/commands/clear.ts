import { BotContext } from "../types";
import reply from '../../scripts/reply';

export default async function clear(ctx: BotContext) {
  reply(ctx, 'This is gonna clear all your messages from the cache.\n\nThe messages don\'t sent to Notion are gonna be <strong>permanently deleted</strong>.\n\nAre you sure? \nType <strong>Yes</strong> to confirm.');
  ctx.session.waitingForClearConfirmation = true;
}
