
import Color from 'color';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import { Linking, Alert } from 'react-native';
import { isIos } from '../ui/basicComponents';

const colorSpace: Array<{ name: string; color: { r: number; g: number; b: number } }> = [
  { name: 'black', color: { r: 0, g: 0, b: 0 } },
  { name: 'gray', color: { r: 128, g: 128, b: 128 } },
  { name: 'white', color: { r: 255, g: 255, b: 255 } },
  { name: 'maroon', color: { r: 128, g: 0, b: 0 } },
  { name: 'red', color: { r: 230, g: 25, b: 75 } },
  { name: 'pink', color: { r: 250, g: 190, b: 190 } },
  { name: 'brown', color: { r: 170, g: 110, b: 40 } },
  { name: 'orange', color: { r: 245, g: 130, b: 48 } },
  { name: 'apricot', color: { r: 255, g: 215, b: 180 } },
  { name: 'olive', color: { r: 128, g: 128, b: 0 } },
  { name: 'yellow', color: { r: 255, g: 255, b: 25 } },
  { name: 'beige', color: { r: 255, g: 250, b: 200 } },
  { name: 'lime', color: { r: 210, g: 245, b: 60 } },
  { name: 'green', color: { r: 60, g: 180, b: 75 } },
  { name: 'mint', color: { r: 170, g: 255, b: 195 } },
  { name: 'teal', color: { r: 0, g: 128, b: 128 } },
  { name: 'cyan', color: { r: 70, g: 240, b: 240 } },
  { name: 'navy', color: { r: 0, g: 0, b: 128 } },
  { name: 'blue', color: { r: 0, g: 130, b: 200 } },
  { name: 'purple', color: { r: 145, g: 30, b: 180 } },
  { name: 'lavender', color: { r: 230, g: 190, b: 255 } },
  { name: 'magenta', color: { r: 240, g: 50, b: 230 } }
  // {name: "", color: {r: , g: , b: }},
];

export function colorDistance(color1: string, color2: string) {
  let color1obj = Color(color1).object();
  let color2obj = Color(color2).object();
  return clipRange(Math.sqrt(
    Math.pow(color1obj.r - color2obj.r, 2) +
    Math.pow(color1obj.g - color2obj.g, 2) +
    Math.pow(color1obj.b - color2obj.b, 2)
  ), 441.6729559300637, 100);
}

export function roundColor(color: string): string {
  let colorRGB = Color(color).object();

  let smallestIndex = 0;
  let smallest = 10000;
  let index = 0;
  for (let color of colorSpace) {
    let distance = Math.sqrt(
      Math.pow(colorRGB.r - color.color.r, 2) +
      Math.pow(colorRGB.g - color.color.g, 2) +
      Math.pow(colorRGB.b - color.color.b, 2)
    );
    if (distance < smallest) {
      smallest = distance;
      smallestIndex = index;
    }
    index++;
  }
  return colorSpace[smallestIndex].name;
}

export function roundColors(colors: string[]) {
  let allColors = '';
  let index = 0;
  for (let color of colors) {
    if (index === 0) {
      allColors += roundColor(color);
    } else {
      if (index === colors.length - 1) {
        allColors = allColors + " and " + roundColor(color);
      } else {
        allColors = allColors + ', ' + roundColor(color);
      }
    }
    index++;
  }
  return allColors;
}


export function clipRange(value: number, initialRange: number, finalRange: number) {
  return finalRange * value / initialRange;
}

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