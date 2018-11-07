import * as React from 'react';
import { View, StyleSheet } from 'react-native';

interface NativeIconProps {
    type: "x"// | "pencil"
}

interface NativeIconState {

}

export class NativeIcon extends React.Component<NativeIconProps, NativeIconState> {

    render() {
        switch (this.props.type) {
            case "x":
                return (
                    <View style={[styles.icon, styles.round, styles.x]}>
                        <View style={styles.xLeft} />
                        <View style={styles.xRight} />
                    </View>
                );
                break;
            // case "pencil":
            //     return (
            //         <View style={[styles.icon, styles.round, styles.pencil]}>
            //             <View style={styles.pencilEraser} />
            //             <View style={styles.pencilStem} />
            //             <View style={styles.pencilTip} />
            //         </View>
            //     );
            //     break;
            default: return undefined;
        }

    }
}

const styles = StyleSheet.create({
    icon: {
        width: 50,
        height: 50,
    },
    round: {
        borderRadius: 100
    },
    x: {
        backgroundColor: "#ff0000",
        justifyContent: "center",
        alignItems: "center"
    },
    xLeft: {
        position: 'absolute',
        width: 5,
        height: 30,
        backgroundColor: "#000",
        transform: [
            {rotate: '45deg'}
        ]
    },
    xRight: {
        position: 'absolute',
        width: 5,
        height: 30,
        backgroundColor: "#000",
        transform: [
            {rotate: '315deg'}
        ]
    },
    // pencil: {
    //     backgroundColor: "#E9E9EF"
    // },
    // pencilEraser: {
    //     position: 'absolute',
    //     width: 5,
    //     height: 5,
    //     top: 15,
    //     left: 15,
    //     backgroundColor: "#000",
    //     transform: [
    //         {rotate: '315deg'}
    //     ]
    // },
    // pencilStem: {
    //     position: 'absolute',
    //     width: 5,
    //     height: 15,
    //     top: 20,
    //     left: 25,
    //     backgroundColor: "#000",
    //     transform: [
    //         {rotate: '315deg'}
    //     ]

    // },
    // pencilTip: {
    //     position: 'absolute',

    //     width: 0,
    //     height: 0,
    //     backgroundColor: 'transparent',
    //     borderStyle: 'solid',
    //     borderLeftWidth: 3,
    //     borderRightWidth: 3,
    //     borderBottomWidth: 5,
    //     top: 31.1,
    //     left: 31.3,
    //     borderLeftColor: 'transparent',
    //     borderRightColor: 'transparent',
    //     borderBottomColor: '#000',
    //     transform: [
    //             {rotate: '135deg'}
    //         ]
    // }
});