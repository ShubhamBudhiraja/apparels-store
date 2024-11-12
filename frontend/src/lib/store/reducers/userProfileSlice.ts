import { IUserData } from '@interface/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IUserData = {};

const userProfileSlice = createSlice({
    name: 'userProfileSlice',
    initialState,
    reducers: {
        updateCustomerDetails: (state, action: PayloadAction<IUserData>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const UserDataActions = userProfileSlice.actions;
export default userProfileSlice.reducer;
