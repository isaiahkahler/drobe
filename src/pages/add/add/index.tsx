import React, { useState, useEffect } from 'react';
import Add from './add';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { DefineNavigationProps } from '../../../common/data/types';

interface AddContainerProps {
    navigation: any,
}

export default function AddContainer(props: AddContainerProps) {

    return (
        <Add navigation={props.navigation}/>
    );
}