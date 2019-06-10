import Library from './library';
import ItemView from './itemView';
import { createStackNavigator } from 'react-navigation';
import { LargeHeaderStyle, LargeHeaderTitleStyle, LargeHeaderSideContainerStyle, LargeHeaderTitleContainerStyle } from '../../common/bits';

export default createStackNavigator({
    Library: {
        screen: Library,
        navigationOptions: {
            title: "Library",
            headerStyle: LargeHeaderStyle,
            headerTitleStyle: LargeHeaderTitleStyle,
            headerTitleContainerStyle: LargeHeaderTitleContainerStyle,
            headerLeftContainerStyle: LargeHeaderSideContainerStyle
        }
    },
    ItemView: {
        screen: ItemView,
        navigationOptions: {
            title: "Item"
        }
    }
});