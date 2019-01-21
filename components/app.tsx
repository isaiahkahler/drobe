import * as React from 'react';
import { StyleSheet, Text, View, Button, Image, Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { Create, CreateStack } from '../pages/create/create';
// import { LibraryStack } from '../pages/library';
import { StatsStack } from '../pages/stats';
import { AddStack } from '../pages/add/add';
import { ProfileStack } from '../pages/profile';
import { Icon } from '../components/icon';

// import { LibraryStack } from '../pages/library/library';
import { LibraryStack } from '../pages/library/library2';

// let App: any;
// if(Platform.OS === 'ios') { } else {}

let App = createBottomTabNavigator(
  {
    Create: { screen: CreateStack },
    Library: { screen: LibraryStack },
    Add: { screen: AddStack },
    Stats: { screen: StatsStack },
    Profile: { screen: ProfileStack }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        return <Icon icon={routeName} isAccent={focused} />;
      }
    }),
    tabBarPosition: 'bottom',
    tabBarOptions: {
      //review: change this to use accent color const in styles
      activeTintColor: '#8C64FF',
      inactiveTintColor: 'gray',
      activeBackgroundColor: '#e9e9e9',
      inactiveBackgroundColor: '#fff',
      showLabel: true
    },
    animationEnabled: true,
    swipeEnabled: true,
    backBehavior: 'initialRoute'
  }
);

export default App;
