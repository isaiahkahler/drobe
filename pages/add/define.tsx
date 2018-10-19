'use strict';
import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  TouchableHighlight,
  TextInput,
  Dimensions,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  Picker,
  Platform,
  SegmentedControlIOS,
  Animated,
  Easing
} from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import { Item, ItemDefinitions, Storage, roundColor } from '../../components/formats';
import { TriangleColorPicker, fromHsv } from 'react-native-color-picker';
import Color from 'color';

//temp
import {FileSystem} from 'expo';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const isIos = Platform.OS === 'ios';

interface DefineProps {
  navigation: any;
}
interface DefineState {
  showTypeList: boolean;
  showModal: boolean;
  renderImage: boolean;
  uri: string;
  options: Item;
  showRequired: boolean;
  colorButton: string;
  modalFadeInAnimation: Animated.Value;
  showRequiredShakeAnimation: Animated.ValueXY;
}

export class Define extends React.Component<DefineProps, DefineState> {
  constructor(props: DefineProps) {
    super(props);
    this.state = {
      showTypeList: false,
      showModal: false,
      renderImage: false,
      uri: '',
      options: {
        class: 'top',
        type: null,
        color: null,
        // cover: null,
        date: Date.now(),
        laundry: 0,
        name: null,
        uses: 0,
        photoURI: null
      },
      showRequired: false,
      colorButton: '#000',
      modalFadeInAnimation: new Animated.Value(0),
      showRequiredShakeAnimation: new Animated.ValueXY({ x: 0, y: 0 })
    };
  }
  static navigationOptions = {
    title: 'Define Attributes'
  };

  componentDidMount = async () => {
    let data = await Storage._retrieveData('addData');
    this.setState(previousState => ({
      uri: data.uri,
      renderImage: true
    }));
  };

  updateData = (
    key: 'class' | 'type' | 'color' | 'cover' | 'name',
    value: boolean | string | number
  ) => {
    if (key === 'class') {
      this.setState(previousState => ({
        ...previousState,
        options: { ...previousState.options, class: value as any, type: null }
      }));
    } else {
      this.setState(previousState => ({
        ...previousState,
        options: { ...previousState.options, [key]: value }
      }));
    }
  };

  //temp!!! delete later
  printData = async () => {
    let page1 = await Storage._retrieveData('page1');
    console.log(page1.items);
    
  };

  componentDidUpdate = () => {
    if (this.state.showModal) {
      Animated.spring(this.state.modalFadeInAnimation, {
        toValue: 1,
        // duration: 100
      }).start();
    }

    if(this.state.showRequired) {
      
    }
  };

  hideModal = () => {
    Animated.spring(this.state.modalFadeInAnimation, {
      toValue: 0, 
      // duration: 100
    }).start(() => this.setState({ showModal: false }));
  };

  shakeRequired = () => {
    Animated.sequence([
      Animated.timing(
        this.state.showRequiredShakeAnimation,
        {
          toValue: {x: 20, y: 0},
          duration: 50
        }
      ),
      Animated.timing(
        this.state.showRequiredShakeAnimation,
        {
          toValue: {x: -20, y: 0},
          duration: 100
        }
      ),
      Animated.timing(
        this.state.showRequiredShakeAnimation,
        {
          toValue: {x: 20, y: 0},
          duration: 100
        }
      ),
      Animated.timing(
        this.state.showRequiredShakeAnimation,
        {
          toValue: {x: 0, y: 0},
          duration: 50
        }
      ),
    ]).start();
  }

  addItem = () => {
    this.setState({ showRequired: true });
    this.shakeRequired();
    if (!!this.state.options.color && !!this.state.options.type) {
      //if color and type are filled
      if (!this.state.options.name) {
        //if name is null fill name
        this.setState(
          previousState => ({
            ...previousState,
            options: {
              ...previousState.options,
              name: `${roundColor(Color(this.state.options.color).object() as any)} ${
                this.state.options.type
              }`
            }
          }),
          () => {
            //one setState has finished
            this.storeItem();
          }
        );
      } else {
        //color, type, and name are filled
        this.storeItem();
      }
    }
  };

  storeItem = () => {
    //async move photo from cache to filesystem storage .then store item
    Storage.MovePhotoFromCache(this.state.uri, (newURI) => {
      this.setState(previousState => ({
        ...previousState,
        options: {...previousState.options, photoURI: newURI}
      }), async () => {
        await Storage.storeItem(this.state.options);
        this.props.navigation.navigate('Library');
      });
    });
  };

  selectItemType = (index: number) => {};

  render() {
    return (
      <React.Fragment>
        <PageLayout scroll>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{padding: "5%"}}>
              {/* image preview */}
              <View style={styles.defineContainer}>
                {this.state.renderImage && (
                  <Image
                    source={{ uri: this.state.uri }}
                    style={{ width: '100%', aspectRatio: 1 }}
                  />
                )}
              </View>
              {/* name */}
              <View style={styles.defineContainer}>
                <Label>Clothing Item Name</Label>
                <TextInput
                  placeholder="enter optional name"
                  style={[styles.inputLine, commonStyles.pb]}
                  onChangeText={value => this.updateData('name', value)}
                  value={this.state.options.name}
                />
              </View>

              {/* class picker */}
              <View>
                {isIos ? (
                  <View style={styles.defineContainer}>
                    <Label>Clothing Item Type</Label>
                    <SegmentedControlIOS
                      values={['top', 'bottom', 'full body', 'shoes', 'accessory']}
                      selectedIndex={ItemDefinitions.classes.indexOf(this.state.options.class)}
                      tintColor="#000"
                      onChange={value =>
                        this.updateData(
                          'class',
                          ItemDefinitions.classes[value.nativeEvent.selectedSegmentIndex]
                        )
                      }
                    />
                  </View>
                ) : (
                  //android
                  <View style={styles.defineContainer}>
                    <Label>Clothing Item Type</Label>
                    <View style={styles.fullWidthButton}>
                    <Picker onValueChange={value => this.updateData('class', value)} selectedValue={this.state.options.class}>
                      <Picker.Item label="top" value="top" />
                      <Picker.Item label="bottom" value="bottom" />
                      <Picker.Item label="full body" value="full body" />
                      <Picker.Item label="shoes" value="shoes" />
                      <Picker.Item label="accessory" value="accessory" />
                    </Picker>
                    </View>
                  </View>
                )}
              </View>
              {/* type picker */}
              <Animated.View style={[styles.defineContainer, (!this.state.options.type && {left: this.state.showRequiredShakeAnimation.x})]}>
                <Label isFilledIn={this.state.options.type} showRequired={this.state.showRequired}>
                  Clothing Item
                </Label>
                <View style={styles.fullWidthButton}>
                  <TouchableHighlight
                    style={styles.touchableHighlight}
                    onPress={() => {
                      this.setState({ showTypeList: true });
                    }}
                  >
                    <Text style={commonStyles.pb}>
                      {this.state.options.type ? this.state.options.type : 'choose item...'}
                    </Text>
                  </TouchableHighlight>
                  {this.state.showTypeList && (
                    <View style={styles.typeList}>
                      {ItemDefinitions.types[this.state.options.class].map(
                        (item: any, index: number) => {
                          return (
                            <TouchableHighlight
                              key={index}
                              onPress={() => {
                                this.updateData('type', item);
                                this.setState({ showTypeList: false });
                              }}
                            >
                              <Text style={commonStyles.pb}>{item}</Text>
                            </TouchableHighlight>
                          );
                        }
                      )}
                      <Text />
                    </View>
                  )}
                </View>
              </Animated.View>
              {/* color picker button*/}
              {/* review: are you supposed to translate Animated.View by setting the style of the left and top? */}
              <Animated.View style={[styles.defineContainer, (!this.state.options.color && {left: this.state.showRequiredShakeAnimation.x})]}>
                <Label isFilledIn={this.state.options.color} showRequired={this.state.showRequired}>
                  Item Color
                </Label>
                <View
                  style={[styles.fullWidthButton, { backgroundColor: this.state.options.color }]}
                >
                  <TouchableHighlight
                    style={styles.touchableHighlight}
                    onPress={() => {
                      this.setState({ showModal: true });
                    }}
                  >
                    <Text style={[commonStyles.pb, { color: this.state.colorButton }]}>
                      {this.state.options.color
                        ? roundColor(Color(this.state.options.color).object() as any)
                        : 'choose color'}
                    </Text>
                  </TouchableHighlight>
                </View>
              </Animated.View>

              {/* <View style={styles.defineContainer}>
                <View style={styles.fullWidthButton}>
                  <Button title="print data" onPress={this.printData} />
                </View>
              </View> */}
              <View style={styles.defineContainer}>
                <View style={styles.fullWidthButton}>
                  <Button title="add item" onPress={this.addItem} />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </PageLayout>
        {/* color picker modal */}
        {this.state.showModal && (
          <Animated.View
            style={[styles.modalAnimatedView, { opacity: this.state.modalFadeInAnimation}]} onPress={() => {console.log("hmm?")}}
          >
            <TouchableHighlight 
              underlayColor="rgba(0,0,0,0)"
              onPress={this.hideModal}
              style={styles.modalContainer}
            >
              <View style={styles.modal}>
                <TriangleColorPicker
                  onColorChange={color => {
                    let colorObj = Color(fromHsv(color));
                    if (colorObj.luminosity() < 0.5) {
                      this.setState({ colorButton: '#fff' });
                    } else {
                      this.setState({ colorButton: '#000' });
                    }
                    this.setState(previousState => ({
                      ...previousState,
                      options: { ...previousState.options, color: fromHsv(color) }
                    }));
                  }}
                  style={{ width: '100%', aspectRatio: 1 }}
                />
                <View style={styles.modalButtonClose}>
                  <Button
                    title="close"
                    onPress={() => {
                      this.hideModal();
                    }}
                    color="#000"
                  />
                </View>
              </View>
            </TouchableHighlight>
          </Animated.View>
        )}
      </React.Fragment>
    );
  }
}

function Label(props: { children: any; isFilledIn?: any; showRequired?: boolean }) {
  //review: code works without if statement - just the first return BUT may set style={[commonStyles.pb, false]} and that may be not good?
  if (props.hasOwnProperty('isFilledIn')) {
    return (
      <View style={[styles.label]}>
        <Text
          style={[commonStyles.pb, !props.isFilledIn && props.showRequired && { color: '#e6194B' }]}
        >
          {props.children}
        </Text>
      </View>
    );
  } else {
    return (
      <View style={[styles.label]}>
        <Text style={commonStyles.pb}>{props.children}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defineContainer: {
    width: '100%',
    marginVertical: width * 0.025
  },
  inputLine: {
    width: '100%',
    padding: 5,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10
  },
  label: {
    marginBottom: 5
  },
  fullWidthButton: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10
  },
  touchableHighlight: {
    padding: 5
  },
  typeList: {
    paddingHorizontal: 5
  },
  modalAnimatedView: {
    
    position: 'absolute',
    width: width,
    height: height,
    flex: 1,
    zIndex: 5,
    // backgroundColor: "#00ff00"
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10%',
    // backgroundColor: "#ff0000"
  },
  modal: {
    // aspectRatio: 0.75,
    width: '100%',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#fff', //'rgba(255,255,255,0.75)',
    padding: '5%'
  },
  modalButtonClose: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    marginTop: 10
  }
});
