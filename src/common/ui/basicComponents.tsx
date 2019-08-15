import React, { useEffect, useMemo, Children } from 'react';
import styled from 'styled-components/native';
import { Dimensions, View, StyleProp, ViewStyle, TouchableHighlight, Platform, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const isIos = Platform.OS === "ios";

export const width = Dimensions.get('screen').width;

export const height = Dimensions.get('screen').height;

export const drobeAccent = '#8C64ff';

export const successColor = '#23D160';

export const dangerColor = '#FF3860';

export const grey = '#f3f3f5'

export const iconSize = 35;

export const P = styled.Text`
    font-size: 20;
`;

export const PC = styled.Text`
    font-size: 20;
    text-align: center;
`;

export const Header = styled.Text`
    font-size: 20;
    font-weight: 500;
`;

export const Label = styled.Text`
    font-size: 16;
`;

export const PageContainer = styled.View`
    height: 100%;
    width: 100%;
`;

export const PageLayout = styled.View`
    flex: 1;
    background-color: #fff;
    width: 100%;
    padding: 5%;
`;

export const ScrollPageLayout = styled.ScrollView`
    flex: 1;
    background-color: #fff;
    width: 100%;
    padding-horizontal: 5%;
`;


export const ModalView = styled.View`
    position: absolute;
    z-index: 1;
    flex: 1;
    background-color: rgba(0,0,0,0.1);
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

export const ModalBody = styled.View`
    position: absolute;
    width: 90%;
    min-height: 50%;
    background-color: #fff;
    border-radius: 10;
    padding: 5%;
`;

export const HorizontalSpace = styled.View`
    height: ${0.05 * width};
`;

export const Center = styled.View`
    justify-content: center;
    align-items: center;
`;

export const Row = styled.View`
    flex-direction: row;
    justify-content: space-evenly;
`;

export const Column = styled.View`
    flex-direction: column;
    justify-content: space-evenly;
`;

export function Touchable(props: { children?: React.ReactNode, onPress?: () => void, style?: StyleProp<ViewStyle> }) {
    return (
        <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' onPress={props.onPress} style={props.style}>
            {props.children}
        </TouchableHighlight>
    );
}

export const FullButton = styled(Touchable)`
    background-color: ${grey};
    padding: 5px;
    margin-vertical: ${0.025 * width}px;
    border-radius: 7px;
    /* font-size: 20px; */
    width: 100%;
`;

export const CircleButtonStyle = styled(Touchable)`
    padding: 5px;
    border-radius: 100;
    aspect-ratio: 1;
    background-color: ${grey};
    justify-content: center;
    align-items: center;
`;

interface CircleButtonProps {
    children?: React.ReactNode,
    style?: ViewStyle,
    selected?: boolean,
    defaultHeight?: boolean,
    onPress?: () => void,
}

export function CircleButton(props: CircleButtonProps) {
    return (
        <CircleButtonStyle style={[{height: !!props.defaultHeight ? 45 : undefined, backgroundColor: !!props.selected ? drobeAccent : grey}, props.style]} onPress={props.onPress}>
            {props.children}
        </CircleButtonStyle>
    );
}

export const FullInput = styled.TextInput`
    background-color: ${grey};
    padding: 5px;
    margin-bottom: ${0.025 * width};
    border-radius: 7;
    font-size: 20;
    width: 100%;
`;

export const HR = styled.View`
    border-bottom-color: #ccc;
    border-bottom-width: 1px;
`;

const TileContainer = styled(Touchable)`
    width: 50%;
    aspect-ratio: 1;
    background-color: ${grey};
    /* border-radius: 25; */
    border-radius: 20;
`;

const TileChild = styled.View`
    flex: 1;
    height: 100%;
    padding: 5%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export function Tile(props: { children?: React.ReactNode, onPress?: () => void }) {
    return (
        <TileContainer onPress={props.onPress}>
            <TileChild>
                {props.children}
            </TileChild>
        </TileContainer>
    );
}

const FloatingBottomButtonStyle = styled(Touchable)`
    position: absolute;
    bottom: ${0.05 * width};
    /* padding: 5px; */
    border-radius: 50px;
    align-self: center;
    shadow-radius: 10;
    shadow-color: #ccc;
    shadow-opacity: 0.5;
`;

export function FloatingBottomButton(props: { text: string, allowed?: boolean, icon?: boolean, onPress: () => void }) {

    return (
        <FloatingBottomButtonStyle onPress={props.onPress} style={{
            backgroundColor: props.allowed === undefined ? "#ddd" : props.allowed ? successColor : '#ddd',
            padding: props.allowed === undefined ? 10 : props.allowed && props.icon ? 5 : 10,
        }}>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
            }}>
                {props.icon && props.allowed && <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={30} style={{ paddingRight: 5, paddingTop: 5 }} color='#fff' />}
                <P style={{ color: props.allowed === undefined ? "#000" : (props.allowed ? "#fff" : "#bbb") }}>{props.text}</P>
            </View>
        </FloatingBottomButtonStyle>
    );
}

export const LargeHeaderTitleStyle = {
    position: "absolute",
    fontWeight: "bold",
    fontSize: 35,
    left: 0,
    bottom: 10
};

export const LargeHeaderTitleContainerStyle = {
    position: "absolute",
    left: 0,
}

export const LargeHeaderStyle = isIos ? {
    height: 100,
    backgroundColor: "#fff",
    borderBottomColor: "#D4D4D5",
    borderBottomWidth: 1,
} : {
        height: 100,
        backgroundColor: "#fff",
    };

export const LargeHeaderSideContainerStyle = {
    position: "absolute",
    height: 50
};



interface ModalProps {
    children?: React.ReactNode, 
    onClose: () => void,
    closeButton?: boolean,
    title?: string,
}

const AnimatedModalView = Animated.createAnimatedComponent(ModalView);

export function Modal(props: ModalProps) {
    const transparency = new Animated.Value(0);
    useEffect(() => {
        Animated.spring(transparency, { toValue: 1 }).start();
    }, []);

    const closeModal = useMemo(() => {
        return () => {
            Animated.spring(transparency, { toValue: 0 }).start(() => props.onClose());
        }
    }, []);

    return (
        <AnimatedModalView style={{ opacity: transparency }} onPress={() => {
            !!props.closeButton && closeModal();
        }}>
            <ModalBody>
                {!!props.title && 
                <View>
                    <Header style={{textAlign: 'center'}}>{props.title}</Header>
                    <HorizontalSpace />
                </View>
                }
                    {props.children}
                {!!props.closeButton && <CircleButtonStyle onPress={() => closeModal()} style={{
                    position: 'absolute',
                    top: 0.05 * width,
                    left: 0.05 * width,
                }}>
                    <MaterialCommunityIcons name='close' size={20} color={dangerColor} />
                </CircleButtonStyle>}
            </ModalBody>
        </AnimatedModalView>
    );
}
