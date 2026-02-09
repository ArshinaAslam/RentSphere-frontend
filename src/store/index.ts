import { configureStore } from "@reduxjs/toolkit";
import authReducer from '@/features/auth/authSlice'
import kycReducer from '@/features/kyc/kycSlice'
import usersReducer from '@/features/users/usersSlice';


export const store  = configureStore({
    reducer:{
      auth: authReducer,
      kyc: kycReducer,
      users:usersReducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch