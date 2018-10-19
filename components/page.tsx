import * as React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { commonStyles } from '../components/styles';

interface PageProps {
  children: any;
  scroll?: boolean;
  padding?: boolean;
}
interface PageState {}

export class PageLayout extends React.Component<PageProps, PageState>{
  render() {
    if(this.props.scroll){
      return( <ScrollView style={[commonStyles.body, (this.props.padding && commonStyles.paddingFive)]}>{this.props.children}</ScrollView>);
    }
    return(
      <View style={[commonStyles.body, (this.props.padding && commonStyles.paddingFive)]}>{this.props.children}</View>
    );
  }
}