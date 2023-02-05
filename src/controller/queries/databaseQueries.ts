import axios from "axios";
import { UploadImageResponse } from "../../app/types";
import { decrypt, encrypt } from "../../models/crypto";
import { IUser, UserModel } from "../../models/schemas/UserSchema";
import { checkAuthCode, getDatabaseData } from "./notionQueries";

async function addUser(
	userId: string | undefined,
	notionAuthKey: string | undefined
) {
	try {
		if (!userId || !notionAuthKey) throw Error("no userId or notionAuthKey");
		const encryptedNotionAuthKey = encrypt(notionAuthKey);
		await checkAuthCode({ auth: notionAuthKey });
		const data = await UserModel.findOneAndUpdate(
			{ userId },
			{ userId, notionAuthKey: encryptedNotionAuthKey }
		);

		if (!data) {
			const encryptedNotionAuthKey = encrypt(notionAuthKey);
			const userSchemaCreate = new UserModel({
				userId,
				notionAuthKey: encryptedNotionAuthKey,
			});
			return userSchemaCreate.save();
		}
	} catch (error: any) {
		throw Error(error.message);
	}
}

async function getNotionAuthKey(userId: string) {
	try {
		const response = await UserModel.findOne({ userId });
		if (!response) throw Error("no user");
		return decrypt(response.notionAuthKey);
	} catch (error: any) {
		console.log(error);
		throw Error(error.message);
	}
}

async function getUser(userId: string) {
	const response = await UserModel.findOne({ userId });
	return response;
}

async function getAllUsers() {
	const response: IUser[] = await UserModel.find({});
	return response;
}

async function uploadImage(url: string) {
	try {
		const response = await axios.get("https://api.imgbb.com/1/upload", {
			params: {
				key: <string>process.env.IMGBB_API_KEY,
				image: url,
			},
		});
		return <UploadImageResponse>{
			status: "success",
			data: {
				url: response.data.data.url,
			},
		};
	} catch (error: any) {
		throw Error(
			"There has been an error uploading the image, please try again later"
		);
	}
}

async function addDefaultDatabase(databaseId: string, userId: string) {
	try {
		const notionAuthKey = <string>await getNotionAuthKey(userId);
		const databaseData = await getDatabaseData({
			auth: notionAuthKey,
			databaseId,
		});
		const data = await UserModel.findOneAndUpdate(
			{ userId },
			{
				defaultDatabaseName: databaseData.title[0].text.content,
				defaultDatabaseId: databaseId,
			},
			{ returnDocument: "after" }
		);
		return {
			status: "success",
			data,
		};
	} catch (error: any) {
		console.log(error);
		return { status: "error" };
	}
}

async function removeDefaultDatabase(userId: string | number | undefined) {
	try {
		if (!userId) {
			throw Error("no userId");
		}
		const updateData = await UserModel.findOneAndUpdate(
			{ userId },
			{ defaultDatabaseName: null, defaultDatabaseId: null },
			{ returnDocument: "before" }
		);
		if (!updateData) {
			throw Error("no update data");
		}
		return <IUser>updateData;
	} catch (error: any) {
		console.log(error);
		throw Error(error.message);
	}
}

async function getDefaultDatabase(userId: string) {
	try {
		return UserModel.findOne({ userId }, [
			"defaultDatabaseId",
			"defaultDatabaseName",
		]);
	} catch (error: any) {
		console.log(error);
		throw Error(error.message);
	}
}

export {
	addDefaultDatabase,
	addUser,
	getAllUsers,
	getDefaultDatabase,
	getNotionAuthKey,
	getUser,
	removeDefaultDatabase,
	uploadImage,
};
