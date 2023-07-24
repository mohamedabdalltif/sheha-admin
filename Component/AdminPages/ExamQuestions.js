import * as React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
  Image,
  FlatList,
  Dimensions,
  Modal,
  ActivityIndicator,
  Picker,
  ToastAndroid,
  AsyncStorage,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Toast,
  Spinner,
} from 'native-base';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';

import basic from './BasicURL';
import {color} from '../color';

const {width, height} = Dimensions.get('window');

// var DESTRUCTIVE_INDEX = 1;
// var CANCEL_INDEX = 6;

export default class ExamQuestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exam_id: this.props.navigation.getParam('exam_id'),
      questions: [],
      loading: true,
      delete_loading: [],
      visableAddQueToChap: false,
      requestLoading: false,
      chaptersData: [],
      selectedChapterId: '',
      selectedQuestion: {},
      selectedQuestionIndex: 0,
    };

    this.flatListRef = null;
    this.scroll_to_index = this.scroll_to_index.bind(this);
  }

  componentDidMount() {
    this.get_questions();
    this.getChapters();
  }

  async addQuestionToChap() {
    this.setState({
      requestLoading: true,
    });
    let question = this.state.selectedQuestion;

    let dataToSend = {
      question_id: question.question_id,
      question_chapter_id: this.state.selectedChapterId,
    };
    let domain = basic.url;

    axios
      .post(domain + 'challenge/add_to_Bank_ques.php', dataToSend)
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data);

          if (res.data == 'success') {
            let all_data = this.state.questions;

            all_data[this.state.selectedQuestionIndex].found = '1';
            this.setState({
              questions: all_data,
            });
            ToastAndroid.showWithGravityAndOffset(
              'قد تم إضافة السؤال بنجاح',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'add_before') {
            ToastAndroid.showWithGravityAndOffset(
              'قد تم إضافة هذا السؤال من قبل',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'عذرا يرجى المحاوله فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجى المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      })
      .finally(() => {
        this.setState({
          requestLoading: false,
          visableAddQueToChap: false,
          selectedChapterId: this.state.chaptersData[0].chapter_id,
        });
      });
  }
  async getChapters() {
    let dataToSend = {
      generation_id: this.props.navigation.getParam('generation_id'),
    };
    let domain = basic.url;
    // console.log(dataToSend);

    axios.post(domain + 'select_chapterts.php', dataToSend).then((res) => {
      if (res.status == 200) {
        // console.log('chapters', res.data);

        if (Array.isArray(res.data)) {
          this.setState({
            chaptersData: res.data,
            selectedChapterId: res.data[0].chapter_id,
          });
        } else {
          this.setState({
            chaptersData: [],
          });
        }
      } else {
        this.setState({
          chaptersData: [],
        });
        ToastAndroid.showWithGravityAndOffset(
          'عذرا يرجى المحاوله فى وقت لاحق',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50,
        );
      }
    });
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

  get_questions = async (question_index) => {
    this.setState({loading: true});
    let data_to_send = {
      id: this.state.exam_id,
    };
    let domain = basic.url;

    axios
      .post(domain + `admin/select_questions.php`, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data != 'error') {
            if (res.data.questions.length > 0) {
              let delete_loding_copy = this.state.delete_loading;
              for (let i = 0; i < res.data.questions.length; i++) {
                delete_loding_copy[i] = false;
              }
              this.setState({
                questions: res.data.questions,
                delete_loading: delete_loding_copy,
              });
              if (question_index * 0 == 0) {
                this.scroll_to_index(question_index);
              }
            } else {
              // Alert.alert('أدمن', 'لا يوجد أسئلة');
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
  allert(index) {
    Alert.alert(
      'ادمن',

      ' هل انت متاكد من حذف السؤال ',
      [
        {
          text: 'الغاء',
          onPress: () => console.log('cansel Pressed'),
        },
        {
          text: 'تأكيد',
          onPress: () => this.delete_question(index),
        },
      ],
      {cancelable: false},
    );
  }
  async delete_question(index) {
    let loading_delete = this.state.delete_loading;
    loading_delete[index] = true;
    this.setState({delete_loading: loading_delete});
    let data_to_send = {
      question_id: this.state.questions[index].question_id,
    };
    let domain = basic.url;

    axios
      .post(domain + `admin/delete_question.php`, data_to_send)
      .then((res) => {
        if (res.data != 'error') {
          const OriginalArray = this.state.questions;

          OriginalArray.splice(index, 1);
          loading_delete.splice(index, 1);

          this.setState({
            questions: OriginalArray,
            delete_loading: loading_delete,
          });
          Toast.show({
            text: 'تم مسح السؤال بنجاح',
            buttonText: 'شكرا',
            textStyle: {color: '#FFF'},
            buttonTextStyle: {color: '#FFF'},
            type: 'danger',
            duration: 7000,
          });
        } else {
          //   Alert.alert(')
          loading_delete[index] = false;
          this.setState({delete_loading: loading_delete});
        }
      });
  }

  edit_question(index) {
    this.props.navigation.navigate('AddEditQuestion', {
      exam_id: this.state.exam_id,
      question_obj: this.state.questions[index],
      changeButton: false,
      refrish: this.get_questions,
      // scroll_to_index: this.scroll_to_index,
      question_index: index,
    });
  }
  add_ques() {
    let index = this.state.questions.length;

    this.props.navigation.navigate('AddEditQuestion', {
      exam_id: this.state.exam_id,
      question_obj: {
        question_id: 0,
        question_text: '',
        question_image: null,
        question_answers: [],
        question_valid_answer: '',
      },
      changeButton: true,
      refrish: this.get_questions,
      // scroll_to_index: this.scroll_to_index,
      question_index: index,
    });
  }

  // delete_question(index) {
  //   let questions = this.state.questions
  //   questions.splice(index, 1)

  //   this.setState({ questions: questions })
  // }

  render_question(item, index) {
    return (
      <View
        style={{
          width: '95%',
          borderWidth: 2,
          borderColor: '#ddd',
          borderRadius: 5,
          padding: 5,
          alignSelf: 'center',
          marginBottom: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}>
          <Text
            style={{
              borderRadius: 5,
              backgroundColor: color,
              color: '#fff',
              fontSize: 18,
              paddingVertical: 2,
              paddingHorizontal: 10,
            }}>
            {index + 1}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '30%',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  visableAddQueToChap: true,
                  selectedQuestion: item,
                  selectedQuestionIndex: index,
                });
              }}>
              <AntDesign
                name={item.found == '1' ? 'star' : 'staro'}
                size={24}
                color="gold"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.edit_question(index);
              }}
              disabled={this.state.delete_loading[index]}>
              <Icon
                name="edit"
                size={22}
                style={{
                  paddingRight: 2,
                  paddingLeft: 2,
                  color:
                    this.state.delete_loading[index] == false ? '#0f0' : '#fff',
                }}
              />
            </TouchableOpacity>
            {this.state.delete_loading[index] == false ? (
              <TouchableOpacity
                onPress={() => {
                  this.allert(index);
                }}>
                <Icon
                  name="trash"
                  size={22}
                  style={{paddingRight: 2, paddingLeft: 2, color: '#F00'}}
                />
              </TouchableOpacity>
            ) : (
              <Spinner
                color="#f00"
                size={22}
                style={{
                  // alignSelf: 'center',
                  padding: 0,
                  height: 22,
                  //   marginTop: -20,
                  // backgroundColor:'#f00'
                }}
              />
            )}
          </View>
        </View>

        <Text
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            fontSize: 18,
            marginTop: 10,
          }}>
          {item.question_text}
        </Text>

        {item.question_image != null ? (
          <Image
            source={{uri: item.question_image}}
            style={{
              width: '90%',
              height: 200,
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 15,
              marginBottom: 5,
              resizeMode: 'stretch',
            }}
          />
        ) : null}
        <View
          style={{
            marginTop: 15,
          }}>
          {item.question_answers.map((answer_text) => (
            <Text
              style={{
                width: '90%',
                alignSelf: 'center',
                borderWidth: 2,
                borderRadius: 5,
                borderColor: '#999',
                backgroundColor:
                  answer_text.answer_text == item.question_valid_answer
                    ? '#72ef72'
                    : '#fff',
                color:
                  answer_text.answer_text != item.question_valid_answer
                    ? '#333'
                    : '#fff',
                paddingVertical: 5,
                paddingHorizontal: 10,
                marginBottom: 3,
                fontSize: 18,
              }}>
              {answer_text.answer_text}
            </Text>
          ))}
        </View>
      </View>
    );
  }

  render() {
    return (
      <>
        <Header style={{backgroundColor: color}} androidStatusBarColor={color}>
          <Left style={{flex: 1}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon
                name="angle-right"
                size={35}
                style={{paddingRight: 10, paddingLeft: 10, color: '#FFF'}}
              />
            </TouchableOpacity>
          </Left>

          <Body style={{flex: 3, alignItems: 'center'}}>
            <Title>الأسئلة</Title>
          </Body>
          <Right style={{flex: 1}}>
            <TouchableOpacity onPress={() => this.add_ques()}>
              <Icon
                name="plus"
                size={25}
                style={{paddingRight: 10, paddingLeft: 10, color: '#fff'}}
              />
            </TouchableOpacity>
          </Right>
        </Header>
        <Container>
          {this.state.loading == true ? (
            <Spinner color={color} size={40} style={{marginTop: 200}} />
          ) : (
            <View>
              {this.state.questions.length == 0 ? (
                <View
                  style={{
                    width: width,
                    height: height - 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 22,
                      color: color,
                    }}>
                    لم يتم إضافة أسئله بعد
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}>
                  <FlatList
                    ref={(ref) => {
                      this.flatListRef = ref;
                    }}
                    removeClippedSubviews={false}
                    enableEmptySections={false}
                    data={this.state.questions}
                    renderItem={({item, index}) =>
                      this.render_question(item, index)
                    }
                    keyExtractor={(item) => item.question_id}
                    initialNumToRender={2}
                    onScrollToIndexFailed={this.scrollToIndexFailed.bind(this)}
                    // getItemLayout={(data, index) => {
                    //   console.log(index)
                    //        // { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                    //       }
                    // }
                    style={{
                      width: '100%',
                      // alignItems:"center",
                    }}
                  />
                </View>
              )}
            </View>
          )}

          <Modal
            visible={this.state.visableAddQueToChap}
            transparent={true}
            onRequestClose={() => {
              this.setState({
                visableAddQueToChap: false,
              });
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({
                    visableAddQueToChap: false,
                  });
                }}
                style={{flex: 1, width: '100%', height: '100%'}}>
                <View style={{flex: 1, width: '100%', height: '100%'}}></View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  paddingVertical: 20,
                  backgroundColor: '#fff',
                  marginHorizontal: 20,
                  borderRadius: 10,
                  width: '90%',
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      marginLeft: 20,
                      fontWeight: 'bold',
                    }}>
                    إضافة السؤال للتحديات
                  </Text>
                  {this.state.chaptersData.length == 0 ? (
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        margin: 7,
                        marginLeft: 20,
                      }}>
                      لا توجد شباتر لأضافة السؤال بها
                    </Text>
                  ) : (
                    <Picker
                      selectedValue={this.state.selectedChapterId}
                      style={{height: 50, width: '90%', alignSelf: 'center'}}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({
                          selectedChapterId: itemValue,
                        });
                      }}>
                      {this.state.chaptersData.map((item) => (
                        <Picker.Item
                          label={item.chapter_name}
                          value={item.chapter_id}
                        />
                      ))}
                    </Picker>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    disabled={
                      this.state.requestLoading ||
                      this.state.chaptersData.length == 0
                    }
                    onPress={() => {
                      this.addQuestionToChap();
                    }}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: color,
                      width: '35%',
                      height: 50,
                      padding: 10,
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}>
                    {this.state.requestLoading ? (
                      <ActivityIndicator color="#fff" size={18} />
                    ) : (
                      <Text
                        style={{
                          fontSize: 18,
                          color: '#fff',
                        }}>
                        إضافة
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={this.state.requestLoading}
                    onPress={() => {
                      this.setState({
                        visableAddQueToChap: false,
                      });
                    }}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      width: '35%',
                      height: 50,

                      padding: 10,
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}>
                    <Text style={{fontSize: 18, color: '#fff'}}>إلغاء</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({
                    visableAddQueToChap: false,
                  });
                }}
                style={{flex: 1, width: '100%', height: '100%'}}>
                <View style={{flex: 1, width: '100%', height: '100%'}}></View>
              </TouchableWithoutFeedback>
            </View>
          </Modal>
          {/* <Fab
            direction="up"
            // containerStyle={{}}
            style={{ backgroundColor: '#d84b88', marginRight: 10 }}
            position="bottomRight"
            onPress={() =>
              this.setState({
                modalVisable: true,
              })
            }>
            <Icon name="plus" style={{ fontSize: 30 }} color="#FFF" />
          </Fab> */}
        </Container>
      </>
    );
  }
}
const styles = StyleSheet.create({});
