import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const generateId = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

const slice = createSlice({
    name: "locations",
    initialState: { },
    reducers: {
        locationAdded: (locations, action) => {
            const id = generateId();
            while (id in locations) {
                id = generateId();
            }
            locations[id] = { id, ...action.payload };
        },

        locationPinned: (locations, action) => {
            locations[action.payload.id].pinned = true;
        },

        locationUnpinned: (locations, action) => {
            locations[action.payload.id].pinned = false;
        },

        locationCheckedIn: (locations, action) => {
            locations[action.payload.id].checkedIn = true;
        },

        locationCheckedOut: (locations, action) => {
            locations[action.payload.id].checkedIn = false;
        },

        locationUrlUpdated: (locations, action) => {
            locations[action.payload.id].url = action.payload.url;
        },

        locationRenamed: (locations, action) => {
            locations[action.payload.id].location = action.payload.newName;
        },

        locationDeleted: (locations, action) => {
            delete locations[action.payload.id];
        },

        locationsReset: (locations, action) => {
            Object.keys(locations).forEach((item, index) => {
                delete locations[item];
            });
        }
    }
});

const {
    locationAdded,
    locationPinned,
    locationUnpinned,
    locationCheckedIn,
    locationCheckedOut,
    locationUrlUpdated,
    locationRenamed,
    locationDeleted,
    locationsReset
} = slice.actions;

export default slice.reducer;

export const addLocation = (location, url, checkedIn, pinned) => locationAdded({
    location,
    url,
    pinned,
    checkedIn,
    lastVisited: Date.now()
});

export const addLocationObject = (locationObject) => locationAdded(locationObject);

export const pinLocation = (id) => locationPinned({ id });
export const unpinLocation = (id) => locationUnpinned({ id });
export const checkInLocation = (id) => locationCheckedIn({ id });
export const checkOutLocation = (id) => locationCheckedOut({ id });
export const updateLocationUrl = (id, url) => locationUrlUpdated({ id, url });
export const renameLocation = (id, newName) => locationRenamed({ id, newName });
export const deleteLocation = (id) => locationDeleted({ id });
export const resetLocations = () => locationsReset();

export const getLocations = createSelector(
    state => state.locations,
    locations => Object.values(locations)
);

export const getCheckedInLocations = createSelector(
    state => state.locations,
    locations => Object.values(locations).filter(location => location.checkedIn).sort((a, b) => {
        if (a.pinned && b.pinned) return 0;
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
    })
);

export const getPinnedNotCheckedInLocations = createSelector(
    state => state.locations,
    locations => Object.values(locations).filter(location => location.pinned && !location.checkedIn)
);

export const getNotPinnedNotCheckedInLocations = createSelector(
    state => state.locations,
    locations => Object.values(locations).filter(location => !location.pinned && !location.checkedIn)
);