import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

import adminReducer from "@/features/admin/adminSlice";
import adminAmenityReducer from '@/features/adminAmenity/adminAmenitySlice';
import adminPropertyTypeReducer from '@/features/adminPropertyType/adminPropertyTypeSlice';
import adminRevenueReducer from "@/features/adminRevenue/adminRevenueSlice"
import authReducer from "@/features/auth/authSlice";
import chatReducer from "@/features/chat/chatSlice";
import inquiryReducer from '@/features/inquiry/inquirySlice';
import kycReducer from "@/features/kyc/kycSlice";
import landlordReducer from "@/features/landlord/landlordSlice";
import landlordAmenityReducer from "@/features/landlordAmenity/landlordAmenitySlice"
import landlordPropertyTypeReducer from '@/features/landlordPropertyType/landlordPropertyTypeSlice';
import landlordVisitReducer from '@/features/landlordVisit/landlordVisitSlice';
import leaseReducer from '@/features/lease/leaseSlice';
import notificationReducer from '@/features/notification/notificationSlice';
import paymentReducer from '@/features/payment/paymentSlice';
import propertyReducer from '@/features/property/propertySlice';
import reviewReducer from "@/features/review/reviewSlice";
import tenantReducer from "@/features/tenant/tenantSlice";
import visitReducer from '@/features/visit/visitSlice';
import wishlistReducer from "@/features/wishlist/wishlistSlice";

import type { Action } from "@reduxjs/toolkit";



const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth","property","visit","landlordVisit","inquiry","wishlist","lease","notification","tenant","landlord"],
};
   

const appReducer = combineReducers({
  auth: authReducer,
  kyc: kycReducer,
  admin: adminReducer,
  tenant: tenantReducer,
  landlord: landlordReducer,
  property : propertyReducer,
  visit: visitReducer,
   landlordVisit: landlordVisitReducer,
   inquiry: inquiryReducer,
   wishlist: wishlistReducer,
   chat: chatReducer,
   lease: leaseReducer,
   payment: paymentReducer,
   notification: notificationReducer,
   review: reviewReducer,
   adminPropertyTypes: adminPropertyTypeReducer,
   adminAmenity: adminAmenityReducer,
   landlordPropertyTypes: landlordPropertyTypeReducer,
   landlordAmenities: landlordAmenityReducer,
    adminRevenue: adminRevenueReducer,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: Action) => {
  if (action.type === "auth/logout/fulfilled" || action.type === "auth/logout/rejected") {
    void storage.removeItem("persist:root");
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





