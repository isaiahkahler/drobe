import * as React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';

interface ManualProps {
  navigation: any;
}

interface ManualState {

}

export class Manual extends React.Component<ManualProps, ManualState> {
  static navigationOptions = {
    title: 'Create Manually'
  };


  render() {
    return (
      <PageLayout scroll padding>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Button onPress={() => {
            this.props.navigation.navigate("LibrarySelector",
              {
                selectionMode: true,
                presetSelections: [],
                greyMode: true,
                return: () => {}
              })
          }} title='open library'></Button>
        </View>
      </PageLayout>
    );
  }
}

const styles = StyleSheet.create({

});