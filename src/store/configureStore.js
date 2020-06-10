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

import locationsReducer from "./locations";
import settingsReducer from "./settings";

const storage = AsyncStorage;

const persistConfig = {
    key: "root",
    storage
};

const reducer = persistReducer(persistConfig, combineReducers({
    locations: locationsReducer,
    settings: settingsReducer
}));

export default () => {
    const store = configureStore({
        reducer,
        middleware: [
            ...getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
                }
            })
        ]
    });
    const persistor = persistStore(store);

    return { store, persistor };
};