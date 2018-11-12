import * as React from 'react';
import { Text, View, ScrollView, StyleSheet, Dimensions, Animated, TouchableHighlight, TouchableWithoutFeedback, Modal } from 'react-native';
import { commonStyles } from '../components/styles';


const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

interface PageProps {
  children: any;
  scroll?: boolean;
  padding?: boolean;
  modal?: React.ReactNode;
  style?: any;
}
interface PageState {
  showModal: boolean;
  modalFadeInAnimation: Animated.Value;
  modalSlideUpAnimation: Animated.Value;
}

export class PageLayout extends React.Component<PageProps, PageState>{
  _modal;

  constructor(props: PageProps) {
    super(props);
    this.state = {
      showModal: false,
      modalFadeInAnimation: new Animated.Value(0),
      modalSlideUpAnimation: new Animated.Value(-50)
    }

    // if (!!this.props.modal) {
    //   this._modal = this.props.modal.ref;
    // }
  }

  componentDidUpdate = () => {

  };

  closeModal = () => {
    Animated.spring(this.state.modalFadeInAnimation, {
      toValue: 0,
      overshootClamping: true
    }).start();
    Animated.spring(this.state.modalSlideUpAnimation, {
      toValue: -50,
      overshootClamping: true
    }).start(() => {
      this.setState({ showModal: false })
    });
  }

  openModal = () => {
    this.setState({ showModal: true }, () => {
      Animated.spring(this.state.modalFadeInAnimation, {
        toValue: 1,
        overshootClamping: true
      }).start();
      Animated.spring(this.state.modalSlideUpAnimation, {
        toValue: 0,
        overshootClamping: true
      }).start();
    })
  }

  render() {
    let modal = this.state.showModal &&
      <Animated.View style={[styles.modalAnimatedView, { opacity: this.state.modalFadeInAnimation }]}>
        <TouchableHighlight style={styles.modalContainer} onPress={this.closeModal} underlayColor='rgba(0,0,0,0)'>
          <Animated.View style={[styles.modal, { bottom: this.state.modalSlideUpAnimation }]}>
            <TouchableHighlight>
              <View>
                {this.props.modal}
                <TouchableHighlight style={[commonStyles.button, {marginTop: 5}]} onPress={this.closeModal} underlayColor='rgba(0,0,0,0.1)'><Text style={[commonStyles.buttonText, commonStyles.centerText]}>close</Text></TouchableHighlight>
              </View>
            </TouchableHighlight>
          </Animated.View>
        </TouchableHighlight>
      </Animated.View>;
    if (this.props.scroll) {
      return (
        <React.Fragment>

          <ScrollView style={[commonStyles.body, this.props.style, (this.props.padding && commonStyles.paddingFive)]}>
            <View style={this.props.padding && { marginVertical: 5 }} />
            {this.props.children}
            <View style={this.props.padding && { marginVertical: 5 }} />
          </ScrollView>
          {this.state.showModal && modal}
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>

        <View style={[commonStyles.body, this.props.style, (this.props.padding && commonStyles.paddingFive)]}>
          <View style={this.props.padding && { marginVertical: 5 }} />
          {this.props.children}
          <View style={this.props.padding && { marginVertical: 5 }} />
        </View>
        {this.state.showModal && modal}
      </React.Fragment>
    );
  }
}


export const styles = StyleSheet.create({
  modalAnimatedView: {
    position: 'absolute',
    width: width,
    height: height,
    flex: 1,
    zIndex: 5,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  modalContainer: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10%'
  },
  modal: {
    width: '100%',
    backgroundColor: '#fff',
    padding: width * 0.05,
    borderRadius: 7.5
  }
})