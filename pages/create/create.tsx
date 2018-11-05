import * as React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, TouchableHighlight } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import { createStackNavigator } from 'react-navigation';
import { Icon } from '../../components/icon';
import { Manual } from './manual';
import { Automatic } from './automatic';
import { Library } from '../../pages/library/library';
import { ItemView } from '../../pages/library/itemView';

interface CreateProps {
  navigation: any;
}
interface CreateState { }

export class Create extends React.Component<CreateProps, CreateState> {
  static navigationOptions = {
    title: 'Create Outfit'
  };


  render() {
    return (
      <PageLayout>
        <View style={styles.container}>
          {/* <Text style={[commonStyles.h1]}>create outfit</Text> */}
          <TouchableHighlight style={styles.tileContainer} underlayColor="rgba(0,0,0,0.1)" onPress={() => { this.props.navigation.navigate("Automatic") }}>
            <View style={styles.tile}>
              <Icon icon="Lightbulb" isAccent={false} multiplier={1.5} />
              <Text style={[commonStyles.pb]}>automatically</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.tileContainer} underlayColor="rgba(0,0,0,0.1)" onPress={() => { this.props.navigation.navigate("Manual") }}>
            <View style={styles.tile}>
              <Icon icon="ManualHand" isAccent={false} multiplier={0.7} />
              <Text style={[commonStyles.pb]}>manually</Text>
            </View>
          </TouchableHighlight>
        </View>
      </PageLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  tileContainer: {
    width: '50%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 25,
  },
  tile: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
});

export const CreateStack = createStackNavigator(
  {
    Create: {
      screen: Create
    },
    Manual: {
      screen: Manual
    },
    Automatic: {
      screen: Automatic
    },
    LibrarySelector: {
      screen: Library
    },
    CreateItemView: {
      screen: ItemView
    },
  },
  { initialRouteName: 'Create' }
);
