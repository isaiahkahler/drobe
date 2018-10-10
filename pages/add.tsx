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
  Modal,
  TouchableOpacity,
  ImageStore
} from 'react-native';
import { Page } from '../components/page';
import { commonStyles } from '../components/styles';
import { createStackNavigator } from 'react-navigation';
import { Camera, Permissions } from 'expo';

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

  takePicture = async () => {
    if (!this._camera) {return} 
      let photo = await this._camera.takePictureAsync().then((data) => {
        this._storeData("add-photo-uri", data.uri);
        this.props.navigation.navigate('Define');
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
          <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={ref => {this._camera = ref}} >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'column-reverse',
                // justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableHighlight onPress={this.takePicture}><View style={{width: 75, height: 75, backgroundColor: "#fff", borderColor: "#000", borderWidth: 5, borderRadius: 100}}/>
              </TouchableHighlight>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <Text>Waiting</Text>
  </View>
);

interface DefineProps {}
interface DefineState {
  showModal: boolean;
  renderImage: boolean;
  uri: string;
}

class Define extends React.Component<DefineProps, DefineState> {
  constructor(props: DefineProps) {
    super(props);
    this.state = { showModal: false, renderImage: false, uri: ''};
  }
  static navigationOptions = {
    title: 'Define Attributes'
  };

  componentDidMount() {
    this._retrieveData('add-photo-uri').then((data) =>
      this.setState({uri: data, renderImage: true})
    );
  }

  _retrieveData = async (item: string) => {
    try {
      const value:any = await AsyncStorage.getItem(item);
      if (value !== null) {
        // We have data!!
        return value;
      }
      return null;
     } catch (error) {
       // Error retrieving data
       return null;
     }
  }
  
  getImage = () => {
    // <Image source={require()}></Image>
  }

  render() {
    return (
      <React.Fragment>
        <Page>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View style={styles.inputLineContainer}>
                <TextInput
                  placeholder="clothing item name"
                  style={[styles.inputLine, commonStyles.pb]}
                />
              </View>
              <View style={styles.imageContainer}>
                 { this.state.renderImage && <Image source={{uri: this.state.uri}} style={{width: "100%", aspectRatio: 1}}/> }
              </View>
              <View>
                {isIos ? (
                  <React.Fragment>
                    <Button
                      onPress={() => {
                        this.setState(previousState => ({
                          ...previousState,
                          showModal: !previousState.showModal
                        }));
                      }}
                      title="choose clothing item type"
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Text style={[styles.label, commonStyles.pb]}>Clothing Item Type</Text>
                    <Picker />
                  </React.Fragment>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Page>
        {this.state.showModal &&
          // <View style={styles.bottomContainer}>
          //   <Picker style={styles.pickerIos}>
          //     <Picker.Item label="top" value="top" />
          //     <Picker.Item label="bottom" value="bottom" />
          //     <Picker.Item label="full" value="full" />
          //     <Picker.Item label="shoes" value="shoes" />
          //     <Picker.Item label="accessory" value="accessory" />
          //   </Picker>
          // </View>
          undefined}
      </React.Fragment>
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
  inputLineContainer: {
    width: '100%',
    paddingHorizontal: '5%',
    marginVertical: width * 0.05
  },
  inputLine: {
    width: '100%',
    padding: 5,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10
  },
  imageContainer: {
    width: '100%',
    paddingHorizontal: '5%',
  },
  image: {},
  label: {},
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
