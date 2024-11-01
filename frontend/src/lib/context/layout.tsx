'use client';
import { createContext, useMemo } from 'react';

interface IContextData {
    dictionary: any;
}

export const LayoutContextData = createContext<IContextData>({
    dictionary: undefined,
});

interface ILayoutContextProvider extends IContextData {
    children: JSX.Element;
}

const LayoutContextProvider = (props: ILayoutContextProvider) => {
    const { dictionary } = props;
    const contextValue = useMemo(
        () => ({
            dictionary: dictionary,
        }),
        [dictionary]
    );

    return <LayoutContextData.Provider value={contextValue}>{props.children}</LayoutContextData.Provider>;
};

export default LayoutContextProvider;
