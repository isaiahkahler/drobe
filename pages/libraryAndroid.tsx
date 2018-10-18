import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  TouchableHighlight,
  ScrollView,
  DrawerLayoutAndroid,
  TextInput,
  SectionList
} from 'react-native';
import { PageLayout } from '../components/page';
import { commonStyles } from '../components/styles';
import { createStackNavigator } from 'react-navigation';
import { getFormality, Item } from '../components/formats';

interface LibraryProps {}
interface LibraryState {
  section: Array<string>; //change to data type to Item (in formats)
}

class Library extends React.Component<LibraryProps, LibraryState> {
  constructor(props: LibraryProps) {
    super(props);
    this.state = { section: ['tile 1', 'tile 2', 'tile 3'] };
  }


  _retrieveData = async (item: string) => {
    //get from storage
    try {
      const value = await AsyncStorage.getItem(item);
      if (value !== null) {
        return value;
      } else {
        return null;
      }
    } catch (error) {
      // Error retrieving data
      return null;
    }
  };

  componentDidMount = () => {
    this.getClothes();
  };

  getClothes() {
    //get from storage
  }

  loadMore = () => {
    //load more from storage?
    this.setState(previousState => ({
      ...previousState,
      section: [...previousState.section, 'new tile', 'new tile 2']
    }));
  };

  getTiles() {
    //map data to tiles
    return this.state.section.map((element, index) => {
      return (
        <Tile key={index}>
          <Text>{element}</Text>
        </Tile>
      );
    });
  }

  render() {
    return (
      <PageLayout scroll>
        <View style={styles.container}>
          <View style={styles.topContainerSpacer}/>
          {this.getTiles()}
        </View>
        <View style={styles.button}>
          <Button onPress={this.loadMore} title="load more" />
        </View>
        {/* <SortSidebar></SortSidebar> */}
      </PageLayout>
    );
  }
}

function Tile(props: { children?: any }) {
  return <View style={styles.tile}>{props.children}</View>;
}

interface SortSidebarProps {
  sort: Function;
}

class LibrarySidebar extends React.Component<{}> {
  constructor(props: any) {
    super(props);
  }
  static navigationOptions = {
    title: 'Library'
  };

  private _drawer = React.createRef<any>();

  closeSidebar = () => {
    this._drawer.current.closeDrawer();
  };
  openSidebar = () => {
    this._drawer.current.openDrawer(); //problem!!! doesn't work!
  };

  render() {
    let sidebarContents = <SortSidebar />;

    return (
      <DrawerLayoutAndroid
        ref={this._drawer}
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Right}
        drawerBackgroundColor="#fff"
        renderNavigationView={() => sidebarContents}
      >
        <View style={styles.fixedTopContainer}>
        <View style={styles.searchContainer}>
        <TextInput style={[styles.search, commonStyles.h2]} value="search"></TextInput>
        </View>
        <TouchableHighlight onPress={() => this.openSidebar()} style={styles.sortButton}><Text style={commonStyles.h2}>sort</Text></TouchableHighlight>
        </View>
        <Library />
      </DrawerLayoutAndroid>
    );
  }
}

class SortSidebar extends React.Component<{}> {
  render() {
    return (
      <View style={styles.sidebar}>
        <SectionList
          sections={[
            {title: 'D', data: ['Devin']},
            {title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie']},
          ]}
          renderItem={({item}) => <Text style={[styles.listItem, commonStyles.pb]}>{item}</Text>}
          renderSectionHeader={({section}) => <Text style={[styles.listSectionHeader, commonStyles.h2]}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

export const LibraryStackAndroid = createStackNavigator(
  { Library: LibrarySidebar },
  { initialRouteName: 'Library' }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  button: {
    width: '50%'
  },
  fixedTopContainer: {
    position: "absolute",
    width: '100%',
    flex: 1,
    flexDirection: "row",
    // flexWrap: "nowrap",
    // justifyContent: "space-evenly",
    // alignItems: "center",
    zIndex: 5,
  },
  searchContainer: {
    flex: 1,
    width: "60%",
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10, 
    paddingLeft: 5,
    paddingRight: 5,
    margin: 10,
    backgroundColor: "#fff"
  },
  search: {
    flex: 1,
    height: 20,
  },
  sortButton: {
    // width: "10%",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10, 
    padding: 5,
    marginLeft: 0,
    margin: 10,
  }, 
  topContainerSpacer: {
    height: 20,
    width: "100%",
    margin: 15,
  },
  sidebar: {
    padding: 10
  },
  listItem: {

  },
  listSectionHeader: {
  }
});
