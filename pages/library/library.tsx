import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  TextInput,
  Dimensions,
  Image,
  NativeScrollEvent,
  Alert
} from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles, StyleConstants } from '../../components/styles';
import { createStackNavigator } from 'react-navigation';
import { Item, Page, ItemDefinitions, Filter } from '../../components/formats';
import { ItemManager } from '../../components/itemManager';
import { ItemView } from './itemView';
import { Define } from '../add/define';
import { SortSidebar } from './sortSidebar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { roundColor } from '../../components/helpers';

import { Sort } from '../../components/filter';

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
  greyFilters: {
    allowed: Filter,
    disallowed: Filter
  };
  drawerOpen: boolean;
  return: { setItem: (item: Item) => void, removeItem: (date: number) => void };
  sortFilters: Array<{ type: "hide" | "order", name: string, value: any }>;
  searchValue: string;
  topSpacerHeight: number;
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
      greyFilters: { allowed: { filter: [] }, disallowed: { filter: [] } },
      return: null,
      drawerOpen: false,
      sortFilters: [],
      searchValue: '',
      topSpacerHeight: 0
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
    if (navigation.state.params.hasOwnProperty('greyFilters')) {
      this.setState({ greyFilters: navigation.state.params.greyFilters });
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
    // allPages = Sort.arrangeItems(allPages, [{filterType: "disallowed", class: "top"}, {filterType: "disallowed", class: "accessory"}, {filterType: "allowed", type: "cardigan"}]);
    allPages = Sort.arrangeItems(allPages, [
      // {filterType: "priority", type: {value: "sneakers", weight: 0}},
      // {filterType: "priority", colors: {value: ["#000"], weight: 0}},
      {filterType: "priority", name: {value: "balck", weight: 0}},
      // {filterType: "priority", type: {value: "sneakers", weight: 0}, colors: {value: ["#ff0000"], weight: 0}},
    ]);
    this.setPages(allPages)
    this.setState({ library: allPages });
  };

  setPages = (pages: Page[]) => {
    this.setState({ pages: pages, pagesShown: 1 })
  }

  //review: do you need to reload on every focus?
  // willFocusSubscription = this.props.navigation.addListener(
  //   'willFocus',
  //   payload => {
  //     // console.log('willFocus');
  //     this.loadLibrary()
  //   }
  // );

  // componentWillUnmount = () => {
  //   // console.log("unmount library")
  //   this.willFocusSubscription.remove();
  // }

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

  getAllowedItems = (item: Item) => {
    let itemIsAllowed = false;
    this.state.greyFilters.allowed.filter.forEach(filter => {
      //for each allowed filter
      let itemEqualsAllKeys = true;
      Object.keys(filter).forEach(key => {
        //for each key of filter like CLASS, TYPE
        if (key === "cover") {
          if (ItemDefinitions.getCover(item.type) !== filter[key]) {
            itemEqualsAllKeys = false;
          }
        } else {
          if (item[key] !== filter[key]) { //if item value not same as filter value
            itemEqualsAllKeys = false;
          }
        }
      })
      if (itemEqualsAllKeys) {
        itemIsAllowed = true;
      }
    });
    let message = this.state.greyFilters.allowed.message;
    let action = this.state.greyFilters.allowed.action;
    return { allowed: itemIsAllowed, message: message, action: action };
  }

  //review: BROKEN
  getDisallowedItems = (item: Item) => {
    let itemIsDisallowed = false;
    this.state.greyFilters.disallowed.filter.forEach(filter => {
      let itemEqualsAllKeys = true;
      Object.keys(filter).forEach(key => {
        if (key === "cover") {
          if (ItemDefinitions.getCover(item.type) !== filter[key]) {
            itemEqualsAllKeys = false;
          }
        } else {
          if (item[key] !== filter[key]) { //if item value not same as filter value
            itemEqualsAllKeys = false;
          }
        }
      })
      if (itemEqualsAllKeys) {
        itemIsDisallowed = true;
      }
    });
    let message = this.state.greyFilters.disallowed.message;
    let action = this.state.greyFilters.disallowed.action;
    return { disallowed: itemIsDisallowed, message: message, action: action };
  }

  getTiles() {
    return this.state.pages.slice(0, this.state.pagesShown).map((page, pageIndex) => {
      return (
        <View key={pageIndex} style={styles.container}>
          {page.items.map((item, itemIndex) => {
            let isAllowed = this.getAllowedItems(item);
            let isDisallowed = this.getDisallowedItems(item);
            let isGreyItem = this.state.greyMode && (!isAllowed.allowed || isDisallowed.disallowed);
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
                        if(!!isAllowed.message && !isAllowed.allowed){
                          if(!!isAllowed.action){
                            Alert.alert(
                              "can't add to outfit",
                              isAllowed.message,
                              [
                                {text: isAllowed.action.title, onPress: () => isAllowed.action.action},
                                {text: "cancel", style: "cancel"}
                              ]
                            )
                          } else {
                            Alert.alert(
                              "can't add to outfit",
                              isAllowed.message,
                              [
                                {text: "OK", style: "cancel"}
                              ]
                            )
                          }
                        } else if(!!isDisallowed.message && isDisallowed.disallowed){
                          if(!!isDisallowed.action) {
                            Alert.alert(
                              "can't add to outfit",
                              isDisallowed.message,
                              [
                                {text: isDisallowed.action.title, onPress: () => isDisallowed.action.action},
                                {text: "cancel", style: "cancel"}
                              ]
                            )
                          } else {
                            Alert.alert(
                              "can't add to outfit",
                              isDisallowed.message,
                              [
                                {text: "OK", style: "cancel"}
                              ]
                            )
                          }
                        } else {
                          Alert.alert(
                            "can't add to outfit",
                            "",
                            [
                              {text: "OK", style: "cancel"}
                            ]
                          )
                        }
                      } else {
                        this.state.return.setItem(this.state.pages[pageIndex].items[itemIndex]);
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
        <ScrollView nestedScrollEnabled horizontal pagingEnabled ref={this._drawer}>
          <View style={styles.page}>
            <ScrollView onScroll={({ nativeEvent }) => this.hasScrolledToEnd(nativeEvent, this.loadMore)} scrollEventThrottle={400}>
              <View style={{ height: this.state.topSpacerHeight }} />
              {this.getTiles()}
            </ScrollView>
            {/* <FlatList nestedScrollEnabled scrollEnabled data={this.state.pages} renderItem={({item,index}) => <View key={index}>{this.getTiles(item, index)}</View>
            }>

            </FlatList> */}
            <View style={styles.fixedTopContainer} onLayout={(event) => {
              var { height } = event.nativeEvent.layout;
              this.setState({ topSpacerHeight: height })
            }}>
              <View style={styles.searchAndSortContainer}>
                <View style={styles.searchContainer}>
                  <MaterialIcons name="search" size={30} color={StyleConstants.accentColor} />
                  <TextInput style={[styles.search, commonStyles.textInput]} placeholder="search" onChangeText={text => this.search(text)} value={this.state.searchValue} />
                  {this.state.searchValue ? <TouchableHighlight onPress={() => { this.search('') }}><MaterialIcons name="close" size={30} color={StyleConstants.accentColor} /></TouchableHighlight> : null}
                </View>
                <TouchableHighlight
                  onPress={() => this.toggleSidebar()}
                  underlayColor="rgba(0,0,0,0.2)"
                  style={commonStyles.button}
                >
                  <Text style={[styles.sortButton, commonStyles.buttonText]}>sort</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.pillContainer}>
                {this.state.sortFilters.map((item, index) => {
                  return (<TouchableHighlight style={styles.pill} key={index} onPress={() => this.removePill(index)} underlayColor="#e9e9e9">
                    <View style={{ flexDirection: "row", alignItems: "center" }}>

                      <Text style={[commonStyles.pb, { paddingLeft: 5 }]}>{item.name === "color" ? roundColor(item.value) : item.value}</Text>
                      <Ionicons name="md-close-circle" size={25} style={{ paddingLeft: 5 }} />
                    </View>
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
    // borderRadius: 5,
    borderRadius: 25,
    // borderWidth: 2,
    // borderColor: '#000'
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
    flexDirection: "row",
    paddingHorizontal: "5%",
    marginTop: width * 0.05
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 10,
    backgroundColor: '#e9e9e9',
    borderRadius: 7.5
  },
  search: {
    flex: 1,
  },
  sortButton: {
    flex: 1
  },
  pillContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingLeft: 5,
    paddingRight: 5,
    marginHorizontal: 5,
    marginTop: 5
  },
  pill: {
    borderRadius: 25,
    // borderWidth: 2,
    padding: 5,
    marginHorizontal: 5,
    marginTop: 5,
    backgroundColor: "#e9e9e9"
  },
});
