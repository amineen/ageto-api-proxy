import mongoose, { Schema } from "mongoose";
import { GenerationDataType } from "./types";

const GenerationDataSchema = new Schema<GenerationDataType>({
  BMS1_P_total_avg: {
    type: Number,
    required: true,
  },
  BMS1_P_total_min: {
    type: Number,
    required: true,
  },
  BMS1_P_total_max: {
    type: Number,
    required: true,
  },
  BMS1_P_total_current: {
    type: Number,
    required: true,
  },
  BMS1_SOC: {
    type: Number,
    required: true,
  },
  GEN_E_total: {
    type: Number,
    required: true,
  },
  GEN_P_total_avg: {
    type: Number,
    required: true,
  },
  GEN_P_total_min: {
    type: Number,
    required: true,
  },
  GEN_P_total_max: {
    type: Number,
    required: true,
  },
  GEN_P_total_current: {
    type: Number,
    required: true,
  },
  INV1_P_total_avg: {
    type: Number,
    required: true,
  },
  INV1_P_total_min: {
    type: Number,
    required: true,
  },
  INV1_P_total_max: {
    type: Number,
    required: true,
  },
  INV1_P_total_current: {
    type: Number,
    required: true,
  },
  INV2_P_total_avg: {
    type: Number,
    required: true,
  },
  INV2_P_total_min: {
    type: Number,
    required: true,
  },
  INV2_P_total_max: {
    type: Number,
    required: true,
  },
  INV2_P_total_current: {
    type: Number,
    required: true,
  },
  INV_E_total_CHG: {
    type: Number,
    required: true,
  },
  INV_E_total_DIS: {
    type: Number,
    required: true,
  },
  LOAD1_P_total_avg: {
    type: Number,
    required: true,
  },
  LOAD1_P_total_min: {
    type: Number,
    required: true,
  },
  LOAD1_P_total_max: {
    type: Number,
    required: true,
  },
  LOAD1_P_total_current: {
    type: Number,
    required: true,
  },
  LOAD_E_total: {
    type: Number,
    required: true,
  },
  OFFSETS_CO2_tons: {
    type: Number,
    required: true,
  },
  PV1_P_total_avg: {
    type: Number,
    required: true,
  },
  PV1_P_total_min: {
    type: Number,
    required: true,
  },
  PV1_P_total_max: {
    type: Number,
    required: true,
  },
  PV1_P_total_current: {
    type: Number,
    required: true,
  },
  PV2_P_total_avg: {
    type: Number,
    required: true,
  },
  PV2_P_total_min: {
    type: Number,
    required: true,
  },
  PV2_P_total_max: {
    type: Number,
    required: true,
  },
  PV2_P_total_current: {
    type: Number,
    required: true,
  },
  PV_E_total: {
    type: Number,
    required: true,
  },
  PV3_P_total_avg: {
    type: Number,
    required: true,
  },

  PV3_P_total_min: {
    type: Number,
    required: true,
  },
  PV3_P_total_max: {
    type: Number,
    required: true,
  },
  PV3_P_total_current: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

export const GenerationDataSchemaModel = mongoose.model<GenerationDataType>(
  "generation_data",
  GenerationDataSchema,
  "generation_data"
);
