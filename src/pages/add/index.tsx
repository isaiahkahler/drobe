import React, { useEffect, useState, useRef } from 'react';
import Add from './add';
import Orientation from './orientation';
import { createStackNavigator } from '@react-navigation/stack';
import { LargeHeaderOptions } from '../../components/navigation';
import { useStoreState } from '../../components/store';
import { StackScreenProps } from '@react-navigation/stack';
import { Camera } from 'expo-camera';

import { ActivityIndicator, Image, ImageSourcePropType, Linking, Text, View } from 'react-native';
import { pageStyles, textStyles } from '../../components/basics';
import { grey, linkColor } from '../../components/constants';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useStoreActions } from '../../components/store';
import * as tf from '@tensorflow/tfjs';``
import * as tfrn from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { useClassifier } from '../../components/classifierHelper';

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
            <Stack.Screen name="Add" component={AddContainer} options={LargeHeaderOptions as any}></Stack.Screen>
            <Stack.Screen name="Orientation" component={Orientation}></Stack.Screen>
        </Stack.Navigator>
    );
}



function AddContainer({ route, navigation }: AddScreenProps) {

    const isFocused = useIsFocused();

    const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);

    const [cameraReady, setCameraReady] = useState(false);

    const getAskCameraPermission = useStoreActions(store => store.helpers.getAskCameraPermission);

    const cameraRef = useRef<any>(null);

    const [photoURI, setPhotoURI] = useState<ImageSourcePropType | null>(null);

    const [loading, setLoading] = useState<'photo' | 'prediction' | null>(null);

    const classifier = useClassifier();

    const takePhoto = async () => {
        if (cameraReady && cameraRef && cameraRef.current) {
            try {
                const picture = await cameraRef.current.takePictureAsync();
                setPhotoURI({ uri: picture.uri });
            } catch (error) {
                console.error('error taking photo:', error);
            }
        }
    };

    // camera permissions
    useEffect(() => {
        console.log('getting camera permission...');
        getAskCameraPermission().then(value => {
            setHasCameraPermission(value);
        })
    }, [getAskCameraPermission]);

    const cameraView = () =>
        <Camera style={{ flex: 1, aspectRatio: 1 }} ref={cameraRef} onCameraReady={() => setCameraReady(true)} />;

    const loadingView = () => <View style={[pageStyles.center, { flex: 1, backgroundColor: grey, }]}>
        <ActivityIndicator size='large' />
    </View>;

    const loadingPhotoView = () => <View style={[pageStyles.center, { flex: 1 }]}>
        <View style={[pageStyles.center, { backgroundColor: grey, flex: 1, position: 'absolute' }]}>
            <ActivityIndicator size='large' />
        </View>
        {photoURI ? <Image source={photoURI} style={{ flex: 1 }} /> : <View />}
    </View>;

    const photoView = () => <>
        {photoURI ? <Image source={photoURI} style={{ flex: 1 }} /> : <View />}
    </>;

    const unfocusedView = () => <View style={{ flex: 1, backgroundColor: grey }} />;

    const permissionDeniedView = () =>
        <View style={{ flex: 1, padding: '10%', backgroundColor: grey }}>
            <Text style={[textStyles.header, { color: "#000" }]}>uh oh</Text>
            <Text style={textStyles.paragraph}>Drobe doesn't have access to your camera.</Text>
            <Text style={[textStyles.paragraph, { color: linkColor }]} onPress={() => {
                Linking.openURL('app-settings:');
            }}>go to settings ↗️</Text>
        </View>;

    let CameraContent = loadingView;

    if (photoURI) {
        if (loading == 'prediction')
            CameraContent = loadingPhotoView;
        else
            CameraContent = photoView;
    } else if (loading == 'photo') {
        CameraContent = loadingView;
    } else if (!isFocused) {
        CameraContent = unfocusedView;
    } else if (!hasCameraPermission) {
        CameraContent = permissionDeniedView;
    } else {
        CameraContent = cameraView;
    }

    const onPhotoButtonPress = async () => {
        console.log('button press')
        if (cameraReady) {
            await takePhoto();
        }
        if(photoURI) {
            let classType = await classifier.classifyClass(photoURI);
            if(classType) {
                // console.log('classType:', classType);
            }
        }

    };

    return (<Add handlePhotoButtonPress={onPhotoButtonPress} predictedAttributes={null}><CameraContent /></Add>)
}
