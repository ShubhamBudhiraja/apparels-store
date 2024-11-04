import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
    name: 'loaderSlice',
    initialState: { show: false },
    reducers: {
        updateState: (state, action: PayloadAction<{ show: boolean }>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const LoaderActions = loaderSlice.actions;
export default loaderSlice.reducer;
