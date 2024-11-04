import { ENVIRONMENTS } from '@enums/common';
import { configureStore } from '@reduxjs/toolkit';
import loaderSlice from './reducers/loaderSlice';
import userProfileSlice from './reducers/userProfileSlice';
import loginModalSlice from './reducers/loginModalSlice';

export const store = configureStore({
    reducer: {
        userProfile: userProfileSlice,
        loader: loaderSlice,
        loginModal: loginModalSlice,
    },
    devTools: process.env.NEXT_PUBLIC_ENV === ENVIRONMENTS.DEVELOPMENT,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
