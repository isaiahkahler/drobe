import * as React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Dimensions, SectionList, ScrollView } from 'react-native';
import { commonStyles } from '../../components/styles';
import { ItemDefinitions } from '../../components/formats';
import {TriangleColorPicker} from '../../components/colorpicker/TriangleColorPicker';
import { fromHsv } from '../../components/colorpicker/utils';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

interface SortSidebarProps {
  onSelect: (type: "order" | "hide", name: string, index: number) => void;
}

interface SortSidebarState {
  selections: Array<{ type: string, index: number }>;
}

export class SortSidebar extends React.Component<SortSidebarProps, SortSidebarState> {
  constructor(props: SortSidebarProps) {
    super(props);
    this.state = { selections: [] }
  }

  sort(type: "date" | "class" | "type", value: any) {
    if (type === "date") {
      console.log(value)
    }
  }



  render() {
    return (
      <React.Fragment>

        <View style={styles.sidebar}>
          <ScrollView scrollEnabled={false}>
            <Text style={[commonStyles.h1, commonStyles.bold]}>sort by</Text>
            <Section label="date" options={['new to old', 'old to new']} action={(value) => { this.props.onSelect("order", "date", value) }} />
            <Section label="type" options={[
              { sublabel: "tops", options: ItemDefinitions.types.top },
              { sublabel: "bottoms", options: ItemDefinitions.types.bottom },
              { sublabel: "full bodies", options: ItemDefinitions.types.full },
              { sublabel: "shoes", options: ItemDefinitions.types.shoes },
              { sublabel: "accessories", options: ItemDefinitions.types.accessory },
            ]} action={(type, value) => { this.props.onSelect("hide", type, value) }} />
            <Section label="color" options='colorpicker' action={() => {}}>
              <TriangleColorPicker style={styles.colorpicker} onColorSelected={color => {this.props.onSelect("order", "color", fromHsv(color))}}/>
            </Section>
            <Section label="formality" options={['casual', 'semi-casual', 'semi-formal', 'formal']} action={(value) => { this.props.onSelect("hide", "formality", value) }}/>
            <Section label="temperature" options={['very light clothes', 'light clothes', 'warm clothes', 'very warm clothes']} action={(value) => { this.props.onSelect("hide", "temperature", value) }}/>
          </ScrollView>
        </View>

      </React.Fragment>
    );
  }
}

interface SectionProps {
  label: string, options: Array<string | { sublabel: string, options: Array<string> }> | "colorpicker", action: Function
}

interface SectionState {
  show: boolean;
}

class Section extends React.Component<SectionProps, SectionState> {
  constructor(props: SectionProps) {
    super(props);
    this.state = { show: false }
  }

  toggleList = () => {
    this.setState(previousState => ({
      ...previousState,
      show: !previousState.show
    }))
  }

  render() {
    return (
      <View style={styles.section} >
        <TouchableHighlight onPress={this.toggleList} underlayColor='rgba(0,0,0,0.1)' >
          <Text style={[commonStyles.h2, commonStyles.bold]}>{this.props.label}</Text>
        </TouchableHighlight>
        {this.state.show && (
          <View style={styles.optionLabel}>
            {this.props.options === "colorpicker" ? (
              this.props.children
            ) : (
              this.props.options.map((item, index) => {
                if (typeof item === "string") {
                  return (
                    <TouchableHighlight onPress={() => this.props.action(this.props.options[index])} key={index} underlayColor='rgba(0,0,0,0.1)' ><Text style={commonStyles.h2}>{item}</Text></TouchableHighlight>
                  );
                } else {
                  return (
                    <Subsection label={item.sublabel} options={item.options} action={(value) => this.props.action(this.props.label, value)} key={index} />
                  );
                }
              })
            )}
          </View>
        )}
      </View>
    );
  }
}

interface SubsectionProps {
  label: string, options: string[], action: Function
}

interface SubsectionState {
  show: boolean;
}


class Subsection extends React.Component<SubsectionProps, SubsectionState> {
  constructor(props: SubsectionProps) {
    super(props);
    this.state = { show: false }
  }

  toggleList = () => {
    this.setState(previousState => ({
      ...previousState,
      show: !previousState.show
    }))
  }

  render() {
    return (
      <View style={styles.subsection}>
        <TouchableHighlight onPress={this.toggleList} underlayColor='rgba(0,0,0,0.1)' >
          <Text style={[commonStyles.h2, commonStyles.bold]}>{this.props.label}</Text>
        </TouchableHighlight>
        {this.state.show && (
          <View style={styles.optionLabel}>
            {this.props.options.map((item, index) => {
              return (
                <TouchableHighlight key={index} onPress={() => this.props.action(this.props.options[index])} underlayColor='rgba(0,0,0,0.1)' >
                  <Text style={commonStyles.pb}>{item}</Text>
                </TouchableHighlight>);
            })}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sidebar: {
    width: width * 0.8,
    flex: 1,
    padding: 10,
    backgroundColor: '#E9E9EF'
  },
  section: {
    borderTopWidth: 2,
    paddingVertical: 5
  },
  optionLabel: {
    paddingLeft: 20,
    paddingTop: 2
  },
  subsection: {},
  colorpicker: {
    width: "100%",
    aspectRatio: 1,
  }
});