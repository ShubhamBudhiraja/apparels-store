'use client';
import { STORAGE_KEY, STORAGE_TYPE } from '@enums/storage';
import { getStorageItem } from '@utils/storage';
import { createContext, useEffect, useMemo, useState } from 'react';

interface IContextData {
    dictionary: any;
    isLoggedIn?: boolean;
}

export const LayoutContextData = createContext<IContextData>({
    dictionary: undefined,
    isLoggedIn: false,
});

interface ILayoutContextProvider extends IContextData {
    children: JSX.Element;
}

const LayoutContextProvider = (props: ILayoutContextProvider) => {
    const { dictionary } = props;

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userId = getStorageItem({ key: STORAGE_KEY.USERID, storageType: STORAGE_TYPE.COOKIE });
        if (userId) setIsLoggedIn(true);
    }, []);

    const contextValue = useMemo(
        () => ({
            dictionary: dictionary,
            isLoggedIn: isLoggedIn,
        }),
        [dictionary, isLoggedIn]
    );

    return <LayoutContextData.Provider value={contextValue}>{props.children}</LayoutContextData.Provider>;
};

export default LayoutContextProvider;
