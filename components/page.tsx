import * as React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { commonStyles } from '../components/styles';

interface PageProps {
  children: any;
  scroll?: boolean;
}
interface PageState {}

export class Page extends React.Component<PageProps, PageState>{
  render() {
    if(this.props.scroll){
      return( <ScrollView style={commonStyles.body}>{this.props.children}</ScrollView>);
    }
    return(
      <View style={commonStyles.body}>{this.props.children}</View>
    );
  }
}