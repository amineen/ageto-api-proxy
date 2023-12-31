"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generationDataController = __importStar(require("../controllers/generation-data-controller"));
const router = express_1.default.Router();
router.route("/").post(generationDataController.insertGenerationData);
router
    .route("/last-reading")
    .get(generationDataController.getLastGenerationDataReading);
router
    .route("/daily-data")
    .get(generationDataController.getGenerationDataByDate);
router
    .route("/totalizer-data")
    .get(generationDataController.getTotalizerDailyReadings);
router
    .route("/last-totalizer-reading")
    .get(generationDataController.getLastTotalizerRecord);
router
    .route("/update-last-totalizer-reading")
    .get(generationDataController.updateLastTotalizerRecord);
router
    .route("/totalizer-data-for-chart")
    .get(generationDataController.getTotalizerDailyReadingsForCharting);
router
    .route("/generation-data-for-chart")
    .get(generationDataController.getGenerationDataForCharting);
router
    .route("/daily-energy-total")
    .get(generationDataController.getGenerationDailyEnergyTotal);
router
    .route("/daily-energy-from-ageto-api")
    .get(generationDataController.getEnergyDataFromAgetoAPI);
router.route("/unique-months").get(generationDataController.getUniqueMonths);
router
    .route("/monthly-totalizer-data")
    .get(generationDataController.getMonthlyTotalizerData);
exports.default = router;
//# sourceMappingURL=generation-data-routes.js.map