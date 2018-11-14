import * as React from 'react';
import { StyleSheet, View, Text, Button, TouchableHighlight, Image, Dimensions, Animated } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import { Item, ItemDefinitions, SortFilter, Outfit } from '../../components/formats';
import { ItemManager } from '../../components/itemManager';
import { filter } from 'minimatch';
import { NativeIcon } from '../../components/nativeIcons';
import { MaterialIcons } from '@expo/vector-icons';
import { Algorithms } from '../../components/algorithms';
import { throws } from 'assert';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

interface ManualProps {
  navigation: any;
}

interface ManualState {
  outfit: Outfit;
  disallowedTypes: Array<{ class?: string, type?: string, cover?: number, date?: number, id?: number }>;
  deleteItemAnimation: Animated.Value;
  deleteItemId: number;
}

export class Manual extends React.Component<ManualProps, ManualState> {
  constructor(props: ManualProps) {
    super(props);
    this.state = {
      outfit: { items: { top: null, bottom: null, full: null, layers: null, accessories: null, shoes: null }, score: null },
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
  }

  setItem = (options: { type: "baseRegular" | "baseFull" | "shoes" | "layers" | "accessories", key?: "top" | "bottom", item: Item }) => {
    let data;
    //review: use of this.state ? should use previous state
    if (Array.isArray(this.state.outfit.items[options.type])) {
      data = [this.state.outfit.items[options.type], options.item]
    } else {
      data = options.item
    }

    // switch (options.type) {
    //   case "baseRegular":
    //     if (!!this.state.outfit.items.baseRegular) {
    //       data = { ...this.state.outfit.items.baseRegular };
    //       data[options.key] = options.item;
    //     } else {
    //       data = { top: null, bottom: null };
    //       data[options.key] = options.item;
    //     }
    //     break;
    //   case "layers":
    //   case "accessories":
    //     data = [this.state.outfit.items[options.type], options.item];
    //     break;
    //   default:
    //     data = options.item
    //     break;
    // }

    this.setState(previousState => ({
      ...previousState,
      outfit: {
        ...previousState.outfit,
        items: { ...previousState.outfit.items, [options.type]: data }
      }
    }))
  }

  removeItem = (id: number) => {
    Object.keys(this.state.outfit.items).map(key => {
      let item: Item = this.state.outfit.items[key];
      if (item.date === id) {
        this.setState(previousState => ({
          ...previousState,
          outfit: {
            ...this.state.outfit,
            items: {
              ...this.state.outfit.items,
              [key]: null
            }
          }
        }))
      }
    })
  }

  replaceItem = (id: number, item: Item) => {

  }

  getItemFromLibrary = (
    options: {
      type: "baseRegular" | "baseFull" | "shoes" | "layers" | "accessories",
      key?: "top" | "bottom",
      item: Item
    },
    allowed: Array<{ class?: string, type?: string, cover?: number, date?: number, id?: number }>,
    disallowed: Array<{ class?: string, type?: string, cover?: number, date?: number, id?: number }>
  ) => {
    this.props.navigation.navigate("LibrarySelector",
      {
        selectionMode: "one",
        greyFilters: this.state.disallowedTypes,
        greyMode: true,
        return: {
          setItem: (item) => {
            this.props.navigation.navigate('Manual');
            // this.addItem(item);
            this.setItem(item);
          },
          removeItem: (date) => {
            this.removeItem(date);
          },
          allowed: {
            allowed
          }
          // replaceItem: (date, item) => {
          //   this.replaceItem(date, item);
          // }
        }
      })
  }

  getItemView(item: Item) {
    return (
      <View style={styles.itemViewContainer}>
        <TouchableHighlight>
          <Image source={{ uri: item.photoURI }} style={styles.tileImage as any} />
        </TouchableHighlight>
        <Text style={[styles.itemViewText, commonStyles.pb, commonStyles.centerText]}>{item.name}</Text>
      </View>
    );
  }

  render() {
    return (
      <PageLayout scroll padding>
        <View style={{ flex: 1, alignItems: "center" }}>


          <View style={styles.label}>
            <View style={[styles.icon, { backgroundColor: "#e9e9e9", position: "absolute" }]}><Text style={[commonStyles.h2, commonStyles.bold]}>1</Text></View>
            <Text style={[commonStyles.pb, commonStyles.centerText, { width: "100%" }]}>start with a base.</Text>
          </View>

          {!!this.state.outfit.items.baseFull || !!this.state.outfit.items.baseRegular ? (
            <View>
              {!!this.state.outfit.items.baseFull && this.getItemView(this.state.outfit.items.baseFull)}
              {!!this.state.outfit.items.baseRegular && (
                <View>
                  {!!this.state.outfit.items.baseRegular.top ? (
                    this.getItemView(this.state.outfit.items.baseRegular.top)
                  ) : (
                      <TouchableHighlight style={styles.tileButton} onPress={this.getItemFromLibrary()}><Text>add a top</Text></TouchableHighlight>
                    )};
                    {!!this.state.outfit.items.baseRegular.bottom ? (
                    this.getItemView(this.state.outfit.items.baseRegular.bottom)
                  ) : (
                      <TouchableHighlight style={styles.tileButton}><Text>add a bottom</Text></TouchableHighlight>
                    )};
                  </View>
              )};
              </View>
          ) : (
              <TouchableHighlight style={[styles.tileImage, { borderWidth: 2, alignItems: "center", justifyContent: "center", flexDirection: "row" }]}
                onPress={() => this.getItemFromLibrary((item) => {
                  if (item.class === "top") {
                    this.setState(previousState => (
                      {
                        ...previousState,
                        outfit: {
                          ...previousState.outfit,
                          items: {
                            ...previousState.outfit.items,
                            baseRegular: {
                              ...previousState.outfit.items.baseRegular,
                              top: item
                            }
                          }
                        }
                      }))
                  } else if (item.class === "bottom") {
                    this.setState(previousState => (
                      {
                        ...previousState,
                        outfit: {
                          ...previousState.outfit,
                          items: {
                            ...previousState.outfit.items,
                            baseRegular: {
                              ...previousState.outfit.items.baseRegular,
                              bottom: item
                            }
                          }
                        }
                      }))
                  } else {
                    this.setState(previousState => (
                      {
                        ...previousState,
                        outfit: {
                          ...previousState.outfit,
                          items: {
                            ...previousState.outfit.items,
                            baseFull: item
                          }
                        }
                      }))
                  }
                },
                  (date: number) => { //does nothing because you shouldnt be able to remove anyting when first picking
                  },
                  [{ class: "top" }, { class: "bottom" }, { class: "full" }], [/* no disallowed */])}>
                <Text style={commonStyles.pb}>icons here</Text>
              </TouchableHighlight>
            )}


        </View>
      </PageLayout>
    );
  }
}

const styles = StyleSheet.create({
  // outfitsContainer: {
  //   paddingVertical: width * 0.05,
  //   flexDirection: "column"
  // },
  // outfitContainer: {
  //   width: "100%",
  //   flexDirection: "row",
  //   justifyContent: "space-around",
  //   alignItems: "center"
  // },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: 'center'
  },
  // itemContainer: {
  //   flexDirection: "column",
  // },
  // textContainer: {
  //   width: width * 0.35,
  // },
  tileImage: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 20,
    // borderWidth: 2,
    // borderColor: '#000'
  },
  tileButton: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 20,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: width * 0.05
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "space-between",
    width: "100%",
    paddingVertical: width * 0.05

  },
  itemViewContainer: {},
  itemViewText: {
    width: width * 0.35
  }
});