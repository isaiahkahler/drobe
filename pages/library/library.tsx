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
import { Item, Storage, Page } from '../../components/formats';
import { ItemView } from './itemView';
import { Define } from '../add/define';
import { SortSidebar } from './sortSidebar';
import { unwatchFile } from 'fs';
import { string } from 'prop-types';

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
  // modalFadeInAnimation: Animated.Value;
  selections: Array<{ type: "hide" | "order", name: string, value: any }>;
}

class Library extends React.Component<LibraryProps, LibraryState> {
  constructor(props: LibraryProps) {
    super(props);
    this.state = {
      pages: [],
      pagesShown: 1,
      drawerOpen: false,
      showModal: false,
      // modalFadeInAnimation: new Animated.Value(0),
      selections: []
    };
  }

  static navigationOptions = {
    title: 'Library'
  };

  componentDidMount = async () => {
    let allPages = await Storage.getAllPages();
    this.setLibrary(allPages)
  };

  // showModal = () => {
  //   this.setState({ showModal: true });
  //   Animated.spring(this.state.modalFadeInAnimation, {
  //     toValue: 1
  //   }).start();
  // };

  // hideModal = () => {
  //   Animated.spring(this.state.modalFadeInAnimation, {
  //     toValue: 0
  //   }).start(() => {
  //     this.setState({ showModal: false });
  //   });
  // };

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
    if (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
      nativeEvent.contentSize.height - paddingToBottom) {
      if (!!callback) {
        callback();
      }
    }
  }

  sortBySelections = async () => {
    this.setLibrary(await Storage.sortBy(this.state.selections));
  }

  setLibrary = (pages: Page[]) => {
    this.setState({pages: pages, pagesShown: 1})
  }

  onSelect = async (type: "hide" | "order", name: string, value: number) => {
    this.hideSidebar();
    // console.log(type, name, value)

    let selectionIndex = this.state.selections.findIndex((selection) => {
      return selection.name === name;
    });


    if (selectionIndex === -1) { //if selection does not exist
      await this.setState(previousState => ({
        ...previousState,
        selections: [...previousState.selections, { type: type, name: name, value: value }]
      }), () => {
        this.sortBySelections()
      });
    } else {
      await this.setState(previousState => ({
        ...previousState,
        selections: [...previousState.selections.slice(0, selectionIndex), {type: type, name: name, value: value}, ...previousState.selections.slice(selectionIndex + 1, previousState.selections.length)]
      }), () => {
        this.sortBySelections();
      })
    }
    
  }

  search = () => {

  }

  removePill = (index) => {
    this.setState(previousState => ({
      ...previousState,
      selections: [...previousState.selections.slice(0, index), ...previousState.selections.slice(index + 1, previousState.selections.length)]
    }), () => {
      this.sortBySelections();
    })
  }

  removeAllPills = () => {
    this.setState({selections: []});
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
                    pageIndex: pageIndex,
                    itemIndex: itemIndex,
                    item: this.state.pages[pageIndex].items[itemIndex]
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

  hideSidebar = () => {
    this._drawer.current.scrollTo({x: 0, animated: true})
  }

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

    return (
      <PageLayout>
        <ScrollView horizontal pagingEnabled ref={this._drawer}>
          <View style={styles.page}>
            <ScrollView onScroll={({ nativeEvent }) => this.hasScrolledToEnd(nativeEvent, this.loadMore)} scrollEventThrottle={400}>
              <View style={styles.topContainerSpacer} />
              {this.getTiles()}
              {/* <View style={styles.button}>
                <Button onPress={this.loadMore} title="reload" />
              </View> */}
            </ScrollView>
            <View style={styles.fixedTopContainer}>
              <View style={styles.searchAndSortContainer}>
                <View style={styles.searchContainer}>
                  <TextInput style={[styles.search, commonStyles.h2]} placeholder="search" onSubmitEditing={this.search} />
                </View>
                <TouchableHighlight
                  onPress={() => this.toggleSidebar()}
                  underlayColor="rgba(0,0,0,0.1)"
                  style={styles.sortButton}
                >
                  <Text style={commonStyles.h2}>sort</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.pillContainer}>
                {/* <View style={styles.pill}>
                  <Text style={commonStyles.pb}>hi</Text>

                </View> */}
                {this.state.selections.map((item, index) => {
                  return(<TouchableHighlight style={styles.pill} key={index} onPress={() => this.removePill(index)}>
                    <Text style={commonStyles.pb}>{item.value}</Text>
                  </TouchableHighlight>);
                })}
              </View>
            </View>
          </View>

          {/* <View style={styles.sidebar}> */}
          <View>
            <SortSidebar onSelect={(type, name, value) => this.onSelect(type, name, value)} />
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
      <View style={{
        marginHorizontal: '5%',
        marginTop: '5%'
      }}>
      <TouchableHighlight
      underlayColor="rgba(0,0,0,0)"
      // onPress={() => {
      // props.openModal(props.pageIndex, props.itemIndex);
      // }}
      onPress={() => props.openItemScreen(props.pageIndex, props.itemIndex)}
      // style={{
        // margin: '5%',
        // flexDirection: 'column',
        // justifyContent: 'space-evenly',
        // alignItems: 'center'
      // }}
    >
      <React.Fragment>
        <Image
          source={{ uri: props.uri }}
          style={styles.tileImage as any}
        />
      </React.Fragment>
    </TouchableHighlight>
        <Text style={[commonStyles.pb, commonStyles.centerText, {width: width * 0.4,}]}>
          {props.name}
        </Text>
      </View>
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
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000'
  },
  button: {
    width: '50%'
  },
  fixedTopContainer: {
    position: 'absolute',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    zIndex: 5
  },
  searchAndSortContainer: {
    flexDirection: "row"
  },
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
  sortButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    padding: 5,
    marginLeft: 0,
    margin: 10
  },
  pillContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    // backgroundColor: "#ff0000",
    // height: 50,
    paddingLeft: 5,
    paddingRight: 5,
    marginHorizontal: 5,
  },
  pill: {
    // flex: 1,
    borderRadius: 25,
    borderWidth: 2,
    padding: 3,
    marginHorizontal: 5,
    backgroundColor: "#fff"
    // height: 50,
    // backgroundColor: "#00ff00"
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
