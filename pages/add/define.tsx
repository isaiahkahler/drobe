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
import { Item, ItemDefinitions } from '../../components/formats';
import { Storage } from '../../components/storage';
import { ItemManager } from '../../components/itemManager';
import { roundColor, roundColors } from '../../components/helpers';
import { TriangleColorPicker } from '../../components/colorpicker/TriangleColorPicker';

import { fromHsv } from '../../components/colorpicker/utils';
import Color from 'color';
import { number } from 'prop-types';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const isIos = Platform.OS === 'ios';

interface DefineProps {
  navigation: any;
}
interface DefineState {
  editMode: boolean;
  pageIndex: number;
  itemIndex: number;
  options: Item;
  renderImage: boolean;
  uri: string;
  showTypeList: boolean;
  modal: {
    // show: boolean;
    index: number;
    action: 'new' | 'add' | 'change';
  };
  showRequired: boolean;
  showRequiredShakeAnimation: Animated.ValueXY;
}

//TO DO!!!!!!!!!!!!!!!!!!!!!!!!
//make sure that everything in this page woRKS with GIVEN DATA!!!!
//it was designed from start to CREATE data, but should work to EDIT data!!!!

export class Define extends React.Component<DefineProps, DefineState> {
  constructor(props: DefineProps) {
    super(props);
    this.state = {
      editMode: false,
      pageIndex: null,
      itemIndex: null,
      options: {
        class: 'top',
        type: null,
        name: null,
        colors: null,
        date: Date.now(),
        uses: 0,
        laundry: 0,
        photoURI: null,
      },
      renderImage: false,
      uri: null,
      showTypeList: false,
      modal: {
        // show: false,
        index: -1,
        action: null
      },
      showRequired: false,
      showRequiredShakeAnimation: new Animated.ValueXY({ x: 0, y: 0 })
    };
  }

  static navigationOptions = {
    title: 'Define Attributes'
  };

  _modal = React.createRef<PageLayout>();

  componentDidMount = async () => {
    let data = await Storage._retrieveData('define');
    if (data.editMode) {
      let item: Item = await ItemManager.getItem(data.pageIndex, data.itemIndex);
      this.setState({ options: item })
    }
    this.setState(previousState => ({
      editMode: data.editMode,
      pageIndex: data.pageIndex,
      itemIndex: data.itemIndex,
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

  componentDidUpdate = () => {
    // if(this.state.modal.show) {
    //   this._modal.current.openModal();
    // }

  };

  hideModal = () => {
    this._modal.current.closeModal();
    this.setState({ modal: { index: -1, action: null } })
  }

  openModal = () => {
    this._modal.current.openModal();
  }

  shakeRequired = () => {
    Animated.sequence([
      Animated.timing(this.state.showRequiredShakeAnimation, {
        toValue: { x: 20, y: 0 },
        duration: 50
      }),
      Animated.timing(this.state.showRequiredShakeAnimation, {
        toValue: { x: -20, y: 0 },
        duration: 100
      }),
      Animated.timing(this.state.showRequiredShakeAnimation, {
        toValue: { x: 20, y: 0 },
        duration: 100
      }),
      Animated.timing(this.state.showRequiredShakeAnimation, {
        toValue: { x: 0, y: 0 },
        duration: 50
      })
    ]).start();
  };

  addItem = () => {
    this.setState({ showRequired: true });
    this.shakeRequired();
    if (!!this.state.options.colors && !!this.state.options.type) {
      if (this.state.options.colors.length !== 0) {
        //if color and type are filled
        if (!this.state.options.name) {
          //if name is null fill name
          this.setState(
            previousState => ({
              ...previousState,
              options: {
                ...previousState.options,
                name: `${roundColors(this.state.options.colors)} ${this.state.options.type}`
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
    }
  };

  storeItem = () => {
    if (!this.state.editMode) {
      //async move photo from cache to filesystem storage .then store item
      Storage.MovePhotoFromCache(this.state.uri, newURI => {
        this.setState(
          previousState => ({
            ...previousState,
            options: { ...previousState.options, photoURI: newURI }
          }),
          async () => {
            await Storage.storeItem(this.state.options);
            this.props.navigation.navigate('Library');
          }
        );
      });
    } else { //is in edit mode
      Storage.overwriteItem(this.state.pageIndex, this.state.itemIndex, this.state.options, () => {
        this.props.navigation.goBack();
      })
    }

    //for both
    Storage._deleteData('define');
  };

  render() {
    let modal = this.state.modal.action === 'change' ? (
      <React.Fragment>
        <TriangleColorPicker
          oldColor={this.state.options.colors[this.state.modal.index]}
          onColorSelected={color => {
            let hexColor = fromHsv(color);
            this.setState(previousState => ({
              ...previousState,
              options: {
                ...previousState.options,
                colors: [
                  ...previousState.options.colors.slice(0, previousState.modal.index),
                  hexColor,
                  ...previousState.options.colors.splice(
                    previousState.modal.index + 1,
                    previousState.options.colors.length
                  )
                ]
              }
            }));
            this.hideModal();
          }}
          style={{ width: '100%', aspectRatio: 1 }}
        />
        <View style={styles.verticalPadding}>

          <TouchableHighlight
            style={commonStyles.button}
            underlayColor="rgba(0,0,0,0.2)"
            onPress={() => {
              this.setState(previousState => ({
                ...previousState,
                options: {
                  ...previousState.options,
                  colors: [
                    ...previousState.options.colors.slice(0, previousState.modal.index),
                    ...previousState.options.colors.slice(
                      previousState.modal.index + 1,
                      previousState.options.colors.length
                    )
                  ]
                }
              }), () => {
                if (this.state.options.colors.length === 0) {
                  this.setState(previousState => ({
                    ...previousState,
                    options: { ...previousState.options, colors: null }
                  }))
                }
              });
              this.hideModal();
            }}
          >
            <Text style={[commonStyles.buttonText, commonStyles.centerText]}>remove color</Text>
          </TouchableHighlight>
        </View>
      </React.Fragment>
    ) : (
        <TriangleColorPicker
          //on selected color = round color to name, set in state,
          //choose color button set in state (w index),  add color to state

          onColorSelected={color => {
            let hexColor = fromHsv(color);
            if (this.state.modal.action === 'new') {
              this.setState(previousState => ({
                ...previousState,
                options: { ...previousState.options, colors: [hexColor] },
                modal: { index: -1, action: null }
              }));
              this.hideModal();
            } else if (this.state.modal.action === 'add') {
              this.setState(previousState => ({
                ...previousState,
                options: {
                  ...previousState.options,
                  colors: [...previousState.options.colors, hexColor]
                }
              }));
              this.hideModal();
            }
          }}
          style={{ width: '100%', aspectRatio: 1 }}
        />
      );


    return (
      <React.Fragment>
        <PageLayout scroll padding modal={modal} ref={this._modal}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <React.Fragment>
              {/* image preview */}
              <View style={styles.verticalPadding}>
                {this.state.renderImage && (
                  <Image
                    source={{ uri: this.state.uri }}
                    style={{ width: '100%', aspectRatio: 1 }}
                  />
                )}
              </View>
              {/* name */}
              <View style={styles.verticalPadding}>
                <Label>Clothing Item Name</Label>
                <TextInput
                  placeholder="enter name (optional)"
                  style={[styles.inputLine, commonStyles.textInput]}
                  onChangeText={value => this.updateData('name', value)}
                  value={this.state.options.name}
                />
              </View>
              {/* class picker */}
              <View>
                {isIos ? (
                  //ios
                  <View style={styles.verticalPadding}>
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
                    <View style={styles.verticalPadding}>
                      <Label>Clothing Item Type</Label>
                      <View style={styles.androidPicker}>
                        <Picker
                          onValueChange={value => this.updateData('class', value)}
                          selectedValue={this.state.options.class}
                        >
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
              {/* review: are you supposed to translate Animated.View by setting the style of the left and top? */}
              <Animated.View
                style={[
                  styles.verticalPadding,
                  !this.state.options.type && { left: this.state.showRequiredShakeAnimation.x }
                ]}
              >
                <Label isFilledIn={this.state.options.type} showRequired={this.state.showRequired}>
                  Clothing Item
                </Label>
                <View
                  style={[
                    commonStyles.button,
                    !!(this.state.showRequired && !this.state.options.type) && {
                      borderColor: '#e6194B'
                    }
                  ]}
                >
                  <TouchableHighlight
                    underlayColor="rgba(0,0,0,0.2)"
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
                              underlayColor="rgba(0,0,0,0.2)"
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

              {/* color picker button */}
              {/* REVIEW:   on delete, make sure if state.colors is empty array, set to NULL */}
              <Animated.View
                style={[
                  styles.verticalPadding,
                  !this.state.options.colors && { left: this.state.showRequiredShakeAnimation.x }
                ]}
              >
                <Label
                  isFilledIn={this.state.options.colors}
                  showRequired={this.state.showRequired}
                >
                  Item Color
                </Label>
                {!!this.state.options.colors ? (
                  <React.Fragment>
                    {this.state.options.colors.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={index === 0 ? undefined : { marginTop: width * 0.025 }}
                        >
                          <TouchableHighlight
                            underlayColor="rgba(0,0,0,0.2)"
                            style={[
                              commonStyles.button,
                              { backgroundColor: this.state.options.colors[index] }
                            ]}
                            onPress={() => {
                              this.setState({
                                modal: { index: index, action: 'change' }
                              }, () => {
                                this.openModal();
                              });
                            }}
                          >
                            <Text
                              style={[
                                commonStyles.pb,
                                {
                                  color: Color(this.state.options.colors[index]).isDark()
                                    ? '#fff'
                                    : '#000'
                                }
                              ]}
                            >
                              {roundColor(item)}
                            </Text>
                          </TouchableHighlight>
                        </View>
                      );
                    })}
                    <View style={styles.verticalPadding}>
                      <TouchableHighlight
                        style={commonStyles.button}
                        underlayColor="rgba(0,0,0,0.2)"
                        onPress={() => {
                          this.setState({
                            modal: {
                              index: this.state.options.colors.length,
                              action: 'add'
                            }
                          }, () => {
                            this.openModal()
                          });
                        }}
                      >
                        <Text style={commonStyles.pb}>add another color (optional)</Text>
                      </TouchableHighlight>
                    </View>
                  </React.Fragment>
                ) : (
                    <TouchableHighlight
                    underlayColor="rgba(0,0,0,0.2)"
                      style={[
                        commonStyles.button,
                        !!(this.state.showRequired && !this.state.options.colors) && {
                          borderColor: '#e6194B'
                        }
                      ]}
                      onPress={() => {
                        this.setState({ modal: { index: 0, action: 'new' } }, () => {
                          this.openModal();
                        });
                      }}
                    >
                      <Text style={commonStyles.pb}>choose color</Text>
                    </TouchableHighlight>
                  )}
              </Animated.View>

              {/* add button */}
              <View style={styles.verticalPadding}>
                <TouchableHighlight style={commonStyles.button} onPress={this.addItem} underlayColor="rgba(0,0,0,0.2)">
                  {this.state.editMode ? (
                    <Text style={[commonStyles.buttonText, commonStyles.centerText]}>store edits</Text>
                  ) : (
                      <Text style={[commonStyles.buttonText, commonStyles.centerText]}>add item</Text>
                    )}
                </TouchableHighlight>
              </View>
            </React.Fragment>
          </TouchableWithoutFeedback>
        </PageLayout>
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
  verticalPadding: {
    width: '100%',
    marginVertical: width * 0.025
  },
  inputLine: {
    width: '100%',
  },
  label: {
    marginBottom: 5
  },
  androidPicker: {
    // borderWidth: 2,
    // borderColor: '#000',
    // borderRadius: 10
    backgroundColor: "#e9e9e9"
  },
  typeList: {
    marginHorizontal: 5
  }
});
