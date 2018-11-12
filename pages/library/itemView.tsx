import * as React from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableHighlight, Alert } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import { Item, Page } from '../../components/formats';
import { roundColor } from '../../components/helpers';
import { Storage } from '../../components/storage';
import Color from 'color';
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons';

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
  //review: is the second param of 'get param' the default value?
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Item'),
      headerRight: (
        navigation.getParam('editMode', undefined) && <TouchableHighlight onPress={navigation.getParam('edit', () => { })} underlayColor='rgba(0,0,0,0)'>
          <MaterialIcons name="edit" size={30} style={{ marginRight: width * 0.05 }} />
        </TouchableHighlight>
      )
    };
  };

  componentDidMount = async () => {
    const navigation = this.props.navigation;
    if (navigation.state.params.hasOwnProperty('pageIndex') && navigation.state.params.hasOwnProperty('itemIndex')) {
      this.setState({ pageIndex: navigation.state.params.pageIndex, itemIndex: navigation.state.params.itemIndex });
    }
    //review: is this ok? should if (editMode) ?
    this.setState({ editMode: navigation.state.params.hasOwnProperty('editMode') })
    this.setState({ item: navigation.state.params.item });
    navigation.setParams({ edit: this.editItem })
  };

  //review: make setting define a method in format? probably a good idea.
  //review: dont use asnyc store! use navigation props you butt
  editItem = () => {
    if (this.state.itemIndex !== null && this.state.pageIndex !== null) {
      Storage.storeDefineProps(true, this.state.pageIndex, this.state.itemIndex, this.state.item.photoURI, () => {
        this.props.navigation.navigate('Edit');
      });
    }
  }

  deleteItem = async () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this from your library? You cannot undo this action.',
      [
        {
          text: 'yes', onPress: async () => {
            await Storage.DeleteItem(this.state.pageIndex, this.state.itemIndex)
            this.props.navigation.navigate("Library");
          }
        },
        { text: 'cancel', style: 'cancel' },
      ],
    )
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
          {this.state.editMode && <TouchableHighlight onPress={() => this.deleteItem()}
            style={[commonStyles.button, { backgroundColor: "#ff0000", marginTop: 5 }]}
            underlayColor="rgba(0,0,0,0.2)">
            <Text style={[commonStyles.pb, commonStyles.centerText, { color: "#fff" }]}>
              Delete Item
            </Text>
          </TouchableHighlight>}
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
