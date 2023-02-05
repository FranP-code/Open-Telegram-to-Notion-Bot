import { MongooseError } from "mongoose";
import mongoose from "mongoose";

export const dbConnection = async () => {
	try {
		await mongoose.connect(<string>process.env.MONGODB_LINK);
		mongoose.connection.once("open", () => {
			console.log("DB connected");
		});
		mongoose.connection.on("error", (error: MongooseError) => {
			console.log(error);
		});
	} catch (error: any) {
		console.log(error);
	}
};
