import { NextFunction } from "grammy"
import reply from '../../scripts/reply'
import { BotContext } from "../types"

export default async function developmentMsg (ctx: BotContext, next: NextFunction) {
  if (process.env.NODE_ENV !== 'development') {
    await next()
    return
  }

  if (
    ctx.from?.id !== parseInt(<string>process.env.MY_USER_ID, 10) &&
    ctx.from?.id !== parseInt(<string>process.env.TESTING_USER_ID, 10)
  ) {
    reply(
      ctx,
      '⚠️ Sorry, this bot is on development for now... \n\nStay alert for new updates! \n\nRepository: https://github.com/FranP-code/Telegram-to-Notion-Bot'
    )
    return
  }

  next()
}
