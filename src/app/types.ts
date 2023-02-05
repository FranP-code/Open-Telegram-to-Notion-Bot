import { CreatePageResponse } from "@notionhq/client/build/src/api-endpoints";
import { Context } from "grammy";
import { File } from "grammy/out/platform.node";

export type DataForAddProperty = {
	id: string;
	type: string;
	name: string;
	multi_select?: {
		options: {
			id: string;
			name: string;
		}[];
	};
	select?: {
		options: {
			id: string;
			name: string;
		}[];
	};
};
export type DataForAdd = {
	isDeleted: boolean;
	data: {
		title: string;
	};
	type: "text" | "image";
	databaseId?: string;
	propertiesQuery?: string;
	properties?: DataForAddProperty[] | {};
	propertiesValues: Record<string, Object[]>;
	listOfpropertiesQuery?: string;
	file?: File;
};

export interface BotContext extends Context {
	session: SessionData;
}

export interface SessionData {
	dataForAdd: DataForAdd[];
	waitingForAnnouncementMessage: boolean;
	waitingForAuthCode: boolean;
	waitingForClearConfirmation: boolean;
	waitingForDefaultDatabaseSelection: boolean;
	waitingForPropiertyValue: { index: number; id: string } | false;
}

export interface INotionDatabase {
	id: string;
	icon: {
		emoji: string;
	};
	title: {
		text: {
			content: string;
		};
	}[];
	properties: {
		telegramIgnore?: {};
	};
}

export type UploadImageResponse = {
	status: string;
	data: {
		url: string;
	};
};

export type AddMessageToDatabaseResponse = {
	databaseTitle: string;
} & CreatePageResponse;

export type GetDatabasesResponse = {
	results: INotionDatabase[];
};

export type GetDefaultDatabaseResponse = {
	defaultDatabaseId?: string;
	defaultDatabaseName?: string;
};
