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
  Modal,
  ActivityIndicator,
  ImageStore,
  FlatList
} from 'react-native';
import { Page } from '../../components/page';
import { commonStyles } from '../../components/styles';
import { Item, ItemDefinitions, Storage, roundColor } from '../../components/formats';
import { TriangleColorPicker, fromHsv } from 'react-native-color-picker';
import Color from 'color';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const isIos = Platform.OS === 'ios';

interface DefineProps {}
interface DefineState {
  showTypeList: boolean;
  showModal: boolean;
  renderImage: boolean;
  uri: string;
  options: Item;
  showRequired: boolean;
  colorButton: string;
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
        cover: null,
        date: Date.now(),
        laundry: 0,
        name: null,
        uses: 0,
        photoURI: null
      },
      showRequired: false,
      colorButton: '#000'
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
  printData = () => {
    console.log(this.state.options);
  };

  addItem = () => {
    this.setState({ showRequired: true });
    if (!!this.state.options.color && !!this.state.options.type) {
      //if color and type are filled
      if (!this.state.options.name) {
        //if name is null fill name
        this.setState(previousState => ({
          ...previousState,
          options: {...previousState.options}
        }))
      }
    }
  };

  selectItemType = (index: number) => {};

  render() {
    return (
      <React.Fragment>
        <Page scroll>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {/* name */}
              <View style={styles.defineContainer}>
                <TextInput
                  placeholder="clothing item name"
                  style={[styles.inputLine, commonStyles.pb]}
                  onChangeText={value => this.updateData('name', value)}
                />
              </View>
              {/* image preview */}
              <View style={styles.defineContainer}>
                {this.state.renderImage && (
                  <Image
                    source={{ uri: this.state.uri }}
                    style={{ width: '100%', aspectRatio: 1 }}
                  />
                )}
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
                    <Picker onValueChange={value => this.updateData('class', value)}>
                      <Picker.Item label="top" value="top" />
                      <Picker.Item label="bottom" value="bottom" />
                      <Picker.Item label="full body" value="full body" />
                      <Picker.Item label="shoes" value="shoes" />
                      <Picker.Item label="accessory" value="accessory" />
                    </Picker>
                  </View>
                )}
              </View>
              {/* type picker */}
              <View style={styles.defineContainer}>
                <Label>Clothing Item</Label>
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
              </View>
              {/* color picker button*/}
              <View style={styles.defineContainer}>
                <Label>Item Color</Label>
                <View style={styles.fullWidthButton}>
                  <TouchableHighlight
                    style={[
                      styles.touchableHighlight,
                      { backgroundColor: this.state.options.color }
                    ]}
                    onPress={() => { 
                      this.setState({ showModal: true });
                    }}
                  >
                    <Text style={[commonStyles.pb, { color: this.state.colorButton }]}>
                      {this.state.options.color ? roundColor(Color(this.state.options.color).object() as any) : "choose color" }
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>

              <View style={styles.defineContainer}>
                <View style={styles.fullWidthButton}>
                  <Button title="print data" onPress={this.printData} />
                </View>
              </View>
              <View style={styles.defineContainer}>
                <View style={styles.fullWidthButton}>
                  <Button title="add item" onPress={this.addItem} />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Page>
        {/* color picker modal */}
        {this.state.showModal && (
          <View style={styles.modalContainer}>
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
                style={{ width: "100%", aspectRatio: 1 }}
              />
              <View style={styles.modalButtonClose}>
                <Button
                  title="close"
                  onPress={() => {
                    this.setState({ showModal: false });
                  }}
                  color="#000"
                />
              </View>
            </View>
          </View>
        )}
      </React.Fragment>
    );
  }
}

function Label(props: { children: any }) {
  return (
    <View style={styles.label}>
      <Text style={commonStyles.pb}>{props.children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  defineContainer: {
    width: '100%',
    paddingHorizontal: '5%',
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
  required: {
    color: '#ff5050'
  },
  typeList: {
    paddingHorizontal: 5
  },
  modalContainer: {
    position: 'absolute',
    width: width,
    height: height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    padding: '10%'
  },
  modal: {
    // aspectRatio: 0.75,
    width: '100%',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#fff", //'rgba(255,255,255,0.75)',
    padding: '5%'
  },
  modalButtonClose: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    marginTop: 10
  },
});
