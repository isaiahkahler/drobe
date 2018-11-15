import { StyleSheet, Dimensions } from 'react-native';
import Expo from 'expo';

export const commonStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#fff", //regular #E9E9EF
    width: Dimensions.get("screen").width
  },
  paddingFive: {
    paddingHorizontal: "5%"
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around', 
    alignItems: 'center',
    // paddingTop: Expo.Constants.statusBarHeight,
  },
  h1: {
    fontSize: 28
  },
  h2: {
    fontSize: 24
  },
  pb: {
    fontSize: 20
  },
  ps: {
    fontSize: 14
  },
  bold: {
    fontWeight: 'bold'
  },
  centerText: {
    textAlign: "center"
  },
  rightText: {
    textAlign: "right"
  },
  button: {
    // borderWidth: 2,
    // borderColor: '#000',
    borderRadius: 7.5,
    backgroundColor: "#e9e9e9",
    padding: 5
  },
  buttonText: {
    fontSize: 20,
    color: "#007aff"
  },
  textInput: {
    backgroundColor: "#e9e9e9",
    padding: 5,
    borderRadius: 7.5,
    fontSize: 20
  }
});

export const StyleConstants = {
  accentColor: "#8C64FF",
  successColor: "#23D160",
  warningColor: "#FF3860"
}