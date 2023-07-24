import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Easing,
  AsyncStorage,
  RefreshControl,
  Modal,
  ToastAndroid,
  ImageBackground,
} from 'react-native';
import {Container, Spinner} from 'native-base';

const {width, height} = Dimensions.get('window');

import {fontFamily} from '../fontFamily';

import {color} from '../color';

import {StatusBar} from 'react-native';
import {Accountspart} from '../constants';

export default class ChosseSubjects extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setTypeInAsync = async (type) => {
    await AsyncStorage.setItem('type', JSON.stringify(type));
    this.props.navigation.navigate('HomePage');
  };

  render() {
    return (
      <Container
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#FFF',
        }}>
        <StatusBar backgroundColor={color} barStyle="light-content" />

        <ScrollView>
          <TouchableOpacity
            style={{
              width: '100%',

              padding: 10,
              marginTop: 50,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              // borderRadius: 40,
              flexDirection: 'row',
            }}
            onPress={() => {
              let type = '1';
              this.setTypeInAsync(type);
            }}>
            <ImageBackground
              style={{width: '100%', height: height / 3, borderRadius: 20}}
              source={require('../images/physics.jpg')}>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  alignItems: 'center',
                  width: '100%',
                  height: height / 3,
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 30, color: '#FFF', fontWeight: 'bold'}}>
                  الفيزياء
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '100%',

              padding: 10,
              marginTop: 30,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              // borderRadius: 40,
              flexDirection: 'row',
            }}
            onPress={() => {
              let type = '2';

              this.setTypeInAsync(type);
            }}>
            <ImageBackground
              style={{width: '100%', height: height / 3, borderRadius: 100}}
              source={require('../images/chimastry.jpg')}>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  alignItems: 'center',
                  width: '100%',
                  height: height / 3,
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 30, color: '#FFF', fontWeight: 'bold'}}>
                  {Accountspart.subName}
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    width: width - 130,
    height: height + 50,
    // marginTop: 55,
    backgroundColor: 'white',
    // paddingBottom: 23,
    marginLeft: (width - 70) * -1,
    // marginTop: (height - 580),

    paddingBottom: 150,
    paddingTop: 155,

    // shadowOffset: { width: 0.5, height: 0.5 },
    // shadowOpacity: 0.7,
    // elevation: 1,
  },

  header: {
    height: 110,
    width: '100%',
    backgroundColor: '#81398e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 25,
    paddingHorizontal: 15,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  titel: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: '15%',
  },
  info_view: {
    width: '85%',
    alignSelf: 'center',
    marginVertical: 15,
    alignItems: 'center',
    borderRadius: 20,
    borderColor: '#777',
    borderWidth: 1,
  },
  Big_image: {
    height: 150,
    width: 150,
    borderRadius: 75,
    marginVertical: 10,
  },
  text_name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  View_name: {
    width: '90%',
    alignItems: 'center',
    paddingLeft: 15,
  },
  percentage_view: {
    width: '90%',
    margin: '5%',
    alignSelf: 'center',
    paddingLeft: 10,
    paddingTop: 10,
    // borderColor: '#777',
    borderRadius: 10,
    // borderWidth: 1,
  },
  view_progress: {
    marginVertical: height * 0.008,
    height: 40,
    width: '90%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  Percentage_text: {
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 18,
    fontFamily: fontFamily,
  },
  next_view: {
    width: '98%',
    flexDirection: 'row',
    alignItems: 'center',
    // paddingLeft: 15,
  },
  view_data: {
    height: 120,
    width: '40%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#777',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_Quiz: {
    fontSize: 18,
    marginVertical: 7,
    fontWeight: 'bold',
  },
  money_view: {
    // height: 100,
    width: '90%',
    margin: '5%',
    // alignSelf: 'center',
    borderRadius: 10,
    borderColor: '#777',
    borderWidth: 1,
    // marginVertical: 10,
    backgroundColor: '#FFF',
  },
  pocket_moneny: {
    flexDirection: 'row',
    // width: '90%',
    // margin: '5%',
    // height: 70,
    // alignSelf: 'center',
    // justifyContent: 'space-between',
  },
  viewcontainer: {
    flexDirection: 'row',
    width: 150,
    // justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text_money1: {
    fontSize: 20,
  },
  viewcontainer2: {
    backgroundColor: '#81398e',
    marginTop: 25,
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 7,
    marginTop: 6,
    fontSize: 20,
    color: '#fff',
  },
  finance_view: {
    height: 70,
    width: '95%',
    alignSelf: 'center',
    // marginTop: 20,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  coin_icon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  wallet_icon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  inner: {
    width: '100%',
    height: 15,
    borderRadius: 15,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  RatingDegree: {
    fontSize: 20,
    color: '#f5fcff',
    // position:'absolute',
    // alignSelf:'center'
  },
});
