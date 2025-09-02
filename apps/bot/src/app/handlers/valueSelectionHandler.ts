import { propertiesResponse } from "../../controller/responses";
import deleteMessage from "../../scripts/deleteMessage";
import extractSubstring from "../../scripts/extractSubstring";
import reply from "../../scripts/reply";
import { BotContext, DataForAddProperty } from "../types";

const valueSelectionHandler = async (
	ctx: BotContext,
	userId: string,
	messageId: number
) => {
	if (!ctx.update.callback_query?.data) {
		return;
	}
	const index = parseInt(
		extractSubstring(ctx.update.callback_query.data, "pi_", ""),
		10
	);
	const dataForAdd = ctx.session.dataForAdd[index];

	if (!dataForAdd || !dataForAdd.properties || !dataForAdd.propertiesValues) {
		reportError(ctx);
		return;
	}
	if (
		extractSubstring(ctx.update.callback_query.data, "vl_", "pi_") === "dn_"
	) {
		ctx.session.waitingForPropiertyValue = false;
		await deleteMessage(ctx, messageId);
		propertiesResponse({
			ctx,
			userId,
			callbackQuery: dataForAdd.listOfpropertiesQuery,
		});
		return;
	}
	const propertyId = extractSubstring(
		ctx.update.callback_query.data,
		"pr_",
		"pi_"
	);
	const property = <DataForAddProperty>(
		Object.values(dataForAdd.properties).find((prop) => prop.id === propertyId)
	);
	const optionId = extractSubstring(
		ctx.update.callback_query.data,
		"vl_",
		"pr_"
	);
	const propiertyValue = dataForAdd.propertiesValues[propertyId];

	let messageText;
	switch (property.type) {
		case "multi_select": {
			const data = property.multi_select?.options.find(
				(option) => option.id === optionId
			);
			if (!data) {
				reportError(ctx);
				return;
			}
			if (propiertyValue) {
				if (
					!Object.keys(dataForAdd.propertiesValues[propertyId]).includes(
						data.id
					)
				) {
					dataForAdd.propertiesValues[propertyId] = [...propiertyValue, data];
				}
			} else {
				dataForAdd.propertiesValues[propertyId] = [data];
			}
			messageText = `<strong>${data.name}</strong> value added`;
			break;
		}

		case "checkbox": {
			const propertyData = JSON.parse(optionId);
			dataForAdd.propertiesValues[propertyId] = propertyData;
			await reply(
				ctx,
				`<strong>${property.name}</strong> is <strong>${
					propertyData ? "checked" : "unchecked"
				}</strong>`
			);
			await deleteMessage(ctx, messageId);
			await propertiesResponse({
				userId,
				callbackQuery: ctx.session.dataForAdd[index].listOfpropertiesQuery,
				ctx,
			});
			break;
		}

		case "select": {
			const data = property.select?.options.find(
				(option) => option.id === optionId
			);
			if (!ctx.session.dataForAdd[index] || !data) {
				reportError(ctx);
				return;
			}
			(ctx.session.dataForAdd[index].propertiesValues as any)[propertyId] =
				data;
			await reply(ctx, `<strong>${data.name}</strong> value added`);
			await deleteMessage(ctx, messageId);
			propertiesResponse({
				userId,
				callbackQuery: ctx.session.dataForAdd[index].listOfpropertiesQuery,
				ctx,
			});
			break;
		}

		default:
			reportError(ctx);
			return;
	}
	if (messageText) reply(ctx, messageText);
};

export default valueSelectionHandler;
