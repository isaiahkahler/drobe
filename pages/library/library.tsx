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
  NativeScrollEvent,
  Alert
} from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import { createStackNavigator } from 'react-navigation';
import { Item, Page } from '../../components/formats';
import { Storage } from '../../components/storage';
import { ItemManager } from '../../components/itemManager';
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
  library: Array<Page>;
  pages: Array<Page>;
  pagesShown: number;
  selectionMode: "one" | "many" | "none";
  greyMode: boolean;
  greyItems: Array<{ class?: string, type?: string, cover?: number, date?: number, id?: number }>;
  drawerOpen: boolean;
  return: { addItem: (item: Item) => void, removeItem: (date: number) => void, replaceItem: (date: number, item: Item) => void };
  sortFilters: Array<{ type: "hide" | "order", name: string, value: any }>;
  searchValue: string;
}

export class Library extends React.Component<LibraryProps, LibraryState> {
  constructor(props: LibraryProps) {
    super(props);
    this.state = {
      library: [],
      pages: [],
      pagesShown: 1,
      selectionMode: "none",
      greyMode: false,
      greyItems: [],
      return: null,
      drawerOpen: false,
      sortFilters: [],
      searchValue: ''
    };
  }

  static navigationOptions = {
    title: 'Library'
  };

  componentDidMount() {
    this.loadLibrary()
    const navigation = this.props.navigation;
    if (navigation.state.params.hasOwnProperty('selectionMode')) {
      this.setState({ selectionMode: navigation.state.params.selectionMode });
    }
    if (navigation.state.params.hasOwnProperty('filters')) {
      this.setState({ greyItems: navigation.state.params.filters });
    }
    if (navigation.state.params.hasOwnProperty('greyMode')) {
      this.setState({ greyMode: navigation.state.params.greyMode });
    }
    if (navigation.state.params.hasOwnProperty('return')) {
      this.setState({ return: navigation.state.params.return })
    }
  }

  loadLibrary = async () => {
    let allPages = await ItemManager.getAllPages();
    this.setPages(allPages)
    this.setState({ library: allPages });
  };

  //review: do you need to reload on every focus?
  willFocusSubscription = this.props.navigation.addListener(
    'willFocus',
    payload => {
      // console.log('willFocus');
      this.loadLibrary()
    }
  );

  componentWillUnmount = () => {
      // console.log("unmount library")
      this.willFocusSubscription.remove();
  }

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

  sortByFilters = async () => {
    this.setPages(await ItemManager.sortBy(this.state.sortFilters));
  }

  setPages = (pages: Page[]) => {
    this.setState({ pages: pages, pagesShown: 1 })
  }

  //review: rename to sort filters instead of select
  onSelect = async (type: "hide" | "order", name: string, value: number) => {
    this.hideSidebar();
    // console.log(type, name, value)

    let selectionIndex = this.state.sortFilters.findIndex((selection) => {
      return selection.name === name;
    });


    if (selectionIndex === -1) { //if selection does not exist
      await this.setState(previousState => ({
        ...previousState,
        sortFilters: [...previousState.sortFilters, { type: type, name: name, value: value }]
      }), () => {
        this.sortByFilters()
      });
    } else {
      await this.setState(previousState => ({
        ...previousState,
        sortFilters: [...previousState.sortFilters.slice(0, selectionIndex), { type: type, name: name, value: value }, ...previousState.sortFilters.slice(selectionIndex + 1, previousState.sortFilters.length)]
      }), () => {
        this.sortByFilters();
      })
    }

  }

  search = (text) => {
    this.setState({ searchValue: text }, async () => ItemManager.search(this.state.searchValue, this.state.library, (pages) => this.setPages(pages)))

  }

  removePill = (index) => {
    this.setState(previousState => ({
      ...previousState,
      sortFilters: [...previousState.sortFilters.slice(0, index), ...previousState.sortFilters.slice(index + 1, previousState.sortFilters.length)]
    }), () => {
      this.sortByFilters();
    })
  }

  removeAllPills = () => {
    this.setState({ sortFilters: [] });
  }

  getTiles() {
    return this.state.pages.slice(0, this.state.pagesShown).map((page, pageIndex) => {
      return (
        <View key={pageIndex} style={styles.container}>
          {page.items.map((item, itemIndex) => {
            const isSameClass = this.state.greyItems.findIndex(e => e.class === item.class) !== -1;
            const isSameType = this.state.greyItems.findIndex(e => e.type === item.type) !== -1;
            const isSameItem = this.state.greyItems.findIndex(e => e.date === item.date) !== -1;
            const isGreyItem = this.state.greyMode && (isSameClass || isSameType || isSameItem);
            return (
              <View style={{
                marginHorizontal: '5%',
                marginTop: '5%'
              }} key={itemIndex}>
                <TouchableHighlight
                  underlayColor="rgba(0,0,0,0)"
                  onPress={() => {
                    if (this.state.selectionMode === "one") {
                      if (isGreyItem) {
                        if (isSameItem) {
                          //say the user has already picked this item. ask to remove it?
                          Alert.alert(
                            'This item is already in your outfit',
                            'Would you like to remove it?',
                            [
                              { text: 'remove', onPress: () => this.state.return.removeItem(item.date) },
                              { text: 'cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
                            ],
                            { cancelable: false }
                          )
                        } else if (isSameClass || isSameType) {
                          //the user has already picked an item for that class. replace?

                          /*
                          ok what do we know?
                          if its an item of the same class or type...?
                          the ID of the matching thing.... ???????

                          */


                          //   if(isSameClass) {
                          //   let itemToReplace = 
                          //   this.state.greyItems[this.state.greyItems.findIndex(e => e.class === item.class)].id;
                          // } else {
                          //   let itemToReplace = this.state.greyItems[this.state.greyItems.findIndex(e => e.type === item.type)].id;
                          //   }
                          let greyID = this.state.greyItems.find(e => e.class === item.class || e.type === item.type).id;
                          let greyItem: Item;
                          this.state.library.forEach((value, index) => {
                            value.items.forEach(value => {
                              if (value.date === greyID) {
                                greyItem = value;
                              }
                            })
                          })

                          Alert.alert(
                            'This item overlaps',
                            `Would you like to replace ${greyItem.name} with ${item.name}?`,
                            [
                              //item.date of item to REMOVE
                              { text: 'replace', onPress: () => this.state.return.replaceItem(greyItem.date, item) },
                              { text: 'cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
                            ],
                            { cancelable: false }
                          )
                        }
                      } else {
                        this.state.return.addItem(this.state.pages[pageIndex].items[itemIndex]);
                      }
                    } else if (this.state.selectionMode === "many") {
                    } else {
                      this.props.navigation.navigate('ItemView', {
                        title: this.state.pages[pageIndex].items[itemIndex].name,
                        pageIndex: pageIndex,
                        itemIndex: itemIndex,
                        item: this.state.pages[pageIndex].items[itemIndex],
                        editMode: true
                      });
                    }
                  }}
                >
                  <View>




                    {isGreyItem ? (

                      <React.Fragment>
                        <Image source={{ uri: item.photoURI }} style={[styles.tileImage as any, { tintColor: 'gray', borderColor: "#ff0000" }]} />
                        <Image source={{ uri: item.photoURI }} style={[styles.tileImage as any, { position: 'absolute', opacity: 0.3, borderColor: "#ff0000" }]} />
                      </React.Fragment>
                    ) : (
                        <Image
                          source={{ uri: item.photoURI }}
                          style={[styles.tileImage as any]}
                        />
                      )
                    }
                  </View>
                </TouchableHighlight>
                <Text style={[commonStyles.pb, commonStyles.centerText, { width: width * 0.4, }]}>
                  {item.name}
                </Text>
              </View>
            );
          })}
        </View>
      );
    });
  }

  private _drawer = React.createRef<ScrollView>();

  hideSidebar = () => {
    this._drawer.current.scrollTo({ x: 0, animated: true })
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
            </ScrollView>
            <View style={styles.fixedTopContainer}>
              <View style={styles.searchAndSortContainer}>
                <View style={styles.searchContainer}>
                  <TextInput style={[styles.search, commonStyles.h2]} placeholder="search" onChangeText={text => this.search(text)} value={this.state.searchValue} />
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
                {this.state.sortFilters.map((item, index) => {
                  return (<TouchableHighlight style={styles.pill} key={index} onPress={() => this.removePill(index)}>
                    <Text style={commonStyles.pb}>{item.value}</Text>
                  </TouchableHighlight>);
                })}
              </View>
            </View>
          </View>

          <View>
            <SortSidebar onSelect={(type, name, value) => this.onSelect(type, name, value)} />
          </View>
        </ScrollView>
      </PageLayout>
    );
  }
}


export const LibraryStack = createStackNavigator(
  {
    Library: { screen: Library },
    ItemView: { screen: ItemView },
    Edit: { screen: Define }
  },
  {
    initialRouteName: 'Library',
    initialRouteParams: { selectionMode: false }
  }
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
  greyOverlay: {
    position: "absolute",
    width: "100%",
    height: '100%',
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25
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
    paddingLeft: 5,
    paddingRight: 5,
    marginHorizontal: 5,
  },
  pill: {
    borderRadius: 25,
    borderWidth: 2,
    padding: 3,
    marginHorizontal: 5,
    backgroundColor: "#fff"
  },
  topContainerSpacer: {
    height: 20,
    width: '100%',
    margin: 15
  }
});
