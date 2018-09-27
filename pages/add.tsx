import * as React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage } from 'react-native';
import { Page } from '../components/page';
import {commonStyles} from '../components/styles';
import {createStackNavigator} from 'react-navigation';

interface AddProps {}
interface AddState {}

class Add extends React.Component<AddProps, AddState>{
  static navigationOptions = {
    title: 'Add',
  };

  _storeData = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  }

  render() {
    return (
      <Page><View style={commonStyles.body}><Text>Add!</Text></View></Page>
    );
  }
}

export const AddStack = createStackNavigator(
  {Add: Add},
  {initialRouteName: 'Add'}
);