import mongoose from "mongoose";
import { Schema } from "mongoose";
import { LastTotalizerRecordingType } from "./types";

const lastRecordDateSchema = new Schema<LastTotalizerRecordingType>(
  {
    datetime: {
      type: Date,
      required: true,
    },
    L1_true_power_avg: {
      type: Number,
      required: true,
    },
    L2_true_power_avg: {
      type: Number,
      required: true,
    },
    L3_true_power_avg: {
      type: Number,
      required: true,
    },
    total_true_power_avg: {
      type: Number,
      required: true,
    },
    L1_current_avg: {
      type: Number,
      required: true,
    },
    L2_current_avg: {
      type: Number,
      required: true,
    },
    L3_current_avg: {
      type: Number,
      required: true,
    },
    total_current_avg: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
);

export default mongoose.model<LastTotalizerRecordingType>(
  "last-record",
  lastRecordDateSchema,
  "last-records"
);
