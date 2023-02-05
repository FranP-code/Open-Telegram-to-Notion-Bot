import extractSubstring from "../../scripts/extractSubstring";
import deleteMessage from "../../scripts/deleteMessage";
import reportError from "../../scripts/reportError";
import reply from "../../scripts/reply";
import {
	AddMessageToDatabaseResponse,
	BotContext,
	DataForAdd,
	DataForAddProperty,
	GetDatabasesResponse,
} from "../types";
import {
	addDefaultDatabase,
	removeDefaultDatabase,
} from "../../controller/queries/databaseQueries";
import { IUser } from "../../models/schemas/UserSchema";
import {
	propertiesResponse,
	propertyValuesResponse,
} from "../../controller/responses";
import {
	addImageToDatabase,
	addMessageToDatabase,
	getDatabases,
} from "../../controller/queries/notionResolvers";
import { databasesKeyboard } from "../../controller/keyboards";

export default async function onCallbackQuery(ctx: BotContext) {
	if (!ctx.update.callback_query?.data) {
		return;
	}
	const userId = (<number>ctx.from?.id).toString();
	const prefix = ctx.update.callback_query.data.substring(0, 3);
	/**
	 * * "db_" = database selection
	 * * "pr_" = propierty selection
	 * * "vl_" = value selection
	 */
	const messageId = ctx.update.callback_query.message?.message_id;
	try {
		switch (prefix) {
			case "db_": {
				const { waitingForDefaultDatabaseSelection } = ctx.session;
				if (waitingForDefaultDatabaseSelection) {
					const databaseId = extractSubstring(
						ctx.update.callback_query.data,
						"db_",
						"dt_"
					);
					const response = await addDefaultDatabase(databaseId, userId);
					if (!response.data) {
						reportError(ctx);
						return;
					}
					reply(
						ctx,
						`Added the database <strong>${response.data.defaultDatabaseName}</strong> as default`
					);
					deleteMessage(ctx, messageId);
					ctx.session.waitingForDefaultDatabaseSelection = false;
					break;
				}
				await propertiesResponse({ ctx, userId });
				deleteMessage(ctx, messageId);
				break;
			}

			case "pr_": {
				const index = parseInt(
					extractSubstring(ctx.update.callback_query.data, "in_", false),
					10
				);
				if (!index && typeof index !== "number") {
					reportError(ctx);
					return;
				}
				const operation = extractSubstring(
					ctx.update.callback_query.data,
					"pr_",
					"in_"
				);
				/**
				 * * db_ = database_prefix
				 * * dt_ = dataType
				 * * in_ = indexOnSession
				 * * co_ = cancel_operation
				 */
				if (operation === "co_") {
					reply(ctx, "Operation canceled");
					ctx.session.dataForAdd[index].isDeleted = true;
					deleteMessage(ctx, messageId);
					return;
				}
				if (operation === "sd_") {
					const dataForAdd = ctx.session.dataForAdd[index];
					if (!dataForAdd || !dataForAdd.databaseId) {
						reportError(ctx);
						return;
					}
					let messageText;
					switch (dataForAdd.type) {
						case "text": {
							const text = dataForAdd.data.title;
							const response = <AddMessageToDatabaseResponse>(
								await addMessageToDatabase(userId, dataForAdd.databaseId, {
									title: text,
									propertiesValues: dataForAdd.propertiesValues || {},
								})
							);
							messageText = `<strong>${
								text.length > 20 ? `${text}\n\n</strong>` : `${text}</strong> `
							}added to <strong>${response.databaseTitle}</strong> database 👍`;
							break;
						}
						case "image":
							const {
								file: image,
								data: { title },
							} = dataForAdd;
							if (!image) throw Error("");
							const imageTitle = title;
							const response = await addImageToDatabase(
								userId,
								dataForAdd.databaseId,
								`https://api.telegram.org/file/bot${
									process.env.NODE_ENV === "production"
										? process.env.BOT_TOKEN_PROD
										: process.env.BOT_TOKEN_DEV
								}/${image.file_path}`,
								imageTitle,
								dataForAdd.propertiesValues
							);
							messageText = `<strong>${
								imageTitle.length > 20
									? `${imageTitle}\n\n</strong>`
									: `${imageTitle}</strong> `
							}added to <strong>${response.databaseTitle}</strong> database 👍`;
							break;
						default:
							reportError(ctx);
							return;
					}
					reply(ctx, messageText);
					ctx.session.dataForAdd[index].isDeleted = true;
					deleteMessage(ctx, messageId);
					return;
				}
				if (operation === "rd_" || operation === "ds_") {
					const databases = <GetDatabasesResponse>await getDatabases(userId);
					if (!ctx.session.dataForAdd[index]) {
						reportError(ctx);
						return;
					}
					const text = <string>ctx.session.dataForAdd[index]?.data.title;
					const botReply = text.length > 20 ? `\n\n${text}` : text;
					const keyboard = databasesKeyboard({
						databases: databases.results,
						dataType: "text",
						sessionStorage: ctx.session.dataForAdd,
					});

					await deleteMessage(ctx, messageId);

					try {
						if (operation === "rd_") {
							const response = <IUser>await removeDefaultDatabase(ctx.from?.id);
							await reply(
								ctx,
								`Removed <strong>${response.defaultDatabaseName}</strong> as default database`
							);
						}
						await reply(
							ctx,
							`Select the <strong>database</strong> to save <strong>${botReply}</strong>`,
							{ ...keyboard, parse_mode: "HTML" }
						);
					} catch (error: any) {
						console.log(error);
						deleteMessage(ctx, messageId);
						reportError(ctx);
					}
				}
				await propertyValuesResponse({ ctx });
				deleteMessage(ctx, messageId);

				break;
			}
			case "vl_": {
				const index = parseInt(
					extractSubstring(ctx.update.callback_query.data, "pi_", ""),
					10
				);
				const dataForAdd = ctx.session.dataForAdd[index];

				if (
					!dataForAdd ||
					!dataForAdd.properties ||
					!dataForAdd.propertiesValues
				) {
					reportError(ctx);
					return;
				}
				if (
					extractSubstring(ctx.update.callback_query.data, "vl_", "pi_") ===
					"dn_"
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
					Object.values(dataForAdd.properties).find(
						(prop) => prop.id === propertyId
					)
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
								dataForAdd.propertiesValues[propertyId] = [
									...propiertyValue,
									data,
								];
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
							callbackQuery:
								ctx.session.dataForAdd[index].listOfpropertiesQuery,
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
						(ctx.session.dataForAdd[index].propertiesValues as any)[
							propertyId
						] = data;
						await reply(ctx, `<strong>${data.name}</strong> value added`);
						await deleteMessage(ctx, messageId);
						propertiesResponse({
							userId,
							callbackQuery:
								ctx.session.dataForAdd[index].listOfpropertiesQuery,
							ctx,
						});
						break;
					}

					default:
						reportError(ctx);
						return;
				}
				if (messageText) reply(ctx, messageText);
				break;
			}
			default:
				reportError(ctx);
				break;
		}
	} catch (error: any) {
		console.log(error);
		deleteMessage(ctx, messageId);
		reportError(ctx);
	}
}
