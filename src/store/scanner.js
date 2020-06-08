import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "settings",
    initialState: false,
    reducers: {
        scannerScanned: (scanned, action) => {
            scanned = true;
        }
    }
});

export default slice.reducer;