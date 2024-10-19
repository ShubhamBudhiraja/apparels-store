'use client';
import { createContext, useMemo } from 'react';

interface IContextData {
    dictionary: any;
}

export const LayoutContextData = createContext<IContextData>({
    dictionary: undefined,
});

interface ILayoutContextProvider {
    children: JSX.Element;
    dictionaryData?: any;
}

const LayoutContextProvider = (props: ILayoutContextProvider) => {
    const { dictionaryData } = props;
    const contextValue = useMemo(
        () => ({
            dictionary: dictionaryData,
        }),
        [dictionaryData]
    );

    return <LayoutContextData.Provider value={contextValue}>{props.children}</LayoutContextData.Provider>;
};

export default LayoutContextProvider;
