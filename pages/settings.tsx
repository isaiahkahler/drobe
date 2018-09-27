import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Page } from '../components/page';
import {commonStyles} from '../components/styles';
import { createStackNavigator } from 'react-navigation';

interface SettingsProps {}
interface SettingsState {}

class Settings extends React.Component<SettingsProps, SettingsState>{
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    return (
      <Page><View style={commonStyles.body}><Text>Settings!</Text></View></Page>
    );
  }
}

export const SettingsStack = createStackNavigator(
  {Settings: Settings},
  {initialRouteName: 'Settings'}
);