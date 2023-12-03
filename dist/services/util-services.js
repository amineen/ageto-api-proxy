"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeData = void 0;
function computeData(agetoAPIResponse) {
    const columnData = agetoAPIResponse.format.data;
    const payload = agetoAPIResponse.payload;
    const firstPayloadItem = payload[0];
    const lastPayloadItem = payload[payload.length - 1];
    //get the keys of ColumnType
    const columnDataKeys = Object.keys(columnData);
    //create an object with the keys of ColumnType and the value of 0
    const initialParsedData = columnDataKeys.reduce((acc, key) => {
        acc[key] = 0;
        return acc;
    }, {});
    const firstParsedItem = { ...initialParsedData, timestamp: firstPayloadItem.meta[0] };
    const lastParsedItem = { ...initialParsedData, timestamp: lastPayloadItem.meta[0] };
    columnData.forEach((column, index) => {
        firstParsedItem[column] = firstPayloadItem.data[index];
        lastParsedItem[column] = lastPayloadItem.data[index];
    });
    const pvEnergy = lastParsedItem.PV_E_total - firstParsedItem.PV_E_total;
    const genEnergy = lastParsedItem.GEN_E_total - firstParsedItem.GEN_E_total;
    const totalLoad = lastParsedItem.LOAD_E_total - firstParsedItem.LOAD_E_total;
    const batteryDIS = lastParsedItem.INV_E_total_DIS - firstParsedItem.INV_E_total_DIS;
    const batteryCHG = lastParsedItem.INV_E_total_CHG - firstParsedItem.INV_E_total_CHG;
    const dailyCO2Offset = lastParsedItem.OFFSETS_CO2_tons - firstParsedItem.OFFSETS_CO2_tons;
    return {
        pvEnergy,
        genEnergy,
        totalLoad,
        batteryDIS,
        batteryCHG,
        dailyCO2Offset,
        date: lastParsedItem.timestamp.split("T")[0],
        lastReading: lastParsedItem,
    };
}
exports.computeData = computeData;
//# sourceMappingURL=util-services.js.map