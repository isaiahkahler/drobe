import * as React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, TouchableHighlight } from 'react-native';
import { Page } from '../components/page';
import { commonStyles } from '../components/styles';
import { createStackNavigator } from 'react-navigation';
import { Settings } from './settings';
import { Icon } from '../components/icon';

interface ProfileProps {
  navigation: any;
}
interface ProfileState {}

class Profile extends React.Component<ProfileProps, ProfileState> {

  
  static navigationOptions = ({ navigation }: any) => {
    return {
      headerTitle: 'Profile',
      headerRight: (
        <TouchableHighlight onPress={() => navigation.navigate('Settings')}>
          <View style={styles.settingsButton}>
          <Icon icon="Settings"></Icon>
          </View>
        </TouchableHighlight>
      )
    };
  };

  _storeData = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  };

  render() {
    return (
      <Page>
        <View style={commonStyles.body}>
          <Text>Profile!</Text>
          <Button
            onPress={() => this.props.navigation.navigate('Settings')}
            title="Go to settings"
          />
        </View>
      </Page>
    );
  }
}

export const ProfileStack = createStackNavigator(
  {
    Profile: { screen: Profile },
    Settings: { screen: Settings }
  },
  { initialRouteName: 'Profile' }
);

const styles = StyleSheet.create({
  settingsButton: {
    // marginRight: '5%'
  }
});
