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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationDataSchemaModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const GenerationDataSchema = new mongoose_1.Schema({
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
exports.GenerationDataSchemaModel = mongoose_1.default.model("generation_data", GenerationDataSchema, "generation_data");
//# sourceMappingURL=GenerationDataSchema.js.map