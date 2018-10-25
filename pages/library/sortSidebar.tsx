import * as React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Dimensions, SectionList } from 'react-native';
import { commonStyles } from '../../components/styles';
import { ItemDefinitions } from '../../components/formats';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

interface SortSidebarProps {
  onSelect(type: string, value: any): Function;
}

interface SortSidebarState {

}

export class SortSidebar extends React.Component<SortSidebarProps, SortSidebarState> {
  sort(type: "date" | "class" | "type", value: any) {
    if (type === "date") {
      console.log(value)
    }
  }

  render() {
    return (
      <View style={styles.sidebar}>
        {/* <SectionList
            sections={[
              { title: 'D', data: ['Devin'] },
              { title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie'] }
            ]}
            renderItem={({ item }) => <Text style={[styles.listItem, commonStyles.pb]}>{item}</Text>}
            renderSectionHeader={({ section }) => (
              <Text style={[styles.listSectionHeader, commonStyles.h2]}>{section.title}</Text>
            )}
            keyExtractor={(item, index) => index}
          /> */}
          <Text style={[commonStyles.h2, commonStyles.bold]}>sort by</Text>
        <Section label="date" options={['new to old', 'old to new']} action={(index) => { this.props.onSelect("date", index) }} />
        <Section label="class" options={ItemDefinitions.classes} action={(index) => { this.props.onSelect("class", index) }} />
      </View>
    );
  }
}

function Section(props: { label: string, options: Array<String>, action: Function }) {
  return (
    <View style={styles.section}>
      <TouchableHighlight>
        <Text style={[commonStyles.pb, commonStyles.bold]}>{props.label}</Text>
      </TouchableHighlight>
      <View style={styles.subsection}>

        {props.options.map((item, index) => {
          return (
            <TouchableHighlight onPress={() => props.action()} key={index}><Text style={commonStyles.pb}>{item}</Text></TouchableHighlight>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: width * 0.8,
    height: height,
    padding: 10,
    backgroundColor: '#E9E9EF'
  },
  section: {
    borderTopWidth: 2

  },
  subsection: {
    paddingLeft: 20,
  }
});