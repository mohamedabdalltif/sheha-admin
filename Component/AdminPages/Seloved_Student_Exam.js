import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  Animated,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  AsyncStorage,
} from 'react-native';
import axios from 'axios';
// import { color } from '../Constants';
// import { Domain } from '../Constants';
import basic from './BasicURL';
import {color} from '../color';

// import NetInfo from '@react-native-community/netinfo';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Spinner,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {SafeAreaView} from 'react-native-safe-area-context';
// import { fontFamily } from '../fontFamily';
// import {color} from '../ColorApp';

// import { Dimensions } from 'react-native';

const {width, height} = Dimensions.get('window');

export default class Seloved_Student_Exam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xValue: new Animated.Value(0),
      position: 0,
      show: false,
      connection_Status: true,
      bottomConnectionMsg: new Animated.Value(-100),
      student_id: this.props.navigation.getParam('student_id'),
      exam_quiz_id: this.props.navigation.getParam('exam_quiz_id'),
      isLoading: false,
      Exam_Quiz_Data_Array: [],
    };
    this._subscription;
  }

  async componentDidMount() {
    // alert(this.state.exam_quiz_id + ' +  ' + this.state.student_id);
    // console.log(res.data)

    this.getSolvedExams();

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      // console.log('Connection value ' + state.isConnected);
      // console.log('Connection type ' + state.type);
      if (state.isConnected == true) {
        this.setState({
          connection_Status: true,
        });
        Animated.spring(this.state.bottomConnectionMsg, {
          toValue: -100,
        }).start();
      } else {
        this.setState({
          connection_Status: false,
        });
        Animated.spring(this.state.bottomConnectionMsg, {toValue: 0}).start();
      }
    });
  }

  async getSolvedExams() {
    this.setState({isLoading: true});
    // alert(this.state.student_id);

    let data_to_send = {
      student_id: this.state.student_id,
      exam_quiz_id: this.state.exam_quiz_id,
    };

    let domain = basic.url;

    axios
      .post(domain + 'select_solved_student_exam_quiz.php', data_to_send)
      .then((res) => {
        // alert(JSON.stringify(res.data));
        this.setState({
          isLoading: false,
        });
        if (res.data != 'not_found') {
          // alert(JSON.stringify(res.data));
          // console.log(Domain)

          res.data.map((item) => {
            item.question_answers = item.question_answers.split('//CAMP//');
          });
          this.setState({
            Exam_Quiz_Data_Array: res.data,
          });
          // console.log(JSON.stringify(res.data));
        } else {
          if (res.data == 'not_found') {
            // alert(res.data)
            Alert.alert(
              'أدمن',
              'لم يتم تسجيل الاجابات لهذا الامتحان',
              [
                {
                  text: '',
                  onPress: () => {},
                  style: 'cancel',
                },
                {text: 'حسنا', onPress: () => {}},
              ],
              {cancelable: false},
            );
          } else if (res.data == 'error') {
            Alert.alert(
              'أدمن',
              'لقد حدث خطا ما في استرجاع البيانات...',
              [
                {
                  text: '',
                  onPress: () => {},
                  style: 'cancel',
                },
                {text: 'حسنا', onPress: () => {}},
              ],
              {cancelable: false},
            );
          }
        }
      });
  }

  renderAnswers(Question, indexOfQuestion) {
    return (
      <FlatList
        data={Question.question_answers}
        renderItem={({index}) => (
          <View>
            {Question.question_answers[index] ==
            Question.question_valid_answer ? (
              <>
                <View style={styles.Answer_view_Green}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.index_view_answer}>
                      <Text style={styles.Text_answer_index}> {index + 1}</Text>
                    </View>
                    <View style={{flex: 4}}>
                      <Text style={{color: '#777', alignSelf: 'flex-start'}}>
                        {Question.question_answers[index]}
                      </Text>
                    </View>
                    <View style={{}}>
                      <Icon
                        name="check"
                        style={{fontSize: 20, color: '#0bf407'}}
                      />
                    </View>
                  </View>
                </View>
              </>
            ) : Question.question_answers[index] !=
                Question.question_valid_answer &&
              Question.question_answers[index] != Question.choosed_answer ? (
              <View style={styles.Answer_view}>
                <View style={styles.index_view_answer}>
                  <Text style={styles.Text_answer_index}> {index + 1}</Text>
                </View>
                <View style={{flex: 4}}>
                  <Text style={{color: '#777', alignSelf: 'flex-start'}}>
                    {Question.question_answers[index]}
                  </Text>
                </View>
              </View>
            ) : (Question.question_answers[index] !=
                Question.question_valid_answer) !=
              Question.choosed_answer ? (
              <>
                <View style={styles.Answer_view_Red}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.index_view_answer}>
                      <Text style={styles.Text_answer_index}> {index + 1}</Text>
                    </View>
                    <View style={{flex: 4}}>
                      <Text style={{color: '#777', alignSelf: 'flex-start'}}>
                        {Question.question_answers[index]}
                      </Text>
                    </View>

                    <View>
                      <Icon
                        name="times"
                        style={{fontSize: 20, color: '#f40707'}}
                      />
                    </View>
                  </View>
                </View>
              </>
            ) : null}
          </View>
        )}
      />
    );
  }
  render() {
    const ViewConnectionMsg = (props) => {
      return (
        <Animated.View
          style={[
            styles.ConnectionView,
            {bottom: this.state.bottomConnectionMsg},
          ]}>
          <View>
            <Text style={{color: 'white'}}>{props.ConnectionEnter}</Text>
          </View>
        </Animated.View>
      );
    };

    return (
      <>
        <StatusBar backgroundColor={color}></StatusBar>

        <SafeAreaView>
          <Header
            style={{backgroundColor: color}}
            androidStatusBarColor={color}>
            <Left style={{flex: 1}}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <Icon
                  name="angle-right"
                  size={35}
                  style={{color: '#fff', marginLeft: 10}}
                />
              </TouchableOpacity>
            </Left>
            <Body
              style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
              <Title
                numberOfLines={2}
                style={{color: '#F5FCFF', fontSize: 20, fontWeight: 'bold'}}>
                الاجابات
              </Title>
            </Body>
            <Right />
          </Header>

          {this.state.connection_Status ? (
            this.state.isLoading ? (
              <View
                style={{
                  //   flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '85%',
                }}>
                <Spinner color={color} />
              </View>
            ) : (
              <ScrollView>
                {this.state.Exam_Quiz_Data_Array.map((Question, index) => (
                  <View style={styles.Question_View}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={styles.IndexView}>
                        <Text style={styles.IndexText}>({index + 1}</Text>
                      </View>
                      <View style={{width: '100%'}}>
                        <Text style={styles.Question_Text}>
                          {Question.question_text}
                        </Text>
                        {Question.correct_or_not == 0 &&
                        Question.choosed_answer == '' ? (
                          <Text
                            style={{
                              // fontFamily: fontFamily,
                              marginTop: 10,
                              fontSize: 14,
                              color: 'red',
                              opacity: 0.8,
                            }}>
                            لم يتم الاجابه علي هذا السؤال
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    {Question.question_image != null ? (
                      <Image
                        style={styles.ImageStyle}
                        source={{uri: Question.question_image}}></Image>
                    ) : null}

                    {this.renderAnswers(Question, index)}
                  </View>
                ))}
                <View style={{width: '100%', height: 70}}></View>
              </ScrollView>
            )
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: height / 3,
              }}>
              {/* <Image
                    style={{ width: '70%', height: height / 4 }}
                    source={require('../images/NoInternet.png')}
                  /> */}
              <Text style={{marginTop: 10, fontSize: 18}}>
                لا يوجد اتصال بالإنترنت
              </Text>
            </View>
          )}
        </SafeAreaView>
        <ViewConnectionMsg ConnectionEnter="لا يوجد اتصال بالإنترنت" />
      </>
    );
  }
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    width: width - 130,
    height: height + 50,
    marginTop: 55,
    backgroundColor: 'white',
    paddingBottom: 23,
    marginLeft: (width - 70) * -1,
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.7,
    elevation: 1,
  },
  ConnectionView: {
    width: '100%',
    height: 20,
    position: 'absolute',
    zIndex: 222,
    backgroundColor: color,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Header: {
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color,
    elevation: 5,
    height: height / 12,
    flexDirection: 'row',
    padding: 20,
  },
  Title: {
    fontSize: 20,
    // fontWeight: 'bold',
    // fontFamily: fontFamily,
    alignSelf: 'center',
    // justifyContent: 'center',
    // marginLeft: '30%',
  },
  Question_View: {
    // width: '90%',
    margin: '5%',
    marginBottom: 10,
    marginTop: 30,
  },
  IndexView: {
    // marginBottom: 10,
    // marginLeft: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 10,
  },
  IndexText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  Question_Text: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginBottom: 10,
    // marginLeft: 10
    width: '85%',
  },
  Answer_view: {
    padding: 10,
    borderColor: '#777',
    borderWidth: 1,
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  Text_answer: {
    fontSize: 15,
  },
  index_view_answer: {
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#777',
    borderWidth: 1,
    margin: 10,
  },
  Text_answer_index: {},
  ImageStyle: {
    height: height / 4,
    width: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  Answer_view_Red: {
    padding: 10,
    borderColor: '#f40707',
    borderWidth: 1,
    backgroundColor: '#dedede',
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 5,
  },
  Answer_view_Green: {
    // height: height / 12,
    // width: width / 1.24,
    padding: 10,
    borderColor: '#0bf407',
    borderWidth: 1,
    backgroundColor: '#dedede',
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 5,
  },
});
