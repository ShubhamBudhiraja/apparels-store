import { IToast } from '@interface/layout';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IToast = { show: false, autohide: false };

const toastSlice = createSlice({
    name: 'toastSlice',
    initialState,
    reducers: {
        updateToastState: (state, action: PayloadAction<IToast>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const ToastActions = toastSlice.actions;
export default toastSlice.reducer;
