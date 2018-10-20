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
    paddingTop: Expo.Constants.statusBarHeight,
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
  }
});

