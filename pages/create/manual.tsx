import * as React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import { Item, ItemDefinitions, SortFilter } from '../../components/formats';
import { ItemManager } from '../../components/itemManager';
import { filter } from 'minimatch';

interface ManualProps {
  navigation: any;
}

interface ManualState {
  outfit: Item[];
  requiredTypes: string[];
}

export class Manual extends React.Component<ManualProps, ManualState> {
  constructor(props: ManualProps) {
    super(props);
    this.state = { outfit: [], requiredTypes: [] }
  }

  static navigationOptions = {
    title: 'Create Manually'
  };

  addItem = (item: Item) => {
    //review: set state like this or use the callback?
    this.setState(previousState => ({
      ...previousState,
      outfit: [...previousState.outfit, item],
      requiredTypes: ItemManager.getDisallowedTypes([...previousState.outfit, item])
    }), () => {
      console.log(this.state.requiredTypes)
    })
  }


  // getSortFilters = () => {
  //   let filters:SortFilter[] = [];
  //   for(let type of this.state.requiredTypes){
  //     filters.push({type: "show", name: "type", value: type})
  //   }
  //   return filters;
  // }


  render() {
    return (
      <PageLayout scroll padding>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Button onPress={() => {
            this.props.navigation.navigate("LibrarySelector",
              {
                selectionMode: "one",
                filters: this.state.requiredTypes,
                greyMode: true,
                return: (item) => {
                  this.props.navigation.navigate('Manual');
                  this.addItem(item);
                  
                }
              })
          }} title='open library'></Button>
        </View>
      </PageLayout>
    );
  }
}

const styles = StyleSheet.create({

});