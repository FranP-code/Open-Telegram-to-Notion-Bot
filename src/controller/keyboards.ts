import { DataForAdd, DataForAddProperty, INotionDatabase } from "../app/types";

export function databasesKeyboard(props: {
	databases: INotionDatabase[];
	cancelOperationText?: string;
	dataType: string;
	sessionStorage: DataForAdd[];
}) {
	const { databases, cancelOperationText, dataType, sessionStorage } = props;
	/**
	 * * db_ = database_prefix
	 * * dt_ = dataType
	 * * in_ = indexOnSession
	 * * co_ = cancel_operation
	 *
	 * Thank you Telegram and your's 64 bytes limit https://github.com/yagop/node-telegram-bot-api/issues/706
	 */
	return {
		reply_markup: {
			inline_keyboard: [
				...databases.map((obj) => {
					const title =
						obj.title.length <= 0 ? "Untitled" : obj.title[0].text.content;

					if (obj.properties.telegramIgnore) {
						return [];
					}

					if (obj.icon) {
						return [
							{
								text: `${obj.icon.emoji ? `${obj.icon.emoji} ` : ""}${title}`,
								callback_data: `db_${obj.id}dt_${dataType}in_${JSON.stringify(
									sessionStorage.length - 1
								)}`,
							},
						];
					}
					return [
						{
							text: title,
							callback_data: `db_${obj.id}dt_${dataType}in_${JSON.stringify(
								sessionStorage.length - 1
							)}`,
						},
					];
				}),
				[
					{
						text: cancelOperationText || "🚫",
						callback_data:
							"db_" +
							"co_" +
							`dt_${dataType}in_${JSON.stringify(sessionStorage.length - 1)}`,
					},
				],
			],
		},
	};
}

export function propertiesKeyboard(
	properties: DataForAddProperty[],
	dataIndex?: number,
	hasDefaultDatabase?: boolean
) {
	/**
	 * * pr_ = propierty prefix
	 * * in_ = data index
	 * * sd_ = send
	 * * co_ = cancel operation
	 * * rd_ = remove default database
	 * * ds_ = database selection
	 */

	const validTypes = [
		"multi_select",
		"phone_number",
		"number",
		"checkbox",
		"select",
		"email",
		"rich_text",
		"url",
		"title",
		"files",
		"date",
	];
	const inlineKeyboard = [
		...properties
			.filter((prop) => validTypes.includes(prop.type))
			.map((prop) => [
				{
					text: prop.name,
					callback_data: `pr_${prop.id}in_${dataIndex}`,
				},
			]),
		[
			{
				text: "✅",
				callback_data: "pr_" + "sd_" + `in_${dataIndex}`,
			},
		],
		[
			{
				text: "🚫",
				callback_data: "pr_" + "co_" + `in_${dataIndex}`,
			},
		],
	];
	if (hasDefaultDatabase) {
		inlineKeyboard.push([
			{
				text: "⬅ Back to databases selection",
				callback_data: "pr_" + "ds_" + `in_${dataIndex}`,
			},
			{
				text: "🗑️ Remove default database",
				callback_data: "pr_" + "rd_" + `in_${dataIndex}`,
			},
		]);
	}
	return {
		reply_markup: {
			inline_keyboard: inlineKeyboard,
		},
	};
}
