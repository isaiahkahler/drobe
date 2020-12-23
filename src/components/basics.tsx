import React, { Props, PropsWithChildren } from 'react';
import { View, TouchableHighlight, Text, StyleSheet, TouchableHighlightProps, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { width, grey, accentColor, successColor } from './constants';

export const textStyles = StyleSheet.create({
    paragraph: {
        fontSize: 20
    },
    header: {
        fontSize: 20,
        fontWeight: '500'
    },
    label: {
        fontSize: 16
    },
    centered: {
        textAlign: 'center'
    },

});

export const pageStyles = StyleSheet.create({
    pageLayout: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        padding: '5%'
    },
    scrollPageLayout: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        paddingHorizontal: '5%'
    },
    paddedSpace: {
        height: 0.05 * width
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    column: {
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    }
});


export function Touchable(props: PropsWithChildren<TouchableHighlightProps>) {
    return (
        <TouchableHighlight underlayColor='rgba(0,0,0,0.2)' onPress={props.onPress} style={props.style}>
            {props.children}
        </TouchableHighlight>
    );
}

export const touchableStyles = StyleSheet.create({
    fullButton: {
        backgroundColor: grey,
        padding: 5,
        marginVertical: 0.025 * width,
        borderRadius: 7,
        width: '100%'
    },
    circleButton: {
        padding: 5,
        borderRadius: 100,
        aspectRatio: 1,
        backgroundColor: grey,
        justifyContent: 'center',
        alignItems: 'center'
    },
    floatingBottomButton: {
        position: 'absolute',
        bottom: 0.05 * width,
        borderRadius: 50,
        alignSelf: 'center',
        shadowRadius: 10,
        shadowColor: '#ccc',
        shadowOpacity: 0.5
    }
});

export function CircleButton (props: PropsWithChildren<TouchableHighlightProps> & {selected?: boolean}) {

    const propStyles  = {
        backgroundColor: props.selected ? accentColor : grey,
    };

    return (
        <Touchable style={[touchableStyles.circleButton, props.style, propStyles]} onPress={props.onPress}>
            {props.children}
        </Touchable>
    );
}

export const inputStyles = StyleSheet.create({
    fullInput: {
        backgroundColor: grey,
        padding: 5,
        marginBottom: 0.025 * width,
        borderRadius: 7,
        fontSize: 20,
        width: '100%'
    }
});



export function FloatingBottomButton(props: { text: string, allowed?: boolean, icon?: boolean, onPress: () => void }) {

    return (
        <Touchable onPress={props.onPress} style={[touchableStyles.floatingBottomButton, {
            backgroundColor: props.allowed === undefined ? "#ddd" : props.allowed ? successColor : '#ddd',
            padding: props.allowed === undefined ? 10 : props.allowed && props.icon ? 5 : 10,
        }]}>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
            }}>
                {props.icon && props.allowed && <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={30} style={{ paddingRight: 5, paddingTop: 5 }} color='#fff' />}
                <Text style={[textStyles.paragraph, { color: props.allowed === undefined ? "#000" : (props.allowed ? "#fff" : "#bbb") }]}>{props.text}</Text>
            </View>
        </Touchable>
    );
}
