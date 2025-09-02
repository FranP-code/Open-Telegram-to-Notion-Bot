import reply from '../../scripts/reply';
import { BotContext } from "../types";

export default async function announcement(ctx: BotContext) {
  if (ctx.from?.id !== parseInt(<string>process.env.MY_USER_ID, 10)) {
    reply(ctx, 'Sorry, this command is only for admins');
    return;
  }

  ctx.session.waitingForAnnouncementMessage = true;

  await reply(ctx, 'Tell your announcement, king.\n\nIt gonna have an <strong>HTML format</strong>.', { parse_mode: 'HTML' });
  reply(ctx, 'Type CANCEL for cancel the announcement');
}
