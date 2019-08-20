
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Linking, Alert } from 'react-native';
import { isIos } from '../ui/basicComponents';

export async function takePhoto(onSuccess: (uri: string) => void, onFail: () => void) {
    console.log('huh')
    const cameraPermission = await Permissions.getAsync(Permissions.CAMERA);
    let cameraPermissionStatus = cameraPermission.status;
    console.log(cameraPermissionStatus);
  
    if (cameraPermissionStatus === Permissions.PermissionStatus.UNDETERMINED) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      cameraPermissionStatus = status;
    }
    if (cameraPermissionStatus === Permissions.PermissionStatus.DENIED) {
      Alert.alert(
        'Cannot Open Camera',
        'Drobe needs access to your camera and camera roll to take pictures.',
        [
          { text: 'OK', style: 'cancel' },
          {
            text: 'Settings', onPress: () => {
              Linking.openURL('app-settings:');
            }
          }
        ]
      );
    }
  
    const cameraRollPermission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    let cameraRollPermissionStatus = cameraRollPermission.status;
  
    if (cameraRollPermissionStatus === Permissions.PermissionStatus.UNDETERMINED) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      cameraRollPermissionStatus = status;
    }
    if (cameraRollPermissionStatus === Permissions.PermissionStatus.DENIED) {
      Alert.alert(
        'Cannot Open Camera',
        'Drobe needs access to your camera and camera roll to take pictures.',
        [
          { text: 'OK', style: 'cancel' },
          {
            text: 'Settings', onPress: () => {
              Linking.openURL('app-settings:');
            }
          }
        ]
      );
    }
  
    if (cameraPermissionStatus === Permissions.PermissionStatus.GRANTED && cameraRollPermissionStatus === Permissions.PermissionStatus.GRANTED) {
      const response = await ImagePicker.launchCameraAsync({
        base64: false
      });
  
      if (response.cancelled === true) {
        onFail();
        return;
      } else {
        onSuccess(response.uri);
        return;
      }
  
    } else {
      onFail();
      return;
    }
  }
  
  export async function chooseFromLibrary(onSuccess: (uri: string) => void, onFail: () => void) {
  
    if (isIos) {
      const cameraRollPermission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      let cameraRollPermissionStatus = cameraRollPermission.status;
  
      if (cameraRollPermissionStatus === Permissions.PermissionStatus.UNDETERMINED) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        cameraRollPermissionStatus = status;
      }
      if (cameraRollPermissionStatus === Permissions.PermissionStatus.DENIED) {
        Alert.alert(
          'Cannot Open Image Library',
          'Drobe needs access to your camera roll to access your pictures.',
          [
            { text: 'OK', style: 'cancel' },
            {
              text: 'Settings', onPress: () => {
                Linking.openURL('app-settings:');
              }
            }
          ]
        );
      }
  
      if (cameraRollPermissionStatus === Permissions.PermissionStatus.GRANTED) {
        const response = await ImagePicker.launchImageLibraryAsync({
          base64: false
        });
  
        if (response.cancelled === true) {
          onFail();
          return;
        } else {
          onSuccess(response.uri);
          return;
        }
  
      }
      //is NOT iOS does NOT require camera roll permission
    } else {
      const response = await ImagePicker.launchImageLibraryAsync({ base64: false });
      if (response.cancelled === true) {
        onFail();
        return;
      } else {
        onSuccess(response.uri);
        return;
      }
    }
  }