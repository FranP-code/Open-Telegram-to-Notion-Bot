import { BotContext } from "../types";
import reply from '../../scripts/reply';

export default function feedback(ctx: BotContext) {
  if (!process.env.FEEDBACK_FORM_URL) {
    return reply(ctx, 'Sorry, there is no feedback form available at the moment.');
  } else {
    return reply(ctx, 'Do you want to give me feedback?\n\n<a href="' + process.env.FEEDBACK_FORM_URL + '">Click here to fill a little form to contact me!</a>', { parse_mode: 'HTML' });
  }
}
