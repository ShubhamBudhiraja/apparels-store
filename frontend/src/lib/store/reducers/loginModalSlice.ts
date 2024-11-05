import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILoginModalSuccess } from 'src/lib/interface/user';

const initialState: { show: boolean; onSuccess?: (details?: ILoginModalSuccess) => void } = { show: false };

const loginModalSlice = createSlice({
    name: 'loginModalSlice',
    initialState: initialState,
    reducers: {
        updateModalState: (
            state,
            action: PayloadAction<{ show: boolean; onSuccess?: (details?: ILoginModalSuccess) => void }>
        ) => {
            return { ...state, ...action.payload };
        },
    },
});

export const LoginModalActions = loginModalSlice.actions;
export default loginModalSlice.reducer;
