import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const slice = createSlice({
    name: "scanner",
    initialState: false,
    reducers: {
        scannerScanned: (scanned, action) => {
            scanned = true;
        },

        scannerEnabled: (scanned, action) => {
            scanned = false;
        }
    }
});

const {
    scannerScanned,
    scannerEnabled
} = slice.actions;

export default slice.reducer;

export const enableScanning = () => scannerEnabled();
export const disableScanning = () => scannerScanned();

export const getScannerStatus = createSelector(
    state => state.scanner,
    scanner => scanner
);