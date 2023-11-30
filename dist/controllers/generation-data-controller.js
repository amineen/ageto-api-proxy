"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalizerDailyReadings = exports.getGenerationDataByDate = exports.getLastGenerationDataReading = exports.insertGenerationData = void 0;
const GenerationDataSchema_1 = require("../models/GenerationDataSchema");
const TotalizerDataModel_1 = __importDefault(require("../models/TotalizerDataModel"));
//@desc Insert array of generation data into database
//@route POST /api/v1/generation-data
//@access Private
const insertGenerationData = async (req, res) => {
    try {
        const generationData = req.body;
        const result = await GenerationDataSchema_1.GenerationDataSchemaModel.insertMany(generationData);
        return res.status(200).json({
            success: true,
            data: { insertCount: result.length },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
exports.insertGenerationData = insertGenerationData;
//@desc Get the last data in the database
//@route GET /api/v1/generation-data/last-reading
//@access Private
const getLastGenerationDataReading = async (req, res) => {
    try {
        const result = await GenerationDataSchema_1.GenerationDataSchemaModel.find({}, {
            BMS1_SOC: 1,
            BMS1_P_total_current: 1,
            GEN_P_total_current: 1,
            INV1_P_total_current: 1,
            INV2_P_total_current: 1,
            LOAD1_P_total_current: 1,
            OFFSETS_CO2_tons: 1,
            PV1_P_total_current: 1,
            PV2_P_total_current: 1,
            PV3_P_total_current: 1,
            timestamp: 1,
            _id: 0,
        })
            .sort({ _id: -1 })
            .limit(1);
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
exports.getLastGenerationDataReading = getLastGenerationDataReading;
//@desc GET data for a given date. date in the format of YYYY-MM-DD.
//@route GET /api/v1/generation-data/:date
//@access Private
const getGenerationDataByDate = async (req, res) => {
    try {
        let date = req.query.date;
        //if date is not provided, set date to today
        if (!date) {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const day = today.getDate();
            date = `${year}-${month}-${day}`;
        }
        const result = await GenerationDataSchema_1.GenerationDataSchemaModel.aggregate([
            {
                $match: {
                    timestamp: { $regex: date },
                },
            },
            {
                $group: {
                    _id: null,
                    load: { $sum: "$LOAD_E_total" },
                    genEnergy: { $sum: "$GEN_E_total" },
                    batteryDIS: { $sum: "$INV_E_total_DIS" },
                    batteryCHG: { $sum: "$INV_E_total_CHG" },
                    pvEnergy: { $sum: "$PV_E_total" },
                    peakLoad: { $max: "$LOAD1_P_total_max" },
                    records: {
                        $push: {
                            BMS1_P_total_current: "$BMS1_P_total_current",
                            BMS1_SOC: "$BMS1_SOC",
                            GEN_P_total_current: "$GEN_P_total_current",
                            INV1_P_total_current: "$INV1_P_total_current",
                            INV2_P_total_current: "$INV2_P_total_current",
                            LOAD1_P_total_current: "$LOAD1_P_total_current",
                            PV1_P_total_current: "$PV1_P_total_current",
                            PV2_P_total_current: "$PV2_P_total_current",
                            timestamp: "$timestamp",
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    load: 1,
                    genEnergy: 1,
                    batteryDIS: 1,
                    batteryCHG: 1,
                    pvEnergy: 1,
                    peakLoad: 1,
                    records: 1,
                },
            },
        ]);
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
exports.getGenerationDataByDate = getGenerationDataByDate;
//@desc GET totalizer daily readings for a given date. date in the format of YYYY-M-DD.
//@route GET /api/v1/generation-data/daily-data?date=YYYY-MM-DD
//@access Private
// export const getTotalizerDailyReadings = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     let date = req.query.date;
//     //if date is not provided, set date to today
//     if (!date) {
//       const today = new Date();
//       const year = today.getFullYear();
//       const month = today.getMonth() + 1;
//       const day = today.getDate();
//       date = `${year}-${month}-${day}`;
//     }
//     const result = await TotalizerDataModel.findOne({
//       dateKey: date,
//     });
//     return res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };
const getTotalizerDailyReadings = async (req, res) => {
    try {
        let date = req.query.date;
        //if date is not provided, set date to today
        if (!date) {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const day = today.getDate();
            date = `${year}-${month}-${day}`;
        }
        const result = await TotalizerDataModel_1.default.aggregate([
            { $match: { dateKey: date } },
            {
                $unwind: "$readings",
            },
            {
                $project: {
                    _id: 0,
                    dailyAccumulativeEnergy: 1,
                    dailykWh: 1,
                    "readings.L1_current_avg": "$readings.L1_current_avg",
                    "readings.L2_current_avg": "$readings.L2_current_avg",
                    "readings.L3_current_avg": "$readings.L3_current_avg",
                    "readings.total_current_avg": "$readings.total_current_avg",
                    "readings.total_true_power_avg": "$readings.total_true_power_avg",
                    "readings.datetime": "$readings.datetime",
                },
            },
            {
                $group: {
                    _id: null,
                    dailyAccumulativeEnergy: { $first: "$dailyAccumulativeEnergy" },
                    dailyKWh: { $first: "$dailykWh" },
                    peakLoad: { $max: "$readings.total_true_power_avg" },
                    readings: {
                        $push: {
                            L1_current_avg: "$readings.L1_current_avg",
                            L2_current_avg: "$readings.L2_current_avg",
                            L3_current_avg: "$readings.L3_current_avg",
                            total_current_avg: "$readings.total_current_avg",
                            total_true_power_avg: "$readings.total_true_power_avg",
                            datetime: "$readings.datetime",
                        },
                    },
                },
            },
        ]);
        return res.status(200).json({
            success: true,
            data: result[0],
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
exports.getTotalizerDailyReadings = getTotalizerDailyReadings;
//# sourceMappingURL=generation-data-controller.js.map