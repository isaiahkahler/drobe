import React, {useState} from 'react';
import { View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Row, Column, FullButton, P } from './basicComponents';


interface ColorPickerProps {
    onConfirm: (string) => void,
}

export default function ColorPicker(props: ColorPickerProps) {

    const [size, setSize] = useState(1);
    const [x, setX] = useState(1);
    const [y, setY] = useState(1);

    const [dotSize, setDotSize] = useState(1);

    const mid = size / 2;

    const deltaX = x - mid;
    const deltaY = y - mid;
    const rad = Math.atan2(deltaY, deltaX);
    const deg = rad * (180 / Math.PI) + 180;
    const yUnit = Math.sin(rad) * mid;
    const xUnit = Math.cos(rad) * mid;
    const xPos = mid + (xUnit * (1 - dotSize / size)) - (dotSize / 2);
    const yPos = mid + yUnit * ((1 - dotSize / size)) - (dotSize / 2);

    const [secondDotSize, setSecondDotSize] = useState(1);
    const [secondSize, setSecondSize] = useState(1);
    const [secondX, setSecondX] = useState(1);
    const [secondY, setSecondY] = useState(1);

    const saturation = Math.round(secondY / secondSize * 100);
    const lightness = Math.round(secondX / secondSize * 100);

    // console.log(saturation, lightness);
    // console.log('render')

    return (
        <View
            onLayout={(event) => {
                setSize(event.nativeEvent.layout.width);
            }}
            onStartShouldSetResponder={(event) => {

                // console.log({
                //     target: event.target,
                //     nativeTarget: event.nativeEvent.target,
                //     id: event.nativeEvent.identifier,
                // })
                return true;
            }}
            onMoveShouldSetResponder={(event) => {
                return true;
            }}
            onResponderMove={(event) => {
                setX(event.nativeEvent.locationX);
                setY(event.nativeEvent.locationY);
            }}
            onResponderStart={(event) => {
                setX(event.nativeEvent.locationX);
                setY(event.nativeEvent.locationY);
            }}>
            {/* color circle image */}
            <Image source={require('../../../assets/colorwheel.png')} style={{
                height: undefined,
                width: undefined,
                aspectRatio: 1,
                resizeMode: 'contain',
                flex: 1
            }}
            />
            {/* dot */}
            <View
                style={{
                    position: "absolute",
                    width: "15%",
                    aspectRatio: 1,
                    borderColor: "#fff",
                    borderRadius: 100,
                    borderWidth: 5,
                    backgroundColor: `hsl(${Math.round(deg)}, 100%, 50%)`,
                    top: yPos,
                    left: xPos

                }}
                onLayout={(event) => {
                    dotSize === 1 && setDotSize(event.nativeEvent.layout.height)
                }}
                onStartShouldSetResponder={() => false}
                onMoveShouldSetResponder={() => false} />
            {/* saturation lightness box */}
            <View
                style={{
                    position: 'absolute',
                    width: '48%',
                    aspectRatio: 1,
                    left: '26%',
                    top: '26%',
                    backgroundColor: `hsl(${Math.round(deg)}, 100%, 50%)`
                }}
                onStartShouldSetResponder={(event) => {
                    // console.log({
                    //     boxTarget: event.target,
                    //     boxNativeTarget: event.nativeEvent.target,
                    //     id: event.nativeEvent.identifier
                    // })
                    return true;
                }}
                onMoveShouldSetResponder={(event) => {
                    return true;
                }}
                onResponderStart={(event) => {
                    setSecondX(event.nativeEvent.locationX);
                    setSecondY(event.nativeEvent.locationY);
                }}
                onResponderMove={(event) => {
                    setSecondX(event.nativeEvent.locationX);
                    setSecondY(event.nativeEvent.locationY);
                }}
                onLayout={(event) => {
                    setSecondSize(event.nativeEvent.layout.height)
                }}>
                <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        zIndex: 3
                    }} />
                <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                    start={[1, 0]}
                    end={[0, 0]}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                    }} />
                {/* second dot */}
                <View
                    style={{
                        position: "absolute",
                        width: "20%",
                        aspectRatio: 1,
                        borderColor: "#fff",
                        borderRadius: 100,
                        borderWidth: 5,
                        backgroundColor: `hsl(${Math.round(deg)}, ${saturation}%, ${lightness}%)`,
                        top: secondY - (secondDotSize / 2),
                        left: secondX - (secondDotSize / 2),
                        zIndex: 4

                    }}
                    onLayout={(event) => {
                        secondDotSize === 1 && setSecondDotSize(event.nativeEvent.layout.height);
                    }}
                    onStartShouldSetResponder={() => false}
                    onMoveShouldSetResponder={() => false} />
            </View>
            {/* <Column>
                <Row>
                    <View 
                        style={{
                            width: '50%',
                            height: '10%',
                            backgroundColor: `hsl(${Math.round(deg)}, ${saturation}%, ${lightness}%)`
                        }}
                    />
                </Row>
                <FullButton onPress={() => props.onConfirm(`hsl(${Math.round(deg)}, ${saturation}%, ${lightness}%)`)}>
                    <P>select</P>
                </FullButton>
            </Column> */}
        </View>
    );
}