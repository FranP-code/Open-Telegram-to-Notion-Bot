import { getNotionAuthKey } from "../../controller/queries/databaseQueries";
import { checkAuthCode } from "../../controller/queries/notionQueries";
import reply from "../../scripts/reply";
import { BotContext } from "../types";

export async function checkAuthCodeCommand(ctx: BotContext) {
  const userId = <string>ctx?.from?.id.toString();
  const notionAuthKey = await getNotionAuthKey(userId);
  if (!notionAuthKey) {
    await reply(ctx, "You have not authenticated your Notion account yet");
    return;
  }
  try {
    await checkAuthCode({ auth: notionAuthKey });
  } catch (error) {
    await reply(ctx, "Your auth code is invalid");
  }
  await reply(ctx, "Your auth code is valid");
}
