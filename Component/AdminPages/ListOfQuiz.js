import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  FlatList,
  ToastAndroid,
  AsyncStorage,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Spinner,
  ActionSheet,
  Root,
  Fab,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import Icon2 from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import basic from './BasicURL';
import {color} from '../color';

const {width, height} = Dimensions.get('window');
var BUTTONS = [
  {icon: 'ios-document', text: 'تعديل الواجب', iconColor: '#080'},
  {icon: 'ios-document', text: 'تقرير الطلاب', iconColor: '#2c8ef4'},
  {text: 'نتائج الطلاب', icon: 'md-document', iconColor: '#ea943b'},
  {text: 'من لم يحل', icon: 'md-document', iconColor: '#00f'},
  {text: 'عرض الأسئلة', icon: 'md-document', iconColor: '#888'},
  {text: 'مسح الواجب', icon: 'trash', iconColor: '#fa213b'},
  {text: 'الغاء', icon: 'close', iconColor: '#fa213b'},
];
var DESTRUCTIVE_INDEX = 7;
var CANCEL_INDEX = 6;

export default class ListOfQuiz extends React.Component {
  //constructor

  constructor(props) {
    super(props);

    this.state = {
      generation_id: 1,
      student_id: 1,
      quiz: [],
      loading: false,
      loading_public: [false],
      loading_answer: [false],
    };

    this.flatListRef = null;
    this.scroll_to_index = this.scroll_to_index.bind(this);
  }

  componentDidMount() {
    this.get_quiz();
  }

  scrollToIndexFailed(error) {
    const offset = error.averageItemLength * error.index;
    this.flatListRef.scrollToOffset({offset});
    setTimeout(() => {
      this.flatListRef.scrollToIndex({index: error.index});
    }, 2500);
  }

  scroll_to_index(scrollTo) {
    setTimeout(() => {
      this.flatListRef.scrollToIndex({animated: true, index: scrollTo});
    }, 400);
  }

  alert_delete(index, name) {
    Alert.alert(
      'ادمن',

      ' هل انت متاكد من مسح الوجب ( ' + name + ' ) ',
      [
        {
          text: 'الغاء',
          onPress: () => console.log('cansel Pressed'),
        },
        {
          text: 'مسح',
          onPress: () => this.delete_quiz(index),
        },
      ],
      {cancelable: false},
    );
  }

  async delete_quiz(index) {
    let data_to_send = {
      quiz_id: this.state.quiz[index].quiz_id,
    };
    let domain = basic.url;

    axios.post(domain + `admin/delete_quiz.php`, data_to_send).then((res) => {
      this.setState({loading: true});
      if (res.status == 200) {
        if (res.data == 'success') {
          this.get_quiz();

          ToastAndroid.showWithGravity(
            'تم حذف الواجب بنجاح',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        } else {
          Alert.alert('أدمن', 'خطأ');
        }
      } else {
        Alert.alert('أدمن', 'خطأ');
      }
    });
  }

  get_quiz = async (exam_quiz_index) => {
    this.setState({loading: true});
    // this.setState({disabled: true});
    let generation_id = this.props.navigation.getParam('generation_id');
    let collection_id = this.props.navigation.getParam('collection_id');

    this.setState({generation_id: generation_id});
    let data_to_send = {
      generation_id: generation_id,
      collection_id: collection_id,
    };
    let domain = basic.url;

    axios
      .post(domain + `admin/select_total_quiz.php`, data_to_send)

      .then((res) => {
        if (res.status == 200) {
          // console.log(res.data)
          // alert(JSON.stringify(res.data))

          if (res.data != 'error') {
            if (res.data.Quiz.length > 0) {
              this.setState({
                quiz: res.data.Quiz,
              });
              if (exam_quiz_index * 0 == 0) {
                this.scroll_to_index(exam_quiz_index);
              }
              // alert(JSON.stringify(res.data))
            } else {
              // Alert.alert('أدمن', 'لا يوجد واجبات');
              this.setState({
                quiz: [],
              });
            }
          } else {
            Alert.alert('أدمن', 'خطأ');
          }
        } else {
          Alert.alert('أدمن', 'حدث شئ خطأ');
        }
        this.setState({loading: false});
      });
  };

  async update_show_to_public(pu_exam_id) {
    // this.setState({disabled: true});
    let load = this.state.loading_public;
    load[pu_exam_id] = true;
    this.setState({loading_public: load});
    let list = this.state.quiz;
    let data_to_send = {
      quiz_id: list[pu_exam_id].quiz_id,
      value: list[pu_exam_id].quiz_show_to_public == 0 ? 1 : 0,
    };
    let domain = basic.url;

    axios
      .post(domain + `admin/update_quiz_show_to_public.php`, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // console.log(res.data)
          if (res.data == 'success') {
            list[pu_exam_id].quiz_show_to_public =
              list[pu_exam_id].quiz_show_to_public == 0 ? 1 : 0;
            this.setState({quiz: list});
            Alert.alert('أدمن', 'تمت العمليه بنجاح');
          } else {
            Alert.alert('أدمن', 'خطأ');
          }
        } else {
          Alert.alert('أدمن', 'حدث شئ خطأ');
        }
        load[pu_exam_id] = false;
        this.setState({loading_public: load});
      });
  }

  async update_show_to_answer(pu_exam_id) {
    // this.setState({disabled: true});
    let generation_id = this.props.navigation.getParam('generation_id');
    let collection_id = this.props.navigation.getParam('collection_id');
    let load = this.state.loading_answer;
    load[pu_exam_id] = true;
    this.setState({loading_answer: load});
    let list = this.state.quiz;
    let data_to_send = {
      exam_id: 'Quiz_' + list[pu_exam_id].quiz_id,
      generation_id: generation_id,
      collection_id: collection_id,
      value: list[pu_exam_id].show_to_answer == 0 ? 1 : 0,
    };
    let domain = basic.url;

    axios
      .post(domain + `admin/update_exam_show_to_answer.php`, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // console.log(res.data)
          if (res.data == 'success') {
            list[pu_exam_id].show_to_answer =
              list[pu_exam_id].show_to_answer == 0 ? 1 : 0;
            this.setState({quiz: list});
            Alert.alert('أدمن', 'تمت العمليه بنجاح');
          } else {
            Alert.alert('أدمن', 'خطأ');
          }
        } else {
          Alert.alert('أدمن', 'حدث شئ خطأ');
        }
        load[pu_exam_id] = false;
        this.setState({loading_answer: load});
      });
  }

  render() {
    return (
      <Root>
        <Container style={{backgroundColor: '#f7f7f7'}}>
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
                  style={{fontSize: 35, color: '#fff', marginLeft: 10}}
                />
              </TouchableOpacity>
            </Left>
            <Body
              style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
              <Title style={{fontSize: 22, fontFamily: 'serif'}}>
                قائمة الواجبات
              </Title>
            </Body>
            <Right />
          </Header>
          {
            // <Text>{item.exam_name}</Text>
          }
          {this.state.loading == true ? (
            <Spinner color={color} size={40} style={{marginTop: 200}} />
          ) : (
            <View>
              {this.state.quiz.length == 0 ? (
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
                      color: color,
                    }}>
                    لا يوجد واجبات متاحة الان
                  </Text>
                </View>
              ) : (
                <View style={{marginVertical: 15, marginBottom: 100}}>
                  <FlatList
                    ref={(ref) => {
                      this.flatListRef = ref;
                    }}
                    removeClippedSubviews={false}
                    enableEmptySections={false}
                    data={this.state.quiz}
                    initialNumToRender={2}
                    onScrollToIndexFailed={this.scrollToIndexFailed.bind(this)}
                    keyExtractor={(item) => item.quiz_id}
                    renderItem={({item, index}) => (
                      <View
                        style={{
                          width: '90%',
                          alignSelf: 'center',
                          paddingHorizontal: 12,
                          paddingVertical: 15,
                          borderRadius: 7,
                          backgroundColor: '#fff',
                          marginBottom: 10,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity
                          style={{width: '70%'}}
                          onPress={() =>
                            ActionSheet.show(
                              {
                                options: BUTTONS,
                                cancelButtonIndex: CANCEL_INDEX,
                                destructiveButtonIndex: DESTRUCTIVE_INDEX,
                              },
                              (buttonIndex) => {
                                if (buttonIndex == 0) {
                                  this.props.navigation.navigate('AddExam', {
                                    exam_id: item.quiz_id,
                                    exam_name: item.quiz_name,
                                    page_type: item.quiz_page_type,
                                    time_type: item.quiz_time_type,
                                    solution_type: item.quiz_solution_type,
                                    exam_duration: item.quiz_time / 60 + '',
                                    date: item.quiz_end_date,
                                    add_or_edit: 2,
                                    add_type: 1,
                                    generation_id: this.state.generation_id,
                                    refrish: this.get_quiz,
                                    // scroll_to_index: this.scroll_to_index,
                                    exam_quiz_index: index,
                                  });
                                } else if (buttonIndex == 1) {
                                  this.props.navigation.navigate('ExamReport', {
                                    exam_id: item.quiz_id,
                                    generation_id: this.state.generation_id,
                                    exam_name: item.quiz_name,
                                    test_id: 2,
                                    collection_id: this.props.navigation.getParam(
                                      'collection_id',
                                    ),
                                  });
                                } else if (buttonIndex == 2) {
                                  this.props.navigation.navigate(
                                    'SolvedStudents',
                                    {
                                      exam_id: item.quiz_id,
                                      exam_name: item.quiz_name,
                                      test_id: 2,
                                      collection_id: this.props.navigation.getParam(
                                        'collection_id',
                                      ),
                                    },
                                  );
                                } else if (buttonIndex == 3) {
                                  this.props.navigation.navigate(
                                    'NotSolvedStudents',
                                    {
                                      exam_id: item.quiz_id,
                                      generation_id: this.state.generation_id,
                                      test_id: 2,
                                      collection_id: this.props.navigation.getParam(
                                        'collection_id',
                                      ),
                                    },
                                  );
                                } else if (buttonIndex == 4) {
                                  this.props.navigation.navigate(
                                    'ExamQuestions',
                                    {
                                      exam_id: 'Quiz_' + item.quiz_id,
                                    },
                                  );
                                } else if (buttonIndex == 5) {
                                  this.alert_delete(index, item.quiz_name);
                                }
                              },
                            )
                          }>
                          <Text style={{fontSize: 22, color: '#444'}}>
                            {item.quiz_name}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            width: 40,
                            height: 40,
                            alignSelf: 'center',
                            // padding:5,
                            borderRadius: 25,
                            backgroundColor: color,
                            arginLeft: 10,
                          }}
                          onPress={() => {
                            this.update_show_to_public(index);
                            // alert('clicked');
                          }}
                          disabled={this.state.loading_public[index]}>
                          {this.state.loading_public[index] ? (
                            <Spinner
                              color="#fff"
                              size={26}
                              style={{
                                alignSelf: 'center',
                                padding: 0,
                                marginTop: -20,
                              }}
                            />
                          ) : (
                            <Icon
                              name={
                                item.quiz_show_to_public == 0
                                  ? 'eye-slash'
                                  : 'eye'
                              }
                              style={{
                                fontSize: 20,
                                color: '#fff',
                                marginTop: 10,
                                alignSelf: 'center',
                              }}
                            />
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            alignSelf: 'center',
                            width: 40,
                            height: 40,
                            // padding:5,
                            borderRadius: 25,
                            backgroundColor: color,
                            arginLeft: 10,
                          }}
                          onPress={() => {
                            this.update_show_to_answer(index);
                            // alert('clicked');
                          }}
                          disabled={this.state.loading_answer[index]}>
                          {this.state.loading_answer[index] ? (
                            <Spinner
                              color="#fff"
                              size={26}
                              style={{
                                alignSelf: 'center',
                                padding: 0,
                                marginTop: -20,
                              }}
                            />
                          ) : (
                            <Icon
                              name={
                                item.show_to_answer == 0 ? 'lock' : 'lock-open'
                              }
                              style={{
                                fontSize: 20,
                                color: '#fff',
                                marginTop: 10,
                                alignSelf: 'center',
                              }}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>
              )}
            </View>
          )}

          <Fab
            direction="up"
            // containerStyle={{}}
            style={{backgroundColor: color, marginRight: 10}}
            position="bottomRight"
            onPress={() =>
              this.props.navigation.navigate('AddExam', {
                exam_quiz_index: this.state.quiz.length,
                exam_name: '',
                exam_duration: '',
                page_type: '0',
                time_type: '0',
                solution_type: '0',
                date: 'إختيار تاريخ',
                time: 'إختيار وقت',
                time2: 'إختيار وقت',
                add_or_edit: 1,
                add_type: 1,
                generation_id: this.state.generation_id,
                refrish: this.get_quiz,
                scroll_to_index: this.scroll_to_index,
              })
            }>
            <Icon name="plus" style={{fontSize: 30}} color="#FFF" />
          </Fab>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({});
