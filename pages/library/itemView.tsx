import * as React from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableHighlight } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import { Item, Page, roundColor } from '../../components/formats';
import { Storage } from '../../components/formats';
import Color from 'color';
import moment from 'moment';
// import moment = require('moment');

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

interface ItemViewProps {
  navigation: any;
}
interface ItemViewState {
  pageIndex: number;
  itemIndex: number;
  item: Item;
  editMode: boolean;
}

export class ItemView extends React.Component<ItemViewProps, ItemViewState> {
  constructor(props: ItemViewProps) {
    super(props);
    this.state = { pageIndex: null, itemIndex: null, item: null, editMode: false };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Item'),
      headerRight: (
        <TouchableHighlight onPress={navigation.getParam('edit', () => {})}>
          <Text>Edit</Text>
        </TouchableHighlight>
      )
    };
  };

  componentDidMount = async () => {
    const navigation = this.props.navigation;
    this.setState({pageIndex: navigation.state.params.pageIndex, itemIndex: navigation.state.params.itemIndex});
    // let item = await Storage.getItem(navigation.state.params.page, navigation.state.params.item);
    // this.setState({ item: item });
    this.setState({ item: navigation.state.params.item });
    // console.log("navigation item", navigation.state.params.item)
    navigation.setParams({edit: this.editItem})
  };

  //review: make setting define a method in format? probably a good idea.
  editItem = () => {
    Storage.storeDefineProps(true, this.state.pageIndex, this.state.itemIndex, this.state.item.photoURI, () => {
      this.props.navigation.navigate('Edit');
    });
  }

  render() {
    if (!!this.state.item) {
      return (
        <PageLayout scroll padding>
          {/* review: is stating name repetitive? */}
          <Text style={[commonStyles.h2, commonStyles.bold]}>{this.state.item.name}</Text>
          <Image
            source={{ uri: this.state.item.photoURI }}
            style={{ width: width * 0.9, aspectRatio: 1 }}
          />
          <ShowValue name="class:" type="class" value={this.state.item.class} />
          <ShowValue name="type:" type="type" value={this.state.item.type} />
          <ShowValue name="color:" type="colors" value={this.state.item.colors} />
          <ShowValue
            name="date added:"
            type="date"
            value={moment(this.state.item.date).calendar()}
          />
          <ShowValue name="total times worn:" type="uses" value={this.state.item.uses} />
          <ShowValue
            name="times worn since last wash:"
            type="uses"
            value={this.state.item.laundry}
          />
          {/* <ShowValue name="date added:" type="date" value={moment(this.state.item.date).calendar()} /> */}
        </PageLayout>
      );
    } else {
      return <View />;
    }
  }
}

//review: change type from string to Item.type. may have to define that interface in Formats
//review: remove 'type' prop replace with 'isColor' boolean
function ShowValue(props: { name: string; type: string; value: any }) {
  if (props.type !== 'colors') {
    return (
      <View style={styles.valueRow}>
        <View style={styles.valueColumn}>
          <Text style={[commonStyles.pb, styles.valueItem]}>{props.name}</Text>
        </View>
        <View style={styles.valueColumn}>
          <Text style={[commonStyles.pb, styles.valueItem]}>{props.value}</Text>
        </View>
      </View>
    );
  } else {
    //review: copy and pasting Luminosity code from Define, try moving function to formats? make a color class?

    return (
      <View style={styles.valueRow}>
        <View style={styles.valueColumn}>
          <Text style={[commonStyles.pb, styles.valueItem]}>{props.name}</Text>
        </View>
        <View style={styles.valueColumn}>
          {props.value.map((item, index) => {
            let colorObj = Color(item);
            let fontColor = '#fff';
            if (colorObj.isLight()) {
              fontColor = '#000';
            }
            return (
              <Text
                key={index}
                style={[
                  commonStyles.pb,
                  styles.valueItem,
                  { color: fontColor, backgroundColor: item }
                ]}
              >
                {roundColor(colorObj.object() as any)}
              </Text>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  valueRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000'
  },
  valueColumn: {
    flexDirection: 'column',
    // flexWrap: "wrap",
    width: '50%'
  },
  valueItem: {
    width: '100%'
  }
});
