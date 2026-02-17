import { createSlice } from "@reduxjs/toolkit";
import { AuthState, ErrorPayload } from "./types";
import {
  changeLandlordPasswordAsync,
  changePasswordAsync,
  editLandlordProfileAsync,
  editTenantProfileAsync,
  // fetchCurrentUserAsync,
  forgotPasswordLandlordAsync,
  forgotPasswordTenantAsync,
  googleAuthAsync,
  loginAdminAsync,
  loginLandlordAsync,
  loginTenantAsync,
  logoutAsync,
  resendOtpAsync,
  resetPasswordAsync,
  signupAsync,
 
  verifyLandlordOtpAsync,
 
  verifyTenantOtpAsync,
} from "./authThunks";

const initialState: AuthState = {
  userData: null,
   tokens: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.userData = null;
      // state.tokens = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupAsync.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(signupAsync.fulfilled, (state) => ({
        ...state,
        loading: false,
      }))
      .addCase(signupAsync.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: (action.payload as ErrorPayload)?.message || "Signup failed",
      }))

      .addCase(googleAuthAsync.pending, (state) => ({
  ...state,
  loading: true,
  error: null,
}))
.addCase(googleAuthAsync.fulfilled, (state, action) => ({
  ...state,
  loading: false,
  userData: action.payload.user,
  // tokens: action.payload.tokens,
}))
.addCase(googleAuthAsync.rejected, (state, action) => ({
  ...state,
  loading: false,
  error: (action.payload as ErrorPayload)?.message || 'Google auth failed',
}))

      // Verify OTP
      .addCase(verifyTenantOtpAsync.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(verifyTenantOtpAsync.fulfilled, (state) => ({
        ...state,
        loading: false,
        error: null,
      }))
      .addCase(verifyTenantOtpAsync.rejected, (state, action) => ({
        ...state,
        loading: false,
        error:
          (action.payload as ErrorPayload)?.message || "Verification failed",
      }))


       .addCase(verifyLandlordOtpAsync.pending, (state) => ({
      ...state,
      loading: true,
      error: null,
    }))
    .addCase(verifyLandlordOtpAsync.fulfilled, (state) => ({
      ...state,
      loading: false,
      error: null,
    }))
    .addCase(verifyLandlordOtpAsync.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: (action.payload as ErrorPayload)?.message || "Verification failed",
    }))

      .addCase(resendOtpAsync.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(resendOtpAsync.fulfilled, (state) => ({
        ...state,
        loading: false,
      }))
      .addCase(resendOtpAsync.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: (action.payload as ErrorPayload)?.message || "Resend failed",
      }))

      .addCase(loginTenantAsync.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(loginTenantAsync.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        userData: action.payload.user,
        // tokens: action.payload.tokens,
      }))
      .addCase(loginTenantAsync.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: (action.payload as ErrorPayload)?.message || "Login failed",
      }))


        .addCase(loginLandlordAsync.pending, (state) => ({
      ...state,
      loading: true,
      error: null,
    }))
    .addCase(loginLandlordAsync.fulfilled, (state, action) => ({
      ...state,
      loading: false,
      userData: action.payload.user,
      // tokens: action.payload.tokens,
    }))
    .addCase(loginLandlordAsync.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: (action.payload as ErrorPayload)?.message || "Login failed",
    }))

    
    .addCase(forgotPasswordTenantAsync.pending, (state) => ({
      ...state,
      loading: true,
      error: null,
    }))
    .addCase(forgotPasswordTenantAsync.fulfilled, (state) => ({
      ...state,
      loading: false,
    }))
    .addCase(forgotPasswordTenantAsync.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: (action.payload as ErrorPayload)?.message || 'Failed to send reset link',
    }))

    .addCase(forgotPasswordLandlordAsync.pending, (state) => ({
      ...state,
      loading: true,
      error: null,
    }))
    .addCase(forgotPasswordLandlordAsync.fulfilled, (state) => ({
      ...state,
      loading: false,
    }))
    .addCase(forgotPasswordLandlordAsync.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: (action.payload as ErrorPayload)?.message || 'Failed to send reset link',
    }))

    .addCase(resetPasswordAsync.pending, (state) => ({
  ...state,
  loading: true,
  error: null,
}))
.addCase(resetPasswordAsync.fulfilled, (state) => ({
  ...state,
  loading: false,
  error: null,
}))
.addCase(resetPasswordAsync.rejected, (state, action) => ({
  ...state,
  loading: false,
  error: (action.payload as ErrorPayload)?.message || "Password reset failed",
}))

      .addCase(logoutAsync.fulfilled, (state) => {
        state.userData = null;
        state.loading = false;
        // state.tokens = null;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.userData = null;
        state.loading = false;
        state.error = null;
        // state.tokens=null;
       
      })

       .addCase(editTenantProfileAsync.pending, (state) => ({
      ...state,
      loading: true,
      error: null,
    }))
  
    .addCase(editTenantProfileAsync.fulfilled, (state, action) => ({
      ...state,
      loading: false,
      userData: action.payload.data.user , 
      error: null,
    }))
    .addCase(editTenantProfileAsync.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: (action.payload as ErrorPayload)?.message || 'Profile update failed',
    }))

      .addCase(editLandlordProfileAsync.pending, (state) => ({
      ...state,
      loading: true,
      error: null,
    }))
  
    .addCase(editLandlordProfileAsync.fulfilled, (state, action) => ({
      ...state,
      loading: false,
      userData: action.payload.data.user , 
      error: null,
    }))
    .addCase(editLandlordProfileAsync.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: (action.payload as ErrorPayload)?.message || 'Profile update failed',
    }))
    .addCase(changePasswordAsync.pending, (state) => ({
  ...state,
  loading: true,
  error: null,
}))
.addCase(changePasswordAsync.fulfilled, (state) => ({
  ...state,
  loading: false,
  
}))
.addCase(changePasswordAsync.rejected, (state, action) => ({
  ...state,
  loading: false,
  error: (action.payload as any)?.message || "Password change failed",
}))
 .addCase(changeLandlordPasswordAsync.pending, (state) => ({
  ...state,
  loading: true,
  error: null,
}))
.addCase(changeLandlordPasswordAsync.fulfilled, (state) => ({
  ...state,
  loading: false,
  
}))
.addCase(changeLandlordPasswordAsync.rejected, (state, action) => ({
  ...state,
  loading: false,
  error: (action.payload as any)?.message || "Password change failed",
}))
.addCase(loginAdminAsync.pending, (state) => ({
  ...state,
  loading: true,
  error: null,
}))
.addCase(loginAdminAsync.fulfilled, (state, action) => ({
  ...state,
  loading: false,
  userData: action.payload.user,
  token : action.payload.token
 
}))
.addCase(loginAdminAsync.rejected, (state, action) => ({
  ...state,
  loading: false,
  error: (action.payload as ErrorPayload)?.message || "Admin login failed",
}))

// .addCase(fetchCurrentUserAsync.pending, (state) => ({
//   ...state,
//   loading: true,
//   error: null,
// }))
// .addCase(fetchCurrentUserAsync.fulfilled, (state, action) => ({
//   ...state,
//   loading: false,
//   userData: action.payload.user,  // ✅ Same as loginTenantAsync
// }))
// .addCase(fetchCurrentUserAsync.rejected, (state, action) => ({
//   ...state,
//   loading: false,
//   error: (action.payload as ErrorPayload)?.message || "Failed to fetch user",
// }))


  },
});

export const { clearUser, clearError,setUser } = authSlice.actions;
export default authSlice.reducer;
