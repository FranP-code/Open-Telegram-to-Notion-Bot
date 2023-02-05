/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */

import { Client } from "@notionhq/client";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { INotionDatabase } from "../../app/types";

/* eslint-disable no-restricted-syntax */
async function checkAuthCode(props: { auth: string }) {
	const { auth } = props;
	const notion = new Client({ auth });
	try {
		const response = await notion.search({
			page_size: 1,
			sort: {
				direction: "ascending",
				timestamp: "last_edited_time",
			},
		});
		return response;
	} catch (error: any) {
		throw Error("auth code invalid");
	}
}

async function returnAllDatabases(props: { auth: string }) {
	const { auth } = props;
	const notion = new Client({ auth });
	try {
		const response = await notion.search({});
		//! OLD const databases = response.results.filter((result) => result.object === 'database');
		const databases = response.results.filter(
			(result) => result.object !== "page"
		);
		const databasesFormated = [];
		for (const database of databases) {
			if ("parent" in database) {
				if (database?.parent && database.parent.type === "workspace") {
					databasesFormated.push(database);
					continue;
				}
				if ("page_id" in database.parent && "title" in database) {
					const parentPage: any = await notion.pages.retrieve({
						page_id: database.parent.page_id,
					});
					if (
						"properties" in parentPage &&
						"title" in parentPage.properties &&
						parentPage.properties.title.type === "title"
					) {
						databasesFormated.push({
							...database,
							title: database.title.map((titleItem) => {
								if ("text" in titleItem && "properties" in parentPage) {
									return {
										...titleItem,
										text: {
											...titleItem.text,
											content: `${titleItem.text.content} (${parentPage.properties.title.title[0].text.content})`,
										},
									};
								}
							}),
						});
					}
				}
			}
		}

		return { ...response, results: databasesFormated };
	} catch (error: any) {
		console.log(error);
		throw Error(error.message);
	}
}

async function addBlockToDatabase(props: {
	auth: string;
	databaseId: string;
	title: string;
	properties: Object;
}) {
	const { auth, databaseId, title, properties } = props;
	const notion = new Client({ auth });
	try {
		const response = await notion.pages.create({
			parent: {
				database_id: databaseId,
			},
			properties: {
				title: [
					{
						text: {
							content: title,
						},
					},
				],
				...properties,
			},
		});
		return response;
	} catch (error: any) {
		console.log(error);
		throw Error(error.message);
	}
}

async function getDatabaseData(props: { auth: string; databaseId: string }) {
	const { auth, databaseId } = props;
	const notion = new Client({ auth });
	const response = await notion.databases.retrieve({ database_id: databaseId });
	if (!response) throw Error("no response");
	return <INotionDatabase>response;
}

async function createPageWithBlock(props: {
	auth: string;
	databaseId: string;
	config: {
		blockType: "image";
		title: string;
		imageUrl: string;
		properties: Object;
	};
}) {
	const { auth, databaseId, config } = props;
	const notion = new Client({ auth });
	try {
		let response;

		switch (config.blockType) {
			case "image":
				response = await notion.pages.create({
					parent: {
						database_id: databaseId,
					},
					properties: {
						title: [
							{
								text: {
									content: config.title,
								},
							},
						],
						...config.properties,
					},
					children: [
						{
							object: "block",
							type: "image",
							image: {
								type: "external",
								external: {
									url: config.imageUrl,
								},
							},
						},
					],
				});
				break;

			default:
				return { status: "error" };
		}
		return response;
	} catch (error: any) {
		console.log(error);
	}
}

export {
	addBlockToDatabase,
	checkAuthCode,
	createPageWithBlock,
	getDatabaseData,
	returnAllDatabases,
};
