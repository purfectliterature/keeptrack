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
// import createSecureStore from "redux-persist-expo-securestore";

import locationsReducer from "./locations";
import settingsReducer from "./settings";
import scannerReducer from "./scanner";

const storage = AsyncStorage;

const persistConfig = {
    key: "root",
    storage,
    blacklist: ["scanner"]
};

const reducer = persistReducer(persistConfig, combineReducers({
    locations: locationsReducer,
    settings: settingsReducer,
    scanner: scannerReducer
}));

export default () => {
    const store = configureStore({
        reducer,
        middleware: [
            ...getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
                }
            }),
            // store => next => action => {
            //     console.log(store.getState());
            //     console.log(action);
            //     return next(action);
            // }
        ]
    });
    const persistor = persistStore(store);

    return { store, persistor };
};