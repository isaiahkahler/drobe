import * as React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage } from 'react-native';
import { Page } from '../components/page';
import {commonStyles} from '../components/styles';
import {createStackNavigator} from 'react-navigation';
import { getFormality, Item } from '../components/formats';

interface LibraryProps {}
interface LibraryState {
  section: Array<string>; //change to data type to Item (in formats)
}

class Library extends React.Component<LibraryProps, LibraryState>{
  constructor(props: LibraryProps){
    super(props);
    this.state = {section: ['tile 1', 'tile 2', 'tile 3']};
  }
  static navigationOptions = {
    title: 'Library',
  };


  _retrieveData = async (item: string) => {
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
  }

  componentDidMount = () => {
    this.getClothes();
  }

  getClothes () {

  }

  loadMore = () => {
    this.setState(previousState => ({
      ...previousState,
      section: [...previousState.section, "new tile", "new tile 2"]
    }));
  }
  
  getTiles() {
    return this.state.section.map((element, index) => {
      return <Tile key={index}><Text>{element}</Text></Tile>;
    });
  }

  render() {
    return (
      <Page scroll>
        <View style={styles.container}>
          {this.getTiles()}
          {/* <Tile><Text>1</Text></Tile>
          <Tile><Text>2</Text></Tile>
          <Tile><Text>3</Text></Tile>
          <Tile><Text>4</Text></Tile> */}
        </View>
        <View style={styles.button}>
        <Button onPress={this.loadMore} title="load more"></Button>
        </View>
      </Page>
    );
  }
}

function Tile(props: {children?: any}) {
  return(
    <View style={styles.tile}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    alignItems: 'center',
    flexWrap: "wrap",
    // backgroundColor: "#ff0000"
  },
  tile: {
    width: '40%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 25,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: "5%"
  },
  button: {
    width: "50%"
  }
});

export const LibraryStack = createStackNavigator(
  {Library: Library},
  {initialRouteName: 'Library'}
);