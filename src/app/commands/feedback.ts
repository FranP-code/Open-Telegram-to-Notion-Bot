import { BotContext } from "../types";
import reply from '../../scripts/reply';

export default function feedback(ctx: BotContext) {
  reply(ctx, 'Do you want to give me feedback?\n\n<strong>Message me!</strong>\n<strong>@frankaP</strong>', { parse_mode: 'HTML' });
}
