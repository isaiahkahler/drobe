import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  TouchableHighlight,
  ScrollView,
  TextInput,
  SectionList,
  Dimensions,
  Platform,
  TouchableNativeFeedback,
  Image,
  Animated,
  NativeScrollEvent
} from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import { createStackNavigator } from 'react-navigation';
import { getFormality, Item, Storage, Page } from '../../components/formats';
import { ItemView } from './itemView';
import { Define } from '../add/define';
import { SortSidebar } from './sortSidebar';
import { unwatchFile } from 'fs';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

interface LibraryProps {
  navigation: any;
}
interface LibraryState {
  // numberOfPages: number;
  pages: Array<Page>;
  pagesShown: number;
  drawerOpen: boolean;
  showModal: boolean;
  modalFadeInAnimation: Animated.Value;
}

class Library extends React.Component<LibraryProps, LibraryState> {
  constructor(props: LibraryProps) {
    super(props);
    this.state = {
      pages: [],
      pagesShown: 1,
      drawerOpen: false,
      showModal: false,
      modalFadeInAnimation: new Animated.Value(0)
    };
  }

  static navigationOptions = {
    title: 'Library'
  };

  componentDidMount = () => {
    this.getClothes();
  };

  showModal = () => {
    this.setState({ showModal: true });
    Animated.spring(this.state.modalFadeInAnimation, {
      toValue: 1
    }).start();
  };

  hideModal = () => {
    Animated.spring(this.state.modalFadeInAnimation, {
      toValue: 0
    }).start(() => {
      this.setState({ showModal: false });
    });
  };

  getClothes = async () => {
    let allPages = await Storage.getAllPages();
    this.setState({ pages: allPages })
  };

  recursiveLoadPages = async (pageNumber: number, numberOfPages: number) => {
    let page = await Storage.getPage(pageNumber);
    this.setState(
      previousState => ({
        ...previousState,
        pages: [...previousState.pages, page]
      }),
      () => {
        if (pageNumber < (numberOfPages - 1)) {
          this.recursiveLoadPages(pageNumber + 1, numberOfPages);
        }
      }
    );
  };

  loadMore = () => {
    if (this.state.pages.length > this.state.pagesShown) {
      this.setState(previousState => ({
        ...previousState,
        pagesShown: previousState.pagesShown + 1
      }))
    }
  };

  hasScrolledToEnd(nativeEvent: NativeScrollEvent, callback?: Function) {
    const paddingToBottom = 20;
    if ( nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
      nativeEvent.contentSize.height - paddingToBottom ) {
      if (!!callback) {
        callback();
      }
    }
  }

  getTiles() {
    //map data to tiles
    if (!this.state.pages) {
      return undefined;
    }
    return this.state.pages.slice(0, this.state.pagesShown).map((page, pageIndex) => {
      return (
        <View key={pageIndex} style={styles.container}>
          {page.items.map((item, itemIndex) => {
            return (
              <Tile
                key={itemIndex}
                uri={item.photoURI}
                name={item.name}
                pageIndex={pageIndex}
                itemIndex={itemIndex}
                openItemScreen={(pageIndex, itemIndex) => {
                  this.props.navigation.navigate('ItemView', {
                    title: this.state.pages[pageIndex].items[itemIndex].name,
                    page: pageIndex,
                    item: itemIndex
                  });
                }}
              >
              </Tile>
            );
          })}
        </View>
      );
    });
  }

  private _drawer = React.createRef<ScrollView>();

  toggleSidebar = () => {
    this._drawer.current.scrollToEnd();
    //problem!!! doesn't always work if user swipes left / right themselves
    // if (this.state.drawerOpen) {
    //   this._drawer.current.scrollTo({ x: 0, y: 0, animated: true });
    // } else {
    //   this._drawer.current.scrollToEnd();
    // }
    // this.setState(previousState => ({
    //   ...previousState,
    //   drawerOpen: !previousState.drawerOpen
    // }));
  };

  render() {
    if (!this.state.pages || this.state.pages.length === 0) {
      return <View style={{ flex: 1, alignContent: 'center', justifyContent: "center" }}><Text style={commonStyles.centerText}>No Items.</Text></View>
    }
    return (
      <PageLayout>
        <ScrollView horizontal pagingEnabled ref={this._drawer}>
          <View style={styles.page}>
            <ScrollView style={styles.scrollContainer} onScroll={({ nativeEvent }) => this.hasScrolledToEnd(nativeEvent, this.loadMore)} scrollEventThrottle={400}>
              <View style={styles.topContainerSpacer} />
              {this.getTiles()}
              {/* <View style={styles.button}>
                <Button onPress={this.loadMore} title="reload" />
              </View> */}
            </ScrollView>
            <View style={styles.fixedTopContainer}>
              <View style={styles.searchContainer}>
                <TextInput style={[styles.search, commonStyles.h2]} placeholder="search" />
              </View>
              <TouchableHighlight
                onPress={() => this.toggleSidebar()}
                underlayColor="rgba(0,0,0,0.1)"
                style={styles.sortButton}
              >
                <Text style={commonStyles.h2}>sort</Text>
              </TouchableHighlight>
            </View>
          </View>

          {/* <View style={styles.sidebar}> */}
          <View>
            <SortSidebar onSelect={(type, value) => { console.log("type", type, "value", value) }} />
          </View>
        </ScrollView>
      </PageLayout>
    );
  }
}

function Tile(props: {
  children?: any;
  uri: string;
  name: string;
  pageIndex: number;
  itemIndex: number;
  // openModal: Function;
  openItemScreen: Function;
}) {
  // return <View style={styles.tile}>{props.children}</View>;
  return (
    <TouchableHighlight
      underlayColor="rgba(0,0,0,0)"
      // onPress={() => {
      // props.openModal(props.pageIndex, props.itemIndex);
      // }}
      onPress={() => props.openItemScreen(props.pageIndex, props.itemIndex)}
      style={{
        margin: '5%',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center'
      }}
    >
      <React.Fragment>
        <Image
          source={{ uri: props.uri }}
          style={{
            width: width * 0.4,
            height: width * 0.4,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: '#000'
          }}
        />
        <Text style={[commonStyles.pb, { position: 'absolute', color: '#ccc', marginTop: 5 }]}>
          {props.name}
        </Text>
      </React.Fragment>
    </TouchableHighlight>
  );
}



export const LibraryStack = createStackNavigator(
  {
    Library: { screen: Library },
    ItemView: { screen: ItemView },
    Edit: { screen: Define }
  },
  { initialRouteName: 'Library' }
);

const styles = StyleSheet.create({
  page: {
    width: width
  },
  container: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  tile: {
    width: '40%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 25,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: '5%'
  },
  tileImage: {
    width: width * 0.35,
    height: width * 0.35
    // aspectRatio: 1
  },
  button: {
    width: '50%'
  },
  fixedTopContainer: {
    position: 'absolute',
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    zIndex: 5
  },
  scrollContainer: {},
  searchContainer: {
    flex: 1,
    width: '60%',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 5,
    margin: 10,
    backgroundColor: '#fff'
  },
  search: {
    flex: 1,
    height: 20
  },
  // sidebar: {
  //   width: Dimensions.get('screen').width * 0.8,
  //   padding: 10,
  //   backgroundColor: '#E9E9EF'
  // },
  sortButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    padding: 5,
    marginLeft: 0,
    margin: 10
  },
  topContainerSpacer: {
    height: 20,
    width: '100%',
    margin: 15
  },
  listItem: {},
  listSectionHeader: {},
  modalView: {
    position: 'absolute',
    width: width,
    height: height - 150, //review: subtract the height of the navbar! (and then some)
    flex: 1,
    zIndex: 5
  },
  modalTouchable: {
    flex: 1,
    width: '100%',
    // height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5%'
  },
  modal: {
    width: '100%',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    padding: '5%',
    flex: 1
    // flexDirection: 'row',
    // justifyContent: 'center'
  }
});
