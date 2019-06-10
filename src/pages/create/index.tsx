import Create from './create';
import Manual from './manual';
import { createStackNavigator } from 'react-navigation';
import { LargeHeaderStyle, LargeHeaderTitleStyle, LargeHeaderSideContainerStyle, LargeHeaderTitleContainerStyle } from '../../common/bits';

export default createStackNavigator({
    Create: {
        screen: Create,
        navigationOptions: {
            title: "Outfits",
            headerStyle: LargeHeaderStyle,
            headerTitleStyle: LargeHeaderTitleStyle,
            headerTitleContainerStyle: LargeHeaderTitleContainerStyle,
            headerLeftContainerStyle: LargeHeaderSideContainerStyle
        }
    },
    Manual: {
        screen: Manual,
        navigationOptions: {
            title: "Create Outfit"
        }
    }
})