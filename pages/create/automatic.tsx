import * as React from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles } from '../../components/styles';
import ProgressCircle from 'react-native-progress-circle';
import { MaterialIcons } from '@expo/vector-icons';
import { Algorithms } from '../../components/algorithms';
import { getWeather } from '../../components/helpers';
import { Weather } from '../../components/formats';
import { Ionicons } from '@expo/vector-icons';


const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;


interface AutomaticProps {
  navigation: any;
}

interface AutomaticState {
  loaded: boolean;
  weather: Weather;
}

export class Automatic extends React.Component<AutomaticProps, AutomaticState> {
  constructor(props: AutomaticProps) {
    super(props);
    this.state = { loaded: false, weather: null }
  }

  static navigationOptions = {
    title: 'Create Automatically'
  };

  componentDidMount() {
    this.getRecommendedOutfits();
    this.getWeather();
  }

  getWeather = async () => {
    let weather = await getWeather();
    this.setState({ weather: weather });
  }

  async getRecommendedOutfits() {
    Algorithms.getRecommendedOutfits().then(outfits => {
      this.setState({ loaded: true })
    });
  }

  generateWeather = () => {
    return !!this.state.weather ? (
      this.state.weather.working ? (
        <View style={{flexDirection: "row", alignItems:"center"}}>
          {this.state.weather.temp === "hot" && <Ionicons name="ios-sunny" size={40} />}
          {this.state.weather.temp === "warm" && <Ionicons name="ios-partly-sunny" size={40} />}
          {this.state.weather.temp === "chilly" && <Ionicons name="ios-cloudy" size={40} />}
          {this.state.weather.temp === "cold" && <Ionicons name="ios-snow" size={40} />}
          {this.state.weather.isUS ? (
            <View style={{paddingLeft: 15}}>
              <Text style={commonStyles.pb}>{Math.round(this.state.weather.f)}&#176; F in {this.state.weather.city}</Text>
              <Text style={commonStyles.ps}>{Math.round(this.state.weather.c)}&#176; C</Text>
            </View>
          ) : (
              <View>
                <Text style={commonStyles.ps}>{Math.round(this.state.weather.c)}&#176; C in {this.state.weather.city}</Text>
              </View>
            )}
        </View>

      ) : (
          <Text>Could not get weather. Location Permission Required.</Text>
        )
    ) : (
        <ActivityIndicator size="small" />
      )
  }

  render() {
    return (
      <PageLayout style={styles.body}>
        <View style={styles.weatherContainer}>
          <View style={styles.weather}>
            {this.generateWeather()}
          </View>
        </View>
        <ScrollView snapToInterval={width * 0.9} snapToAlignment="start" decelerationRate="fast" horizontal style={styles.scrollContainer} showsHorizontalScrollIndicator={false}>
          <View style={styles.firstMargin} />
          {this.state.loaded ? (
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((item, index) => {
              return <View key={index} style={styles.outfitContainer}><Text>item</Text></View>
            })
          ) : (
              <View style={styles.outfitContainer}>
                <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                  <ActivityIndicator size="large" />
                </View>
              </View>
            )}
        </ScrollView>
        {/* <View style={styles.iconContainer}> */}
        {/* <View style={styles.floatingIcon}><MaterialIcons name='chevron-left' size={40} /></View>
                <View style={styles.floatingIcon}><MaterialIcons name='chevron-right' size={40} /></View> */}
        {/* </View> */}


      </PageLayout>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#e9e9e9"
  },
  scrollContainer: {
    flex: 1,
    // flexDirection: "column",
    width: width,
    height: "100%",
    paddingVertical: width * 0.05,
    backgroundColor: "#e9e9e9"
  },
  outfitContainer: {
    width: width * 0.86,
    marginHorizontal: width * 0.02,
    backgroundColor: "#fff",
    borderRadius: 7.5,
    padding: width * 0.05
  },
  firstMargin: {
    width: width * 0.05
  },
  iconContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // zIndex: 5

  },
  floatingIcon: {
    position: "absolute",
    top: (height * 0.5) - 50,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e9e9e9",
    justifyContent: "center",
    alignItems: "center",
    // zIndex: 5
  },
  weatherContainer: {
    width: "100%",
    padding: width * 0.07,
    paddingBottom: 0
  },
  weather: {
    borderRadius: 7.5,
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.02,
    // paddingVertical:10,
    backgroundColor: "#fff"
  }
});