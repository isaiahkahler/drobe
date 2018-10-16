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
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Page } from '../../components/page';
import { commonStyles } from '../../components/styles';
import { createStackNavigator } from 'react-navigation';
import { Camera, Permissions, FileSystem } from 'expo';
import { Item, ItemDefinitions, Storage } from '../../components/formats';
import {Define} from './define';

const width = Dimensions.get('screen').width;
const isIos = Platform.OS === 'ios';

interface AddProps {
  navigation: any;
}
interface AddState {
  hasCameraPermission: any;
  showCamera: boolean;
}

class Add extends React.Component<AddProps, AddState> {
  constructor(props: AddProps) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      showCamera: true
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
//use from Storage class
  // _storeData = async (key: string, value: any) => {
  //   try {
  //     await AsyncStorage.setItem(key, value);
  //   } catch (error) {
  //     // Error saving data
  //   }
  // };
  // _retrieveData = async (item: string) => {
  //   try {
  //     const value: any = await AsyncStorage.getItem(item);
  //     if (value !== null) {
  //       // We have data!!
  //       return value;
  //     }
  //     return null;
  //   } catch (error) {
  //     // Error retrieving data
  //     return null;
  //   }
  // };

  takePicture = async () => {
    // FileSystem.
    this.setState({showCamera: false})
    if (!this._camera) {
      return;
    }
    // let photo = await this._camera.takePictureAsync();
    //   await Storage._storeData('addData', { uri: photo.uri, width: photo.width, height: photo.height });
    //   this.props.navigation.navigate('Define');
    try{
      let photo = await this._camera.takePictureAsync().then((photo) => {
         Storage._storeData('addData', { uri: photo.uri, width: photo.width, height: photo.height });
        this.props.navigation.navigate('Define');
      });
    } catch (e) {
      alert("oops! picture could not be taken. error: " + e);
      this.setState({showCamera: true})
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
          {this.state.showCamera ? (
            <View style={{ flex: 1 }}>
              <Camera
                style={{ flex: 1 }}
                type={Camera.Constants.Type.back}
                ref={ref => {
                  this._camera = ref;
                }}
              >
                <View
                  style={styles.pictureButtonContainer}
                >
                  <TouchableHighlight onPress={this.takePicture}>
                    <View
                      style={styles.pictureButton}
                    />
                  </TouchableHighlight>
                </View>
              </Camera>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          )}
        </View>
      );
    }
  }
}


//delete!
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
        <TextInput onChangeText={value => this.updateData('name', value)} placeholder="name" />
        <TextInput onChangeText={value => this.updateData('type', value)} placeholder="type" />
        <TextInput onChangeText={value => this.updateData('color', value)} placeholder="color" />
        <TextInput onChangeText={value => this.updateData('cover', value)} placeholder="cover" />
        <TextInput onChangeText={value => this.updateData('cover', value)} placeholder="cover" />
        <Button
          onPress={() => {
            Storage.storeItem(this.state.options);
          }}
          title="store"
        />
        <Button
          onPress={() => {
            Storage._retrieveData('pages').then(value => {
              console.log(value);
            });
            // Storage._retrieveData('page' + 1).then(value => console.log(value))
            // Storage._retrieveData('page' + 2).then(value => console.log(value))
            // Storage._retrieveData('page' + 3).then(value => console.log(value))
            Storage._retrieveData('page1').then(value => {
              console.log('page1');
              if (!!value) {
                console.log(value.items[0].name);
              }
              if (!!value) {
                console.log(value.items[1].name);
              }
              if (!!value) {
                console.log(value.items[2].name);
              }
              if (!!value) {
                console.log(value.items[3].name);
              }
              if (!!value) {
                console.log(value.items[4].name);
              }
            });
            Storage._retrieveData('page2').then(value => {
              console.log('page2');
              if (!!value) {
                console.log(value.items[0].name);
              }
              if (!!value) {
                console.log(value.items[1].name);
              }
              if (!!value) {
                console.log(value.items[2].name);
              }
              if (!!value) {
                console.log(value.items[3].name);
              }
              if (!!value) {
                console.log(value.items[4].name);
              }
            });
            Storage._retrieveData('page3').then(value => {
              console.log('page3');
              if (!!value) {
                console.log(value.items[0].name);
              }
              if (!!value) {
                console.log(value.items[1].name);
              }
              if (!!value) {
                console.log(value.items[2].name);
              }
              if (!!value) {
                console.log(value.items[3].name);
              }
              if (!!value) {
                console.log(value.items[4].name);
              }
            });
          }}
          title="print"
        />
        <Button title="delete second" onPress={() => Storage.DeleteItem(1, 2)} />
        <Button title="delete all" onPress={() => AsyncStorage.clear()} />
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
  pictureButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column-reverse',
    alignItems: 'center'
  },
  pictureButton: {
    width: 75,
    height: 75,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 5,
    borderRadius: 100
  }
});
