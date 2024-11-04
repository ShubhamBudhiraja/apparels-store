import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { show: boolean; onSuccess?: () => void } = { show: false };

const loginModalSlice = createSlice({
    name: 'loginModalSlice',
    initialState: initialState,
    reducers: {
        updateModalState: (state, action: PayloadAction<{ show: boolean; onSuccess?: () => void }>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const LoginModalActions = loginModalSlice.actions;
export default loginModalSlice.reducer;
