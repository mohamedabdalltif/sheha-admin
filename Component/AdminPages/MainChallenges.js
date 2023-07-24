import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import axios from 'axios';
import basic from './BasicURL';
import {color} from '../color';
import images from '../../constants/images';

export default class MainChallenges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AllStudents: '',
      AllStudentsPending: '',
      AllData: this.props.navigation.getParam('AllData'),
    };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          flexDirection: 'row',
          padding: 15,
        }}>
        <StatusBar backgroundColor={color} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/************************************************************************************************************ */}
          <TouchableOpacity
            style={{
              width: '100%',
              height: 170,
              padding: 10,
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 40,
              flexDirection: 'row',
            }}
            onPress={() =>
              this.props.navigation.navigate('chaptersPage', {
                AllData: this.state.AllData,
              })
            }>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 30, color: '#000', fontWeight: 'bold'}}>
                الشباتر
              </Text>
            </View>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={images.add_chapter}
                resizeMode="contain"
                style={{flex: 1, width: '100%', height: '100%'}}
              />
            </View>
          </TouchableOpacity>
          {/************************************************************************************************************ */}

          <TouchableOpacity
            style={{
              marginVertical: '15%',
              width: '100%',
              height: 170,
              padding: 10,
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 40,
              flexDirection: 'row',
            }}
            onPress={() =>
              this.props.navigation.navigate('FinishChallenge', {
                AllData: this.state.AllData,
              })
            }>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={images.completedChallenges1}
                resizeMode="contain"
                style={{flex: 1, width: '100%', height: '100%'}}
              />
            </View>

            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 30, color: '#000', fontWeight: 'bold'}}>
                التحديات المنتهية
              </Text>
            </View>
          </TouchableOpacity>

          {/************************************************************************************************************ */}

          <TouchableOpacity
            style={{
              width: '100%',
              height: 170,
              padding: 10,
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 40,
              flexDirection: 'row',
            }}
            onPress={() =>
              this.props.navigation.navigate('TopRatedStudent', {
                AllData: this.state.AllData,
              })
            }>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 30, color: '#000', fontWeight: 'bold'}}>
                الطلاب الاعلى تقييماً
              </Text>
            </View>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={images.students_degres}
                resizeMode="contain"
                style={{flex: 1, width: '100%', height: '100%'}}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  Container: {
    width: '100%',
    justifyContent: 'center',
    //   flexDirection: "row",
    marginTop: 10,
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
    shadowOffset: {height: 0, width: 5},
    shadowOpacity: 0.5,
    elevation: 1,
    borderColor: 'white',
    borderWidth: 1,
  },
  insideButton: {
    marginTop: -50,
    marginRight: 30,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonStyle: {
    shadowOffset: {height: 50, width: 50},
    shadowOpacity: 0.5,
    elevation: 1,
    justifyContent: 'center',
    marginTop: 10,
    width: 120,
    marginRight: 20,
    height: 30,

    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
  },
});
