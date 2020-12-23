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

interface AddProps {
    handlePhotoButtonPress: () => void,
    predictedAttributes: Item | null,
}

export default function Add(props: PropsWithChildren<AddProps>) {

    const [pageHeight, setPageHeight] = useState(0);

    const [cameraOffset, setCameraOffset] = useState(0);

    const cameraButtonOpacity = useRef(new Animated.Value(0.8)).current;

    const [hideCameraButton, setHideCameraButton] = useState(false);

    // calculate camera offset 
    useEffect(() => {
        console.log('page height:', pageHeight)
        if (pageHeight !== 0) {
            setCameraOffset(((pageHeight * 0.9) - (0.9 * width)) / 2);
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
    camera: {
        width: '90%',
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