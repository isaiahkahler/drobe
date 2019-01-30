import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableHighlight,
  TextInput,
  FlatList,
  Image
} from "react-native";
import { PageLayout } from "../../components/page";
import { commonStyles, StyleConstants } from "../../components/styles";
import { createStackNavigator, NavigationComponent } from "react-navigation";
import { Item, Page, ItemDefinitions, Filter } from "../../components/formats";
import { ItemManager } from "../../components/itemManager";
import { ItemView } from "./itemView2";
import { Define } from "../add/define";
import { SortSidebar } from "./sortSidebar";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { roundColor } from "../../components/helpers";
import {
  Sort,
  Priority,
  Allowed,
  Disallowed,
  Greyed
} from "../../components/filter";
import { Storage } from "../../components/storage";
import { Button } from '../../components/button';

//review: remove all unused imports

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

interface LibraryProps {
  navigation: NavigationComponent;
}

//review use of all of these
interface LibraryState {
  columns: number,
  library: Page[];
  items: Item[];
  activePages: number;
  filters: Array<Priority | Allowed | Disallowed | Greyed>;
  topContainerHeight: number;
  drawerOpen: boolean;
  searchValue: string;
}

//review: does this class (and others) need to be exported? only the 'stack'
//needs to? remove unnecessary exports
export class Library extends React.Component<LibraryProps, LibraryState> {
  _drawer: React.RefObject<ScrollView>;

  constructor(props: LibraryProps) {
    super(props);
    this._drawer = React.createRef<ScrollView>();
    this.state = {
      columns: 3,
      library: [],
      items: [],
      activePages: 1,
      filters: [],
      topContainerHeight: 0,
      drawerOpen: false,
      searchValue: ""
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Library",
      headerRight: (
        <TouchableHighlight onPress={navigation.getParam('changeView')} underlayColor='rgba(0,0,0,0)'>
          <MaterialCommunityIcons name="view-grid" size={30}  style={{ marginRight: width * 0.05 }} />
        </TouchableHighlight>
      )
    };
  }

  async componentDidMount() {
    this.props.navigation.setParams({'changeView': this.changeView});
    this.loadLibrary();
  }

  checkReload = () => {
    let reload = this.props.navigation.getParam("reload", false);
    // if (reload) {
    //   this.loadLibrary();
    // }
    // console.log(reload, "reload");
    // console.log(this.props.navigation.state.params)
  };

  didFocusListener = this.props.navigation.addListener(
    "didFocus",
    () => setTimeout(() => this.checkReload(), 1000)
  );

  async loadLibrary() {
    let allPages = await ItemManager.getAllPages();
    allPages = Sort.arrangeItems(allPages, [
      { filterType: "priority", date: { value: "ascending", weight: 0 } }
    ]);
    this.setState({ library: allPages });
    this.setState({ items: ItemManager.pagesToItemList(allPages) });
  }

  renderItem(item: Item) {
    return (
      <TouchableHighlight style={[styles.tile, {width: width / this.state.columns}]} onPress={() => {

        
        this.props.navigation.navigate('ItemView', {
          title: item.name,
          pageIndex: -1,
          itemIndex: -1,
          item: item,
          editMode: true
        })
      }
      }>
        <Image
          source={{
            uri: Storage.getLibraryPhotosDirectory() + "/" + item.photoURI
          }}
          style={styles.tileImage}
        />
      </TouchableHighlight>
    );
  }

  hideSidebar = () => {
    this._drawer.current.scrollTo({ x: 0, animated: true });
  };

  toggleSidebar = () => {
    this._drawer.current.scrollToEnd();
  };

  hasNoItems = () => {
    return(
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text style={commonStyles.pb}>Your library is empty!</Text>
        <Button title="Add Clothes" onPress={() => {this.props.navigation.navigate('Add')}} />
      </View>
    )
  }

  changeView = () => {
    if(this.state.columns === 3){
      this.setState({columns: 2});
    } else {
      this.setState({columns: 3});
    }
  }

  render() {
    return (
      <PageLayout>
        <ScrollView horizontal pagingEnabled ref={this._drawer}>
          {/* library part (not sidebar) */}
          <View style={styles.library}>
            {/* tiles scroll view */}
            <ScrollView style={styles.tilesScrollView}>
              <View style={{ height: this.state.topContainerHeight }} />
              {/* {this.getTiles()} */}
              {/* <View style={styles.tilesContainer}> */}
                <FlatList
                // style={styles.tilesContainer}
                  ListEmptyComponent={this.hasNoItems}
                  numColumns={this.state.columns}
                  key={this.state.columns}
                  initialNumToRender={15}
                  data={this.state.items}
                  renderItem={({ item }) => this.renderItem(item) as any}
                  keyExtractor={item => item.date.toString()}
                />
              {/* </View> */}
            </ScrollView>
            {/* top static container */}
            <View style={styles.topStaticContainer}>
              {/* <Text style={commonStyles.pb}>top container</Text> */}

              <View
                onLayout={event => {
                  var { height } = event.nativeEvent.layout;
                  this.setState({ topContainerHeight: height + 0.05 * width });
                }}
              >
                <View style={styles.topContainer}>
                  <View style={styles.searchContainer}>
                    <MaterialIcons
                      name="search"
                      size={30}
                      color={StyleConstants.accentColor}
                    />
                    <TextInput
                      style={[styles.search, commonStyles.textInput]}
                      placeholder="search"
                      onChangeText={text => {
                        /*this.search(text)*/
                      }}
                      value={this.state.searchValue}
                    />
                    {this.state.searchValue ? (
                      <TouchableHighlight
                        onPress={() => {
                          /*this.search('')*/
                        }}
                      >
                        <MaterialIcons
                          name="close"
                          size={30}
                          color={StyleConstants.accentColor}
                        />
                      </TouchableHighlight>
                    ) : null}
                  </View>
                  <TouchableHighlight
                    onPress={() => this.toggleSidebar()}
                    underlayColor="rgba(0,0,0,0.2)"
                    style={commonStyles.button}
                  >
                    <Text style={[styles.sortButton, commonStyles.buttonText]}>
                      sort
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>

          {/* sidebar */}
          <View>
            <SortSidebar onSelect={() => {}} />
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
    initialRouteName: "Library"
    //   initialRouteParams: { selectionMode: false }
  }
);

const styles = StyleSheet.create({
  library: {
    width: width
  },
  tilesScrollView: {
    flex: 1
  },
  topStaticContainer: {
    width: width,
    position: "absolute"
  },
  topContainer: {
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
    backgroundColor: "#e9e9e9",
    borderRadius: 7.5
  },
  search: {
    flex: 1
  },
  sortButton: {
    flex: 1
  },
  tile: {
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  tileImage: {
    height: "98%",
    aspectRatio: 1
  },
  tilesContainer: {
    flex: 1,
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    backgroundColor: "#ff0000"
  }
});
