import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  FlatList,
  // scrollToEnd,
  // ScrollView,
  AsyncStorage,
  ToastAndroid,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  // Header,
  // Left,
  // Body,
  // Right,
  // Title,
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
import {StatusBar} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const {width, height} = Dimensions.get('window');
var BUTTONS = [
  {icon: 'ios-document', text: 'تعديل الامتحان', iconColor: '#080'},
  // {icon: 'ios-document-text-sharp', text: 'رفع الامتحان', iconColor: '#080'},
  {icon: 'ios-document', text: 'تقرير الطلاب', iconColor: '#2c8ef4'},
  {text: 'نتائج الطلاب', icon: 'md-document', iconColor: '#ea943b'},
  {text: 'من لم يحل', icon: 'md-document', iconColor: '#00f'},
  {text: 'عرض الأسئلة', icon: 'md-document', iconColor: '#888'},
  {text: 'مسح الامتحان', icon: 'trash', iconColor: '#fa213b'},
  {text: 'الغاء', icon: 'close', iconColor: '#fa213b'},
];
var DESTRUCTIVE_INDEX = 6;
var CANCEL_INDEX = 6;
export default class ListOfExams extends React.Component {
  //constructor

  constructor(props) {
    super(props);

    this.state = {
      generation_id: 1,
      student_id: 1,
      exams: [],
      loading: false,
      loading_public: [false],
      loading_answer: [false],
      excel_name: '',
      path: '',
      file: '',
      loading: false,
    };

    this.flatListRef = null;
    this.scroll_to_index = this.scroll_to_index.bind(this);
  }

  async componentDidMount() {
    this.get_exams();
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

  async delete_Exam(index) {
    let data_to_send = {
      exam_id: this.state.exams[index].exam_id,
    };
    let domain = basic.url;

    axios.post(domain + `admin/delete_exam.php`, data_to_send).then((res) => {
      this.setState({loading: true});
      if (res.status == 200) {
        if (res.data == 'success') {
          this.get_exams();

          ToastAndroid.showWithGravity(
            'تم حذف الامتحان بنجاح',
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
  alert_delete(index, name) {
    Alert.alert(
      'ادمن',

      ' هل انت متاكد من مسح امتحان ( ' + name + ' ) ',
      [
        {
          text: 'الغاء',
          onPress: () => console.log('cansel Pressed'),
        },
        {
          text: 'مسح',
          onPress: () => this.delete_Exam(index),
        },
      ],
      {cancelable: false},
    );
  }

  async confirmUploadFile(item, res) {
    this.setState({loading: true});
    let singleFile = res;
    if (singleFile != null) {
      //If file selected then create FormData
      const fileToUpload = singleFile;
      const data = new FormData();
      data.append('name', 'Image Upload');
      data.append('file_attachment', fileToUpload);
      data.append('exam_name', item.exam_name);
      data.append('exam_id', 'Exam_' + item.exam_id);
      //Please change file upload URL
      let domain = basic.url;

      let res = await fetch(domain + 'admin/upload_excel_file.php', {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data; ',
        },
      });
      let responseJson = await res.json();
      if (responseJson == 'success') {
        Alert.alert('أدمن', 'تم رفع الامتحان بنجاح');
        // this.props.navigation.goBack()
      } else if (responseJson == 'Sorry, your file is too large.') {
        Alert.alert('أدمن', 'حجم هذا الملخص كبير لرفعه');
      } else if (responseJson == 'Sorry, file already exists.') {
        Alert.alert('أدمن', 'هذا الملخص موجود بالفعل');
      } else {
        Alert.alert('أدمن', 'عفوا حدث خطأ أثناء رفع الملخص');
      }
    } else {
      //if no file selected the show alert
      Alert.alert('أدمن', 'عفوا يجب اختيار ملخص اولا');
    }
    this.setState({loading: false});
  }
  async uploadExcelFile(item) {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      Alert.alert(
        'أدمن',
        'هل انت متأكد من رفع ملف' + res.name + 'لأسئلة هذا الامتحان ؟',
        [
          {
            text: 'إلغاء',
            onPress: () => {},
          },
          {
            text: 'رفع',
            onPress: () => {
              this.confirmUploadFile(item, res);
            },
          },
        ],
        {
          cancelable: true,
        },
      );
      this.setState({
        summery_name: res.name,
        path: res.uri,
        file: res,
      });
    } catch (err) {}
  }
  get_exams = async (exam_quiz_index) => {
    this.setState({loading: true});
    let generation_id = this.props.navigation.getParam('generation_id');

    let collection_id = this.props.navigation.getParam('collection_id');
    this.setState({generation_id: generation_id, collection_id: collection_id});
    let data_to_send = {
      generation_id: generation_id,
      collection_id: collection_id,
    };
    let domain = basic.url;

    axios
      .post(domain + `admin/select_total_exams.php`, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data != 'error') {
            if (res.data.exams.length > 0) {
              this.setState({
                exams: res.data.exams,
              });
              if (exam_quiz_index * 0 == 0) {
                this.scroll_to_index(exam_quiz_index);
              }

              // console.log(this.state.exams)
            } else {
              // Alert.alert('أدمن', 'لا يوجد إمتحانات');
              this.setState({
                exams: [],
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
    let list = this.state.exams;
    let data_to_send = {
      exam_id: list[pu_exam_id].exam_id,
      value: list[pu_exam_id].exam_show_to_public == 0 ? 1 : 0,
    };
    let domain = basic.url;

    axios
      .post(domain + `admin/update_exam_show_to_public.php`, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // console.log(res.data)
          if (res.data == 'success') {
            list[pu_exam_id].exam_show_to_public =
              list[pu_exam_id].exam_show_to_public == 0 ? 1 : 0;
            this.setState({exams: list});
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
    let generation_id = this.props.navigation.getParam('generation_id');

    let collection_id = this.props.navigation.getParam('collection_id');
    // this.setState({disabled: true});
    let load = this.state.loading_answer;
    load[pu_exam_id] = true;
    this.setState({loading_answer: load});
    let list = this.state.exams;
    let data_to_send = {
      exam_id: 'Exam_' + list[pu_exam_id].exam_id,
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
            this.setState({exams: list});
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
          <StatusBar backgroundColor={color} />
          <View
            style={{
              width: '100%',
              height: 60,
              flexDirection: 'row',
              backgroundColor: color,
              elevation: 22,
            }}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <Icon
                  name="angle-right"
                  style={{fontSize: 35, color: '#fff', marginRight: 20}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
              <Text
                style={{color: '#F5FCFF', fontSize: 20, fontWeight: 'bold'}}>
                قائمة الامتحانات
              </Text>
            </View>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity>
                {/* <Text style={{fontWeight:'bold',textDecorationLine:'underline',color:'#fff'}} >أخر أمتحان</Text> */}
              </TouchableOpacity>
            </View>
          </View>
          {
            // <Text>{item.exam_name}</Text>
          }
          {this.state.loading == true ? (
            <Spinner color={color} size={40} style={{marginTop: 200}} />
          ) : (
            <View>
              {this.state.exams.length == 0 ? (
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
                    لا يوجد امتحانات متاحه الان
                  </Text>
                </View>
              ) : (
                <View style={{marginVertical: 15, marginBottom: 100}}>
                  <FlatList
                    ref={(ref) => {
                      this.flatListRef = ref;
                    }}
                    data={this.state.exams}
                    removeClippedSubviews={false}
                    enableEmptySections={false}
                    keyExtractor={(item) => item.exam_id}
                    initialNumToRender={2}
                    contentContainerStyle={{
                      marginBottom: 100,
                    }}
                    onScrollToIndexFailed={this.scrollToIndexFailed.bind(this)}
                    renderItem={({item, index}) => (
                      <View
                        style={{
                          width: '90%',
                          alignSelf: 'center',
                          paddingHorizontal: 12,
                          paddingVertical: 10,
                          borderRadius: 7,
                          backgroundColor: '#fff',
                          marginBottom: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
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
                                    exam_id: item.exam_id,
                                    exam_name: item.exam_name,
                                    page_type: item.exam_page_type,
                                    time_type: item.exam_time_type,
                                    solution_type: item.exam_solution_type,
                                    exam_duration: item.exam_time / 60 + '',
                                    date: item.exam_date,
                                    time: item.exam_start_time,
                                    time2: item.exam_end_time,
                                    add_or_edit: 2,
                                    add_type: 0,
                                    generation_id: this.state.generation_id,
                                    exam_quiz_index: index,
                                    refrish: this.get_exams,
                                    exam_type: item.exam_type,
                                    // scroll_to_index: this.scroll_to_index,
                                  });
                                }
                                //  else if (buttonIndex == 1) {
                                //   this.uploadExcelFile(item);
                                // }
                                else if (buttonIndex == 1) {
                                  this.props.navigation.navigate('ExamReport', {
                                    exam_id: item.exam_id,
                                    generation_id: this.state.generation_id,
                                    exam_name: item.exam_name,
                                    test_id: 1,
                                    collection_id: this.props.navigation.getParam(
                                      'collection_id',
                                    ),
                                  });
                                } else if (buttonIndex == 2) {
                                  this.props.navigation.navigate(
                                    'SolvedStudents',
                                    {
                                      exam_id: item.exam_id,
                                      exam_name: item.exam_name,

                                      test_id: 1,
                                      collection_id: this.props.navigation.getParam(
                                        'collection_id',
                                      ),
                                    },
                                  );
                                } else if (buttonIndex == 3) {
                                  this.props.navigation.navigate(
                                    'NotSolvedStudents',
                                    {
                                      exam_id: item.exam_id,
                                      exam_name: item.exam_name,

                                      generation_id: this.state.generation_id,
                                      test_id: 1,
                                      collection_id: this.props.navigation.getParam(
                                        'collection_id',
                                      ),
                                    },
                                  );
                                } else if (buttonIndex == 4) {
                                  if (item.exam_type == '1B') {
                                    console.log(item);
                                    this.props.navigation.navigate(
                                      'BubbleExamQuestions',
                                      {
                                        exam_id: 'Exam_' + item.exam_id,
                                        papel_link: item.papel_link,
                                        exam_name: item.exam_name,
                                      },
                                    );
                                  } else {
                                    this.props.navigation.navigate(
                                      'ExamQuestions',
                                      {
                                        exam_id: 'Exam_' + item.exam_id,
                                        generation_id: this.props.navigation.getParam(
                                          'generation_id',
                                        ),
                                      },
                                    );
                                  }
                                } else if (buttonIndex == 5) {
                                  this.alert_delete(index, item.exam_name);
                                }
                              },
                            )
                          }>
                          <Text style={{fontSize: 22, color: '#444'}}>
                            {item.exam_name}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            width: 40,
                            height: 40,
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
                                item.exam_show_to_public == 0
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
          <Modal visible={this.state.loading} transparent={true}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: 250,
                  height: 250,
                  borderRadius: 10,
                  backgroundColor: '#fff',
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}>
                <ActivityIndicator size={30} color="#000" />
              </View>
            </View>
          </Modal>
          <Fab
            direction="up"
            // containerStyle={{}}
            style={{backgroundColor: color, marginRight: 10}}
            position="bottomRight"
            onPress={() =>
              this.props.navigation.navigate('AddExam', {
                exam_quiz_index: this.state.exams.length,
                exam_name: '',
                exam_duration: '',
                page_type: '0',
                time_type: '0',
                solution_type: '0',
                date: 'إختيار تاريخ',
                time: 'إختيار وقت',
                time2: 'إختيار وقت',
                add_or_edit: 1,
                add_type: 0,
                generation_id: this.state.generation_id,
                refrish: this.get_exams,
                // scroll_to_index: this.scroll_to_index,
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
