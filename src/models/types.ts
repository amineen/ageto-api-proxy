export type GenerationDataType = {
  BMS1_P_total_avg: number;
  BMS1_P_total_min: number;
  BMS1_P_total_max: number;
  BMS1_P_total_current: number;
  BMS1_SOC: number;
  GEN_E_total: number;
  GEN_P_total_avg: number;
  GEN_P_total_min: number;
  GEN_P_total_max: number;
  GEN_P_total_current: number;
  INV1_P_total_avg: number;
  INV1_P_total_min: number;
  INV1_P_total_max: number;
  INV1_P_total_current: number;
  INV2_P_total_avg: number;
  INV2_P_total_min: number;
  INV2_P_total_max: number;
  INV2_P_total_current: number;
  INV_E_total_CHG: number;
  INV_E_total_DIS: number;
  LOAD1_P_total_avg: number;
  LOAD1_P_total_min: number;
  LOAD1_P_total_max: number;
  LOAD1_P_total_current: number;
  LOAD_E_total: number;
  OFFSETS_CO2_tons: number;
  PV1_P_total_avg: number;
  PV1_P_total_min: number;
  PV1_P_total_max: number;
  PV1_P_total_current: number;
  PV2_P_total_avg: number;
  PV2_P_total_min: number;
  PV2_P_total_max: number;
  PV2_P_total_current: number;
  PV_E_total: number;
  PV3_P_total_avg: number;
  timestamp: string;
};

export type TotalizerDailyReadingsType = {
  datetime: string;
  L1_kilowatt_hours: number;
  L2_kilowatt_hours: number;
  L3_kilowatt_hours: number;
  total_kilowatt_hours: number;
  L1_current_min: number;
  L2_current_min: number;
  L3_current_min: number;
  total_current_min: number;
  L1_current_max: number;
  L2_current_max: number;
  L3_current_max: number;
  total_current_max: number;
  L1_current_avg: number;
  L2_current_avg: number;
  L3_current_avg: number;
  total_current_avg: number;
  L1_energy: number;
  L2_energy: number;
  L3_energy: number;
  total_energy: number;
  L1_true_power_avg: number;
  L2_true_power_avg: number;
  L3_true_power_avg: number;
  total_true_power_avg: number;
  hour: number;
  minute: number;
};
export type TotalizerDataType = {
  month: number;
  year: number;
  day: number;
  dateKey: string;
  dailyAccumulativeEnergy: number;
  dailykWh: number;
  readings: TotalizerDailyReadingsType[];
};

export type LastTotalizerRecordingType = {
  datetime: Date;
  L1_true_power_avg: number;
  L2_true_power_avg: number;
  L3_true_power_avg: number;
  total_true_power_avg: number;
  L1_current_avg: number;
  L2_current_avg: number;
  L3_current_avg: number;
  total_current_avg: number;
};

export const dataColumns = [
  "BMS1_P_total",
  "BMS1_SOC",
  "GEN_E_total",
  "GEN_P_total",
  "GEN_Run_hrs",
  "INV1_P_total",
  "INV2_P_total",
  "INV_E_total_CHG",
  "INV_E_total_DIS",
  "LOAD1_P_total",
  "LOAD_E_total",
  "OFFSETS_CO2_tons",
  "PV1_P_total",
  "PV2_P_total",
  "PV3_P_total",
  "PV_E_total",
] as const;

export type ColumnType = (typeof dataColumns)[number];

export type PayloadType = {
  data: number[];
  meta: string[];
};

export type AgetoResponseDataType = {
  format: {
    //the type of this is array of the union type ColumnType
    data: ColumnType[];
    meta: string[];
  };
  payload: PayloadType[];
};

export type EnergyData = {
  genEnergy: number;
  batteryDIS: number;
  batteryCHG: number;
  pvEnergy: number;
  totalLoad: number;
  dailyCO2Offset: number;
  peakLoad?: number;
};

export type DailyEnergyTotalType = EnergyData & {
  date: string;
  lastReading: {
    [key in ColumnType]: number;
  };
};
