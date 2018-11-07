import * as React from 'react';
import { StyleSheet, View, Text, Button, TouchableHighlight, Image, Dimensions } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import { Item, ItemDefinitions, SortFilter } from '../../components/formats';
import { ItemManager } from '../../components/itemManager';
import { filter } from 'minimatch';
import { NativeIcon } from '../../components/nativeIcons';
import { MaterialIcons } from '@expo/vector-icons';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

interface ManualProps {
  navigation: any;
}

interface ManualState {
  outfit: Item[];
  disallowedTypes: Array<{ class?: string, type?: string, cover?: number, date?: number, id?: number }>;
}

export class Manual extends React.Component<ManualProps, ManualState> {
  constructor(props: ManualProps) {
    super(props);
    this.state = { outfit: [], disallowedTypes: [] }
  }

  static navigationOptions = {
    title: 'Create Manually'
  };

  componentDidUpdate = () => {
    console.log(ItemManager.isValidOutfit(this.state.outfit))
  }

  addItem = (item: Item) => {
    //review: set state like this or use the callback?
    this.setState(previousState => ({
      ...previousState,
      outfit: [...previousState.outfit, item]
    }), () => {
      this.setState(previousState => ({
        disallowedTypes: ItemManager.getDisallowedItems([...previousState.outfit])
      }))
    })
  }

  removeItem = (id: number) => {
    this.setState(previousState => ({
      ...previousState,
      outfit: [...previousState.outfit.slice(0, previousState.outfit.findIndex(e => e.date === id)), ...previousState.outfit.slice(previousState.outfit.findIndex(e => e.date === id) + 1, previousState.outfit.length)]
    }), () => {
      //review: do you want it to return to manual after removing item? 
      this.setState(previousState => ({
        disallowedTypes: ItemManager.getDisallowedItems([...previousState.outfit])
      }), () => {
        this.props.navigation.navigate('Manual')
      })

    })
  }

  replaceItem = (id: number, item: Item) => {
    console.log("fjdsfklds", this.state.outfit.slice(0, 0))
    console.log(this.state.outfit.findIndex(e => e.date === id))
    this.setState(previousState => ({
      ...previousState,
      outfit: [...previousState.outfit.slice(0, previousState.outfit.findIndex(e => e.date === id)), item, ...previousState.outfit.slice(previousState.outfit.findIndex(e => e.date === id) + 1, previousState.outfit.length)]
    }), () => {
      //review: do you want it to return to manual after removing item? 
      this.setState(previousState => ({
        disallowedTypes: ItemManager.getDisallowedItems([...previousState.outfit])
      }), () => {
        this.props.navigation.navigate('Manual')
      })

    })
  }

  render() {
    return (
      <PageLayout scroll padding>
        <View style={{ flex: 1, alignItems: "center" }}>

          <TouchableHighlight
            onPress={() => {
              this.props.navigation.navigate("LibrarySelector",
                {
                  selectionMode: "one",
                  filters: this.state.disallowedTypes,
                  greyMode: true,
                  return: {
                    addItem: (item) => {
                      this.props.navigation.navigate('Manual');
                      this.addItem(item);
                    },
                    removeItem: (date) => {
                      this.removeItem(date);
                    },
                    replaceItem: (date, item) => {
                      this.replaceItem(date, item);
                    }
                  }
                })
            }}
            style={commonStyles.button}
          >
            <Text style={commonStyles.pb}>add item</Text>
          </TouchableHighlight>
          <View style={styles.outfitsContainer}>
            {this.state.outfit.map((item, index) => {
              return (
                <View style={styles.outfitContainer} key={index}>
                  <TouchableHighlight onPress={() => this.removeItem(item.date)} style={[styles.icon, {backgroundColor: "#ff0000"}]}><MaterialIcons name="close" size={40} color="#000"/></TouchableHighlight>
                  {/* <TouchableHighlight style={[styles.icon, {backgroundColor: "#E9E9E9"}]}><MaterialIcons name="edit" size={35} color="#000"/></TouchableHighlight> */}
                  <View style={styles.itemContainer}>
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('CreateItemView', { item: item })}><Image
                      source={{ uri: item.photoURI }}
                      style={styles.tileImage as any}
                    /></TouchableHighlight>]
                    <Text style={[commonStyles.pb, commonStyles.centerText]}>{item.name}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </PageLayout>
    );
  }
}

const styles = StyleSheet.create({
  outfitsContainer: {
    paddingVertical: width * 0.05,
    flexDirection: "column"
  },
  outfitContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: 'center'
  },
  itemContainer: {
    flexDirection: "column",
  },
  textContainer: {
    justifyContent: "center"
  },
  tileImage: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000'
  },
});