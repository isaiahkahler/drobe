import * as React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage  } from 'react-native';
import { Page } from '../components/page';
import { commonStyles } from '../components/styles';
import { createStackNavigator } from 'react-navigation';
import { Icon } from '../components/icon';



interface CreateProps {}
interface CreateState {}

export class Create extends React.Component<CreateProps, CreateState> {
  static navigationOptions = {
    title: 'Create Outfit'
  };


  render() {
    return (
      <Page>
        <View style={commonStyles.container}>
        <Text style={[commonStyles.h1, commonStyles.bold]}>create outfit</Text>
          <View style={styles.tile}>
            <Icon icon="Lightbulb" isAccent={false} multiplier={1.5} />
            <Text style={[commonStyles.pb, commonStyles.bold]}>automatically</Text>
          </View>
          <View style={styles.tile}>
            <Text style={[commonStyles.pb, commonStyles.bold]}>manually</Text>
          </View>
        </View>
      </Page>
    );
  }
}

const styles = StyleSheet.create({
  tile: {
    width: '50%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 25,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
});

// export const CreateStack = createStackNavigator({ Create: Create }, { initialRouteName: 'Create' });
