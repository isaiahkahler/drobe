import * as React from 'react';
import { StyleSheet, Text, View, Button, SectionList, TouchableHighlight } from 'react-native';
import { PageLayout } from '../components/page';
import {commonStyles} from '../components/styles';
import { createStackNavigator } from 'react-navigation';
import { Icon } from '../components/icon';

interface SettingsProps {}
interface SettingsState {}

export class Settings extends React.Component<SettingsProps, SettingsState>{
  static navigationOptions = {
    title: 'Settings'
  };

  render() {
    return (
      <PageLayout><View style={commonStyles.body}>
        {/* <SectionList
        style={styles.list}
        sections={[
            {title: 'Account', data: ['Email', 'Password', 'Delete Account']},
            {title: 'Privacy', data: ['Privacy Options', 'Terms of Service']},
            {title: 'Preferences', data: ['Edit Style Preferences']},
            {title: 'Feedback', data: ['Leave Feedback', 'Report a Bug']},
          ]}
          renderItem={({item}) => <Text style={[styles.listItem, commonStyles.pb]}>{item}</Text>}
          renderSectionHeader={({section}) => <Text style={[styles.listSectionHeader, commonStyles.h2, commonStyles.bold]}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
        /> */}
      </View></PageLayout>
    );
  }
}

export const SettingsStack = createStackNavigator(
  {Settings: Settings},
  {initialRouteName: 'Settings'}
);

const styles = StyleSheet.create({
  list: {
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  listItem: {
    
    // paddingLeft: "5%",
    // paddingRight: "5%",
    marginTop: 2,
    marginBottom: 2,
    // borderBottomColor: '#000',
    // borderBottomWidth: 3
  },
  listSectionHeader: {
    
    // paddingLeft: "5%",
    // paddingRight: "5%",
    marginTop: 2,
    marginBottom: 2,
    // borderBottomColor: '#000',
    // borderBottomWidth: 3
  }
});