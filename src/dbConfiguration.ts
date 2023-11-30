import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const configureDB = async () => {
  const password = process.env.MONGODB_PASSWORD;
  const user = process.env.MONGODB_USER;
  const dbName = process.env.MONGODB_DB;
  const url = `mongodb+srv://${user}:${password}@${dbName}.qha7wjk.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
};
