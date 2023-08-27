import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authentication/authSlice";
import projectReducer from "./projects/projectSlice";
import storage from "redux-persist/lib/storage";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import { PERSIST_STORE_KEY } from "../utils/constants";

const persistConfig = {
    key: PERSIST_STORE_KEY,
    storage,
};

const rootReducer = combineReducers({
    authSlice: authReducer,
    projectSlice: projectReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
