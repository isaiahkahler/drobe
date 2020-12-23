import React, { createContext, PropsWithChildren, useContext } from 'react';
import { View } from 'react-native';

const ConditionalContext = createContext(false);

function True(props: { children?: React.ReactNode }) {

    const value = useContext(ConditionalContext);

    if (!value) {
        return null;
    }

    return <>{props.children}</>;

}

function False(props: PropsWithChildren<{}>) {

    const value = useContext(ConditionalContext);

    if (value) {
        return null;
    }

    return <>{props.children}</>;
}

export const If = {
    Parent: ConditionalContext.Provider,
    True: True,
    False: False,
}