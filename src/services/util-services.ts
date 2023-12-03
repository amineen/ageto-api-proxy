import {
  AgetoResponseDataType,
  ColumnType,
  DailyEnergyTotalType,
} from "../models/types";

export function computeData(
  agetoAPIResponse: AgetoResponseDataType
): DailyEnergyTotalType {
  const columnData = agetoAPIResponse.format.data;

  const payload = agetoAPIResponse.payload;

  const firstPayloadItem = payload[0];
  const lastPayloadItem = payload[payload.length - 1];

  //create an object with the keys of ColumnType and the value of 0
  const initialParsedData = columnData.reduce((acc, key) => {
    acc[key as ColumnType] = 0;
    return acc;
  }, {} as { [key in ColumnType]: number });

  const firstParsedItem: { [key in ColumnType]: number } & {
    timestamp: string;
  } = { ...initialParsedData, timestamp: firstPayloadItem.meta[0] };
  const lastParsedItem: { [key in ColumnType]: number } & {
    timestamp: string;
  } = { ...initialParsedData, timestamp: lastPayloadItem.meta[0] };

  columnData.forEach((column: ColumnType, index) => {
    firstParsedItem[column] = firstPayloadItem.data[index];
    lastParsedItem[column] = lastPayloadItem.data[index];
  });

  const pvEnergy = lastParsedItem.PV_E_total - firstParsedItem.PV_E_total;
  const genEnergy = lastParsedItem.GEN_E_total - firstParsedItem.GEN_E_total;
  const totalLoad = lastParsedItem.LOAD_E_total - firstParsedItem.LOAD_E_total;
  const batteryDIS =
    lastParsedItem.INV_E_total_DIS - firstParsedItem.INV_E_total_DIS;
  const batteryCHG =
    lastParsedItem.INV_E_total_CHG - firstParsedItem.INV_E_total_CHG;
  const dailyCO2Offset =
    lastParsedItem.OFFSETS_CO2_tons - firstParsedItem.OFFSETS_CO2_tons;

  return {
    date: lastParsedItem.timestamp.split("T")[0] as string,
    pvEnergy,
    genEnergy,
    totalLoad,
    batteryDIS,
    batteryCHG,
    dailyCO2Offset,
  };
}
