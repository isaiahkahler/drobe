"use strict";
import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableHighlight,
  TextInput,
  Dimensions,
  Platform,
  ActivityIndicator,
  Linking
} from "react-native";
import { PageLayout } from "../../components/page";
import { commonStyles, StyleConstants } from "../../components/styles";
import { createStackNavigator } from "react-navigation";
import { Storage } from "../../components/storage";
import { Item, ItemDefinitions } from "../../components/formats";
import { Define } from "./define";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ImagePicker,
  Permissions,
  FileSystem,
  IntentLauncherAndroid
} from "expo";
import { Button } from "../../components/button";

const width = Dimensions.get("screen").width;
const isIos = Platform.OS === "ios";

interface AddProps {
  navigation: any;
}
interface AddState {
  cameraPermissionStatus: Permissions.PermissionStatus;
  libraryPermissionStatus: Permissions.PermissionStatus;
  permissionError: boolean;
  awaiting: boolean;
}

class Add extends React.Component<AddProps, AddState> {
  constructor(props: AddProps) {
    super(props);
    this.state = {
      cameraPermissionStatus: null,
      libraryPermissionStatus: null,
      permissionError: false,
      awaiting: false
    };
  }
  static navigationOptions = {
    title: "Add Clothes"
  };

  async componentWillMount() {
    const cameraStatus = await Permissions.getAsync(Permissions.CAMERA);
    const libraryStatus = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    this.setState({
      cameraPermissionStatus: cameraStatus.status,
      libraryPermissionStatus: libraryStatus.status
    });
  }

  //review: same as comment down below, however, check all permission paths
  //-what happens when the user denies permissions and then tries again?
  takePhoto = async () => {
    this.setState({ awaiting: true });

    // if (
    //   this.state.cameraPermissionStatus === "undetermined" ||
    //   (!isIos && this.state.cameraPermissionStatus === "denied")
    // ) {
    //   let cameraStatus = await Permissions.askAsync(Permissions.CAMERA);
    //   this.setState({ cameraPermissionStatus: cameraStatus.status });
    // }

    // if (
    //   this.state.libraryPermissionStatus === "undetermined" ||
    //   (!isIos && this.state.libraryPermissionStatus === "denied")
    // ) {
    //   let libraryStatus = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //   this.setState({ libraryPermissionStatus: libraryStatus.status });
    // }

    // if (this.state.cameraPermissionStatus === "denied") {
    //   this.setState({ permissionError: true, awaiting: false });
    // }

    // if (this.state.libraryPermissionStatus === "denied") {
    //   this.setState({ permissionError: true, awaiting: false });
    // }

    if (this.state.cameraPermissionStatus !== "granted") {
      let cameraStatus = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ cameraPermissionStatus: cameraStatus.status }, () => {
        if(this.state.cameraPermissionStatus === "denied") {
          this.setState({permissionError: true, awaiting: false});
          return;
        }
      });
    }
    if (this.state.libraryPermissionStatus !== "granted") {
      let cameraStatus = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ libraryPermissionStatus: cameraStatus.status }, () => {
        if(this.state.libraryPermissionStatus === "denied") {
          this.setState({permissionError: true, awaiting: false});
          return;
        }
      });
    }

    if (
      this.state.cameraPermissionStatus === "granted" &&
      this.state.libraryPermissionStatus === "granted"
    ) {
      this.setState({ permissionError: false });
      let response = await ImagePicker.launchCameraAsync({
        base64: false
      });
      if (response.cancelled === false) {
        this.props.navigation.navigate("Define", {
          data: {
            editMode: false,
            pageIndex: -1,
            itemIndex: -1,
            uri: response.uri
          }
        });
      }
    }
    this.setState({ awaiting: false });
  };

  //review: was getting sketchy behavior on simulator with commented code. is the current code ok?
  choosePhoto = async () => {
    this.setState({ awaiting: true });

    // if (this.state.libraryPermissionStatus === "undetermined" && isIos) {
    //   let libraryStatus = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //   this.setState({ libraryPermissionStatus: libraryStatus.status });
    // }

    // if (this.state.libraryPermissionStatus === "denied" && isIos) {
    //   this.setState({ permissionError: true, awaiting: false });
    //   return;
    // }

    if (this.state.libraryPermissionStatus !== "granted") {
      let libraryStatus = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ libraryPermissionStatus: libraryStatus.status }, () => {
        if (this.state.libraryPermissionStatus === "denied") {
          this.setState({ permissionError: true, awaiting: false });
          return;
        }
      });
    }

    if (this.state.libraryPermissionStatus === "granted" || !isIos) {
      this.setState({ permissionError: false });
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        base64: false
      });
      if (response.cancelled === false) {
        this.props.navigation.navigate("Define", {
          data: {
            editMode: false,
            pageIndex: -1,
            itemIndex: -1,
            uri: response.uri
          }
        });
      }
    }
    this.setState({ awaiting: false });
  };

  render() {
    return (
      <PageLayout>
        {this.state.awaiting ? (
          <View style={styles.container}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.container}>
              <TouchableHighlight
                style={styles.tileContainer}
                underlayColor="rgba(0,0,0,0.2)"
                onPress={this.takePhoto}
              >
                <View style={styles.tile}>
                  <MaterialIcons
                    name="camera-alt"
                    size={50}
                    style={styles.icon}
                    color={StyleConstants.accentColor}
                  />
                  <Text style={[commonStyles.pb, commonStyles.centerText]}>
                    take photo
                  </Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.tileContainer}
                underlayColor="rgba(0,0,0,0.2)"
                onPress={this.choosePhoto}
              >
                <View style={styles.tile}>
                  <MaterialIcons
                    name="photo-library"
                    size={50}
                    style={styles.icon}
                    color={StyleConstants.accentColor}
                  />
                  <Text style={[commonStyles.pb, commonStyles.centerText]}>
                    choose from library
                  </Text>
                </View>
              </TouchableHighlight>
            </View>

            {this.state.permissionError && (
              <View
                style={{
                  padding: "5%",
                  borderWidth: 2,
                  borderColor: StyleConstants.warningColor,
                  borderRadius: 5
                }}
              >
                <Text style={commonStyles.pb}>
                  Drobe needs to access your camera and photos to take pictures
                  of your clothes.
                </Text>
                <Button
                  title="open settings"
                  onPress={() => {
                    if (isIos) {
                      Linking.canOpenURL("app-settings:")
                        .then(supported => {
                          console.log(`Settings url works`);
                          Linking.openURL("app-settings:");
                        })
                        .catch(error => {
                          console.log(`An error has occured: ${error}`);
                        });
                    } else {
                      IntentLauncherAndroid.startActivityAsync(
                        IntentLauncherAndroid.ACTION_APPLICATION_SETTINGS
                      );
                    }
                  }}
                />
              </View>
            )}
          </View>
        )}
      </PageLayout>
    );
  }
}

export const AddStack = createStackNavigator(
  {
    Add: { screen: Add },
    Define: { screen: Define }
  },
  { initialRouteName: "Add" }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  tileContainer: {
    width: "50%",
    aspectRatio: 1,
    backgroundColor: "#e9e9e9",
    borderRadius: 25
  },
  tile: {
    padding: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    margin: 10
  }
});
