import Add from './add';
import Define from './define';
import { createStackNavigator } from 'react-navigation';
import { LargeHeaderStyle, LargeHeaderTitleStyle, LargeHeaderSideContainerStyle, LargeHeaderTitleContainerStyle } from '../../common/bits';

export default createStackNavigator({
    Add: {
        screen: Add,
        navigationOptions: {
            title: "Add Clothes",
            headerStyle: LargeHeaderStyle,
            headerTitleStyle: LargeHeaderTitleStyle,
            headerTitleContainerStyle: LargeHeaderTitleContainerStyle,
            headerLeftContainerStyle: LargeHeaderSideContainerStyle
        }
    },
    Define: {
        screen: Define,
        navigationOptions: {
            title: "Define Attributes"
        }
    }
});