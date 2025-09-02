import moment from "moment";
import { propertiesResponse } from "../../controller/responses";
import deleteMessage from "../../scripts/deleteMessage";
import reply from "../../scripts/reply";
import { BotContext } from "../types";

const propertyValueHandler = async (ctx: BotContext, userId: string) => {
	if (ctx.session.waitingForPropiertyValue) {
		const { index } = ctx.session.waitingForPropiertyValue;
		const propiertyId = ctx.session.waitingForPropiertyValue.id;

		let userInput: any = <string>ctx.message?.text?.trim();

		if (!ctx.session.dataForAdd[index].propertiesValues) {
			ctx.session.dataForAdd[index].propertiesValues = {};
		}

		const propierty = Object.values(
			<Object>ctx.session.dataForAdd[index].properties
		).find(({ id }) => id === propiertyId);

		const urlReg = new RegExp(
			"^(https?:\\/\\/)?" +
				"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
				"((\\d{1,3}\\.){3}\\d{1,3}))" +
				"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
				"(\\?[;&a-z\\d%_.~+=-]*)?" +
				"(\\#[-a-z\\d_]*)?$",
			"i"
		);
		const emailReg = new RegExp(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);

		const phoneReg = new RegExp(
			/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
		);

		let message;

		switch (propierty.type) {
			case "email":
				if (!emailReg.test(userInput)) {
					message = "This don't look like a email";
				}
				break;
			case "files":
				if (!urlReg.test(userInput)) {
					message = "This don't look like a URL";
				}
				break;

			case "phone":
				if (!phoneReg.test(userInput)) {
					message = "That's not a phone";
				}
				break;

			case "number":
				if (Number.isNaN(parseInt(userInput, 10))) {
					message = "That's not a number";
				}
				break;

			case "url":
				if (!urlReg.test(userInput)) {
					message = "This don't look like a URL";
				}
				break;

			case "date":
				userInput = moment(userInput).format().toString();
				if (!moment(userInput).isValid()) {
					message = "This don't look like a date";
				}
				break;

			default:
				break;
		}

		if (message) {
			await reply(ctx, message);
			return;
		}

		switch (propierty.type) {
			case "files":
				userInput = [
					{
						type: "external",
						name: userInput.length <= 100 ? userInput : "file",
						external: {
							url: userInput,
						},
					},
				];
				break;
			case "number":
				userInput = parseInt(userInput, 10);
				break;

			case "rich_text":
				userInput = [{ type: "text", text: { content: userInput } }];
				break;

			case "title":
				ctx.session.dataForAdd[index].data.title = userInput;
				userInput = [{ text: { content: userInput } }];
				break;

			case "date":
				userInput = { start: userInput };
				break;
			default:
				break;
		}
		(ctx.session.dataForAdd[index].propertiesValues as any)[propiertyId] =
			userInput;

		try {
			await reply(ctx, `Data added to ${propierty.name}`);
			if (ctx.update?.message?.message_id) {
				await deleteMessage(ctx, ctx.update.message.message_id - 1);
			}
		} catch (error: any) {
			console.log(error);
		}
		await propertiesResponse({
			callbackQuery: <string>(
				ctx.session.dataForAdd[index].listOfpropertiesQuery
			),
			ctx: ctx,
			userId,
		});
		ctx.session.waitingForPropiertyValue = false;
		return;
	}
};

export default propertyValueHandler;
