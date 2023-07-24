import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  AsyncStorage,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import basic from './BasicURL';
import { color } from '../color';
import { images } from '../../constants';

export default class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      AllStudents: '',
      AllStudentsPending: '',
    };
  }
  async componentDidMount() {
    let domain = basic.url;

    axios.get(domain + 'select_generations.php').then((res) => {
      let array = res.data.gens;
      let Number = 0;
      let NumberPending = 0;
      for (let i = 0; i < array.length; i++) {
        Number =
          Number +
          (parseInt(array[i].student_with_pending) +
            parseInt(array[i].student_without_pending));
        NumberPending = NumberPending + parseInt(array[i].student_with_pending);
      }
      this.setState({ AllStudents: Number, AllStudentsPending: NumberPending });
    });
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
            onPress={() => this.props.navigation.navigate('ClassPage')}>
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 30, color: '#000', fontWeight: 'bold' }}>
                الدفعات
              </Text>
            </View>
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('../images/groups.png')}
                resizeMode="contain"
                style={{ flex: 1, width: '100%', height: '100%' }}
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
              this.props.navigation.navigate('Students', {
                generation_id: 'no',
                collectiont_id: 'no',
                status: 'approved',
                NumberOfStudent: this.state.AllStudents,
              })
            }>
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('../images/students2.png')}
                resizeMode="contain"
                style={{ flex: 1, width: '100%', height: '100%' }}
              />
            </View>

            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 30, color: '#000', fontWeight: 'bold' }}>
                جميع الطلاب
              </Text>
            </View>
          </TouchableOpacity>

          {/******************************************************* الحسابات ***************************************************** */}
          <TouchableOpacity
            style={{
              // marginVertical: '15%',
              width: '100%',
              height: 170,
              padding: 10,
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 40,
              flexDirection: 'row',
            }}
            onPress={() => this.props.navigation.navigate('Login')}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 30, color: '#000', fontWeight: 'bold'}}>
               الحسابات
              </Text>
            </View>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image
               source={images.theAccounts}
                resizeMode="contain"
                style={{width: '80%', height: '80%'}}
              />
            </View>
          </TouchableOpacity>
          {/************************************************************************************************************ */}
          {/* <TouchableOpacity
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
              this.props.navigation.navigate('LateStudent', {
                generation_id: 'no',
                collectiont_id: 'no',
                status: 'pending',
                NumOfStudentPending: this.state.AllStudentsPending,
              })
            }>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 30, color: '#000', fontWeight: 'bold'}}>
                المتخلفين عن الدفع
              </Text>
            </View>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={require('../images/pending.png')}
                style={{flex: 1, width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity> */}
          {/* /////////////////////////////////////////////////////////////////// */}
          <TouchableOpacity
            style={{
              marginTop: '15%',
              width: '100%',
              height: 170,
              padding: 10,
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 40,
              flexDirection: 'row',
            }}
            onPress={() => this.props.navigation.navigate('Generations')}>
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={images.versus}
                resizeMode="contain"
                style={{ flex: 1, width: '100%', height: '100%' }}
              />
            </View>
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 30, color: '#000', fontWeight: 'bold' }}>
                التحديات
              </Text>
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
    shadowOffset: { height: 0, width: 5 },
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
    shadowOffset: { height: 50, width: 50 },
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
