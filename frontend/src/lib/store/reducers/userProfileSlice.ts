import { IProductData } from '@interface/products';
import { ICartData, IProfileDetails, IUserAddress, IUserData } from '@interface/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IUserData = {
    addresses: [],
    cart: { total: 0, cartTotal: 0, isDeliveryFeeIncluded: false, products: [] },
};

const userProfileSlice = createSlice({
    name: 'userProfileSlice',
    initialState,
    reducers: {
        updateCustomerDetails: (state, action: PayloadAction<IProfileDetails | IUserData>) => {
            return { ...state, ...action.payload };
        },
        updateCart: (state, action: PayloadAction<ICartData>) => {
            return { ...state, cart: action.payload };
        },
        updateWishlist: (state, action: PayloadAction<IProductData[]>) => {
            return { ...state, wishlist: action.payload };
        },
        addAddress: (state, action: PayloadAction<IUserAddress>) => {
            const addresses = [...(state?.addresses || [])];
            addresses.push(action.payload);
            return { ...state, addresses };
        },
        updateAddress: (state, action: PayloadAction<IUserAddress>) => {
            const addresses = state.addresses?.map((address: IUserAddress) => {
                let temp = { ...address };
                if (action.payload._id === address._id) temp = { ...address, ...action.payload };
                return temp;
            });
            return { ...state, addresses };
        },
        deleteAddress: (state, action: PayloadAction<{ addressId: string }>) => {
            const addresses = state.addresses?.filter(
                (address: IUserAddress) => address._id !== action.payload.addressId
            );
            return { ...state, addresses };
        },
        resetProfile: () => initialState,
    },
});

export const UserDataActions = userProfileSlice.actions;
export default userProfileSlice.reducer;
