import React from 'react';
import Define from './define';
import { NavigationScreenProp } from 'react-navigation';
import { DefineNavigationProps, Item } from '../../../common/types';

interface DefineContainerProps {
    navigation: NavigationScreenProp<{}, DefineNavigationProps>,
}

export default function DefineContainer(props: DefineContainerProps) {

    const tempURI = props.navigation.getParam("uri");

    function storeItem(item: Item) {
        
    }

    return (
        <Define photoURI={tempURI}></Define>
    );
}