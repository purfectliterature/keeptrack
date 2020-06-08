import { AsyncStorage } from "react-native";
import { combineReducers } from "redux";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from "redux-persist";
import createSecureStore from "redux-persist-expo-securestore";

import locationsReducer from "./locations";
import settingsReducer from "./settings";
import scannerReducer from "./scanner";

const storage = AsyncStorage;

const persistConfig = {
    key: "root",
    storage,
    blacklist: ["scanner"]
};

const locationsPersistConfig = {
    key: "locations",
    storage
};

const settingsPersistConfig = {
    key: "settings",
    storage
};

// const combinedReducers = combineReducers({
//     locations: persistReducer(locationsPersistConfig, locationsReducer),
//     settings: persistReducer(settingsPersistConfig, settingsReducer),
//     scanner: scannerReducer
// });

const combinedReducers = combineReducers({
    locations: locationsReducer,
    settings: settingsReducer,
    scanner: scannerReducer
});

const reducer = persistReducer(persistConfig, );

export default () => {
    const store = configureStore({
        reducer: combinedReducers,
        middleware: [
            // ...getDefaultMiddleware({
            //     serializableCheck: {
            //         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            //     }
            // }),
            store => next => action => {
                console.log(store.getState());
                console.log(action);
                return next(action);
            }
        ]
    });
    const persistor = () => persistStore(store);

    return { store, persistor };
};