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

    const [tfReady, setTfReady] = useState(false);

    const [modelReady, setModelReady] = useState(false);

    const [model, setModel] = useState<mobilenet.MobileNet | null>(null);

    const isFocused = useIsFocused();

    const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);

    const [cameraReady, setCameraReady] = useState(false);

    const getAskCameraPermission = useStoreActions(store => store.helpers.getAskCameraPermission);

    const cameraRef = useRef<any>(null);

    const [photoURI, setPhotoURI] = useState<ImageSourcePropType | null>(null);

    const [loading, setLoading] = useState<'photo' | 'prediction' | null>(null);

    const [doClassify, setDoClassify] = useState(false);



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

    useEffect(() => {
        if(doClassify && photoURI && model && modelReady) {
            classifyImage();
        }
    }, [photoURI, doClassify, model, modelReady]);

    const classifyImage = async () => {
        console.log('starting classifier')
        try {
            if(photoURI && modelReady && model) {
                console.log('classifying...');
                const imageAssetPath = Image.resolveAssetSource(photoURI);
                const response = await tfrn.fetch(imageAssetPath.uri, {}, {isBinary: true});
                const rawImageData = await response.arrayBuffer();
                const imageData = new Uint8Array(rawImageData);
                const imageTensor = tfrn.decodeJpeg(imageData);
                const predictions = await model.classify(imageTensor);
                console.log('predictions:');
                console.log(predictions);
            }
        } catch (error) {
            console.error(error);
        }
        setDoClassify(false);
        console.log('ending classifier');
    };

    // wait for tensorflow 
    useEffect(() => {
        (async () => {
            try {
                console.log('loading tf...');
                await tf.ready();
                setTfReady(true);
                console.log('tf ready');
            } catch (error) {
                console.error('error loading tf', error);
            }
        })();
    }, []);

    // load model
    useEffect(() => {
        (async () => {
            try {
                console.log('loading model...');
                const _model = await mobilenet.load();
                setModel(_model);
                setModelReady(true);
                console.log('model ready');
            } catch (error) {
                console.error('could not load model', error);
            }
        })();
    }, []);

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
        if (cameraReady) {
            await takePhoto();
        }
        setDoClassify(true);
    };

    return (<Add handlePhotoButtonPress={onPhotoButtonPress} predictedAttributes={null}><CameraContent /></Add>)
}
