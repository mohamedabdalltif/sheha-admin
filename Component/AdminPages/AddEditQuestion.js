import React, {Component} from 'react';

import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Spinner,
  Button,
} from 'native-base';
import {RadioButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import basic from './BasicURL';
import {color} from '../color';

const {width, height} = Dimensions.get('window');

// var DESTRUCTIVE_INDEX = 1;
// var CANCEL_INDEX = 6;

export default class AddEditQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exam_id: this.props.navigation.getParam('exam_id'),
      modalVisable: true,
      changeButton: this.props.navigation.getParam('changeButton'),
      answer_text: '',
      answer_type: 0, //0 ==>add 1==>update
      edit_index: -1,
      disabled: false,
      add_answer: false,
      question_obj: this.props.navigation.getParam('question_obj'),
      // question_obj_copy: this.props.navigation.getParam('question_obj'),
      loading: false,
      filePath: {},
      change_photo: false,
      isChange: false,
    };
  }

  chooseFile = () => {
    var options = {
      title: 'Select Image',

      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        let source = response;
        let obj = this.state.question_obj;
        obj.question_image = source.uri;

        this.setState({
          filePath: source,
          question_obj: obj,
          change_photo: true,
        });
      }
    });
  };

  componentWillUnmount() {
    if (this.state.isChange) {
      let refrish = this.props.navigation.getParam('refrish');
      let question_index = parseInt(
        this.props.navigation.getParam('question_index'),
      );
      refrish(question_index);
      // let scroll_to_index = this.props.navigation.getParam("scroll_to_index")
      // scroll_to_index(question_index)
    }
  }

  componentDidMount() {
    let question_answers = this.props.navigation.getParam('question_obj')
        .question_answers,
      answers_copy = '';
    for (let i = 0; i < question_answers.length; i++) {
      if (i == 0) {
        answers_copy += question_answers[i].answer_text;
      } else {
        answers_copy += '//CAMP//' + question_answers[i].answer_text;
      }
    }
    this.setState({
      txt: this.props.navigation.getParam('question_obj').question_text,
      img: this.props.navigation.getParam('question_obj').question_image,
      valid: this.props.navigation.getParam('question_obj')
        .question_valid_answer,
      question_answers: answers_copy,
    });
  }

  async add_question() {
    let obj = this.state.question_obj;

    if (obj.question_text.trim() == '') {
      Alert.alert('أدمن', 'يجب إدخال نص للسؤال');
    } else if (obj.question_answers.length == 0) {
      Alert.alert('أدمن', 'يجب إدخال إجابات للسؤال ');
    } else if (obj.question_answers.length == 1) {
      Alert.alert('أدمن', 'يجب إدخال أكثر من إجابه ');
    } else {
      this.setState({loading: true});
      let answers = '';
      for (let i = 0; i < obj.question_answers.length; i++) {
        if (i == 0) {
          answers += obj.question_answers[i].answer_text;
        } else {
          answers += '//CAMP//' + obj.question_answers[i].answer_text;
        }
      }

      let domain = basic.url;

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
            data: this.state.filePath['data'],
          },
          {
            name: 'question_text',
            data: obj.question_text,
          },
          {
            name: 'question_image',
            data: obj.question_image == null ? null : '1',
          },
          {
            name: 'question_answers',
            data: answers,
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
          this.setState({loading: false});

          let data = resp.data.trim();
          if (data == '"success"') {
            this.setState({isChange: true});
            this.props.navigation.goBack();
            Alert.alert('أدمن', 'تمت إضافة السؤال بنجاح');
          } else {
            Alert.alert('أدمن', 'حدث خطأ ما من فضلك حاول مره اخرى');
          }
        })
        .catch((err) => {
          // ...
        });
      // }
    }
  }

  async edit_question() {
    let obj = this.state.question_obj;

    if (obj.question_text.trim() == '') {
      Alert.alert('أدمن', 'يجب إدخال نص للسؤال');
    } else if (obj.question_answers.length == 0) {
      Alert.alert('أدمن', 'يجب إدخال إجابات للسؤال ');
    } else if (obj.question_answers.length == 1) {
      Alert.alert('أدمن', 'يجب إدخال أكثر من إجابه ');
    } else {
      this.setState({loading: true});
      let answers = '';
      for (let i = 0; i < obj.question_answers.length; i++) {
        if (i == 0) {
          answers += obj.question_answers[i].answer_text;
        } else {
          answers += '//CAMP//' + obj.question_answers[i].answer_text;
        }
      }

      let answers_copy = this.state.question_answers,
        txt = this.state.txt,
        img = this.state.img,
        valid = this.state.valid;

      if (
        txt == obj.question_text &&
        img == obj.question_image &&
        valid == obj.question_valid_answer &&
        answers_copy == answers
      ) {
        Alert.alert('أدمن', 'يجب تغيير بيانات السؤال ');
        this.setState({loading: false});
        return;
      }

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
            data: this.state.filePath['data'],
          },
          {
            name: 'question_id',
            data: obj.question_id,
          },
          {
            name: 'question_text',
            data: obj.question_text,
          },
          {
            name: 'question_image',
            data: this.state.change_photo == false ? null : '1',
          },
          {
            name: 'question_answers',
            data: answers,
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
          this.setState({loading: false});

          let data = resp.data.trim();
          if (data == '"success"') {
            this.setState({isChange: true});
            this.props.navigation.goBack();
            Alert.alert('أدمن', 'تمت تعديل السؤال بنجاح');
          } else {
            Alert.alert('أدمن', 'حدث خطأ ما من فضلك حاول مره اخرى');
          }
        })
        .catch((err) => {
          // ...
        });
      // }
    }
  }

  choose_answer(index) {
    let obj = this.state.question_obj;
    let answers = obj.question_answers;
    for (let i = 0; i < answers.length; i++) {
      if (i == index) {
        answers[i].answer_check = true;
        obj.question_valid_answer = answers[i].answer_text;
      } else {
        answers[i].answer_check = false;
      }
    }

    this.setState({question_obj: obj});
  }

  add_answer() {
    let obj = this.state.question_obj;
    // alert(this.state.answer_text.trim)
    let answer_text = this.state.answer_text.trim();
    if (answer_text != '') {
      for (let index = 0; index < obj.question_answers.length; index++) {
        let element = obj.question_answers[index];
        if (answer_text == element.answer_text) {
          Alert.alert('أدمن', 'هذه الإجابه موجوده بالفعل');

          return;
        }
      }

      obj.question_answers.push({
        answer_text: answer_text,
        answer_check: obj.question_answers.length == 0 ? true : false,
      });
      if (obj.question_answers.length == 1) {
        obj.question_valid_answer = obj.question_answers[0].answer_text;
      }
      this.setState({
        question_obj: obj,
        add_answer: false,
        answer_text: '',
      });
    } else {
      Alert.alert('أدمن', 'يجب إدخال نص للاجابه');
    }
  }

  edit_answer() {
    let obj = this.state.question_obj,
      index = this.state.edit_index;
    if (this.state.answer_text.trim() != '') {
      obj.question_answers[index].answer_text = this.state.answer_text.trim();
      if (obj.question_answers[index].answer_check) {
        obj.question_valid_answer = this.state.answer_text.trim();
      }
      this.setState({
        question_obj: obj,
        add_answer: false,
        answer_text: '',
      });
    } else {
      Alert.alert('أدمن', 'يجب إدخال نص للاجابه');
    }
  }

  allert(index) {
    Alert.alert(
      'ادمن',

      ' هل انت متاكد من حذف الأجابة ',
      [
        {
          text: 'الغاء',
          onPress: () => console.log('cansel Pressed'),
        },
        {
          text: 'تأكيد',
          onPress: () => this.delete_answer(index),
        },
      ],
      {cancelable: false},
    );
  }
  delete_answer(index) {
    let obj = this.state.question_obj;
    let answers = obj.question_answers;
    if (answers[index].answer_check && answers.length > 1) {
      answers.splice(index, 1);
      answers[0].answer_check = true;
      obj.question_valid_answer = answers[0].answer_text;
    } else {
      answers.splice(index, 1);
    }

    if (answers.length == 0) {
      obj.question_valid_answer = '';
    }

    this.setState({question_obj: obj});
  }

  render_add_answer() {
    return (
      <View
        style={{
          width: width,
          height: height,
          backgroundColor: '#00000044',
          // backgroundColor:"transparent",
          // justifyContent: "center",
          // paddingTop: height / 4,
          paddingTop: 40,
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '90%',

            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 10,
          }}>
          <ScrollView>
            <View style={{}}>
              <Text
                style={{
                  margin: 24,
                  marginBottom: 10,
                  marginTop: 10,
                  fontSize: 17,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {this.state.answer_type == 0 ? 'إضافة إجابه' : 'تعديل إجابه'}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignSelf: 'center',
                borderColor: '#ddd',
                borderWidth: 1,
                width: '90%',
              }}>
              <TextInput
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  // height: 50,
                  width: '90%',
                  // paddingLeft: 5,
                  color: '#000',
                }}
                multiline={true}
                placeholder="نص الإجابه"
                placeholderTextColor="#000"
                onChangeText={(answer_text) =>
                  this.setState({answer_text: answer_text})
                }
                value={this.state.answer_text}
              />
            </View>

            <Button
              onPress={() => {
                if (this.state.answer_type == 0) {
                  this.add_answer();
                } else {
                  this.edit_answer();
                }
              }}
              style={{
                width: '90%',
                backgroundColor: color,
                justifyContent: 'center',
                marginTop: 60,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: '#FFF',
                }}>
                {this.state.answer_type == 0 ? 'إضافة' : 'تعديل'}
              </Text>
            </Button>

            <TouchableOpacity
              style={{
                width: '90%',
                backgroundColor: '#ddd',
                justifyContent: 'center',
                marginTop: 20,
                alignSelf: 'center',
                height: 45,
              }}
              onPress={() => {
                this.setState({add_answer: false});
              }}>
              <Text
                style={{
                  //   color: 'white',
                  marginTop: 5,
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                الغاء
              </Text>
            </TouchableOpacity>
          </ScrollView>
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
          {/* <Left style={{flex: 1}}>
              <TouchableOpacity onPress={this.openMenu}>
                <Icon
                  name="md-menu"
                  size={22}
                  style={{
                    paddingRight: 10,
                    paddingLeft: 10,
                    marginTop: 10,
                    color: '#FFF',
                  }}
                />
              </TouchableOpacity>
            </Left> */}
          <Body style={{flex: 3, alignItems: 'center'}}>
            <Title>
              {this.state.changeButton == false ? 'تعديل سؤال' : 'اضافة سؤال'}
            </Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>
        <Container>
          <ScrollView>
            <View style={{paddingVertical: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderColor: '#ddd',
                  borderWidth: 1,
                  width: '90%',
                }}>
                <TextInput
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    padding: 10,
                    width: '90%',
                    color: '#000',

                    // paddingLeft: 5,
                  }}
                  multiline={true}
                  placeholder="نص السؤال"
                  placeholderTextColor="#000"
                  onChangeText={(ques_text) => {
                    let obj = this.state.question_obj;
                    obj.question_text = ques_text;
                    this.setState({question_obj: obj});
                  }}
                  value={this.state.question_obj.question_text}
                />
              </View>

              {this.state.question_obj.question_image != null ? (
                <>
                  <Image
                    source={{uri: this.state.question_obj.question_image}} //this.state.question_obj.question_image }}
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

                  <TouchableOpacity
                    // disabled={this.state.disabled}
                    onPress={() => {
                      let Photo = this.state.question_obj;

                      Photo.question_image = null;
                      this.setState({question_obj: Photo});
                    }}
                    style={{
                      width: '50%',
                      backgroundColor: color,
                      justifyContent: 'center',
                      // marginTop: 5,
                      alignSelf: 'center',
                      flexDirection: 'row',
                      borderRadius: 3,
                      opacity: 0.9,
                      marginVertical: 5,
                    }}>
                    <Text
                      style={{
                        fontSize: 23,
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        color: '#fff',
                      }}>
                      مسح الصورة
                    </Text>
                  </TouchableOpacity>
                </>
              ) : null}

              <Button
                disabled={this.state.disabled}
                onPress={() => {
                  this.chooseFile();
                }}
                style={{
                  width: '90%',
                  backgroundColor: color,
                  justifyContent: 'center',
                  marginTop: 5,
                  marginBottom: 10,
                  alignSelf: 'center',
                }}>
                {this.state.question_obj.question_image != null ? (
                  <Text
                    style={{
                      fontSize: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: '#FFF',
                    }}>
                    تغيير صورة
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: '#FFF',
                    }}>
                    اختيار الصورة
                  </Text>
                )}
              </Button>
              {this.state.question_obj.question_answers.length != 0 ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  {this.state.question_obj.question_answers.map(
                    (answer_obj, answer_index) => (
                      <View
                        style={{
                          width: '90%',
                          borderWidth: 1,
                          borderColor: answer_obj.answer_check
                            ? '#72ef72'
                            : '#ddd',
                          padding: 5,
                          marginBottom: 5,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '80%',
                            justifyContent: 'space-between',
                          }}>
                          <RadioButton
                            status={
                              answer_obj.answer_check ? 'checked' : 'unchecked'
                            }
                            onPress={() => {
                              this.choose_answer(answer_index);
                            }}
                            style={{justifyContent: 'flex-end'}}
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              textAlign: 'left',
                              width: '80%',
                            }}>
                            {answer_obj.answer_text}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '20%',
                            justifyContent: 'space-between',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                add_answer: true,
                                answer_type: 1,
                                answer_text: answer_obj.answer_text,
                                edit_index: answer_index,
                              });
                            }}>
                            <Icon
                              name="edit"
                              size={20}
                              style={{
                                paddingRight: 2,
                                paddingLeft: 2,
                                color: '#0f0',
                              }}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => this.allert(answer_index)}>
                            <Icon
                              name="trash"
                              size={20}
                              style={{
                                paddingRight: 2,
                                paddingLeft: 2,
                                color: '#F00',
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ),
                  )}
                </View>
              ) : null}
              <Button
                disabled={this.state.disabled}
                onPress={() => {
                  this.setState({add_answer: true, answer_type: 0});
                  // alert("here")
                }}
                style={{
                  width: '90%',
                  backgroundColor: color,
                  justifyContent: 'center',
                  // marginTop: 5,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: '#FFF',
                  }}>
                  إضافة إجابة
                </Text>
              </Button>

              <Button
                disabled={this.state.disabled}
                onPress={() => {
                  if (this.state.changeButton == false) {
                    this.edit_question();
                  } else {
                    this.add_question();
                  }
                }}
                style={{
                  width: '90%',
                  backgroundColor: color,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 60,
                  alignSelf: 'center',
                }}>
                {this.state.disabled == true ? (
                  <Spinner color="white" size={25} style={{marginTop: 5}} />
                ) : this.state.loading == false ? (
                  <Text
                    style={{
                      fontSize: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: '#FFF',
                    }}>
                    {this.state.changeButton == false ? 'تعديل' : 'اضافة'}
                  </Text>
                ) : (
                  <Spinner
                    color="#fff"
                    size={26}
                    style={{
                      alignSelf: 'center',
                      padding: 0,
                      //   marginTop: -20,
                    }}
                  />
                )}
              </Button>

              <TouchableOpacity
                style={{
                  width: '90%',
                  backgroundColor: '#ddd',
                  justifyContent: 'center',
                  marginTop: 20,
                  alignSelf: 'center',
                  height: 45,
                }}
                disabled={this.state.disabled}
                onPress={() => {
                  // this.setState({ modalVisable: false });
                  this.props.navigation.goBack();
                }}>
                <Text
                  style={{
                    //   color: 'white',
                    marginTop: 5,
                    fontSize: 20,
                    textAlign: 'center',
                  }}>
                  الغاء
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {this.state.add_answer ? this.render_add_answer() : null}
        </Container>
      </>
    );
  }
}
const styles = StyleSheet.create({});
