import mongoose from "mongoose";
import { Schema } from "mongoose";

import { TotalizerDataType, TotalizerDailyReadingsType } from "./types";

const totalizerDailyReadings = new Schema<TotalizerDailyReadingsType>(
  {
    datetime: {
      type: String,
    },
    L1_kilowatt_hours: {
      type: Number,
    },
    L2_kilowatt_hours: {
      type: Number,
    },
    L3_kilowatt_hours: {
      type: Number,
    },
    total_kilowatt_hours: {
      type: Number,
    },
    L1_current_min: {
      type: Number,
    },
    L2_current_min: {
      type: Number,
    },
    L3_current_min: {
      type: Number,
    },
    total_current_min: {
      type: Number,
    },
    L1_current_max: {
      type: Number,
    },
    L2_current_max: {
      type: Number,
    },
    L3_current_max: {
      type: Number,
    },
    total_current_max: {
      type: Number,
    },
    L1_current_avg: {
      type: Number,
    },
    L2_current_avg: {
      type: Number,
    },
    L3_current_avg: {
      type: Number,
    },
    total_current_avg: {
      type: Number,
    },
    L1_energy: {
      type: Number,
    },
    L2_energy: {
      type: Number,
    },
    L3_energy: {
      type: Number,
    },
    total_energy: {
      type: Number,
    },
    L1_true_power_avg: {
      type: Number,
    },
    L2_true_power_avg: {
      type: Number,
    },
    L3_true_power_avg: {
      type: Number,
    },
    total_true_power_avg: {
      type: Number,
    },
    hour: {
      type: Number,
    },
    minute: {
      type: Number,
    },
  },
  { versionKey: false }
);

const totalizerDataSchema = new Schema<TotalizerDataType>(
  {
    month: {
      type: Number,
    },
    year: {
      type: Number,
    },
    day: {
      type: Number,
    },
    dateKey: {
      type: String,
    },
    dailyAccumulativeEnergy: {
      type: Number,
    },
    dailykWh: {
      type: Number,
    },
    readings: [totalizerDailyReadings],
  },
  { versionKey: false }
);

export default mongoose.model<TotalizerDataType>(
  "totalizer_data",
  totalizerDataSchema
);
