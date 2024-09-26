import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../Helper/helper";

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (data) => {
    try {
      const res = await axiosInstance.post("/api/user/auth/signup", data);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
);
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (data) => {
    try {
      const res = await axiosInstance.post("/api/user/auth/verify", data);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
);
export const login = createAsyncThunk(
  "auth/login",
  async (data) => {
    try {
      const res = await axiosInstance.post("/api/user/auth/login", data);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data) => {
    try {
      const res = await axiosInstance.post("/api/user/auth/forgot-password", data);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data) => {
    try {
      const res = await axiosInstance.post("/api/user/auth/reset-password", data);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data) => {
    try {
      const res = await axiosInstance.post("/api/user/auth/change-password", data);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async () => {
    try {
      const res = await axiosInstance.get("/api/user/auth/profile");
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (data) => {
    try {
      console.log(data);
      const res = await axiosInstance.post("/api/user/auth/update-profile", data,{
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const authSlice = createSlice({
  name: "Auth",
  initialState: {
    logUser: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null,
    token: sessionStorage.getItem('token') || null,
    isAuthenticated: !!sessionStorage.getItem('token'),
    loading: false,
    // redirect: "/",
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.logUser = user;
      state.token = token;
      state.isAuthenticated = true;
      state.redirect = "/";
    },
    logout: (state) => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      state.logUser = null;
      state.token = null;
      state.isAuthenticated = false;
      state.redirect = "/user/login";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(verifyEmail.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(login.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        // state.tok = true;
        // state.redirect = "/";
        // if(action.payload.success){
        // state.user = action.payload.data;
        // }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(forgotPassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(resetPassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(changePassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getUserProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        console.log(action.payload.data);
        state.loading = false;
        if(action.payload.success){
          state.user = action.payload.data;
          const user = sessionStorage.getItem('user');
            sessionStorage.setItem('user', JSON.stringify({
              ...JSON.parse(user),
              avatar: action.payload.data.avatar,
              email: action.payload.data.email,
              name: action.payload.data.name,
              }));
          state.logUser = JSON.parse(sessionStorage.getItem('user'))
        }
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updateUserProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
export const { logout, loginSuccess } = authSlice.actions;
