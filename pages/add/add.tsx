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
  ActivityIndicator
} from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles, StyleConstants } from '../../components/styles';
import { createStackNavigator } from 'react-navigation';
import { Camera, Permissions, FileSystem } from 'expo';
import { Storage } from '../../components/storage';
import { Item, ItemDefinitions } from '../../components/formats';
import { Define } from './define';
import { MaterialIcons } from '@expo/vector-icons';
import ImagePicker from 'react-native-image-picker';

const width = Dimensions.get('screen').width;
const isIos = Platform.OS === 'ios';


interface AddProps {
  navigation: any;
}
interface AddState {
  hasCameraPermission: any;
  showCamera: boolean;
  flash: 'on' | 'off' | 'torch';
}

class Add extends React.Component<AddProps, AddState> {
  constructor(props: AddProps) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      showCamera: true,
      flash: 'off'
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

    const willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        this.setState({ showCamera: false })
      }
    );

    const willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        this.setState({ showCamera: true })
      }
    );



  }

  private _camera: any;

  takePicture = async () => {
    //TODO : set show camera true when navigating back from define
    // this.setState({ showCamera: false });
    if (!this._camera) {
      return;
    }
    // let photo = await this._camera.takePictureAsync();
    //   await Storage._storeData('addData', { uri: photo.uri, width: photo.width, height: photo.height });
    //   this.props.navigation.navigate('Define');
    try {
      //review: should this be passed as a navigaiton prop instead of storing and grabbing?
      let photo = await this._camera.takePictureAsync().then((photo) => {
        this.setState({ flash: "off" })
        // Storage._storeData('define', { editMode: false, uri: photo.uri, width: photo.width, height: photo.height });
        Storage.storeDefineProps(false, -1, -1, photo.uri, () => {
          this.props.navigation.navigate('Define');
        });
      });
    } catch (e) {
      alert('oops! picture could not be taken. \n' + e);
      this.setState({ showCamera: true });
    }
  };

  getFlashMode = () => {
    if (this.state.flash === 'on') {
      return Camera.Constants.FlashMode.on;
    } else if (this.state.flash === 'off') {
      return Camera.Constants.FlashMode.off;
    } else {
      return Camera.Constants.FlashMode.torch;
    }
  };

  switchFlashMode = () => {
    if (this.state.flash === 'off') {
      this.setState({ flash: 'on' });
    }
    if (this.state.flash === 'on') {
      this.setState({ flash: 'torch' });
    }
    if (this.state.flash === 'torch') {
      this.setState({ flash: 'off' });
    }
  };

  launchPicker = () => {

    
    return <Text>hi</Text>

  }

  componentDidMount () {

    const options = {
      title: 'Add Clothing',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    // ImagePicker.showImagePicker(options, (response) => {
    //   console.log('Response = ', response);

    //   if (response.didCancel) {
    //     console.log('User cancelled image picker');
    //   } else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error);
    //   } else if (response.customButton) {
    //     console.log('User tapped custom button: ', response.customButton);
    //   } else {
    //     const source = { uri: response.uri };

    //     // You can also display the image using data:
    //     // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    //   }
    // });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
          {/* {this.state.showCamera && this.launchPicker()} */}
          {this.state.showCamera ? (
            <View style={{ flex: 1 }}>
              <Camera
                style={{ flex: 1 }}
                type={Camera.Constants.Type.back}
                flashMode={this.getFlashMode()}
                ref={ref => {
                  this._camera = ref;
                }}
              >
                <View style={styles.flashButtonContainer}>
                  <TouchableHighlight
                    underlayColor="rgba(0,0,0,0.2)"
                    style={styles.flashButton}
                    onPress={() => this.switchFlashMode()}
                  >
                    <View>
                      {this.state.flash === "off" ? <MaterialIcons name="flash-off" size={30} color={StyleConstants.accentColor} /> : null}
                      {this.state.flash === "on" ? <MaterialIcons name="flash-on" size={30} color={StyleConstants.accentColor} /> : null}
                      {this.state.flash === "torch" ? <MaterialIcons name="highlight" size={30} color={StyleConstants.accentColor} /> : null}
                    </View>
                  </TouchableHighlight>
                </View>
                <View style={styles.pictureButtonContainer}>
                  <TouchableHighlight onPress={this.takePicture} style={styles.pictureButton} underlayColor="rgba(0,0,0,0.2)">
                    <View />
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
    borderRadius: 100,
    marginBottom: 20
  },
  flashButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  flashButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  }
});
