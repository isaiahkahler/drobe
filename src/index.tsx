import React from 'react';
import { NativeModules } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Add from './pages/add';
import Create from './pages/create';
import Library from './pages/library';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { accentColor, iconSize } from './components/constants';
import { StoreProvider } from 'easy-peasy';
import store from './components/store';

const Tab = createBottomTabNavigator();


const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default function App() {
    return (
        <StoreProvider store={store}>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            if (route.name === 'Add') {
                                if (focused)
                                    return <MaterialCommunityIcons name="plus-circle" size={iconSize} color={accentColor} />;
                                else
                                    return <MaterialCommunityIcons name="plus-circle-outline" size={iconSize} color="grey" />;
                            }
                            if (route.name === 'Create') {
                                if (focused)
                                    return <MaterialCommunityIcons name="pencil" size={iconSize} color={accentColor} />;
                                else
                                    return <MaterialCommunityIcons name="pencil" size={iconSize} color="grey" />;
                            }
                            if (route.name === 'Library') {
                                if (focused)
                                    return <MaterialCommunityIcons name="tshirt-crew" size={iconSize} color={accentColor} />;
                                else
                                    return <MaterialCommunityIcons name="tshirt-crew" size={iconSize} color="grey" />;
                            }

                        },
                    })}
                    tabBarOptions={{
                        showLabel: false
                    }}>
                    <Tab.Screen name="Create" component={Create} />
                    <Tab.Screen name="Add" component={Add} initialParams={{ newUser: true }} />
                    <Tab.Screen name="Library" component={Library} />
                </Tab.Navigator>
            </NavigationContainer>
        </StoreProvider>
    );
}

