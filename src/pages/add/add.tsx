import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, ImageSourcePropType, LayoutAnimation, Linking, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import { pageStyles, textStyles, Touchable, touchableStyles } from '../../components/basics';
import { accentColor, grey, linkColor, width } from '../../components/constants';
import { useIsFocused } from '@react-navigation/native';
import { startAnimation } from '../../components/animationHelper';
import { If } from '../../components/uiHelpers';
import { AddScreenProps } from './index';
import { useStoreActions } from '../../components/store';
import { Item } from '../../components/types';

export default function AddContainer({ route, navigation }: AddScreenProps) {

    const [tfReady, setTfReady] = useState(false);

    const isFocused = useIsFocused();

    const [cameraOffset, setCameraOffset] = useState(0);

    const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);

    const [cameraReady, setCameraReady] = useState(false);

    const getAskCameraPermission = useStoreActions(store => store.helpers.getAskCameraPermission);

    // const [cameraRef, setCameraRef] = useState<Camera | null>(null);

    const cameraRef = useRef<any>(null);

    const [photoURI, setPhotoURI] = useState<ImageSourcePropType | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const takePhoto = async () => {
        console.log('push')
        if (cameraReady && cameraRef) {
            console.log(cameraRef);
            const picture = await cameraRef.current.takePictureAsync();
                console.log("height:", picture.height);
                console.log("width:", picture.width);
                console.log('uri:')
                console.log(picture.uri)
                setPhotoURI(picture.uri as any);
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
        <Camera style={{ flex: 1 }} ref={cameraRef} onCameraReady={() => setCameraReady(true)} />;

    const loadingView = () => <View style={[pageStyles.center, { flex: 1, backgroundColor: grey, }]}>
        <ActivityIndicator size='large' color="#000" />
    </View>;

    const photoView = () => <>
        {photoURI ? <Image source={photoURI} style={{ flex: 1 }} /> : <View />}
    </>;

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
        CameraContent = photoView;
    } else if (isLoading || !isFocused) {
        CameraContent = loadingView;
    } else {
        CameraContent = cameraView;
    }

    if (!hasCameraPermission) {
        CameraContent = permissionDeniedView;
    }

    const onPhotoButtonPress = () => {
        if (cameraReady) {
            takePhoto();
        }
    };

    console.log('add container')

    return (<Add handlePhotoButtonPress={onPhotoButtonPress} predictedAttributes={null}><CameraContent /></Add>)
}

interface AddProps {
    handlePhotoButtonPress: () => void,
    predictedAttributes: Item | null,
}

function Add(props: PropsWithChildren<AddProps>) {

    const [pageHeight, setPageHeight] = useState(0);

    const [cameraOffset, setCameraOffset] = useState(0);

    const cameraButtonOpacity = useRef(new Animated.Value(1)).current;

    const [hideCameraButton, setHideCameraButton] = useState(false);

    console.log('add')
    // calculate camera offset 
    useEffect(() => {
        console.log('page height:', pageHeight)
        if (pageHeight !== 0) {
            setCameraOffset(((pageHeight * 0.9) - (0.8 * width)) / 2);
        }
    }, [pageHeight]);

    return (
        <View style={pageStyles.pageLayout} onLayout={(event) => setPageHeight(event.nativeEvent.layout.height)}>
            <View style={pageStyles.paddedSpace} />

            <View style={[styles.camera, { top: cameraOffset, backgroundColor: grey }]}>
                {props.children}
            </View>

            <If.Parent value={!hideCameraButton}>
                <If.True>
                    <Animated.View style={[styles.cameraButtonContainer, { opacity: cameraButtonOpacity }]}>
                        <Touchable style={[touchableStyles.floatingBottomButton, styles.cameraButton]} onPress={() => {
                            props.handlePhotoButtonPress();
                            // takePhoto();
                            // LayoutAnimation.easeInEaseOut();
                            // setCameraOffset(0);
                            // startAnimation(cameraButtonOpacity, 0, () => setHideCameraButton(true));
                        }}><View></View></Touchable>
                    </Animated.View>
                </If.True>
            </If.Parent>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    camera: {
        width: '80%',
        aspectRatio: 1,
        borderRadius: 20,
        overflow: 'hidden',
        alignSelf: 'center'
    },
    cameraButton: {
        width: '20%',
        aspectRatio: 1,
        borderRadius: 100,
        borderWidth: 7,
        borderColor: accentColor,
    },
    cameraButtonContainer: {
        flex: 1
    }
});