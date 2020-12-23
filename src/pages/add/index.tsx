import React, { useEffect, useState } from 'react';
import Add from './add';
import Orientation from './orientation';
import { createStackNavigator } from '@react-navigation/stack';
import { LargeHeaderOptions } from '../../components/navigation';
import { useStoreState } from '../../components/store';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { Camera } from 'expo-camera';

type AddStackParamList = {
    Add: undefined,
    Orientation: undefined
};

export type AddScreenProps = StackScreenProps<AddStackParamList, 'Add'>;

const Stack = createStackNavigator<AddStackParamList>();

export default function AddPageStack() {

    const user = useStoreState((state) => state.user);

    const navigation = useNavigation();

    return (
        <Stack.Navigator mode='modal'>
            <Stack.Screen name="Add" component={Add} options={LargeHeaderOptions as any}></Stack.Screen>
            <Stack.Screen name="Orientation" component={Orientation}></Stack.Screen>
        </Stack.Navigator>
    );
}