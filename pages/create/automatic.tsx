import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import  ProgressCircle from 'react-native-progress-circle';

interface AutomaticProps {

}

interface AutomaticState {

}

export class Automatic extends React.Component <AutomaticProps, AutomaticState> {
    static navigationOptions = {
      title: 'Create Automatically'
    };


    render() {
        return(
            <PageLayout scroll padding>
            <View style={{flex:1, alignItems: "center"}}> 
                <ProgressCircle
                    color="#c964ff"
                    bgColor="#fff"
                    percent={95}
                    radius={80}
                    
                    borderWidth={10}
                    outerCircleStyle={{backgroundColor: "#fff"}}
                >
                    <Text style={[commonStyles.h1, commonStyles.bold]}>95</Text>
                </ProgressCircle>
            </View>
            </PageLayout>
        );
    }
}