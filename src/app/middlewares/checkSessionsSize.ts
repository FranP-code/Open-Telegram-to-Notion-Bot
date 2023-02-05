import { NextFunction } from 'grammy';
import reply from '../../scripts/reply';
import { BotContext } from '../types';

export default function checkSessionsSize(ctx: BotContext, next: NextFunction) {
  const allDataIsDeleted = ctx.session.dataForAdd.every(data => data.isDeleted);

  if (allDataIsDeleted) {
    ctx.session.dataForAdd = [];
  }

  const limit = process.env.NODE_ENV === 'production' ? 15 : 3;
  if (ctx.session.dataForAdd.length >= limit && !ctx.update?.callback_query?.data && ctx.update?.message?.text !== '/clear') {
    reply(ctx, `There's ${ctx.session.dataForAdd.filter((data) => !data.isDeleted).length} messages waiting for be sended to Notion or be canceled. Please, define them and send again a message.`);
    return;
  }
  next();
}
