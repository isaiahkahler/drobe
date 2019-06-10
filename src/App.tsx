import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { drobeAccent } from './common/ui/basicComponents';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Add from './pages/add';
import Create from './pages/create';
import Library from './pages/library';

const app = createBottomTabNavigator({
    Create: {
        screen: Create,
        navigationOptions: {
            tabBarIcon: ({tintColor}: {tintColor: string}) => <MaterialCommunityIcons name="pencil" size={35} color={tintColor} />
        },

    },
    Add: {
        screen: Add,
        navigationOptions: {
            tabBarIcon: ({tintColor}: {tintColor: string}) => <MaterialCommunityIcons name="plus-circle" size={35} color={tintColor} />
        },
    },
    Library: {
        screen: Library,
        navigationOptions: {
            tabBarIcon: ({tintColor}: {tintColor: string}) => <MaterialCommunityIcons name="tshirt-crew" size={35} color={tintColor} />
        },
    }
},
    {
        tabBarOptions: {
            activeTintColor: drobeAccent,
            inactiveTintColor: 'gray',
            showLabel: false
        },
    });

export default createAppContainer(app);