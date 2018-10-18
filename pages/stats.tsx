import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Dimensions,
  TouchableHighlight,
  ScrollViewComponent,
  ScrollViewProperties,
  ScrollViewProps,
  Platform,
  TouchableNativeFeedback
} from 'react-native';
import { PageLayout } from '../components/page';
import { commonStyles } from '../components/styles';
import { createStackNavigator } from 'react-navigation';

interface StatsProps {}
interface StatsState {
  pageScrollable: boolean;
}

class Stats extends React.Component<StatsProps, StatsState> {
  constructor(props: StatsProps) {
    super(props);
    this.state = { pageScrollable: false };
  }
  static navigationOptions = {
    title: 'Stats'
  };

  _swiper = React.createRef<ScrollView>();
  _historySwiper = React.createRef<ScrollView>();

  scrollToEnd = () => {
    this._swiper.current.scrollToEnd();
  };

  scrollToStart = () => {
    this._swiper.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  setScrollable = (event: any) => {
    console.log(event);
    console.log(event.target);
  };

  initialScrollToEnd = () => {
    this._historySwiper.current.scrollToEnd();
  };

  render() {
    return (
      <View style={commonStyles.body}>
        <View style={styles.underHeader}>
          <TouchableHighlight onPress={() => this.scrollToStart()} underlayColor='rgba(0,0,0,0.1)' style={styles.underHeaderButton}>
            <Text style={commonStyles.h2}>history</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.scrollToEnd()} underlayColor='rgba(0,0,0,0.1)' style={styles.underHeaderButton}>
            <Text style={commonStyles.h2}>favorites</Text>
          </TouchableHighlight>
        </View>
        <ScrollView
          // scrollEnabled={this.state.pageScrollable}
          horizontal
          pagingEnabled
          style={styles.swiper}
          ref={this._swiper}
          showsHorizontalScrollIndicator={false}
        >
          <PageLayout>
            <View style={styles.page}>
              <ScrollView
                horizontal
                pagingEnabled
                style={styles.historySwiper}
                ref={this._historySwiper}
                scrollEnabled={true}
              >
                <View style={styles.fullCardContainer}>
                  <View style={styles.fullCard} />
                </View>
                <View style={styles.fullCardContainer}>
                  <View style={styles.fullCard} />
                </View>
              </ScrollView>
            </View>
          </PageLayout>
          <PageLayout>
            <View style={styles.page}>
              <Text>page 2</Text>
            </View>
          </PageLayout>
        </ScrollView>
      </View>
    );
  }
}

export const StatsStack = createStackNavigator({ Stats: Stats }, { initialRouteName: 'Stats' });

const styles = StyleSheet.create({
  underHeader: {
    flexDirection: 'row',
    width: '100%'
  },
  underHeaderButton: {
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '50%',
    height: 50
  },
  swiper: {
    flex: 1,
    width: '100%'
  },
  page: {
    flex: 1,
    width: Dimensions.get('screen').width
  },
  historySwiper: {
    flex: 1,
    width: '100%'
    // backgroundColor: "#ccc"
  },
  fullCardContainer: {
    // paddingHorizontal: "10%",
    // paddingVertical: "5%"
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: Dimensions.get('screen').width
  },
  fullCard: {
    flex: 1,
    width: '90%',
    height: '90%',
    // marginVertical: '5%',
    // marginHorizontal: '10%',
    // paddingHorizontal: "10%",
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 25
    // backgroundColor: "#ff0000"
  }
});
