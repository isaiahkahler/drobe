import * as React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import  ProgressCircle from 'react-native-progress-circle';


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
        return(
            <PageLayout scroll padding>
            <View style={{flex:1, alignItems: "center"}}> 
            </View>
            </PageLayout>
        );
    }
}