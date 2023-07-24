import React, {Component} from 'react';

import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
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
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ModalHome from 'react-native-modalbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import basic from './BasicURL';
import {color} from '../color';

const {width, height} = Dimensions.get('window');

export default class AddExam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exam_id: this.props.navigation.getParam('exam_id'),
      exam_name: this.props.navigation.getParam('exam_name'),
      page_type: this.props.navigation.getParam('page_type'),
      time_type: this.props.navigation.getParam('time_type'),
      solution_type: this.props.navigation.getParam('solution_type'),
      exam_duration: this.props.navigation.getParam('exam_duration'),
      exam_index: this.props.navigation.getParam('exam_index'),
      data: [],
      // generation_selected_value: '',
      generation_selected_index: this.props.navigation.getParam(
        'generation_id',
      ),
      date: this.props.navigation.getParam('date'), //'إختيار تاريخ',
      time: this.props.navigation.getParam('time'), //'إختيار وقت',
      time2: this.props.navigation.getParam('time2'), //'إختيار وقت',
      loading: false,
      add_type: this.props.navigation.getParam('add_type'),
      add_or_edit: this.props.navigation.getParam('add_or_edit'),
      isChange: false,
      exam_type: this.props.navigation.getParam('exam_type'),
      isBubble: this.props.navigation.getParam('exam_type') != '1B' ? '0' : '1',
    };
  }

  async componentWillUnmount() {
    if (this.state.isChange) {
      let refrish = this.props.navigation.getParam('refrish');
      let exam_quiz_index = parseInt(
        this.props.navigation.getParam('exam_quiz_index'),
      );
      // scroll_to_index(exam_quiz_index)
      refrish(exam_quiz_index);
    }
  }

  componentDidMount() {
    // alert(this.state.exam_duration)
    // this.getgenedata()
    //    alert(this.props.navigation.getParam('generation_id'))
  }

  // getgenedata() {
  //     axios
  //         .get(basic.url+'select_generations.php')
  //         .then(res => {

  //             if (res.data.gens.length > 0) {
  //                 this.setState({
  //                     data: res.data.gens,
  //                     generation_selected_value: res.data.gens[0].generation_name,
  //                     generation_selected_index: res.data.gens[0].generation_id,
  //                 })
  //             }

  //         });
  // }

  onValueChange(value, index) {
    this.setState({
      generation_selected_value: value,
      generation_selected_value: this.state.data[index].generation_id,
    });
  }

  async add_exam() {
    let exam_name = this.state.exam_name.trim(),
      page_type = this.state.page_type,
      time_type = this.state.time_type,
      solution_type = this.state.solution_type,
      exam_duration = this.state.exam_duration.trim(),
      exam_date = this.state.date.trim(),
      exam_time = this.state.time.trim(),
      exam_end_time = this.state.time2.trim();

    if (exam_name == '') {
      Alert.alert('أدمن', 'يجب إدخال إسم الإمتحان');
      return;
    } else if (exam_duration == '' && time_type == '1') {
      Alert.alert('أدمن', 'يجب إدخال وقت الإمتحان');
      return;
    } else if (parseFloat(exam_duration) * 0 != 0 && time_type == '1') {
      Alert.alert('أدمن', 'يجب إدخال وقت صحيح');
      return;
    } else if (exam_date == 'إختيار تاريخ') {
      Alert.alert('أدمن', 'يجب إدخال تاريخ الإمتحان');
      return;
    } else if (exam_time == 'إختيار وقت') {
      Alert.alert('أدمن', 'يجب إدخال وقت بداية الإمتحان');
      return;
    } else if (exam_end_time == 'إختيار وقت') {
      Alert.alert('أدمن', 'يجب إدخال وقت نهاية الإمتحان');
      return;
    } else {
      if (parseFloat(exam_duration) <= 0) {
        Alert.alert('أدمن', 'يجب إدخال وقت صحيح');
        return;
      }
      this.setState({loading: true});
      let data_to_send = {
        exam_name: exam_name,
        page_type: page_type,
        time_type: time_type,
        solution_type: solution_type,
        all_type:
          this.state.isBubble == '1'
            ? '1B'
            : page_type + time_type + solution_type,
        exam_time: exam_duration == '' ? 0 : parseFloat(exam_duration) * 60,
        exam_date: exam_date,
        exam_start: exam_time,
        exam_end: exam_end_time,
        exam_generation_id: this.state.generation_selected_index,
      };
      let domain = basic.url;

      axios.post(domain + `admin/add_exam.php`, data_to_send).then((res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            this.setState({isChange: true});
            this.props.navigation.goBack();
            Alert.alert('أدمن', 'تمت إضافة الإمتحان بنجاح');
          } else {
            Alert.alert('أدمن', 'خطأ');
          }
        } else {
          Alert.alert('أدمن', 'خطأ');
        }
        this.setState({loading: false});
      });
    }
  }

  async edit_exam() {
    let exam_name = this.state.exam_name.trim(),
      page_type = this.state.page_type,
      time_type = this.state.time_type,
      solution_type = this.state.solution_type,
      exam_duration = this.state.exam_duration.trim(),
      exam_date = this.state.date.trim(),
      exam_time = this.state.time.trim(),
      exam_end_time = this.state.time2.trim();

    if (exam_name == '') {
      Alert.alert('أدمن', 'يجب إدخال إسم الإمتحان');
      return;
    } else if (exam_duration == '' && time_type == '1') {
      Alert.alert('أدمن', 'يجب إدخال وقت الإمتحان');
      return;
    } else if (parseFloat(exam_duration) * 0 != 0 && time_type == '1') {
      Alert.alert('أدمن', 'يجب إدخال وقت صحيح');
      return;
    } else if (exam_date == 'إختيار تاريخ') {
      Alert.alert('أدمن', 'يجب إدخال تاريخ الإمتحان');
      return;
    } else if (exam_time == 'إختيار وقت') {
      Alert.alert('أدمن', 'يجب إدخال وقت بداية الإمتحان');
      return;
    } else if (exam_end_time == 'إختيار وقت') {
      Alert.alert('أدمن', 'يجب إدخال وقت نهاية الإمتحان');
      return;
    } else {
      if (parseFloat(exam_duration) <= 0 && time_type == '1') {
        Alert.alert('أدمن', 'يجب إدخال وقت صحيح');
        return;
      }
      this.setState({loading: true});
      let data_to_send = {
        exam_id: this.state.exam_id,
        exam_name: exam_name,
        page_type: page_type,
        time_type: time_type,
        solution_type: solution_type,
        all_type:
          this.state.isBubble == '1'
            ? '1B'
            : page_type + time_type + solution_type,
        exam_time: exam_duration == '' ? 0 : parseFloat(exam_duration) * 60,
        exam_date: exam_date,
        exam_start: exam_time,
        exam_end: exam_end_time,
      };
      let domain = basic.url;

      axios.post(domain + `admin/edit_exam.php`, data_to_send).then((res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            this.setState({isChange: true});
            this.props.navigation.goBack();
            Alert.alert('أدمن', 'تم تعديل الإمتحان بنجاح');
          } else {
            Alert.alert('أدمن', 'لقد ادخلت نفس القيم دون تغيير');
          }
        } else {
          Alert.alert('أدمن', 'خطأ');
        }
        this.setState({loading: false});
      });
    }
  }

  async add_quiz() {
    let exam_name = this.state.exam_name.trim(),
      page_type = this.state.page_type,
      time_type = this.state.time_type,
      solution_type = this.state.solution_type,
      exam_duration = this.state.exam_duration.trim(),
      exam_date = this.state.date.trim();

    if (exam_name == '') {
      Alert.alert('أدمن', 'يجب إدخال إسم الواجب');
      return;
    } else if (exam_duration == '' && time_type == '1') {
      Alert.alert('أدمن', 'يجب إدخال وقت الواجب');
      return;
    } else if (parseFloat(exam_duration) * 0 != 0 && time_type == '1') {
      Alert.alert('أدمن', 'يجب إدخال وقت صحيح');
      return;
    } else if (exam_date == 'إختيار تاريخ') {
      Alert.alert('أدمن', 'يجب إدخال تاريخ الواجب');
      return;
    } else {
      if (parseFloat(exam_duration) <= 0) {
        Alert.alert('أدمن', 'يجب إدخال وقت صحيح');
        return;
      }
      this.setState({loading: true});
      let data_to_send = {
        quiz_name: exam_name,
        page_type: page_type,
        time_type: time_type,
        solution_type: solution_type,
        all_type: page_type + time_type + solution_type,
        quiz_time: exam_duration == '' ? 0 : parseFloat(exam_duration) * 60,
        quiz_date: exam_date,
        quiz_generation_id: this.state.generation_selected_index,
      };
      let domain = basic.url;

      axios.post(domain + `admin/add_quiz.php`, data_to_send).then((res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            this.setState({isChange: true});
            this.props.navigation.goBack();
            Alert.alert('أدمن', 'تمت إضافة الإمتحان بنجاح');
          } else {
            Alert.alert('أدمن', 'خطأ');
          }
        } else {
          Alert.alert('أدمن', 'خطأ');
        }
        this.setState({loading: false});
      });
    }
  }

  async edit_quiz() {
    let exam_name = this.state.exam_name.trim(),
      page_type = this.state.page_type,
      time_type = this.state.time_type,
      solution_type = this.state.solution_type,
      exam_duration = this.state.exam_duration.trim(),
      exam_date = this.state.date.trim();

    if (exam_name == '') {
      Alert.alert('أدمن', 'يجب إدخال إسم الواجب');
      return;
    } else if (exam_duration == '' && time_type == '1') {
      Alert.alert('أدمن', 'يجب إدخال وقت الواجب');
      return;
    } else if (parseFloat(exam_duration) * 0 != 0 && time_type == '1') {
      Alert.alert('أدمن', 'يجب إدخال وقت صحيح');
      return;
    } else if (exam_date == 'إختيار تاريخ') {
      Alert.alert('أدمن', 'يجب إدخال تاريخ الواجب');
      return;
    } else {
      if (parseFloat(exam_duration) <= 0 && time_type == '1') {
        Alert.alert('أدمن', 'يجب إدخال وقت صحيح');
        return;
      }
      this.setState({loading: true});
      let data_to_send = {
        quiz_id: this.state.exam_id,
        quiz_name: exam_name,
        page_type: page_type,
        time_type: time_type,
        solution_type: solution_type,
        all_type: page_type + time_type + solution_type,
        quiz_time: exam_duration == '' ? 0 : parseFloat(exam_duration) * 60,
        quiz_date: exam_date,
      };
      let domain = basic.url;

      axios.post(domain + `admin/edit_quiz.php`, data_to_send).then((res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            this.setState({isChange: true});
            this.props.navigation.goBack();
            Alert.alert('أدمن', 'تم تعديل الإمتحان بنجاح');
          } else {
            Alert.alert('أدمن', 'لقد ادخلت نفس القيم دون تغيير');
          }
        } else {
          Alert.alert('أدمن', 'خطأ');
        }
        this.setState({loading: false});
      });
    }
  }

  render_add_exam_form() {
    return (
      <ScrollView style={{paddingTop: 20}}>
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
              // flexDirection: 'row',
              // justifyContent: 'flex-end',
              alignItems: 'center',
              height: 50,
              width: '96%',
              // paddingLeft: 5,
              color: '#000',
            }}
            multiline={true}
            placeholder={
              this.state.add_type == 0 ? 'إسم الإمتحان' : 'إسم الواجب'
            }
            placeholderTextColor="#000"
            onChangeText={(exam_name) => this.setState({exam_name: exam_name})}
            value={this.state.exam_name}
          />
        </View>
        <Text
          style={{
            fontSize: 18,
            color: '#555',
            width: '90%',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          نوع الامتحان
        </Text>

        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'center',
            alignSelf: 'center',
            // borderColor: '#ddd',
            // borderWidth: 1,
            width: '90%',
            marginTop: 15,
          }}>
          <RadioButton.Group
            onValueChange={(value) => {
              this.setState({isBubble: value});
            }}
            value={this.state.isBubble}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                // backgroundColor:"#f00",
                width: width * 0.88,
                alignSelf: 'center',
                // marginLeft: 10
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <RadioButton value="1" />
                <Text>بابل</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <RadioButton value="0" />
                <Text>نظام قديم</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>

        {this.state.isBubble == '0' && (
          <>
            <Text
              style={{
                fontSize: 18,
                color: '#555',
                width: '90%',
                alignSelf: 'center',
                marginTop: 15,
              }}>
              عرض الأسئله
            </Text>

            <View
              style={{
                flexDirection: 'row',
                // justifyContent: 'center',
                alignSelf: 'center',
                // borderColor: '#ddd',
                // borderWidth: 1,
                width: '90%',
                marginTop: 15,
              }}>
              <RadioButton.Group
                onValueChange={(value) => {
                  this.setState({page_type: value});
                }}
                value={this.state.page_type}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // backgroundColor:"#f00",
                    width: width * 0.88,
                    alignSelf: 'center',
                    // marginLeft: 10
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <RadioButton value="0" />
                    <Text>صفحه واحده</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <RadioButton value="1" />
                    <Text>صفحه لكل سؤال</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          </>
        )}

        <Text
          style={{
            fontSize: 18,
            color: '#555',
            width: '90%',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          الوقت
        </Text>
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'center',
            alignSelf: 'center',
            // borderColor: '#ddd',
            // borderWidth: 1,
            width: '90%',
            marginTop: 15,
          }}>
          <RadioButton.Group
            onValueChange={(value) => {
              this.setState({time_type: value});
            }}
            value={this.state.time_type}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                // backgroundColor:"#f00",
                width: width * 0.7,
                alignSelf: 'center',
                // marginLeft: 10
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <RadioButton value="0" />
                <Text>لا يوجد</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <RadioButton value="1" />
                <Text>يوجد</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>

        {this.state.time_type == '1' ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
              borderColor: '#ddd',
              borderWidth: 1,
              width: '75%',
              marginTop: 10,
            }}>
            <TextInput
              style={{
                // flexDirection: 'row',
                // justifyContent: 'flex-end',
                alignItems: 'center',
                height: 50,
                width: '96%',
                // paddingLeft: 5,
                color: '#000',
              }}
              placeholder={
                this.state.page_type == '1'
                  ? 'مدة كل سؤال بالدقيقه'
                  : 'مدة الإمتحان بالدقيقه'
              }
              placeholderTextColor="#000"
              onChangeText={(exam_duration) =>
                this.setState({exam_duration: exam_duration})
              }
              value={this.state.exam_duration}
              keyboardType="number-pad"
            />
          </View>
        ) : null}

        {this.state.isBubble == '0' && (
          <>
            <Text
              style={{
                fontSize: 18,
                color: '#555',
                width: '90%',
                alignSelf: 'center',
                marginTop: 15,
              }}>
              الإجابات
            </Text>
            <View
              style={{
                flexDirection: 'row',
                // justifyContent: 'center',
                alignSelf: 'center',
                // borderColor: '#ddd',
                // borderWidth: 1,
                width: '90%',
                marginTop: 15,
              }}>
              <RadioButton.Group
                onValueChange={(value) => {
                  this.setState({solution_type: value});
                }}
                value={this.state.solution_type}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // backgroundColor:"#f00",
                    width: width * 0.72,
                    alignSelf: 'center',
                    // marginLeft: 10
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <RadioButton value="0" />
                    <Text> لا تعرض</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <RadioButton value="1" />
                    <Text>تعرض</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          </>
        )}

        {/* 
                <Text
                    style={{
                        fontSize: 18,
                        color: "#555",
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: 15,
                    }}>الدفعه</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        // justifyContent: 'center',
                        alignSelf: 'center',
                        // borderColor: '#ddd',
                        // borderWidth: 1,
                        width: '90%',
                        marginTop: 15,
                    }}>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        placeholder="Gender"
                        placeholderStyle={{ color: 'black' }}
                        placeholderIconColor="#9B9B9B"
                        style={{
                            width: '100%',
                            fontWeight: '500',
                            fontSize: 14,
                            color: '#333',
                            // marginLeft: 5,
                            alignSelf: 'center',
                        }}
                        selectedValue={this.state.generation_selected_value}
                        onValueChange={this.onValueChange.bind(this)}
                    >
                        {/* <Picker.Item label="اختر اسم الدفعه" value="" /> *}
                        {this.state.data.map(res => (
                            <Picker.Item
                                label={res.generation_name}
                                value={res.generation_name}
                                id={res.generation_id}
                            />
                        ))}
                    </Picker>
                </View> */}

        <Text
          style={{
            fontSize: 18,
            color: '#555',
            width: '90%',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          التاريخ
        </Text>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignSelf: 'center',
            backgroundColor: '#ddd',
            // borderWidth: 1,
            width: '70%',
            marginTop: 15,
            padding: 5,
            alignItems: 'center',
          }}
          onPress={() => {
            this.setState({show_picker: true});
          }}>
          <Text>{this.state.date}</Text>
        </TouchableOpacity>

        {this.state.show_picker ? (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={(value) => {
              let d = new Date(value.nativeEvent.timestamp);
              if (d.toString() != 'Invalid Date') {
                this.setState({
                  date:
                    d.getFullYear() +
                    '-' +
                    (d.getMonth() + 1) +
                    '-' +
                    d.getDate(),
                  show_picker: false,
                });
              } else {
                this.setState({show_picker: false});
              }
            }}
          />
        ) : null}

        {this.state.add_type == 0 ? (
          <View>
            <Text
              style={{
                fontSize: 18,
                color: '#555',
                width: '90%',
                alignSelf: 'center',
                marginTop: 15,
              }}>
              وقت البدايه
            </Text>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: '#ddd',
                // borderWidth: 1,
                width: '70%',
                marginTop: 15,
                padding: 5,
                alignItems: 'center',
              }}
              onPress={() => {
                this.setState({show_picker2: true});
              }}>
              <Text>{this.state.time}</Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 18,
                color: '#555',
                width: '90%',
                alignSelf: 'center',
                marginTop: 15,
              }}>
              وقت النهاية
            </Text>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: '#ddd',
                // borderWidth: 1,
                width: '70%',
                marginTop: 15,
                padding: 5,
                alignItems: 'center',
              }}
              onPress={() => {
                this.setState({show_picker3: true});
              }}>
              <Text>{this.state.time2}</Text>
            </TouchableOpacity>

            {this.state.show_picker2 ? (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode={'time'}
                is24Hour={true}
                display="default"
                onChange={(value) => {
                  let d = new Date(value.nativeEvent.timestamp);
                  if (d.toString() != 'Invalid Date') {
                    this.setState({
                      time: d.toString().slice(15, 21),
                      show_picker2: false,
                    });
                  } else {
                    this.setState({show_picker2: false});
                  }
                }}
              />
            ) : null}

            {this.state.show_picker3 ? (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode={'time'}
                is24Hour={true}
                display="default"
                onChange={(value) => {
                  let d = new Date(value.nativeEvent.timestamp);
                  if (d.toString() != 'Invalid Date') {
                    this.setState({
                      time2: d.toString().slice(15, 21),
                      show_picker3: false,
                    });
                  } else {
                    this.setState({show_picker3: false});
                  }
                }}
              />
            ) : null}
          </View>
        ) : null}

        <Button
          onPress={() => {
            this.state.add_type == 0
              ? this.state.add_or_edit == 1
                ? this.add_exam()
                : this.edit_exam()
              : this.state.add_or_edit == 1
              ? this.add_quiz()
              : this.edit_quiz();
          }}
          style={{
            width: '90%',
            backgroundColor: color,
            justifyContent: 'center',
            marginTop: 60,
            alignSelf: 'center',
            marginBottom: 60,
          }}
          disabled={this.state.loading}>
          {this.state.loading == false ? (
            <Text
              style={{
                fontSize: 24,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                color: '#FFF',
              }}>
              {this.state.add_or_edit == 1 ? 'إضافة' : 'تعديل'}
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
      </ScrollView>
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
                size={25}
                style={{paddingRight: 10, paddingLeft: 10, color: '#FFF'}}
              />
            </TouchableOpacity>
          </Left>

          <Body style={{flex: 3, alignItems: 'center'}}>
            <Title>
              {this.state.add_type == 0
                ? this.state.add_or_edit == 1
                  ? 'إضافة إمتحان'
                  : 'تعديل إمتحان'
                : this.state.add_or_edit == 1
                ? 'إضافة واجب'
                : 'تعديل واجب'}
            </Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>
        <Container>{this.render_add_exam_form()}</Container>
      </>
    );
  }
}
