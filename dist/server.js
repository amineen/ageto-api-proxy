"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const dbConfiguration_1 = require("./dbConfiguration");
// routers imports
const generation_data_routes_1 = __importDefault(require("./routes/generation-data-routes"));
dotenv_1.default.config();
//configure database
(0, dbConfiguration_1.configureDB)();
const app = (0, express_1.default)();
//add cors
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
//add body parser
app.use(express_1.default.json());
app.get("/", (req, res) => {
    return res.status(200).json({
        msg: "Welcome to Totalizer Scraping API",
        version: "1.0.0",
        developer: "Aaron Mineen",
    });
});
//routers
app.use("/api/v0/generation-data", generation_data_routes_1.default);
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map