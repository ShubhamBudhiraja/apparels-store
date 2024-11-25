import { IUserData } from '@interface/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IUserData = { cart: { total: 0, cartTotal: 0, discount: 0, products: [] } };

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
