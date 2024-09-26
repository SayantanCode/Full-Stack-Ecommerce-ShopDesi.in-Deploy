import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../Slice/authSlice";
import { viewSlice } from "../Slice/viewSlice";

export const store = configureStore({
    reducer:{
        Auth: authSlice.reducer,
        View: viewSlice.reducer
    }
})