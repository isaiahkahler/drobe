import React, { useState, useEffect } from 'react';
import Add from './add';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { DefineNavigationProps } from '../../../common/types';

interface AddContainerProps {
    navigation: any,
}

export default function AddContainer(props: AddContainerProps) {

    const [cameraPermission, setCameraPermission] = useState<Permissions.PermissionStatus>(Permissions.PermissionStatus.UNDETERMINED);

    const [cameraRollPermission, setCameraRollPermission] = useState<Permissions.PermissionStatus>(Permissions.PermissionStatus.UNDETERMINED);

    async function tryOpenCamera() {
        if (cameraPermission === Permissions.PermissionStatus.GRANTED && cameraRollPermission === Permissions.PermissionStatus.GRANTED) {
            const response = await ImagePicker.launchCameraAsync({
                base64: false
            });
            handleImageResponse(response);
            return;
        }
        if (cameraPermission === Permissions.PermissionStatus.UNDETERMINED) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
            setCameraPermission(status);
            tryOpenCamera();
            return;
        }
        if (cameraRollPermission === Permissions.PermissionStatus.UNDETERMINED) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            setCameraRollPermission(status);
            tryOpenCamera();
            return;
        }
        if (cameraPermission === Permissions.PermissionStatus.DENIED || cameraRollPermission === Permissions.PermissionStatus.DENIED) {
            Alert.alert(
                'Cannot Open Camera',
                'Drobe needs access to your camera and camera roll in order to take pictures.',
                [
                    { text: "cancel", style: 'cancel' },
                    {
                        text: "settings", onPress: () => {
                            //open settings
                        }
                    }
                ]
            )
        }
    };

    async function tryOpenImagePicker () {
        if (cameraRollPermission === Permissions.PermissionStatus.GRANTED) {
            const response = await ImagePicker.launchImageLibraryAsync({
                base64: false
            });
            handleImageResponse(response);
            return;
        }
        if (cameraRollPermission === Permissions.PermissionStatus.UNDETERMINED) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            setCameraRollPermission(status);
            tryOpenCamera();
            return;
        }
        if (cameraRollPermission === Permissions.PermissionStatus.DENIED) {
            Alert.alert(
                'Cannot Open Photo Library',
                'Drobe needs access to your camera roll in order to take photos from your library.',
                [
                    { text: "cancel", style: 'cancel' },
                    {
                        text: "settings", onPress: () => {
                            //open settings
                        }
                    }
                ]
            )
        }
    };

    // get status of permissions
    useEffect(() => {
        const getStatus = async () => {
            const { status } = await Permissions.getAsync(Permissions.CAMERA);
            setCameraPermission(status);
        };
        getStatus();
    }, []);

    useEffect(() => {
        const getStatus = async () => {
            const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
            setCameraRollPermission(status);
        };
        getStatus();
    }, []);

    function handleImageResponse(image: ImagePicker.ImagePickerResult) {
        if (!image.cancelled){
            const navigationProps: DefineNavigationProps = {uri: image.uri} 
            props.navigation.navigate('Define', navigationProps);
        }
    }

    return (
        <Add tryOpenCamera={tryOpenCamera} tryOpenImagePicker={tryOpenImagePicker} />
    );
}