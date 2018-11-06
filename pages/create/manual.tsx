import * as React from 'react';
import { StyleSheet, View, Text, Button, TouchableHighlight, Image, Dimensions } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import { Item, ItemDefinitions, SortFilter } from '../../components/formats';
import { ItemManager } from '../../components/itemManager';
import { filter } from 'minimatch';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

interface ManualProps {
  navigation: any;
}

interface ManualState {
  outfit: Item[];
  disallowedTypes: Array<{ class?: string, type?: string, cover?: number, date?: number }>;
}

export class Manual extends React.Component<ManualProps, ManualState> {
  constructor(props: ManualProps) {
    super(props);
    this.state = { outfit: [], disallowedTypes: [] }
  }

  static navigationOptions = {
    title: 'Create Manually'
  };

  addItem = (item: Item) => {
    //review: set state like this or use the callback?
    this.setState(previousState => ({
      ...previousState,
      outfit: [...previousState.outfit, item],
      disallowedTypes: ItemManager.getDisallowedItems([...previousState.outfit, item])
    }), () => {
      // console.log(this.state.disallowedTypes)
      // console.log("is valid", ItemManager.isValidOutfit(this.state.outfit))
    })
  }

  render() {
    return (
      <PageLayout scroll padding>
        <View style={{ flex: 1, alignItems: "center" }}>

          <TouchableHighlight
            onPress={() => {
              this.props.navigation.navigate("LibrarySelector",
                {
                  selectionMode: "one",
                  filters: this.state.disallowedTypes,
                  greyMode: true,
                  return: (item) => {
                    this.props.navigation.navigate('Manual');
                    this.addItem(item);

                  }
                })
            }}
            style={commonStyles.button}
          >
            <Text style={commonStyles.pb}>add item</Text>
          </TouchableHighlight>
          <View style={styles.outfitContainer}>
            {this.state.outfit.map((item, index) => {
              return (
                <View style={styles.itemContainer} key={index}>
                  <TouchableHighlight onPress={() => this.props.navigation.navigate('CreateItemView', { item: item })}><Image
                    source={{ uri: item.photoURI }}
                    style={styles.tileImage as any}
                  /></TouchableHighlight>]
                    <Text style={[commonStyles.pb, commonStyles.centerText]}>{item.name}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </PageLayout>
    );
  }
}

const styles = StyleSheet.create({
  outfitContainer: {
    paddingVertical: width * 0.05,
    flexDirection: "column"
  },
  itemContainer: {
    flexDirection: "column",
    // width: "100%",
    // justifyContent: "space-around",
    // alignContent: "space-between"
  },
  textContainer: {
    justifyContent: "center"
  },
  tileImage: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000'
  },
});