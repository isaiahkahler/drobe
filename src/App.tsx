import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Add from './pages/add';
import Create from './pages/create';
import Library from './pages/library';
import { drobeAccent, iconSize } from './common/data/constants';

const app = createBottomTabNavigator({
    Create: {
        screen: Create,
        navigationOptions: {
            tabBarIcon: ({tintColor}: {tintColor: string}) => <MaterialCommunityIcons name="pencil" size={iconSize} color={tintColor} />
        },

    },
    Add: {
        screen: Add,
        navigationOptions: {
            tabBarIcon: ({tintColor}: {tintColor: string}) => <MaterialCommunityIcons name="plus-circle" size={iconSize} color={tintColor} />
        },
    },
    Library: {
        screen: Library,
        navigationOptions: {
            tabBarIcon: ({tintColor}: {tintColor: string}) => <MaterialCommunityIcons name="tshirt-crew" size={iconSize} color={tintColor} />
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