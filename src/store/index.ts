import { configureStore, combineReducers } from "@reduxjs/toolkit";
import type { Action } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/features/auth/authSlice";
import kycReducer from "@/features/kyc/kycSlice";
import usersReducer from "@/features/users/usersSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};
   

const appReducer = combineReducers({
  auth: authReducer,
  kyc: kycReducer,
  users: usersReducer,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: Action) => {
  if (action.type === "auth/logoutAsync/fulfilled" || action.type === "auth/logoutAsync/rejected") {
    storage.removeItem("persist:root");
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;