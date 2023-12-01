"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const lastRecordDateSchema = new mongoose_2.Schema({
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
}, { versionKey: false });
exports.default = mongoose_1.default.model("last-record", lastRecordDateSchema, "last-records");
//# sourceMappingURL=LastTotalizerRecordSchema.js.map