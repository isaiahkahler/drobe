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
  TouchableNativeFeedback
} from 'react-native';
import { Page } from '../components/page';
import { commonStyles } from '../components/styles';
import { createStackNavigator } from 'react-navigation';
import { getFormality, Item } from '../components/formats';

interface LibraryProps {}
interface LibraryState {
  section: Array<string>; //change to data type to Item (in formats)
  drawerOpen: boolean;
}

class Library extends React.Component<LibraryProps, LibraryState> {
  constructor(props: LibraryProps) {
    super(props);
    this.state = { section: ['tile 1', 'tile 2', 'tile 3'], drawerOpen: false };
  }

  static navigationOptions = {
    title: 'Library'
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
    return (
      <Page>
        <ScrollView horizontal pagingEnabled ref={this._drawer}>
          <View style={styles.page}>
            <ScrollView style={styles.scrollContainer}>
              <View style={styles.container}>
                <View style={styles.topContainerSpacer} />
                {this.getTiles()}
              </View>
              <View style={styles.button}>
                <Button onPress={this.loadMore} title="load more" />
              </View>
            </ScrollView>
            <View style={styles.fixedTopContainer}>
              <View style={styles.searchContainer}>
                <TextInput style={[styles.search, commonStyles.h2]} placeholder="search" />
              </View>

              {Platform.OS === 'ios' ? (
                <TouchableHighlight onPress={() => this.toggleSidebar()} underlayColor='rgba(0,0,0,0.1)' style={styles.sortButton}>
                  <Text style={commonStyles.h2}>sort</Text>
                </TouchableHighlight>
              ) : (
                <TouchableNativeFeedback onPress={() => this.toggleSidebar()}>
                  <View style={styles.sortButton}>
                    <Text style={commonStyles.h2}>sort</Text>
                  </View>
                </TouchableNativeFeedback>
              )}
            </View>
          </View>

          <View style={styles.sidebar}>
            <SortSidebar />
          </View>
        </ScrollView>
      </Page>
    );
  }
}

function Tile(props: { children?: any }) {
  return <View style={styles.tile}>{props.children}</View>;
}

class SortSidebar extends React.Component<{}> {
  render() {
    return (
      <View style={styles.sidebar}>
        <SectionList
          sections={[
            { title: 'D', data: ['Devin'] },
            { title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie'] }
          ]}
          renderItem={({ item }) => <Text style={[styles.listItem, commonStyles.pb]}>{item}</Text>}
          renderSectionHeader={({ section }) => (
            <Text style={[styles.listSectionHeader, commonStyles.h2]}>{section.title}</Text>
          )}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

export const LibraryStack = createStackNavigator(
  { Library: Library },
  { initialRouteName: 'Library' }
);

const styles = StyleSheet.create({
  page: {
    width: Dimensions.get('screen').width
  },
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
  sidebar: {
    width: Dimensions.get('screen').width * 0.8,
    padding: 10,
    backgroundColor: "#ccc"
  },
  listItem: {},
  listSectionHeader: {}
});
