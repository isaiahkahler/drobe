import * as React from 'react';
import { StyleSheet, View, Text, Button, TouchableHighlight, Image, Dimensions, Animated } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles, StyleConstants } from '../../components/styles';
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
  deleteItemAnimation: Animated.Value;
  progress: number;
}

export class Manual extends React.Component<ManualProps, ManualState> {
  constructor(props: ManualProps) {
    super(props);
    this.state = {
      outfit: { items: { top: null, bottom: null, full: null, layers: [], accessories: [], shoes: null }, score: null },
      deleteItemAnimation: new Animated.Value(0),
      progress: 0
    }
  }

  static navigationOptions = {
    title: 'Create Manually'
  };

  componentDidUpdate = () => {
    // console.log(ItemManager.isValidOutfit(this.state.outfit))
    // if (ItemManager.isValidOutfit(this.state.outfit)) {
  }

  setItem = (
    options: {
      type: "base" | "top" | "bottom" | "full" | "shoes" | "layers" | "accessories",
      item: Item
    }) => {
    let data;
    let type = options.type;
    //review: use of this.state ? should use previous state
    if (options.type === "base") {
      type = options.item.class as any;
      data = options.item;
    } else if (Array.isArray(this.state.outfit.items[options.type])) {
      data = [...this.state.outfit.items[options.type] as any, options.item];
    } else {
      data = options.item;
    }


    this.setState(previousState => ({
      ...previousState,
      outfit: {
        ...previousState.outfit,
        items: { ...previousState.outfit.items, [type]: data }
      }
    }), () => {
      if (this.state.progress < 1 && (
        (
          !!this.state.outfit.items.top && 
          !!this.state.outfit.items.bottom
        ) || 
        (!!this.state.outfit.items.full))) { //review: i had this check to make sure that the full was not cover type 3, but i think that does nothing because you can't insert full of type 3 into the state anyways
        this.setState({ progress: 1 });
      }
      if (this.state.progress < 2 && !!this.state.outfit.items.shoes) {
        this.setState({ progress: 2 });
      }
      if (this.state.progress < 3 && !!this.state.outfit.items.layers && this.state.outfit.items.layers.length !== 0) {
        this.setState({ progress: 3 });
      }
      if (this.state.progress < 4 && !!this.state.outfit.items.accessories && this.state.outfit.items.accessories.length !== 0) {
        this.setState({ progress: 4 });
      }
    })
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
      type: "base" | "top" | "bottom" | "full" | "shoes" | "layers" | "accessories",
    },
    allowed: Array<{ class?: string, type?: string, cover?: number, date?: number }>,
    disallowed: Array<{ class?: string, type?: string, cover?: number, date?: number }>
  ) => {
    this.props.navigation.navigate("LibrarySelector",
      {
        selectionMode: "one",
        greyFilters: { allowed: allowed, disallowed: disallowed },
        greyMode: true,
        return: {
          setItem: (item) => {
            this.props.navigation.navigate('Manual');
            // this.addItem(item);
            this.setItem({ ...options, item: item });
          },
          removeItem: (date) => {
            this.removeItem(date);
          },
        }
      })
  }

  getItemView(item: Item) {
    return (
      <View style={styles.itemViewContainer}>
        <TouchableHighlight underlayColor="rgba(0,0,0,0.2)">
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


          <Label title="start with a base" progress={this.state.progress} step={1} />


          {!!this.state.outfit.items.top || !!this.state.outfit.items.bottom || !!this.state.outfit.items.full ? (
            <View>
              {!!this.state.outfit.items.full && ItemDefinitions.getCover(this.state.outfit.items.full.type) !== 3 && this.getItemView(this.state.outfit.items.full)}
              {(
                !!this.state.outfit.items.top ||
                !!this.state.outfit.items.bottom ||
                (!!this.state.outfit.items.full && ItemDefinitions.getCover(this.state.outfit.items.full.type) === 3))
                && (
                  <View>
                    {!!this.state.outfit.items.top ? (
                      this.getItemView(this.state.outfit.items.top)
                    ) : (
                        <TouchableHighlight style={styles.tileButton} underlayColor="rgba(0,0,0,0.2)" onPress={() => this.getItemFromLibrary(
                          { type: "top" },
                          [{ class: "top", cover: 1 }, { class: "top", cover: 2 }],
                          [])}>
                          <Text>add a top</Text>
                        </TouchableHighlight>
                      )};
                    {!!this.state.outfit.items.bottom || !!(!!this.state.outfit.items.full && ItemDefinitions.getCover(this.state.outfit.items.full.type) === 3) ? (
                      <React.Fragment>
                        {!!this.state.outfit.items.bottom && this.getItemView(this.state.outfit.items.bottom)}
                        {!!(!!this.state.outfit.items.full && ItemDefinitions.getCover(this.state.outfit.items.full.type) === 3) && this.getItemView(this.state.outfit.items.full)}
                      </React.Fragment>
                    ) : (
                        <TouchableHighlight style={styles.tileButton} underlayColor="rgba(0,0,0,0.2)" onPress={() => this.getItemFromLibrary(
                          { type: "base" },
                          [{ class: "bottom" }, { class: "full", cover: 3 }],
                          [])}>
                          <Text>add a bottom</Text>
                        </TouchableHighlight>
                      )};
                  </View>
                )};
              </View>
          ) : (
              <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" style={styles.tileButton}
                onPress={() => this.getItemFromLibrary(
                  { type: "base" },
                  [{ class: "top" }, { class: "bottom" }, { class: "full" }],
                  [{class: "top", cover: 3}])}>
                <Text style={commonStyles.pb}>icons here</Text>
              </TouchableHighlight>
            )}


          <Label title="add shoes" progress={this.state.progress} step={2} />

          {!!this.state.outfit.items.shoes ? (
            this.getItemView(this.state.outfit.items.shoes)
          ) : (
              <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" style={styles.tileButton}
                onPress={() => {
                  this.state.progress >= 1 ? this.getItemFromLibrary(
                    { type: "shoes" },
                    [{ class: "shoes" }],
                    [])
                    :
                    alert("try picking your base first");
                }}>
                <Text style={commonStyles.pb}>shoe icon</Text>
              </TouchableHighlight>
            )}

          <Label title="add layers" progress={this.state.progress} step={3} />

          {this.state.outfit.items.layers.length !== 0 ? (
            this.state.outfit.items.layers.map((item, index) => {
              return(<View key={index}>
                {this.getItemView(item)}
              </View>);
            })
          ) : (
              <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" style={styles.tileButton}
                onPress={() => {
                  this.state.progress >= 2 ? this.getItemFromLibrary(
                    { type: "layers" },
                    [{ class: "top" }],
                    [{ class: "top", cover: 1 }])
                    :
                    alert("try picking your base and shoes first");
                }}>
                <Text style={commonStyles.pb}>layer icon</Text>
              </TouchableHighlight>
            )}

          <Label title="add accessories" progress={this.state.progress} step={4} />

          {this.state.outfit.items.accessories.length !== 0 ? (
            
            this.state.outfit.items.accessories.map((item, index) => {
              console.log(item, index)
              return(<View key={index}>
                {this.getItemView(item)}
              </View>);
            })
          ) : (
              <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" style={styles.tileButton}
                onPress={() => {
                  this.state.progress >= 2 ? this.getItemFromLibrary(
                    { type: "accessories" },
                    [{ class: "accessory" }],
                    [])
                    :
                    alert("try picking your base and shoes first");
                }}>
                <Text style={commonStyles.pb}>layer icon</Text>
              </TouchableHighlight>
            )}


        </View>
      </PageLayout>
    );
  }
}

function Label(props: { title: string, progress: number, step: number }) {
  return (
    <View style={styles.label}>
      <View style={[styles.icon, { backgroundColor: props.progress >= props.step ? StyleConstants.successColor : "#e9e9e9", position: "absolute" }]}>
        {props.progress >= props.step ? (
          <MaterialIcons name="check" size={40} />
        ) : (
            <Text style={[commonStyles.h2, commonStyles.bold]}>{props.step.toString()}</Text>
          )}
      </View>
      <Text style={[commonStyles.h2, commonStyles.bold, commonStyles.centerText, { width: "100%" }]}>{props.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: 'center'
  },
  tileImage: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 20,
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