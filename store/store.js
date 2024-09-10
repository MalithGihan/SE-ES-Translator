import { configureStore } from '@reduxjs/toolkit'; // Correct import path
import authSlice from './authSlice'; // Ensure this path is correct

export const store = configureStore({
    reducer: {
        auth: authSlice
    }
});
