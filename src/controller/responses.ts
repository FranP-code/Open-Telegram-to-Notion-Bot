import extractSubstring from "../scripts/extractSubstring";
import { BotContext, DataForAddProperty, INotionDatabase } from "../app/types";
import reportError from "../scripts/reportError";
import reply from "../scripts/reply";
import { getDatabaseData } from "./queries/notionQueries";
import { getProperties } from "./queries/notionResolvers";
import { propertiesKeyboard } from "./keyboards";

export async function propertiesResponse(props: {
	ctx: BotContext;
	userId: string;
	callbackQuery?: string;
	databaseName?: string;
}) {
	const { ctx, userId, callbackQuery, databaseName } = props;
	const config = callbackQuery || ctx.update.callback_query?.data || "";
	const index = parseInt(extractSubstring(config, "in_", false), 10);
	if (!ctx.session.dataForAdd[index]) {
		reportError(ctx);
		return;
	}
	ctx.session.dataForAdd[index].listOfpropertiesQuery = config;
	if (config.includes("co_")) {
		ctx.session.dataForAdd[index].isDeleted = true;
		reply(ctx, "Operation canceled 👍");
		return;
	}
	const databaseId = extractSubstring(config, "db_", "dt_");
	let databaseProperties;
	if (!ctx.session.dataForAdd[index].properties) {
		try {
			databaseProperties = await getProperties(userId, databaseId);
			if (!databaseProperties) {
				reportError(ctx);
				return;
			}
			ctx.session.dataForAdd[index].properties = databaseProperties;
			ctx.session.dataForAdd[index].databaseId = databaseId;
		} catch (error: any) {
			console.log(error);
			reportError(ctx);
			ctx.session.dataForAdd[index].isDeleted = true;
			return;
		}
	} else {
		databaseProperties = ctx.session.dataForAdd[index].properties;
	}
	const keyboard = propertiesKeyboard(
		Object.values(<Object>databaseProperties),
		index,
		!!databaseName
	);
	await reply(
		ctx,
		`Select the <strong>properties</strong> for define${
			databaseName ? `\n\nUsing <strong>${databaseName}</strong> database` : ""
		}`,
		{ parse_mode: "HTML", ...keyboard }
	);
}

export async function propertyValuesResponse(props: { ctx: BotContext }) {
	const { ctx } = props;
	if (!ctx.update.callback_query?.data) {
		reportError(ctx);
		return;
	}
	const propertyId = extractSubstring(
		ctx.update.callback_query.data,
		"pr_",
		"in_"
	);
	const index = parseInt(
		extractSubstring(ctx.update.callback_query.data, "in_", ""),
		10
	);
	const data = ctx.session.dataForAdd[index];

	if (!data) {
		reportError(ctx);
		return;
	}
	ctx.session.dataForAdd[index].propertiesQuery =
		ctx.update.callback_query.data;

	const propierty = <DataForAddProperty>(
		Object.values(<Object>data.properties).find((obj) => obj.id === propertyId)
	);

	/**
	 * * pi_ = propietary_index
	 * * pr_ = propierty_id
	 * * dn_ = done
	 */

	const generateMessageData = (
		data?: Object[],
		excludeDoneButton?: boolean
	) => {
		const excludeDoneButtonData = !excludeDoneButton
			? [
					[
						{
							text: "✅",
							callback_data: "vl_" + "dn_" + `pi_${index}`,
						},
					],
			  ]
			: [];
		return data
			? {
					parse_mode: "HTML",
					reply_markup: {
						inline_keyboard: [...data, ...excludeDoneButtonData],
					},
			  }
			: {
					parse_mode: "HTML",
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: "🚫",
									callback_data: "vl_" + "dn_" + `pi_${index}`,
								},
							],
						],
					},
			  };
	};

	let messageText;
	let messageData;

	if (propierty.type === "multi_select" && propierty.multi_select) {
		messageText = `Select the options for add to <strong>${propierty.name}</strong>`;
		// messageData = {
		//   parse_mode: 'HTML',
		//   reply_markup: {
		//     inline_keyboard: [
		//       ...propierty.multi_select.options.map((option) => [{
		//         text: option.name,
		//         callback_data: `vl_${option.id}pr_${propierty.id}pi_${index}`
		//       }]),
		//       [{
		//         text: '✅',
		//         callback_data: 'vl_' + 'dn_' + `pi_${index}`
		//       }]
		//     ]
		//   }
		// }
		messageData = generateMessageData(
			propierty.multi_select.options.map((option) => [
				{
					text: option.name,
					callback_data: `vl_${option.id}pr_${propierty.id}pi_${index}`,
				},
			])
		);
	}

	if (propierty.type === "phone_number") {
		ctx.session.waitingForPropiertyValue = { ...propierty, index };
		messageText = `Write the value for <strong>${propierty.name}</strong>`;
		// messageData = {
		//   parse_mode: 'HTML',
		//   reply_markup: {
		//     inline_keyboard: [
		//       [{
		//         text: '🚫',
		//         callback_data: 'vl_' + 'dn_' + `pi_${index}`
		//       }]
		//     ]
		//   }
		// }
		messageData = generateMessageData();
	}
	if (propierty.type === "number") {
		ctx.session.waitingForPropiertyValue = { ...propierty, index };
		messageText = `Type the number for <strong>${propierty.name}</strong>`;
		// message.data = {
		//   parse_mode: 'HTML',
		//   reply_markup: {
		//     inline_keyboard: [
		//       [{
		//         text: '🚫',
		//         callback_data: 'vl_' + 'dn_' + `pi_${index}`
		//       }]
		//     ]
		//   }
		// }
		messageData = generateMessageData();
	}
	if (propierty.type === "checkbox") {
		messageText = `Select if the checkbox <strong>${propierty.name}</strong> stays checked or not`;
		// message.data = {
		//   parse_mode: 'HTML',
		//   reply_markup: {
		//     inline_keyboard: [
		//       [{
		//         text: 'Checked',
		//         callback_data: `vl_${true}pr_${propierty.id}pi_${index}`
		//       }],
		//       [{
		//         text: 'Unchecked',
		//         callback_data: `vl_${false}pr_${propierty.id}pi_${index}`
		//       }],
		//       [{
		//         text: '🚫',
		//         callback_data: 'vl_' + 'dn_' + `pi_${index}`
		//       }]
		//     ]
		//   }
		// }
		messageData = generateMessageData(
			[
				[
					{
						text: "Checked",
						callback_data: `vl_${true}pr_${propierty.id}pi_${index}`,
					},
				],
				[
					{
						text: "Unchecked",
						callback_data: `vl_${false}pr_${propierty.id}pi_${index}`,
					},
				],
				[
					{
						text: "🚫",
						callback_data: "vl_" + "dn_" + `pi_${index}`,
					},
				],
			],
			true
		);
	}
	if (propierty.type === "select" && propierty.select) {
		messageText = `Select the value for <strong>${propierty.name}</strong> propierty`;
		// messageData = {
		//   parse_mode: 'HTML',
		//   reply_markup: {
		//     inline_keyboard: [
		//       ...propierty.select.options.map((option) => [{
		//         text: option.name,
		//         callback_data: `vl_${option.id}pr_${propierty.id}pi_${index}`
		//       }]),
		//       [{
		//         text: '🚫',
		//         callback_data: 'vl_' + 'dn_' + `pi_${index}`
		//       }]
		//     ]
		//   }
		// }
		messageData = generateMessageData(
			[
				...propierty.select.options.map((option) => [
					{
						text: option.name,
						callback_data: `vl_${option.id}pr_${propierty.id}pi_${index}`,
					},
				]),
				[
					{
						text: "🚫",
						callback_data: "vl_" + "dn_" + `pi_${index}`,
					},
				],
			],
			true
		);
	}
	if (propierty.type === "email") {
		ctx.session.waitingForPropiertyValue = { ...propierty, index };
		messageText = `Type the email for <strong>${propierty.name}</strong>`;
		// message.data = {
		//   parse_mode: 'HTML',
		//   reply_markup: {
		//     inline_keyboard: [
		//       [{
		//         text: '🚫',
		//         callback_data: 'vl_' + 'dn_' + `pi_${index}`
		//       }]
		//     ]
		//   }
		// }
		messageData = generateMessageData();
	}
	if (propierty.type === "rich_text") {
		ctx.session.waitingForPropiertyValue = { ...propierty, index };
		messageText = `Type the text for <strong>${propierty.name} propierty</strong>`;
		// message.data = {
		//   parse_mode: 'HTML',
		//   reply_markup: {
		//     inline_keyboard: [
		//       [{
		//         text: '🚫',
		//         callback_data: 'vl_' + 'dn_' + `pi_${index}`
		//       }]
		//     ]
		//   }
		// }
		messageData = generateMessageData();
	}
	if (propierty.type === "url") {
		ctx.session.waitingForPropiertyValue = { ...propierty, index };
		messageText = `Type the URL for <strong>${propierty.name}</strong> propierty`;
		// message.data = {
		//   parse_mode: 'HTML',
		//   reply_markup: {
		//     inline_keyboard: [
		//       [{
		//         text: '🚫',
		//         callback_data: 'vl_' + 'dn_' + `pi_${index}`
		//       }]
		//     ]
		//   }
		// }
		messageData = generateMessageData();
	}
	if (propierty.type === "title") {
		ctx.session.waitingForPropiertyValue = { ...propierty, index };
		messageText = "Type the <strong>new title</strong>";
		// message.data = {
		//   parse_mode: 'HTML',
		//   reply_markup: {
		//     inline_keyboard: [
		//       [{
		//         text: '🚫',
		//         callback_data: 'vl_' + 'dn_' + `pi_${index}`
		//       }]
		//     ]
		//   }
		// }
		messageData = generateMessageData();
	}
	if (propierty.type === "files") {
		ctx.session.waitingForPropiertyValue = { ...propierty, index };
		messageText = `Place the URL for <strong>${propierty.name}</strong>`;
		// message.data = {
		//   parse_mode: 'HTML',
		//   reply_markup: {
		//     inline_keyboard: [
		//       [{
		//         text: '🚫',
		//         callback_data: 'vl_' + 'dn_' + `pi_${index}`
		//       }]
		//     ]
		//   }
		// }
		messageData = generateMessageData();
	}
	if (propierty.type === "date") {
		ctx.session.waitingForPropiertyValue = { ...propierty, index };
		messageText = `Type the <strong>${propierty.name}</strong> preferably with one of the following structures:\n\n- <strong>12/25/2022</strong>\n- <strong>12/25/2022 15:00</strong>\n- <strong>12-25-2022 15:00</strong>\n- <strong>2022-05-25T11:00:00</strong>`;
		// message.data = {
		//   parse_mode: 'HTML',
		//   reply_markup: {
		//     inline_keyboard: [
		//       [{
		//         text: '🚫',
		//         callback_data: 'vl_' + 'dn_' + `pi_${index}`
		//       }]
		//     ]
		//   }
		// }
		messageData = generateMessageData();
	}
	if (!messageText) {
		reportError(ctx);
		return;
	}
	reply(ctx, messageText, messageData);
}
