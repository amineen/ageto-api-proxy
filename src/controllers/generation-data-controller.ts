import {
  GenerationDataType,
  ColumnType,
  dataColumns,
  AgetoResponseDataType,
} from "../models/types";
import { GenerationDataSchemaModel } from "../models/GenerationDataSchema";
import { Request, Response } from "express";
import TotalizerDataModel from "../models/TotalizerDataModel";
import LastTotalizerRecordSchema from "../models/LastTotalizerRecordSchema";
import axios from "axios";

import dotenv from "dotenv";
import { computeData } from "../services/util-services";
dotenv.config();

const AGETO_API_BASE_URL = process.env.AGETO_API_BASE_URL as string;
const AGETO_API_TOKEN = process.env.AGETO_API_TOKEN as string;

type LastGenDataType = {
  bmsSOC: number;
  bmsTotalPower: number;
  genTotalPower: number;
  loadTotalPower: number;
  pvTotalPower: number;
  timestamp: string;
};

//@desc Insert array of generation data into database
//@route POST /api/v1/generation-data
//@access Private
export const insertGenerationData = async (req: Request, res: Response) => {
  try {
    const generationData: GenerationDataType[] = req.body;
    const result = await GenerationDataSchemaModel.insertMany(generationData);

    return res.status(200).json({
      success: true,
      data: { insertCount: result.length },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getAgetoData = async (date: string) => {
  const from = `${date}T00:00:00.000Z`;
  const to = `${date}T23:59:59.999Z`;

  const columns = dataColumns.join(",");

  const agetoAPIResponse = await axios.get(
    `${AGETO_API_BASE_URL}?device=Totota&from=${from}&to=${to}&columns=${columns}`,
    {
      headers: {
        Authorization: `Bearer ${AGETO_API_TOKEN}`,
      },
    }
  );

  const data = agetoAPIResponse.data as AgetoResponseDataType;

  const computedData = computeData(data);
  return computedData;
};

const getLastReadingFromAgetoAPI = async (): Promise<LastGenDataType> => {
  const to = new Date().toISOString();
  //from 30 minutes ago
  const from = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const columns = dataColumns.join(",");
  const agetoAPIResponse = await axios.get(
    `${AGETO_API_BASE_URL}?device=Totota&from=${from}&to=${to}&columns=${columns}`,
    {
      headers: {
        Authorization: `Bearer ${AGETO_API_TOKEN}`,
      },
    }
  );

  const responseData = agetoAPIResponse.data as AgetoResponseDataType;
  const columnData = responseData.format.data;

  const payload = responseData.payload;
  const lastPayloadItem = payload[payload.length - 1];
  const initialParsedData = columnData.reduce((acc, key) => {
    acc[key as ColumnType] = 0;
    return acc;
  }, {} as { [key in ColumnType]: number });
  const lastParsedItem: { [key in ColumnType]: number } & {
    timestamp: string;
  } = { ...initialParsedData, timestamp: lastPayloadItem.meta[0] };

  columnData.forEach((column: ColumnType, index) => {
    lastParsedItem[column] = lastPayloadItem.data[index];
  });
  const lastReadings: LastGenDataType = {
    bmsSOC: lastParsedItem.BMS1_SOC,
    bmsTotalPower: lastParsedItem.BMS1_P_total,
    loadTotalPower: lastParsedItem.LOAD1_P_total,
    pvTotalPower:
      lastParsedItem.PV1_P_total +
      lastParsedItem.PV2_P_total +
      lastParsedItem.PV3_P_total,
    genTotalPower: lastParsedItem.GEN_P_total,
    timestamp: lastParsedItem.timestamp,
  };

  return lastReadings;
};

//@desc Get energy data from ageto api for a given date "YYYY-MM-DD"
//@route POST /api/v1/generation-data/ageto-api?date=YYYY-MM-DD
//@access Private
export const getEnergyDataFromAgetoAPI = async (
  req: Request,
  res: Response
) => {
  try {
    let date = req.query.date;
    //if date is not provided, set date to today
    if (!date) {
      date = new Date().toISOString().split("T")[0];
    }

    const computedData = await getAgetoData(date as string);

    return res.status(200).json({
      success: true,
      data: computedData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getLastRecord = (lastRecord: GenerationDataType): LastGenDataType => {
  const { PV3_P_total_current, PV3_P_total_avg } = lastRecord;
  let pv3Power = PV3_P_total_current || PV3_P_total_avg;

  return {
    bmsSOC: lastRecord.BMS1_SOC,
    bmsTotalPower: lastRecord.BMS1_P_total_current,
    genTotalPower: lastRecord.GEN_P_total_current,
    loadTotalPower: lastRecord.LOAD1_P_total_current,
    pvTotalPower:
      lastRecord.PV1_P_total_current +
      lastRecord.PV2_P_total_current +
      pv3Power,
    timestamp: lastRecord.timestamp,
  };
};

//@desc Get the last data in the database
//@route GET /api/v1/generation-data/last-reading
//@access Private
export const getLastGenerationDataReading = async (
  req: Request,
  res: Response
) => {
  try {
    const lastReadingFromAgetoAPI = await getLastReadingFromAgetoAPI();

    if (!lastReadingFromAgetoAPI) {
      const result = await GenerationDataSchemaModel.find(
        {},
        {
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
          PV3_P_total_avg: 1,
          timestamp: 1,
          _id: 0,
        }
      )
        .sort({ _id: -1 })
        .limit(1);

      const lastRecord = result[0] as GenerationDataType;

      const lastReadings = getLastRecord(lastRecord);

      return res.status(200).json({
        success: true,
        data: lastReadings,
      });
    } else {
      return res.status(200).json({
        success: true,
        data: lastReadingFromAgetoAPI,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//@desc GET data for a given date. date in the format of YYYY-MM-DD.
//@route GET /api/v1/generation-data/:date
//@access Private
export const getGenerationDataByDate = async (req: Request, res: Response) => {
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

    const result = await GenerationDataSchemaModel.aggregate([
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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

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

export const getTotalizerDailyReadings = async (
  req: Request,
  res: Response
) => {
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

    const result = await TotalizerDataModel.aggregate([
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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//@desc GET totalizer daily readings for charting
//@route GET /api/v1/generation-data/daily-data-charting?date=YYYY-MM-DD
//@access Private
export const getTotalizerDailyReadingsForCharting = async (
  req: Request,
  res: Response
) => {
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

    const result = await TotalizerDataModel.aggregate([
      { $match: { dateKey: date } },
      {
        $unwind: "$readings",
      },
      {
        $group: {
          _id: null,
          dailyAccumulativeEnergy: { $first: "$dailyAccumulativeEnergy" },
          dailykWh: { $first: "$dailykWh" },
          peakLoad: { $max: "$readings.total_true_power_avg" },
          //get date from readings.datetime
          date: { $first: { $substr: ["$readings.datetime", 0, 10] } },
          times: { $push: { $substr: ["$readings.datetime", 11, 5] } },
          L1_current_avg: { $push: "$readings.L1_current_avg" },
          L2_current_avg: { $push: "$readings.L2_current_avg" },
          L3_current_avg: { $push: "$readings.L3_current_avg" },
          total_current_avg: { $push: "$readings.total_current_avg" },
          total_true_power_avg: { $push: "$readings.total_true_power_avg" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$date",
          dailykWh: 1,
          peakLoad: 1,
          readings: {
            times: "$times",
            L1_current_avg: "$L1_current_avg",
            L2_current_avg: "$L2_current_avg",
            L3_current_avg: "$L3_current_avg",
            total_current_avg: "$total_current_avg",
            total_true_power_avg: "$total_true_power_avg",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//@desc GET the last totalizer record
//@route GET /api/v1/generation-data/last-record
//@access Private
export const getLastTotalizerRecord = async (req: Request, res: Response) => {
  try {
    const result = await LastTotalizerRecordSchema.find({})
      .sort({ _id: -1 })
      .limit(1);

    return res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//@desc get the last totalizer record in totalizer data collection and insert it into last totalizer record collection
//@route GET /api/v1/generation-data/last-record
//@access Private
export const updateLastTotalizerRecord = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await TotalizerDataModel.find({}).sort({ _id: -1 }).limit(1);

    const lastRecord = result[0].readings[result[0].readings.length - 1];

    const lastRecordDate = new Date(lastRecord.datetime);

    const lastRecordDateObj = {
      datetime: lastRecordDate,
      L1_true_power_avg: lastRecord.L1_true_power_avg,
      L2_true_power_avg: lastRecord.L2_true_power_avg,
      L3_true_power_avg: lastRecord.L3_true_power_avg,
      total_true_power_avg: lastRecord.total_true_power_avg,
      L1_current_avg: lastRecord.L1_current_avg,
      L2_current_avg: lastRecord.L2_current_avg,
      L3_current_avg: lastRecord.L3_current_avg,
      total_current_avg: lastRecord.total_current_avg,
    };

    const result2 = await LastTotalizerRecordSchema.insertMany(
      lastRecordDateObj
    );

    return res.status(200).json({
      success: true,
      data: result2,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//@desc get generation data for charting
//@route GET /api/v1/generation-data/charting-data
//@access Private

export const getGenerationDataForCharting = async (
  req: Request,
  res: Response
) => {
  try {
    let date = req.query.date;
    //if date is not provided, set date to today
    if (!date) {
      date = new Date().toISOString().split("T")[0];
    }

    const result = await GenerationDataSchemaModel.aggregate([
      {
        $match: {
          timestamp: { $regex: date },
        },
      },
      {
        $group: {
          _id: null,
          date: { $first: { $substr: ["$timestamp", 0, 10] } },
          totalLoad: { $sum: "$LOAD_E_total" },
          genEnergy: { $sum: "$GEN_E_total" },
          batteryDIS: { $sum: "$INV_E_total_DIS" },
          batteryCHG: { $sum: "$INV_E_total_CHG" },
          pvEnergy: { $sum: "$PV_E_total" },
          peakLoad: { $max: "$LOAD1_P_total_max" },
          bms: { $push: "$BMS1_P_total_current" },
          bmsSOC: { $push: "$BMS1_SOC" },
          gen: { $push: "$GEN_P_total_current" },
          load: { $push: "$LOAD1_P_total_current" },
          //pvTotal is the sum of pv1, pv2, pv3
          pvPower: {
            $push: {
              $sum: [
                "$PV1_P_total_current",
                "$PV2_P_total_current",
                "$PV3_P_total_current",
              ],
            },
          },
          timestamp: { $push: { $substr: ["$timestamp", 11, 5] } },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$date",
          totalLoad: 1,
          genEnergy: 1,
          batteryDIS: 1,
          batteryCHG: 1,
          pvEnergy: 1,
          peakLoad: 1,
          records: {
            load: "$load",
            pvPower: "$pvPower",
            timestamp: "$timestamp",
            bms: "$bms",
            bmsSOC: "$bmsSOC",
            gen: "$gen",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//@desc generation daily energy total for a given date
//@route GET /api/v1/generation-data/daily-energy-total?date=YYYY-MM-DD
//@access Private
export const getGenerationDailyEnergyTotal = async (
  req: Request,
  res: Response
) => {
  try {
    let date = req.query.date;
    //if date is not provided, set date to today
    if (!date) {
      date = new Date().toISOString().split("T")[0];
    }

    const today = new Date().toISOString().split("T")[0];

    if (date === today) {
      const computedData = await getAgetoData(date as string);
      return res.status(200).json({
        success: true,
        data: computedData,
      });
    }

    const result = await GenerationDataSchemaModel.aggregate([
      {
        $match: {
          timestamp: { $regex: date },
        },
      },
      {
        $group: {
          _id: null,
          genEnergy: { $sum: "$GEN_E_total" },
          batteryDIS: { $sum: "$INV_E_total_DIS" },
          batteryCHG: { $sum: "$INV_E_total_CHG" },
          pvEnergy: { $sum: "$PV_E_total" },
          totalLoad: { $sum: "$LOAD_E_total" },
          peakLoad: { $max: "$LOAD1_P_total_max" },
          firstCO2Offset: { $first: "$OFFSETS_CO2_tons" },
          lastCO2Offset: { $last: "$OFFSETS_CO2_tons" },
        },
      },
      {
        $project: {
          _id: 0,
          genEnergy: 1,
          batteryDIS: 1,
          batteryCHG: 1,
          pvEnergy: 1,
          totalLoad: 1,
          peakLoad: 1,
          dailyCO2Offset: { $subtract: ["$lastCO2Offset", "$firstCO2Offset"] },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//@desc get list of unique months in totalizer data collection
//@route GET /api/v1/generation-data/months
//@access Private
export const getUniqueMonths = async (req: Request, res: Response) => {
  try {
    const result = await TotalizerDataModel.aggregate([
      {
        //group by month and year fields in the collection. the month and year fields are have number type
        $group: {
          _id: {
            month: "$month",
            year: "$year",
          },
        },
      },
      {
        $project: {
          _id: 0,
          months: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
          periodCode: {
            $concat: [
              { $toString: "$_id.year" },
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
        },
      },
      //convert codes to number and sort in descending order
      { $sort: { periodCode: -1 } },
      { $project: { periodCode: 0 } },
    ]);

    return res.status(200).json({
      success: true,
      data: result.map((item) => item.months),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//@desc get totalizer data for a given month.
//@route GET /api/v1/generation-data/monthly-data?month=YYYY-MM
//@access Private
export const getMonthlyTotalizerData = async (req: Request, res: Response) => {
  try {
    const period = req.query.period as string;

    let year: number;
    let month: number;

    if (!period) {
      const today = new Date();
      year = today.getFullYear();
      month = today.getMonth() + 1;
    } else {
      const periodArr = period.split("-");
      year = parseInt(periodArr[0]);
      month = parseInt(periodArr[1]);
    }

    const totalKwhResult = await TotalizerDataModel.aggregate([
      {
        $match: {
          month,
          year,
        },
      },
      {
        $group: {
          _id: null,
          totalkWh: { $sum: "$dailykWh" },
        },
      },
    ]);

    const hourlyDataResult = await TotalizerDataModel.aggregate([
      {
        $match: {
          month,
          year,
        },
      },
      {
        $unwind: "$readings",
      },
      {
        $group: {
          _id: "$readings.hour",
          peakLoad: { $max: "$readings.total_true_power_avg" },
          minLoad: { $min: "$readings.total_true_power_avg" },
          avgLoad: { $avg: "$readings.total_true_power_avg" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const result = {
      totalkWh: totalKwhResult[0]?.totalkWh,
      hours: hourlyDataResult.map((data) => data._id),
      monthlyPeak: Math.max(...hourlyDataResult.map((data) => data.peakLoad)),
      peakLoad: hourlyDataResult.map((data) => data.peakLoad),
      minLoad: hourlyDataResult.map((data) => data.minLoad),
      avgLoad: hourlyDataResult.map((data) => data.avgLoad),
    };

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//@desc get yearly kWh to from totalizer data for a given year
//@route GET /api/v1/generation-data/yearly-kWh-data?year=YYYY
//@access Private

export const getYearlyTotalizerData = async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.query.year as string);

    const result = await TotalizerDataModel.aggregate([
      {
        $match: {
          year,
        },
      },
      {
        $group: {
          _id: null,
          totalkWh: { $sum: "$dailykWh" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: result[0]?.totalkWh,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
