import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  AsyncStorage,
  ToastAndroid,
} from 'react-native';
import { Container, Picker, Form, Spinner, Toast } from 'native-base';
import { Hoshi } from 'react-native-textinput-effects';
import Icon from 'react-native-vector-icons/FontAwesome5';
const { width, height } = Dimensions.get('window');
import axios from 'axios';
import basic from './BasicURL';

export default class SeeMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataa: [],
      visable: false,
      loading: false,
      student_id: '',
      generation_id: '',
    };
  }

  componentDidMount() {
    this.info();
  }

  // getMore() {
  //   this.info();
  // }

  allert(index, name, id) {
    Alert.alert(
      'ادمن',

      ' هل انت متاكد من اعاده امتحان ( ' + name + ' ) للطالب ؟ ',
      [
        {
          text: 'الغاء',
          onPress: () => console.log('cansel Pressed'),
        },
        {
          text: 'اعادة',
          onPress: () => this.Re_Start_Exam(index, id),
        },
      ],
      { cancelable: false },
    );
  }

  async Re_Start_Exam(index, item) {
    let data_to_send = {
      solved_exam_id: item,
    };
    this.setState({ loading: true });
    let domain = basic.url;

    axios
      .post(
        domain + `admin/delete_solved_exam.php`,

        data_to_send,
      )
      .then((res) => {
        if (res.data == 'success') {
          this.setState({ loading: false });
          // let change= this.state.dataa;

          // change.exams.splice(index,1)

          // this.setState({
          //   data: change,

          // });
          this.info();
          ToastAndroid.showWithGravity(
            'تم اعادة الامتحان  بنجاح',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        } else {
          //   Alert.alert(')
          this.setState({ loading: false, modalVisible2: false });
        }
      });
  }

  info = async () => {
    this.setState({ loading: true });
    let student_id = this.props.navigation.getParam('student_id');
    let generation_id = this.props.navigation.getParam('generation_id');
    let data_to_send = {
      generation_id: generation_id,
      student_id: student_id,
    };
    let domain = basic.url;

    axios.post(domain + 'select_solved.php', data_to_send).then((res) => {
      if (res.status == 200) {
        // alert(JSON.stringify(res.data))
        if (res.data == 'error') {
          Alert.alert('مرحبا', 'هناك خطأ ما في اتسترجاع بينات المتحان');
        } else {
          this.setState({
            dataa: res.data.exams,
          });
        }
      } else {
        alert('error');
      }

      this.setState({ loading: false });
    });
  };
  render() {
    return (
      <Container
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#EAEAEA',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{ width: '10%', alignSelf: 'flex-start' }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
            style={{
              marginLeft: 0.05 * width,
              marginTop: 0.05 * height,
              // flexDirection: 'row',
              width: '100%',
            }}>
            <Icon name="chevron-right" color={'black'} size={20} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            marginTop: 7,
          }}>
          <Text style={{ color: '#9a9999', textAlign: 'center' }}>
            (اضغط مطولا علي اسم الامتحان للإعادة)
          </Text>
        </View>
        <ScrollView style={{}}>
          {this.state.loading == true ? (
            <Spinner color="#006AB8" size={40} style={{ marginTop: 200 }} />
          ) : (
            <View>
              {this.state.dataa.length == 0 ? (
                <View
                  style={{
                    width: width,
                    height: height - 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#006AB8',
                    }}>
                    لايوجد امتحانات
                  </Text>
                </View>
              ) : (
                <View>
                  <View
                    style={{
                      width: '95%',
                      flexDirection: 'row',
                      marginTop: 25,
                      height: height * 0.05,
                      marginBottom: 5,
                      alignSelf: 'center',
                      // backgroundColor:'red'
                    }}>
                    <View
                      style={{
                        backgroundColor: 'white',
                        width: '70%',
                        borderRightWidth: 2,
                        justifyContent: 'center',
                        borderBottomStartRadius: 20,
                        borderTopStartRadius: 20,
                        // shadowColor: '#000',
                        // shadowOffset: {
                        //   width: 0,
                        //   height: 6,
                        // },
                        // shadowOpacity: 0.37,
                        // shadowRadius: 7.49,

                        elevation: 2,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 18,
                          fontWeight: 'bold',
                        }}>
                        اسم الامتحان
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: 'white',
                        width: '30%',
                        justifyContent: 'center',
                        borderTopEndRadius: 20,
                        borderBottomEndRadius: 20,
                        // shadowColor: '#000',
                        // shadowOffset: {
                        //   width: 0,
                        //   height: 6,
                        // },
                        // shadowOpacity: 0.37,
                        // shadowRadius: 7.49,

                        elevation: 2,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 18,
                          fontWeight: 'bold',
                        }}>
                        المجموع
                      </Text>
                    </View>
                  </View>

                  {this.state.dataa.map((str, index) => {
                    return (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate(
                              'Seloved_Student_Exam',
                              {
                                exam_quiz_id: str.exam_quiz_id,
                                student_id: str.solved_exam_student_id,
                              },
                            );
                          }}
                          onLongPress={() => {
                            this.allert(index, str.exam_name, str.solved_exam_id);
                          }}
                          style={{
                            width: '90%',
                            flexDirection: 'row',
                            marginTop: 5,
                            // height: height * 0.05,
                            marginBottom: 5,
                            alignSelf: 'center',
                          }}>
                          <View
                            style={{
                              backgroundColor: 'white',
                              width: '70%',
                              borderRightWidth: 2,
                              justifyContent: 'center',
                              borderBottomStartRadius: 20,
                              borderTopStartRadius: 20,
                              padding: 10,
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                fontSize: 18,
                                fontWeight: '500',
                              }}>
                              {str.exam_name}
                            </Text>
                          </View>
                          <View
                            style={{
                              backgroundColor: 'white',
                              width: '30%',
                              justifyContent: 'center',
                              borderTopEndRadius: 20,
                              borderBottomEndRadius: 20,
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                fontSize: 18,
                                fontWeight: '500',
                              }}>
                              {str.solved_exam_score}
                            </Text>
                          </View>

                        </TouchableOpacity>
                        <View
                          style={{
                            // marginBottom:40
                          }}></View>
                      </>
                    );
                  })}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </Container>
    );
  }
}
