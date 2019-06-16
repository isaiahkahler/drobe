import Add from './add';
import Define from './define';
import { createStackNavigator } from 'react-navigation';
import { LargeHeaderStyle, LargeHeaderTitleStyle, LargeHeaderSideContainerStyle, LargeHeaderTitleContainerStyle, PageContainer, PageLayout, P } from '../../common/ui/basicComponents';

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
},
{
   mode: 'modal' 
});
