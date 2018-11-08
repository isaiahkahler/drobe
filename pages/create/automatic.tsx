import * as React from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Dimensions } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import  ProgressCircle from 'react-native-progress-circle';
import { MaterialIcons } from '@expo/vector-icons';


const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;


interface AutomaticProps {
    navigation: any;
}

interface AutomaticState {

}

export class Automatic extends React.Component <AutomaticProps, AutomaticState> {
    static navigationOptions = {
      title: 'Create Automatically'
    };


    render() {
        console.log(width * 0.86 + width * 0.02 + width * 0.02)
        console.log(width * 0.9)
        return(
            <PageLayout>
            {/* <View style={{flex:1, alignItems: "center"}}> 

            </View> */}
            <ScrollView snapToInterval={width * 0.9} snapToAlignment="start" decelerationRate="fast" horizontal style={styles.scrollContainer}>
                {/* <Text style={[commonStyles.pb]}>some text some text some text some text some text some text some text some textsome text some text some text some text some text some text some text some textsome text some text some text some text some text some text some text some text</Text> */}
                <View style={styles.firstMargin} />
                {[0,1,2,3,4,5,6,7,8,9,0].map((item, index) => {
                    return <View key={index} style={styles.outfitContainer}><Text>item</Text></View>
                })}
            </ScrollView>
            {/* <View style={styles.iconContainer}> */}
                <View style={styles.floatingIcon}><MaterialIcons name='chevron-left' size={40} /></View>
                <View style={styles.floatingIcon}><MaterialIcons name='chevron-right' size={40} /></View>
            {/* </View> */}
            </PageLayout>
        );
    }
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        // flexDirection: "column",
        width: width,
        height: "100%",
        paddingVertical: width * 0.05
    },
    outfitContainer: {
        width: width * 0.86,
        marginHorizontal: width * 0.02,
        // flex: 1,
        // backgroundColor: "#E9E9E9",
        borderWidth: 2,
        borderRadius: 25
    },
    firstMargin: {
        width: width * 0.05
    },
    iconContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        // zIndex: 5

    },
    floatingIcon: {
        position: "absolute",
        top: (height * 0.5) - 50,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#e9e9e9",
        justifyContent: "center",
        alignItems: "center",
        // zIndex: 5
    }
});