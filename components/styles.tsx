import { StyleSheet, Dimensions } from 'react-native';


export const commonStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#fff",
    width: Dimensions.get("screen").width
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around', 
    alignItems: 'center'
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
  }
});

