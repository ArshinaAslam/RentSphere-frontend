import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

import adminReducer from "@/features/admin/adminSlice";
import authReducer from "@/features/auth/authSlice";
import kycReducer from "@/features/kyc/kycSlice";
import propertyReducer from '@/features/property/propertySlice';
import visitReducer from '@/features/visit/visitSlice'

import type { Action } from "@reduxjs/toolkit";



const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth","property"],
};
   

const appReducer = combineReducers({
  auth: authReducer,
  kyc: kycReducer,
  admin: adminReducer,
  property : propertyReducer,
  visit: visitReducer,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: Action) => {
  if (action.type === "auth/logout/fulfilled" || action.type === "auth/logout/rejected") {
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





