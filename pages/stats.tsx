import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Page } from '../components/page';
import {commonStyles} from '../components/styles';
import { createStackNavigator } from 'react-navigation';

interface StatsProps {}
interface StatsState {}

class Stats extends React.Component<StatsProps, StatsState>{
  static navigationOptions = {
    title: 'Stats',
  };
  render() {
    return (
      <Page><View style={commonStyles.body}><Text>Stats!</Text></View></Page>
    );
  }
}

export const StatsStack = createStackNavigator(
  {Stats: Stats},
  {initialRouteName: 'Stats'}
);