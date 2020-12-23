import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageSourcePropType, LayoutAnimation, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import { pageStyles, textStyles, Touchable, touchableStyles } from '../../components/basics';
import { accentColor, width } from '../../components/constants';
import { useIsFocused } from '@react-navigation/native';
import { startAnimation } from '../../components/animationHelper';
import { If } from '../../components/uiHelpers';
import { AddScreenProps } from './index';
import { useStoreActions } from '../../components/store';
import { Item } from '../../components/types';

function AddContainer({ route, navigation }: AddScreenProps) {

    const [tfReady, setTfReady] = useState(false);

    const isFocused = useIsFocused();

    const [pageHeight, setPageHeight] = useState(0);

    const [cameraOffset, setCameraOffset] = useState(0);

    const cameraButtonOpacity = useRef(new Animated.Value(1)).current;

    const [hideCameraButton, setHideCameraButton] = useState(false);

    const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);

    const [cameraReady, setCameraReady] = useState(false);

    const getAskCameraPermission = useStoreActions(store => store.helpers.getAskCameraPermission);

    const [cameraRef, setCameraRef] = useState<Camera | null>(null);

    const [photoURI, setPhotoURI] = useState<ImageSourcePropType | null>(null);

    const takePhoto = async () => {
        console.log('push')
        if (cameraReady && cameraRef) {
            const picture = await cameraRef.takePictureAsync();
            console.log("height:", picture.height);
            console.log("width:", picture.width);
        }
    };


    // camera permissions
    useEffect(() => {
        console.log('getting camera permission...');
        getAskCameraPermission().then(value => {
            setHasCameraPermission(value);
        })
    }, [getAskCameraPermission]);

    const cameraView = <>
        <If.Parent value={hasCameraPermission && isFocused}>
            <If.True>
                <Camera style={[styles.camera, { top: cameraOffset }]} ref={(camera) => { setCameraRef(camera) }} onCameraReady={() => setCameraReady(true)} />
            </If.True>
            <If.False>
                <View style={[styles.camera, { top: cameraOffset }]}></View>
            </If.False>
        </If.Parent>
    </>;

    const photoView = <>
        {photoURI ? <Image source={photoURI} style={{flex: 1}} /> : <View />}       
    </>;

    const permissionDeniedView = <> 
        <View style={{flex: 1}}>
            
        </View>
    </>;

    const _cameraContent = <></>;

    const onPhotoButtonPress = () => {

    };

    return (<Add cameraContent={_cameraContent} handlePhotoButtonPress={onPhotoButtonPress} predictedAttributes={null} />)
}

interface AddProps {
    handlePhotoButtonPress: () => void,
    cameraContent: React.ReactNode,
    predictedAttributes: Item | null,
}

export default function Add(props: AddProps) {

    const [pageHeight, setPageHeight] = useState(0);

    const [cameraOffset, setCameraOffset] = useState(0);

    const cameraButtonOpacity = useRef(new Animated.Value(1)).current;

    const [hideCameraButton, setHideCameraButton] = useState(false);


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

            <View style={[styles.camera, { top: cameraOffset }]}>{props.cameraContent}</View>

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