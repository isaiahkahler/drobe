import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableHighlight, TextInput, FlatList, Image } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles, StyleConstants } from '../../components/styles';
import { createStackNavigator, NavigationComponent } from 'react-navigation';
import { Item, Page, ItemDefinitions, Filter } from '../../components/formats';
import { ItemManager } from '../../components/itemManager';
import { ItemView } from './itemView';
import { Define } from '../add/define';
import { SortSidebar } from './sortSidebar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { roundColor } from '../../components/helpers';
import { Sort, Priority, Allowed, Disallowed, Greyed } from '../../components/filter';
import { Storage } from '../../components/storage';

//review: remove all unused imports



const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

interface LibraryProps {
  navigation: NavigationComponent;
}

//review use of all of these
interface LibraryState {
  library: Page[],
  items: Item[],
  activePages: number,
  filters: Array<Priority | Allowed | Disallowed | Greyed>,
  topContainerHeight: number,
  drawerOpen: boolean,
  searchValue: string
}

//review: does this class (and others) need to be exported? only the 'stack'
//needs to? remove unnecessary exports
export class Library extends React.Component<LibraryProps, LibraryState> {
  _drawer: React.RefObject<ScrollView>

  constructor(props: LibraryProps) {
    super(props);
    this._drawer = React.createRef<ScrollView>();
    this.state = {
      library: [],
      items: [],
      activePages: 1,
      filters: [],
      topContainerHeight: 0,
      drawerOpen: false,
      searchValue: ''
    }
  }

  static navigationOptions = {
    title: 'Library'
  };

  async componentDidMount() {
    let allPages = await ItemManager.getAllPages();
    allPages = Sort.arrangeItems(allPages, [
      { filterType: "priority", date: { value: "ascending", weight: 0 } }
    ]);
    this.setState({ library: allPages });
    this.setState({ items: ItemManager.pagesToItemList(allPages) }, () => {
      this.state.items.forEach(item => {
        console.log(item.photoURI)
      })
    });

  }

  renderItem(item: Item) {
    return (

      <View style={styles.tile}>
        <Image source={{ uri: Storage.getLibraryPhotosDirectory() + '/' + item.photoURI }} style={styles.tileImage}></Image>
      </View>
    )
  }

  hideSidebar = () => {
    this._drawer.current.scrollTo({ x: 0, animated: true })
  }

  toggleSidebar = () => {
    this._drawer.current.scrollToEnd();
  };

  render() {
    return (
      <PageLayout>
        <ScrollView horizontal pagingEnabled ref={this._drawer} >
          {/* library part (not sidebar) */}
          <View style={styles.library}>
            {/* tiles scroll view */}
            <ScrollView style={styles.tilesScrollView}>
              <View style={{ height: this.state.topContainerHeight }} />
              {/* {this.getTiles()} */}
              <View style={styles.tilesContainer}>

                <FlatList data={this.state.items} renderItem={({ item }) => this.renderItem(item) as any} keyExtractor={(item) => item.date.toString()}></FlatList>
              </View>

              {/* <Image source={{uri: "file:///var/mobile/Containers/Data/Application/54936716-2557-42CD-86FD-9D1A7E9DEA98/Documents/ExponentExperienceData/%2540isaiahkahler%252Fdrobe/libraryPhotos/1546708480834.jpg"}} style={styles.tileImage} /> */}
              {/* <Image source={{uri: "file:///var/mobile/Containers/Data/Application/54936716-2557-42CD-86FD-9D1A7E9DEA98/Documents/ExponentExperienceData/%2540isaiahkahler%252Fdrobe/libraryPhotos/1546458960702.jpg"}} style={styles.tileImage} /> */}
            </ScrollView>
            {/* top static container */}
            <View style={styles.topStaticContainer}>
              {/* <Text style={commonStyles.pb}>top container</Text> */}


              <View onLayout={(event) => {
                var { height } = event.nativeEvent.layout;
                this.setState({ topContainerHeight: height })
              }}>
                <View style={styles.topContainer}>
                  <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={30} color={StyleConstants.accentColor} />
                    <TextInput style={[styles.search, commonStyles.textInput]} placeholder="search" onChangeText={text => {/*this.search(text)*/ }} value={this.state.searchValue} />
                    {this.state.searchValue ? <TouchableHighlight onPress={() => { /*this.search('')*/ }}><MaterialIcons name="close" size={30} color={StyleConstants.accentColor} /></TouchableHighlight> : null}
                  </View>
                  <TouchableHighlight
                    onPress={() => this.toggleSidebar()}
                    underlayColor="rgba(0,0,0,0.2)"
                    style={commonStyles.button}
                  >
                    <Text style={[styles.sortButton, commonStyles.buttonText]}>sort</Text>
                  </TouchableHighlight>
                </View>
              </View>



            </View>
          </View>

          {/* sidebar */}
          <View>
            <SortSidebar onSelect={() => { }} />
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
    //   initialRouteParams: { selectionMode: false }
  }
);

const styles = StyleSheet.create({
  library: {
    width: width
  },
  tilesScrollView: {
    flex: 1,
  },
  topStaticContainer: {
    width: width,
    position: 'absolute',
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
    backgroundColor: '#e9e9e9',
    borderRadius: 7.5
  },
  search: {
    flex: 1,
  },
  sortButton: {
    flex: 1
  },
  tile: {
    width: '33%',
    aspectRatio: 1
  },
  tileImage: {
    height: '100%',
    aspectRatio: 1
  },
  tilesContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  }
});