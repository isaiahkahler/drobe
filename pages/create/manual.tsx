import * as React from 'react';
import { StyleSheet, View, Text, Button, TouchableHighlight, Image, Dimensions, Animated } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import { Item, ItemDefinitions, SortFilter } from '../../components/formats';
import { ItemManager } from '../../components/itemManager';
import { filter } from 'minimatch';
import { NativeIcon } from '../../components/nativeIcons';
import { MaterialIcons } from '@expo/vector-icons';
import { Algorithms } from '../../components/algorithms';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

interface ManualProps {
  navigation: any;
}

interface ManualState {
  outfit: Item[];
  disallowedTypes: Array<{ class?: string, type?: string, cover?: number, date?: number, id?: number }>;
  deleteItemAnimation: Animated.Value;
  deleteItemId: number;
}

export class Manual extends React.Component<ManualProps, ManualState> {
  constructor(props: ManualProps) {
    super(props);
    this.state = {
      outfit: [],
      disallowedTypes: [],
      deleteItemAnimation: new Animated.Value(0),
      deleteItemId: -1
    }
  }

  static navigationOptions = {
    title: 'Create Manually'
  };

  componentDidUpdate = () => {
    // console.log(ItemManager.isValidOutfit(this.state.outfit))
    // if (ItemManager.isValidOutfit(this.state.outfit)) {
    if (this.state.outfit.length === 2) {
      console.log(Algorithms.scoreOutfit({
        items:
        {
          baseRegular:
            { top: this.state.outfit[0], bottom: this.state.outfit[1] },
            baseFull: null,
          accessories: null,
          layers: null
        }
        , score: null
      }));
    }
  }

  addItem = (item: Item) => {
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
    this.setState({ deleteItemId: id }, () => {
      Animated.spring(this.state.deleteItemAnimation, {
        toValue: width,
        overshootClamping: true
      }).start(() => {
        this.setState(previousState => ({
          ...previousState,
          outfit: [...previousState.outfit.slice(0, previousState.outfit.findIndex(e => e.date === id)), ...previousState.outfit.slice(previousState.outfit.findIndex(e => e.date === id) + 1, previousState.outfit.length)]
        }), () => {
          //review: do you want it to return to manual after removing item? 
          this.setState(previousState => ({
            disallowedTypes: ItemManager.getDisallowedItems([...previousState.outfit]),
            deleteItemAnimation: new Animated.Value(0)
          }), () => {
            this.props.navigation.navigate('Manual')
          })

        })
      })
    })
  }

  replaceItem = (id: number, item: Item) => {
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
            underlayColor="rgba(0,0,0,0.2)"
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
            <Text style={commonStyles.buttonText}>add item</Text>
          </TouchableHighlight>
          <View style={styles.outfitsContainer}>
            {this.state.outfit.map((item, index) => {
              return (
                <Animated.View style={[styles.outfitContainer, this.state.deleteItemId === item.date && { left: this.state.deleteItemAnimation }]} key={index}>
                  <TouchableHighlight onPress={() => this.removeItem(item.date)} style={[styles.icon, { backgroundColor: "#ff0000" }]} underlayColor="rgba(0,0,0,0.2)"><MaterialIcons name="close" size={40} color="#000" /></TouchableHighlight>
                  {/* <TouchableHighlight style={[styles.icon, {backgroundColor: "#E9E9E9"}]}><MaterialIcons name="edit" size={35} color="#000"/></TouchableHighlight> */}
                  <View style={styles.itemContainer}>
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('CreateItemView', { item: item })} underlayColor="rgba(0,0,0,0.2)"><Image
                      source={{ uri: item.photoURI }}
                      style={styles.tileImage as any}
                    /></TouchableHighlight>]
                    <Text style={[commonStyles.pb, commonStyles.centerText, styles.textContainer]}>{item.name}</Text>
                  </View>
                </Animated.View>
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
    borderRadius: 25,
    justifyContent: "center",
    alignItems: 'center'
  },
  itemContainer: {
    flexDirection: "column",
  },
  textContainer: {
    width: width * 0.35,
  },
  tileImage: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 20,
    // borderWidth: 2,
    // borderColor: '#000'
  },
});