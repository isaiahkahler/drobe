import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tfrn from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knn from '@tensorflow-models/knn-classifier';
import { Image, ImageSourcePropType } from 'react-native';
import { Item, Top, Bottom, Full, Shoes, Accessory } from './types';
import { classModelToken } from './tokens';

export function useClassifier() {

    const [tfReady, setTfReady] = useState(false);

    const [modelReady, setModelReady] = useState(false);

    const [model, setModel] = useState<mobilenet.MobileNet | null>(null);

    const [classClassifier] = useState(knn.create());
    const [typeClassifier] = useState(knn.create());

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

    // load classifiers
    useEffect(() => {
        if (classClassifier)
            (async () => {
                try {
                    let response = await fetch('https://api.keyvalue.xyz' + classModelToken, {
                        method: 'GET',
                    });
                    let tensorObj = await response.json();
                    Object.keys(tensorObj).forEach((key) => {
                        tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1000, 1000])
                    })
                    classClassifier.setClassifierDataset(tensorObj);

                } catch (error) {
                    console.error('could not load classifier(s): ', error);
                }
            })();
    }, [classClassifier]);

    useEffect(() => {
        if (typeClassifier)
            (async () => {
                try {
                    let response = await fetch('https://api.keyvalue.xyz' + classModelToken, {
                        method: 'GET',
                    });
                    let tensorObj = await response.json();
                    Object.keys(tensorObj).forEach((key) => {
                        tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1000, 1000])
                    })
                    classClassifier.setClassifierDataset(tensorObj);

                } catch (error) {
                    console.error('could not load classifier(s): ', error);
                }
            })();
    }, [classClassifier]);


    // const classify = async (photo: ImageSourcePropType, category: 'class' | 'top' | 'bottom' | 'full' | 'shoes' | 'accessory') => {
    const classify = async (photo: ImageSourcePropType) => {
        try {
            if (model && modelReady) {
                // image to tensor
                const imageAssetPath = Image.resolveAssetSource(photo);
                const response = await tfrn.fetch(imageAssetPath.uri, {}, { isBinary: true });
                const rawImageData = await response.arrayBuffer();
                const imageData = new Uint8Array(rawImageData);
                const imageTensor = tfrn.decodeJpeg(imageData);

                const activation = model.infer(imageTensor, true);
                const result = await classClassifier.predictClass(activation);
                return result;
            }
        } catch (error) {
            console.error('could not classify:', error);
            return error;
        }
    };

    const actions = {
        ready: tfReady && modelReady,
        classify: classify,
    }

    return actions;
}