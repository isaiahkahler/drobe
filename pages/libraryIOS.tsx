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
import { PageLayout } from '../components/page';
import { commonStyles } from '../components/styles';
import { createStackNavigator } from 'react-navigation';
import { getFormality, Item, Storage, Page } from '../components/formats';

interface LibraryProps {}
interface LibraryState {
  // numberOfPages: number;
  pages: Array<Page>;
  drawerOpen: boolean;
}

class Library extends React.Component<LibraryProps, LibraryState> {
  constructor(props: LibraryProps) {
    super(props);
    this.state = { pages: [], drawerOpen: false };
  }

  static navigationOptions = {
    title: 'Library'
  };

  componentDidMount = () => {
    this.getClothes();
  };

  getClothes = async () => {
    //get from storage
    let numberOfPages = await Storage.getNumberOfPages();
    if (numberOfPages !== 0) {
      let pageOne = await Storage.getPage(1);
      this.setState({ pages: [pageOne] });
    }
  };

  loadMore = () => {
    //load more from storage?
    // this.setState(previousState => ({
    //   ...previousState,
    //   section: [...previousState.pages, 'new tile', 'new tile 2']
    // }));
  };

  getTiles() {
    //map data to tiles
    if(!this.state.pages){return undefined;}
    return this.state.pages.map((page, pageIndex) => {
      return (
        <View key={pageIndex}>
          {page.items.map((item, itemIndex) => {
            return (
              <Tile>
                <Text key={itemIndex}>{item.name}</Text>
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
    return (
      <PageLayout>
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
                <TouchableHighlight
                  onPress={() => this.toggleSidebar()}
                  underlayColor="rgba(0,0,0,0.1)"
                  style={styles.sortButton}
                >
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
      </PageLayout>
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
        {/* <SectionList
          sections={[
            { title: 'D', data: ['Devin'] },
            { title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie'] }
          ]}
          renderItem={({ item }) => <Text style={[styles.listItem, commonStyles.pb]}>{item}</Text>}
          renderSectionHeader={({ section }) => (
            <Text style={[styles.listSectionHeader, commonStyles.h2]}>{section.title}</Text>
          )}
          keyExtractor={(item, index) => index}
        /> */}
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
    backgroundColor: '#E9E9EF'
  },
  listItem: {},
  listSectionHeader: {}
});
