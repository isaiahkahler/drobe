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
  ImageStore
} from 'react-native';
import { Page } from '../components/page';
import { commonStyles } from '../components/styles';
import { createStackNavigator } from 'react-navigation';
import { Camera, Permissions } from 'expo';
import { Item, ItemDefinitions, Storage } from '../components/formats';

const width = Dimensions.get('screen').width;
const isIos = Platform.OS === 'ios';

interface AddProps {
  navigation: any;
}
interface AddState {
  hasCameraPermission: any;
}

class Add extends React.Component<AddProps, AddState> {
  constructor(props: AddProps) {
    super(props);
    this.state = {
      hasCameraPermission: null
    };
  }
  static navigationOptions = {
    title: 'Add Clothes'
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState(previousState => ({
      ...previousState,
      hasCameraPermission: status === 'granted'
    }));
  }

  private _camera: any;

  _storeData = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  };
  _retrieveData = async (item: string) => {
    try {
      const value: any = await AsyncStorage.getItem(item);
      if (value !== null) {
        // We have data!!
        return value;
      }
      return null;
    } catch (error) {
      // Error retrieving data
      return null;
    }
  };

  takePicture = async () => {
    if (!this._camera) {
      return;
    }
    let photo = await this._camera.takePictureAsync({ base64: true }).then(data => {
      ImageStore.addImageFromBase64(
        data.base64,
        uri => {
          //success
          this._storeData('add-photo-uri', uri);
          this.props.navigation.navigate('Define');
          console.log(uri);
        },
        () => {
          //failure
          alert('there was a problem storing that image.');
        }
      );
    });
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={Camera.Constants.Type.back}
            ref={ref => {
              this._camera = ref;
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'column-reverse',
                // justifyContent: "center",
                alignItems: 'center'
              }}
            >
              <TouchableHighlight onPress={this.takePicture}>
                <View
                  style={{
                    width: 75,
                    height: 75,
                    backgroundColor: '#fff',
                    borderColor: '#000',
                    borderWidth: 5,
                    borderRadius: 100
                  }}
                />
              </TouchableHighlight>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

interface DefineProps {}
interface DefineState {
  showModal: boolean;
  renderImage: boolean;
  uri: string;
  options: Item;
}

class Define extends React.Component<DefineProps, DefineState> {
  constructor(props: DefineProps) {
    super(props);
    this.state = {
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
      }
    };
  }
  static navigationOptions = {
    title: 'Define Attributes'
  };

  componentDidMount() {
    this._retrieveData('add-photo-uri').then(data =>
      this.setState(previousState => ({
        uri: data,
        renderImage: true,
        options: { ...previousState.options, photoURI: data }
      }))
    );
  }

  _retrieveData = async (item: string) => {
    try {
      const value: any = await AsyncStorage.getItem(item);
      if (value !== null) {
        // We have data!!
        return value;
      }
      return null;
    } catch (error) {
      // Error retrieving data
      return null;
    }
  };

  updateData = (
    key: 'class' | 'type' | 'color' | 'cover' | 'name',
    value: boolean | string | number
  ) => {
    this.setState(previousState => ({
      ...previousState,
      options: { ...previousState.options, [key]: value }
    }));
  };

  printData = () => {
    //temp!!! delete later
    console.log(this.state.options);
  };

  render() {
    return (
      <React.Fragment>
        <Page scroll>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View style={styles.defineContainer}>
                <TextInput
                  placeholder="clothing item name"
                  style={[styles.inputLine, commonStyles.pb]}
                  onChangeText={value => this.updateData('name', value)}
                />
              </View>
              <View style={styles.defineContainer}>
                {this.state.renderImage && (
                  <Image
                    source={{ uri: this.state.uri }}
                    style={{ width: '100%', aspectRatio: 1 }}
                  />
                )}
              </View>
              <View>
                <Text style={[styles.defineContainer, commonStyles.pb]}>Clothing Item Type</Text>
                {isIos ? (
                  <View style={styles.defineContainer}>
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
                  <Picker onValueChange={value => this.updateData('class', value)}>
                    <Picker.Item label="top" value="top" />
                    <Picker.Item label="bottom" value="bottom" />
                    <Picker.Item label="full body" value="full body" />
                    <Picker.Item label="shoes" value="shoes" />
                    <Picker.Item label="accessory" value="accessory" />
                  </Picker>
                )}
              </View>
              <View style={styles.defineContainer}>
                <View style={{ borderWidth: 2, borderColor: '#000', borderRadius: 10 }}>
                  <Button title="print data" onPress={this.printData} />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Page>
        {this.state.showModal && (
          <View style={styles.bottomContainer}>
            <Picker
              style={styles.pickerIos}
              onValueChange={value => this.updateData('class', value)}
              selectedValue={this.state.options.class}
            >
              <Picker.Item label="top" value="top" />
              <Picker.Item label="bottom" value="bottom" />
              <Picker.Item label="full body" value="full body" />
              <Picker.Item label="shoes" value="shoes" />
              <Picker.Item label="accessory" value="accessory" />
            </Picker>
            <Button title="done" onPress={() => this.setState({ showModal: false })} />
          </View>
        )}
      </React.Fragment>
    );
  }
}

interface TempState {
  options: Item;
}

class Temp extends React.Component<{}, TempState> {
  constructor(props: any) {
    super(props);
    this.state = {
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
      }
    };
  }

  updateData = (
    key: 'class' | 'type' | 'color' | 'cover' | 'name',
    value: boolean | string | number
  ) => {
    this.setState(previousState => ({
      ...previousState,
      options: { ...previousState.options, [key]: value }
    }));
  };

  render() {
    return (
      <View>

      <TextInput
        onChangeText={(value) => this.updateData("name", value) }
        placeholder="name"
        />
      <TextInput
        onChangeText={(value) => this.updateData("type", value) }
        placeholder="type"
        />
      <TextInput
        onChangeText={(value) => this.updateData("color", value) }
        placeholder="color"
        />
      <TextInput
        onChangeText={(value) => this.updateData("cover", value) }
        placeholder="cover"
        />
      <TextInput
        onChangeText={(value) => this.updateData("cover", value) }
        placeholder="cover"
        />
        <Button onPress={() => {
          Storage.storeItem(this.state.options)
        }}
         title="store"
        />
        <Button onPress={() => {
            Storage._retrieveData('pages').then((value) => {
              console.log(value)
            })
            // Storage._retrieveData('page' + 1).then(value => console.log(value)) 
            // Storage._retrieveData('page' + 2).then(value => console.log(value)) 
            // Storage._retrieveData('page' + 3).then(value => console.log(value)) 
            Storage._retrieveData('page1').then((value) => {
              console.log("page1")
              if(!!value){
                console.log(value.items[0].name)
              }
              if(!!value){
                console.log(value.items[1].name)
              }
              if(!!value){
                console.log(value.items[2].name)
              }
              if(!!value){
                console.log(value.items[3].name)
              }
              if(!!value){
                console.log(value.items[4].name)
              }
            })
            Storage._retrieveData('page2').then((value) => {
              console.log("page2")
              if(!!value){
                console.log(value.items[0].name)
              }
              if(!!value){
                console.log(value.items[1].name)
              }
              if(!!value){
                console.log(value.items[2].name)
              }
              if(!!value){
                console.log(value.items[3].name)
              }
              if(!!value){
                console.log(value.items[4].name)
              }
            })
            Storage._retrieveData('page3').then((value) => {
              console.log("page3")
              if(!!value){
                console.log(value.items[0].name)
              }
              if(!!value){
                console.log(value.items[1].name)
              }
              if(!!value){
                console.log(value.items[2].name)
              }
              if(!!value){
                console.log(value.items[3].name)
              }
              if(!!value){
                console.log(value.items[4].name)
              }
            })
        }}
        title="print"/>
        <Button title="delete second" 
         onPress={() => Storage.DeleteItem(1, 2)}
        />
        <Button title="delete all" 
         onPress={() => AsyncStorage.clear()}
        />
        </View>
    );
  }
}

export const AddStack = createStackNavigator(
  {
    Add: { screen: Add },
    Define: { screen: Define }
  },
  { initialRouteName: 'Add' }
);

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  },
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
  bottomContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'column-reverse',
    zIndex: 5
    // backgroundColor: "#ff0000"
  },
  pickerIos: {
    position: 'absolute',
    width: width
  }
});
