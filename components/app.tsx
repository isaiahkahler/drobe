import * as React from 'react';
import { StyleSheet, Text, View, Button, Image, Platform} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { Create } from '../pages/create';
// import { LibraryStack } from '../pages/library';
import { StatsStack } from '../pages/stats';
import { AddStack } from '../pages/add';
import { SettingsStack } from '../pages/settings';
import { ProfileStack } from '../pages/profile';
import { Icon } from  '../components/icon';

// const LibraryStack = Platform.select({
//   ios: () => require('../pages/libraryIOS'),
//   android: () => require('../pages/libraryAndroid'),
// });

import { LibraryStack } from "../pages/libraryIOS";
import { LibraryStackAndroid } from '../pages/libraryAndroid';

//temp
// import {SortSidebar} from '../pages/library';
// import {Parent} from '../pages/library';
let App: any;
if(Platform.OS === 'ios') {

  App = createBottomTabNavigator({
    Create: { screen: Create },
    Library: { screen: LibraryStack },
    Add: { screen: AddStack },
    Stats: { screen: StatsStack },
    Profile: { screen: ProfileStack },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({focused}) => {
        const { routeName } = navigation.state;
        return <Icon icon={routeName} isAccent={focused} />
      }, 
    }),
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#8C64FF',
      inactiveTintColor: 'gray',
      activeBackgroundColor: '#ccc',
      inactiveBackgroundColor: "#fff",
      showLabel: false
    },
    animationEnabled: true,
    swipeEnabled: true,
    backBehavior: "initialRoute"
  }
  );
} else {
    App = createBottomTabNavigator({
      Create: { screen: Create },
      Library: { screen: LibraryStack },
      Add: { screen: AddStack },
      Stats: { screen: StatsStack },
      Profile: { screen: ProfileStack },
    },
    {
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({focused}) => {
          const { routeName } = navigation.state;
          return <Icon icon={routeName} isAccent={focused} />
        }, 
      }),
      tabBarPosition: 'bottom',
      tabBarOptions: {
        activeTintColor: '#8C64FF',
        inactiveTintColor: 'gray',
        activeBackgroundColor: '#ccc',
        inactiveBackgroundColor: "#fff",
        showLabel: false
      },
      animationEnabled: true,
      swipeEnabled: true,
      backBehavior: "initialRoute"
    }
    );

}


export default App;