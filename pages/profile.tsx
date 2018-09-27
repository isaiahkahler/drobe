import * as React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage } from 'react-native';
import { Page } from '../components/page';
import {commonStyles} from '../components/styles';
import {createStackNavigator} from 'react-navigation';

interface ProfileProps {}
interface ProfileState {}

class Profile extends React.Component<ProfileProps, ProfileState>{
  static navigationOptions = {
    title: 'Profile',
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
      <Page><View style={commonStyles.body}><Text>Profile!</Text></View></Page>
    );
  }
}

export const ProfileStack = createStackNavigator(
  {Profile: Profile},
  {initialRouteName: 'Profile'}
);