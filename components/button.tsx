import * as React from "react";
import {
  Platform,
  View,
  Button as ReactButton,
  NativeSyntheticEvent,
  NativeTouchEvent
} from "react-native";
import { StyleConstants } from "./styles";

interface ButtonProps {
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
  title: string;
}

const isIos = Platform.OS === "ios";

export class Button extends React.PureComponent<ButtonProps> {
  render() {
    return (
      <View>
        {isIos ? (
          <View
            style={{
              backgroundColor: "#e9e9e9",
              borderRadius: 7.5,
              margin: 3
            }}
          >
            <ReactButton onPress={this.props.onPress} title={this.props.title}/>
          </View>
        ) : (
          <View style={{
              margin: 3
          }}>
            <ReactButton
              onPress={this.props.onPress}
              title={this.props.title}
              color={StyleConstants.accentColor}
            />
          </View>
        )}
      </View>
    );
  }
}
