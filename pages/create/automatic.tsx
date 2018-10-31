import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';

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

            </PageLayout>
        );
    }
}