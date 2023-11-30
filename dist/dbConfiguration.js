"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const configureDB = async () => {
    const password = process.env.MONGODB_PASSWORD;
    const user = process.env.MONGODB_USER;
    const dbName = process.env.MONGODB_DB;
    const url = `mongodb+srv://${user}:${password}@${dbName}.qha7wjk.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    mongoose_1.default
        .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
        console.log("Database connected successfully");
    })
        .catch((err) => {
        console.error("Database connection error:", err);
    });
};
exports.configureDB = configureDB;
//# sourceMappingURL=dbConfiguration.js.map