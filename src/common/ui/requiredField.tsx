import React, { useEffect, useState } from 'react';
import { Text, Animated, View } from 'react-native';
import { Row, Column } from '../ui/basicComponents';



import { dangerColor, animationScale } from '../data/constants';


interface RequiredFieldProps {
    children?: React.ReactNode,
    showLabel?: boolean,
    padding?: boolean,
}

const AnimatedColumn = Animated.createAnimatedComponent(Column);

const animationDuration = 250 * animationScale;


    const width = new Animated.Value(0);

    const padding = new Animated.Value(0);

    const opacity = new Animated.Value(0);
export default function RequiredField(props: RequiredFieldProps) {

    const [hidable, setHidable] = useState(false);


    useEffect(() => {
        if(props.showLabel){
            Animated.timing(width, {
                toValue: 2,
                duration: animationDuration,
            }).start(() => {
                setHidable(true);
            });
            props.padding && Animated.timing(padding, {
                toValue: 10,
                duration: animationDuration,
            }).start();
            Animated.timing(opacity, {
                toValue: 1,
                duration: animationDuration
            }).start();
        } else {
            if(hidable){
                Animated.timing(width, {
                    toValue: 0,
                    duration: animationDuration, 
                }).start();
                props.padding && Animated.timing(padding, {
                    toValue: 0,
                    duration: animationDuration,
                }).start();
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: animationDuration
                }).start();
            }
        }
    }, [props.showLabel]);

    return (
        <AnimatedColumn
            style={{
                borderWidth: width,
                borderRadius: 15,
                borderColor: dangerColor,
                padding: padding,
            }}
        >
            <Row style={{
                top: -15,
                position: "absolute",
                alignSelf: "center"
            }}>
                <View style={{
                    backgroundColor: "#fff",
                    padding: 5,
                }}>
                    <Animated.View style={{
                        opacity: opacity
                    }}>
                        <Text style={{ color: dangerColor }}>Required</Text>
                    </Animated.View>
                </View>
            </Row>
            {props.children}
        </AnimatedColumn>
    );
}