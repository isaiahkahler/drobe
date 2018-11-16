import * as React from 'react';
import { StyleSheet, View, Text, Button, TouchableHighlight, Image, Dimensions, Animated, Alert } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles, StyleConstants } from '../../components/styles';
import { Item, ItemDefinitions, SortFilter, Outfit, Filter } from '../../components/formats';
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
  createButtonSpacer: number;
  animations: {
    base: Animated.Value;
    shoes: Animated.Value;
  }
}

export class Manual extends React.Component<ManualProps, ManualState> {
  constructor(props: ManualProps) {
    super(props);
    this.state = {
      outfit: { items: { top: null, bottom: null, full: null, layers: [], accessories: [], shoes: null }, score: null },
      deleteItemAnimation: new Animated.Value(0),
      progress: 0,
      createButtonSpacer: 0,
      animations: {
        base: new Animated.Value(0),
        shoes: new Animated.Value(0)
      }
    }
  }

  static navigationOptions = {
    title: 'Create Manually'
  };

  setItem = (
    options: {
      type: "base" | "top" | "bottom" | "full" | "shoes" | "layers" | "accessories",
      item: Item
    }) => {
    let data;
    let type = options.type;
    //review: use of this.state ? should use previous state
    if (options.type === "base") {
      // if (options.item.class === "full" && !!this.state.outfit.items.bottom) {
      //   //if setting full and bottom exists, delete bottom
      //   this.removeItem(this.state.outfit.items.bottom.date)
      // } else if (options.item.class === "bottom" && !!this.state.outfit.items.full) {
      //   //if setting bottom and full exists, delete full
      //   this.removeItem(this.state.outfit.items.full.date)
      // }
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
        (
          !!this.state.outfit.items.full &&
          ItemDefinitions.getCover(this.state.outfit.items.full.type) === 3 &&
          !!this.state.outfit.items.top
        ) ||
        (
          !!this.state.outfit.items.full &&
          ItemDefinitions.getCover(this.state.outfit.items.full.type) !== 3
        ))) { //review: i had this check to make sure that the full was not cover type 3, but i think that does nothing because you can't insert full of type 3 into the state anyways
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

  removeItem = (id: number, callback?: Function) => {
    Object.keys(this.state.outfit.items).map(key => {
      let item = this.state.outfit.items[key];
      if (!!item) {
        if (Array.isArray(item)) {
          let index = item.findIndex(e => e.date === id);
          if (index !== -1) {
            this.setState(previousState => ({
              ...previousState,
              outfit: {
                ...previousState.outfit,
                items: {
                  ...previousState.outfit.items,
                  [key]: [...previousState.outfit.items[key].slice(0, index), ...previousState.outfit.items[key].slice(index + 1, previousState.outfit.items[key].length)]
                }
              }
            }), () => {
              if (!!callback) {
                callback();
              }
            })
          }
        } else {
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
            }), () => {
              if (!!callback) {
                callback();
              }
            })
          }
        }
      }
    })
  }

  animateButtons = () => {
    if (this.state.progress < 1) {
      Animated.sequence([
        Animated.timing(this.state.animations.base, {
          toValue: 20,
          duration: 50
        }),
        Animated.timing(this.state.animations.base, {
          toValue: -20,
          duration: 100
        }),
        Animated.timing(this.state.animations.base, {
          toValue: 20,
          duration: 100
        }),
        Animated.timing(this.state.animations.base, {
          toValue: 0,
          duration: 50
        })
      ]).start();
    }
    if (this.state.progress < 2) {
      Animated.sequence([
        Animated.timing(this.state.animations.shoes, {
          toValue: 20,
          duration: 50
        }),
        Animated.timing(this.state.animations.shoes, {
          toValue: -20,
          duration: 100
        }),
        Animated.timing(this.state.animations.shoes, {
          toValue: 20,
          duration: 100
        }),
        Animated.timing(this.state.animations.shoes, {
          toValue: 0,
          duration: 50
        })
      ]).start();
    }
  }

  getItemFromLibrary = (
    options: {
      type: "base" | "top" | "bottom" | "full" | "shoes" | "layers" | "accessories",
    },
    allowed: Filter,
    disallowed: Filter,
    replaceItem?: Item //IF REPLACING PREVIOUS ITEM, PASS IN THE PREVIOUS ITEM
  ) => {
    let notAllowed: Filter = { filter: [...disallowed.filter] }; //change to type of filter, once you make that
    Object.keys(this.state.outfit.items).map(key => {
      if (!!this.state.outfit.items[key]) {
        if (Array.isArray(this.state.outfit.items[key])) {
          this.state.outfit.items[key].forEach((item: Item) => {
            notAllowed.filter.push({ date: item.date })
            notAllowed.message = "this item is already in your outfit.";
          });
        } else {
          notAllowed.filter.push({ date: this.state.outfit.items[key].date });
          notAllowed.message = "this item is already in your outfit.";
        }
      }
    })
    // console.log("disallowed", notAllowed)
    this.props.navigation.navigate("LibrarySelector",
      {
        selectionMode: "one",
        greyFilters: { allowed: allowed, disallowed: notAllowed },
        greyMode: true,
        return: {
          setItem: (item) => {
            this.props.navigation.navigate('Manual');
            if (!!replaceItem) {
              this.removeItem(replaceItem.date, () => {
                this.setItem({ ...options, item: item });
              })
            } else {
              this.setItem({ ...options, item: item });
            }
          },
          //review: I THINK REMOVE ITEM IS UNUSED?
          removeItem: (date) => {
            this.removeItem(date);
          },
        }
      })
  }

  getItemView(item: Item, close?: boolean, onPress?: () => void) {
    return (
      <View style={styles.itemViewContainer}>
        <TouchableHighlight underlayColor="rgba(0,0,0,0.2)">
          <View>
            <TouchableHighlight
              style={[styles.iconSmall, { backgroundColor: "#ccc", position: "absolute", zIndex: 2, top: -15, left: -15 }]}
              underlayColor="#aaa"
              onPress={onPress ? () => onPress() : () => { }}>
              <MaterialIcons name={close ? "close" : "swap-horiz"} size={35} />
            </TouchableHighlight>
            <Image source={{ uri: item.photoURI }} style={styles.tileImage as any} />
          </View>
        </TouchableHighlight>
        <Text style={[styles.itemViewText, commonStyles.pb, commonStyles.centerText]}>{item.name}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={{ width: "100%", height: "100%" }}>
        <PageLayout scroll padding>
          <View style={{ flex: 1, alignItems: "center" }}>


            <Label title="start with a base" progress={this.state.progress} step={1} />


            {!!this.state.outfit.items.top || !!this.state.outfit.items.bottom || !!this.state.outfit.items.full ? (
              <View>
                {!!this.state.outfit.items.full && ItemDefinitions.getCover(this.state.outfit.items.full.type) !== 3 && this.getItemView(this.state.outfit.items.full, false, () => {

                  this.getItemFromLibrary(
                    { type: "base" },
                    {
                      filter: [{ class: "top" }, { class: "bottom" }, { class: "full" }],
                      message: "clothing item must be a top, bottom, or full body, and it must be able to be worn by itself."
                    },
                    { filter: [{ class: "top", cover: 3 }] },
                    this.state.outfit.items.full)
                })}
                {(
                  !!this.state.outfit.items.top ||
                  !!this.state.outfit.items.bottom ||
                  (!!this.state.outfit.items.full && ItemDefinitions.getCover(this.state.outfit.items.full.type) === 3))
                  && (
                    <View>
                      {!!this.state.outfit.items.top ? (
                        this.getItemView(this.state.outfit.items.top, false, () => this.getItemFromLibrary(
                          { type: "top" },
                          {
                            filter: [{ class: "top", cover: 1 }, { class: "top", cover: 2 }],
                            message: "item must be a top and must be able to be worn alone"
                          },
                          { filter: [] }))
                      ) : (
                          <Animated.View
                            style={{
                              transform: [
                                {
                                  rotateZ: this.state.animations.base.interpolate(
                                    { inputRange: [-20, 20], outputRange: ['-20deg', '20deg'] }
                                  )
                                }
                              ]
                            }}>
                            <TouchableHighlight style={styles.tileButton} underlayColor="rgba(0,0,0,0.2)" onPress={() => this.getItemFromLibrary(
                              { type: "top" },
                              {
                                filter: [{ class: "top", cover: 1 }, { class: "top", cover: 2 }],
                                message: "item must be a top and must be able to be worn alone"
                              },
                              { filter: [] })}>
                              <Text>add a top</Text>
                            </TouchableHighlight>
                          </Animated.View>
                        )};
                    {!!this.state.outfit.items.bottom || !!(!!this.state.outfit.items.full && ItemDefinitions.getCover(this.state.outfit.items.full.type) === 3) ? (
                        <React.Fragment>
                          {!!this.state.outfit.items.bottom && this.getItemView(this.state.outfit.items.bottom, false, () => {
                            this.getItemFromLibrary(
                              { type: "base" },
                              {
                                filter: [{ class: "bottom" }, { class: "full", cover: 3 }],
                                message: "item must be a bottom and must be able to be worn alone"
                              },
                              { filter: [] },
                              this.state.outfit.items.bottom)
                          })
                          }
                          {!!(!!this.state.outfit.items.full && ItemDefinitions.getCover(this.state.outfit.items.full.type) === 3) && this.getItemView(this.state.outfit.items.full, false, () => {
                            this.getItemFromLibrary(
                              { type: "base" },
                              {
                                filter: [{ class: "bottom" }, { class: "full", cover: 3 }],
                                message: "item must be a bottom and must be able to be worn alone"
                              },
                              { filter: [] },
                              this.state.outfit.items.full)
                          })}
                        </React.Fragment>
                      ) : (
                          <Animated.View
                            style={{
                              transform: [
                                {
                                  rotateZ: this.state.animations.base.interpolate(
                                    { inputRange: [-20, 20], outputRange: ['-20deg', '20deg'] }
                                  )
                                }
                              ]
                            }}>
                            <TouchableHighlight style={styles.tileButton} underlayColor="rgba(0,0,0,0.2)" onPress={() => this.getItemFromLibrary(
                              { type: "base" },
                              {
                                filter: [{ class: "bottom" }, { class: "full", cover: 3 }],
                                message: "item must be a bottom and must be able to be worn alone"
                              },
                              { filter: [] })}>
                              <Text>add a bottom</Text>
                            </TouchableHighlight>
                          </Animated.View>
                        )};
                  </View>
                  )};
              </View>
            ) : (
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotateZ: this.state.animations.base.interpolate(
                          { inputRange: [-20, 20], outputRange: ['-20deg', '20deg'] }
                        )
                      }
                    ]
                  }}>
                  <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" style={styles.tileButton}
                    onPress={() => this.getItemFromLibrary(
                      { type: "base" },
                      {
                        filter: [{ class: "top" }, { class: "bottom" }, { class: "full" }],
                        message: "clothing item must be a top, bottom, or full body, and it must be able to be worn by itself."
                      },
                      { filter: [{ class: "top", cover: 3 }] })}>
                    <Text style={commonStyles.pb}>icons here</Text>
                  </TouchableHighlight>
                </Animated.View>
              )}


            <Label title="add shoes" progress={this.state.progress} step={2} />

            {!!this.state.outfit.items.shoes ? (
              this.getItemView(this.state.outfit.items.shoes, false, () => {
                this.state.progress >= 1 ? this.getItemFromLibrary(
                  { type: "shoes" },
                  {
                    filter: [{ class: "shoes" }],
                    message: "clothing item must be shoes"
                  },
                  { filter: [] })
                  :
                  Alert.alert(
                    "not yet",
                    "try adding a base first",
                    [
                      { text: "OK", style: "cancel" }
                    ]
                  )
              })
            ) : (
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotateZ: this.state.animations.shoes.interpolate(
                          { inputRange: [-20, 20], outputRange: ['-20deg', '20deg'] }
                        )
                      }
                    ]
                  }}>
                  <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" style={styles.tileButton}
                    onPress={() => {
                      this.state.progress >= 1 ? this.getItemFromLibrary(
                        { type: "shoes" },
                        {
                          filter: [{ class: "shoes" }],
                          message: "clothing item must be shoes"
                        },
                        { filter: [] })
                        :
                        Alert.alert(
                          "not yet",
                          "try adding a base first",
                          [
                            { text: "OK", style: "cancel" }
                          ]
                        )
                    }}>
                    <Text style={commonStyles.pb}>shoe icon</Text>
                  </TouchableHighlight>
                </Animated.View>
              )}

            <Label title="add layers" progress={this.state.progress} step={3} />

            {this.state.outfit.items.layers.length !== 0 ? (
              <View>
                {this.state.outfit.items.layers.map((item, index) => {
                  return (<View key={index}>
                    {this.getItemView(item, true, () => {
                      this.removeItem(item.date)
                    })}

                  </View>);
                })}
                <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" style={styles.tileButton}
                  onPress={() => {
                    //REVIEW: double check these branches - does each give the right alert?
                    //wait thats impossible - theres not top of cover type 1
                    this.state.progress >= 2 ? this.getItemFromLibrary(
                      { type: "layers" },
                      {
                        filter: [{ class: "top" }],
                        message: "a layer must be a top"
                      },
                      {
                        filter: [{ class: "top", cover: 1 }],
                        message: "this item has to be worn alone so it can't be worn as a layer. you can try replacing it in your base."
                      })
                      :
                      Alert.alert(
                        "not yet",
                        "try adding a base and shoes first",
                        [
                          { text: "OK", style: "cancel" }
                        ]
                      )
                  }}>
                  <Text style={commonStyles.pb}>add another layer</Text>
                </TouchableHighlight>
              </View>
            ) : (
                <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" style={styles.tileButton}
                  onPress={() => {
                    this.state.progress >= 2 ? this.getItemFromLibrary(
                      { type: "layers" },
                      {
                        filter: [{ class: "top" }],
                        message: "a layer must be a top"
                      },
                      {
                        filter: [{ class: "top", cover: 1 }],
                        message: "this item has to be worn alone so it can't be worn as a layer. you can try replacing it in your base."
                      })
                      :
                      Alert.alert(
                        "not yet",
                        "try adding a base and shoes first",
                        [
                          { text: "OK", style: "cancel" }
                        ]
                      )
                  }}>
                  <Text style={commonStyles.pb}>layer icon</Text>
                </TouchableHighlight>
              )}

            <Label title="add accessories" progress={this.state.progress} step={4} />

            {this.state.outfit.items.accessories.length !== 0 ? (

              this.state.outfit.items.accessories.map((item, index) => {
                return (<View key={index}>
                  {this.getItemView(item, true, () => {
                    this.removeItem(item.date)
                  })}
                  <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" style={styles.tileButton}
                    onPress={() => {
                      this.state.progress >= 2 ? this.getItemFromLibrary(
                        { type: "accessories" },
                        {
                          filter: [{ class: "accessory" }],
                          message: "item must be an accessory"
                        },
                        { filter: [] })
                        :
                        Alert.alert(
                          "not yet",
                          "try adding a base and shoes first",
                          [
                            { text: "OK", style: "cancel" }
                          ]
                        )
                    }}>
                    <Text style={commonStyles.pb}>add another accessory</Text>
                  </TouchableHighlight>
                </View>);
              })
            ) : (
                <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" style={styles.tileButton}
                  onPress={() => {
                    this.state.progress >= 2 ? this.getItemFromLibrary(
                      { type: "accessories" },
                      {
                        filter: [{ class: "accessory" }],
                        message: "item must be an accessory"
                      },
                      { filter: [] })
                      :
                      Alert.alert(
                        "not yet",
                        "try adding a base and shoes first",
                        [
                          { text: "OK", style: "cancel" }
                        ]
                      )
                  }}>
                  <Text style={commonStyles.pb}>add accessory</Text>
                </TouchableHighlight>
              )}
            <View style={{ height: this.state.createButtonSpacer }} />
          </View>
        </PageLayout>

        <View style={styles.createButtonContainer}>
          <TouchableHighlight
            style={[styles.createButton, { backgroundColor: (this.state.progress >= 2 ? StyleConstants.successColor : "#e9e9e9") }]}
            onLayout={(event) => {
              var { height } = event.nativeEvent.layout;
              this.setState({ createButtonSpacer: height })
            }}
            onPress={() => this.animateButtons()}
            underlayColor="rgba(0,0,0,0.2)">
            <Text style={[commonStyles.h2, (this.state.progress >= 2 ? commonStyles.bold : undefined), (this.state.progress >= 2 ? { color: "#fff" } : { color: "#ccc" })]}>create outfit</Text>
          </TouchableHighlight>
        </View>
      </View>
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
  iconSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    // marginVertical: width * 0.05

    marginVertical: width * 0.025
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "space-between",
    width: "100%",
    paddingVertical: width * 0.05

  },
  itemViewContainer: {
    marginVertical: width * 0.025
  },
  itemViewText: {
    width: width * 0.35
  },
  createButtonContainer: {
    position: "absolute",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    width: "100%",
    bottom: width * 0.025
  },
  createButton: {
    padding: 10,
    borderRadius: 50,
  }
});