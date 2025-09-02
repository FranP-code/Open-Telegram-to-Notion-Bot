import { CreatePageResponse } from "@notionhq/client/build/src/api-endpoints";
import {
	GetDatabasesResponse,
	INotionDatabase,
	UploadImageResponse,
} from "../../app/types";
import { getUser, getNotionAuthKey, uploadImage } from "./databaseQueries";
import {
	returnAllDatabases,
	addBlockToDatabase,
	getDatabaseData,
	createPageWithBlock,
} from "./notionQueries";

export async function getDatabases(userId: string) {
	try {
		await getUser(userId);
		const notionAuthKey = <string>await getNotionAuthKey(userId);
		const databases = await returnAllDatabases({ auth: notionAuthKey });
		if (!databases) {
			throw Error("");
		}
		return <GetDatabasesResponse>databases;
	} catch (error: any) {
		console.log(error);
		throw Error("no auth code");
	}
}

export async function addMessageToDatabase(
	userId: string,
	databaseId: string,
	data: { title: string; propertiesValues: Object }
) {
	try {
		const notionAuthKey = <string>await getNotionAuthKey(userId);
		const response = <CreatePageResponse>await addBlockToDatabase({
			auth: notionAuthKey,
			databaseId,
			title: data.title,
			properties: data.propertiesValues,
		});
		const databaseData = <INotionDatabase>(
			await getDatabaseData({ auth: notionAuthKey, databaseId })
		);
		const databaseTitle =
			databaseData.title.length <= 0
				? "Untitled"
				: databaseData.title[0].text.content;
		return { ...response, databaseTitle };
	} catch (error: any) {
		console.log(error);
		throw Error(error.message);
	}
}

export async function addImageToDatabase(
	userId: string,
	databaseId: string,
	imageURL: string,
	title: string,
	properties: Object
) {
	try {
		const uploadResponse = await uploadImage(imageURL);
		const notionAuthKey = <string>await getNotionAuthKey(userId);
		await createPageWithBlock({
			auth: notionAuthKey,
			databaseId,
			config: {
				blockType: "image",
				imageUrl: uploadResponse.data.url,
				title,
				properties,
			},
		});
		const databaseData = await getDatabaseData({
			auth: notionAuthKey,
			databaseId,
		});

		return {
			status: "success",
			databaseTitle:
				databaseData.title.length <= 0
					? "Untitled"
					: databaseData.title[0].text.content,
		};
	} catch (error: any) {
		console.log(error);
		throw Error(error.message);
	}
}

export async function getProperties(userId: string, databaseId: string) {
	try {
		const notionAuthKey = <string>await getNotionAuthKey(userId);
		const response = await getDatabaseData({ auth: notionAuthKey, databaseId });
		return response.properties;
	} catch (error: any) {
		console.log(error);
		throw Error(error.message);
	}
}
