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
import RNFetchBlob from 'rn-fetch-blob';

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
import {Button, IconButton, RadioButton} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';

import basic from './BasicURL';
import {color} from '../color';

const {width, height} = Dimensions.get('window');

// var DESTRUCTIVE_INDEX = 1;
// var CANCEL_INDEX = 6;

export default class BubbleExamQuestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exam_id: this.props.navigation.getParam('exam_id'),
      papel_link: '',
      questions: [],
      loading: true,
      uploadPdfLoading: false,
    };

    this.flatListRef = null;
    this.scroll_to_index = this.scroll_to_index.bind(this);
  }

  componentDidMount() {
    this.get_questions();
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
        console.log(res.data);
        console.log(res.data.exam_info.papel_link);
        if (res.status == 200) {
          if (res.data != 'error') {
            if (Array.isArray(res.data.questions)) {
              let alldata = res.data.questions;

              alldata.map((item) => (item.delLoading = false));
              this.setState({
                questions: alldata,
                papel_link: res.data.exam_info.papel_link,
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

  async delete_question(index) {
    let AllData = this.state.questions;
    AllData[index].delLoading = true;
    this.setState({
      questions: AllData,
    });
    let data_to_send = {
      question_id: AllData[index].question_id,
    };
    let domain = basic.url;

    axios
      .post(domain + `admin/delete_question.php`, data_to_send)
      .then((res) => {
        if (res.data != 'error') {
          const OriginalArray = this.state.questions;

          OriginalArray.splice(index, 1);

          this.setState({
            questions: OriginalArray,
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
          AllData[index].delLoading = false;
          this.setState({
            questions: AllData,
          });
        }
      });
  }

  async addPDF() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      // this.setState({
      //     summery_name: res.name,
      //     path: res.uri,
      //     file: res,
      // })
      this.uploadPDF(res);
    } catch (err) {}
  }

  uploadPDF = async (file) => {
    if (file != null) {
      this.setState({
        uploadPdfLoading: true,
      });

      const data = new FormData();
      data.append('name', 'Image Upload');
      data.append('file_attachment', file);
      data.append('exam_id', this.state.exam_id.slice(5));
      let domain = basic.url;

      let res = await fetch(domain + 'admin/upload_exam_papel_pdf.php', {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data; ',
        },
      });
      let responseJson = await res.json();
      console.log(responseJson);
      if (responseJson == 'success') {
        Alert.alert('أدمن', 'تم الرفع بنجاح');
        this.setState({
          papel_link: file.uri,
        });
      } else if (responseJson == 'Sorry, your file is too large.') {
        Alert.alert('أدمن', 'حجم هذا الملف كبير لرفعه');
      } else if (responseJson == 'Sorry, file already exists.') {
        Alert.alert('أدمن', 'هذا الملف موجود بالفعل');
      } else {
        Alert.alert('أدمن', 'عفوا حدث خطأ أثناء رفع الملف');
      }
      this.setState({
        uploadPdfLoading: false,
      });
    } else {
      Alert.alert('أدمن', 'عفوا يجب اختيار الملف اولا');
    }
    // this.setState({
    //   papel_link:
    //     'https://camp-coding.org/teachersApp/Mohamed_Elbadry_physics/admin/uploads/699253140_1632152332    .pdf',
    // });
  };

  async add_ques() {
    let obj = {
      question_id: 0,
      question_answers: 'أ//CAMP//ب//CAMP//ج//CAMP//د',
      question_image: null,
      question_text: 'أختر',
      question_valid_answer: 'أ',
    };

    let domain = basic.url;

    this.setState({loading: true});

    RNFetchBlob.fetch(
      'POST',
      domain + `admin/add_ques.php`,
      {
        Authorization: 'Bearer access-token',
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      [
        // element with property `filename` will be transformed into `file` in form data
        {
          name: 'image',
          filename: 'avatar.png',
          type: 'image/png',
          data: null,
        },
        {
          name: 'question_text',
          data: obj.question_text,
        },
        {
          name: 'question_image',
          data: null,
        },
        {
          name: 'question_answers',
          data: obj.question_answers,
        },
        {
          name: 'question_valid_answer',
          data: obj.question_valid_answer,
        },
        {
          name: 'question_exam_quiz_id',
          data: this.state.exam_id,
        },
      ],
    )
      .then((resp) => {
        let data = resp.data.trim();
        if (data == '"success"') {
          this.get_questions();
          Toast.show('تمت إضافة السؤال بنجاح');
        } else {
          Alert.alert('أدمن', 'حدث خطأ ما من فضلك حاول مره اخرى');
        }
      })
      .catch((err) => {
        // ...
      })
      .finally(() => {
        this.setState({loading: false});
      });
  }

  async modifyAnswer(newVal, index) {
    let allQuestions = this.state.questions;
    let lastVal = allQuestions[index].question_valid_answer;
    allQuestions[index].question_valid_answer = newVal;
    this.setState({
      questions: allQuestions,
    });
    let domain = basic.url;

    RNFetchBlob.fetch(
      'POST',
      domain + `admin/edit_ques.php`,
      {
        Authorization: 'Bearer access-token',
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      [
        // element with property `filename` will be transformed into `file` in form data
        {
          name: 'image',
          filename: 'avatar.png',
          type: 'image/png',
          data: null,
        },
        {
          name: 'question_id',
          data: allQuestions[index].question_id,
        },
        {
          name: 'question_text',
          data: allQuestions[index].question_text,
        },
        {
          name: 'question_image',
          data: null,
        },
        {
          name: 'question_answers',
          data: 'أ//CAMP//ب//CAMP//ج//CAMP//د',
        },
        {
          name: 'question_valid_answer',
          data: allQuestions[index].question_valid_answer,
        },
        {
          name: 'question_exam_quiz_id',
          data: this.state.exam_id,
        },
      ],
    )
      .then((resp) => {
        this.setState({loading: false});

        let data = resp.data.trim();
        if (data == '"success"') {
        } else {
          allQuestions[index].question_valid_answer = lastVal;
          this.setState({
            questions: allQuestions,
          });
          Alert.alert('أدمن', 'حدث خطأ ما من فضلك حاول مره اخرى');
        }
      })
      .catch((err) => {
        // ...
      });
  }

  render_question(item, index) {
    return (
      <View
        style={{
          backgroundColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          marginVertical: 10,
          width: '90%',
          alignSelf: 'center',
        }}>
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#BBBDC1',
            borderRadius: 8,
            padding: 4,
            paddingHorizontal: 8,
            top: -10,
          }}>
          <Text>•{index + 1}•</Text>
        </View>

        <RadioButton.Group
          onValueChange={(newValue) => {
            this.modifyAnswer(newValue, index);
          }}
          value={item.question_valid_answer}>
          <View
            style={{
              flexDirection: 'row',
              // width: '100%',
              alignItems: 'center',
              justifyContent: 'space-around',
              // flexWrap: 'wrap',
              // flex: 1,
            }}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <RadioButton color={'#3a86ff'} value="أ" />
              <Text style={{fontSize: 18, fontWeight: '800'}}>أ</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <RadioButton color={'#3a86ff'} value="ب" />
              <Text style={{fontSize: 18, fontWeight: '800'}}>ب</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <RadioButton color={'#3a86ff'} value="ج" />
              <Text style={{fontSize: 18, fontWeight: '800'}}>ج</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <RadioButton color={'#3a86ff'} value="د" />
              <Text style={{fontSize: 18, fontWeight: '800'}}>د</Text>
            </View>
          </View>
        </RadioButton.Group>
        {/* </View> */}
        <Button
          loading={item.delLoading}
          style={{
            marginVertical: 8,
          }}
          color={'#DA291C'}
          mode="contained"
          labelStyle={{
            fontWeight: '800',
            fontSize: 18,
          }}
          onPress={() => {
            Alert.alert(
              'تنبية ⚠️',
              'تأكيد حذف السؤال',
              [
                {
                  text: 'إغلاق',
                  onPress: () => console.log('cancel mark whole exam'),
                },
                {
                  text: 'حذف',
                  style: 'cancel',
                  onPress: () => this.delete_question(index),
                },
              ],
              {
                cancelable: true,
              },
            );
          }}>
          حذف
        </Button>
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
            <TouchableOpacity
              onPress={() => {
                if (this.state.papel_link) {
                  this.add_ques();
                } else {
                  Alert.alert('أدمن', 'يجب إضافة ملف PDF للإمتحان أولاً');
                }
              }}>
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
                    key={'qu'}
                    removeClippedSubviews={false}
                    enableEmptySections={false}
                    data={this.state.questions}
                    renderItem={({item, index}) =>
                      this.render_question(item, index)
                    }
                    keyExtractor={(_, index) => `#-${index}`}
                    // initialNumToRender={2}
                    onScrollToIndexFailed={this.scrollToIndexFailed.bind(this)}
                    // getItemLayout={(data, index) => {
                    //   console.log(index)
                    //        // { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                    //       }
                    // }
                    style={{
                      width: '100%',
                      marginBottom: 50,

                      // alignItems:"center",
                    }}
                  />
                </View>
              )}
            </View>
          )}
          {!this.state.loading && (
            <View
              style={{
                position: 'absolute',
                bottom: 10,
                //   left: 0,
                width: '90%',
                alignSelf: 'center',
              }}>
              {this.state.papel_link ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <Button
                    loading={this.state.uploadPdfLoading}
                    style={{
                      width: '45%',
                    }}
                    mode="contained"
                    color="#3a86ff"
                    onPress={() => {
                      this.addPDF();
                    }}>
                    تعديل
                  </Button>
                  <Button
                    onPress={() => {
                      this.props.navigation.navigate('Viewer', {
                        sum_name: this.props.navigation.getParam('exam_name'),
                        sum_link: this.state.papel_link,
                      });
                    }}
                    style={{
                      width: '45%',
                    }}
                    mode="contained"
                    color="#3a86ff">
                    عرض
                  </Button>
                </View>
              ) : (
                <Button
                  loading={this.state.uploadPdfLoading}
                  onPress={() => {
                    this.addPDF();
                  }}
                  mode="contained"
                  color="#3a86ff">
                  إضافة PDF
                </Button>
              )}
            </View>
          )}
        </Container>
      </>
    );
  }
}
const styles = StyleSheet.create({});
