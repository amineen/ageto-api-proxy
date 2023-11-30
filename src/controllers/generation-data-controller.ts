import { GenerationDataType } from "../models/types";
import { GenerationDataSchemaModel } from "../models/GenerationDataSchema";
import { Request, Response } from "express";

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

//@desc Get the last data in the database
//@route GET /api/v1/generation-data/last-reading
//@access Private
export const getLastGenerationDataReading = async (
  req: Request,
  res: Response
) => {
  try {
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
        timestamp: 1,
        _id: 0,
      }
    )
      .sort({ _id: -1 })
      .limit(1);

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
