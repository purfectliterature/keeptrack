import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "settings",
    initialState: {
        showIntro: true
    },
    reducers: {
        introShown: (settings, action) => {
            settings.showIntro = false;
        }
    }
});

export default slice.reducer;

const {
    introShown
} = slice.actions;