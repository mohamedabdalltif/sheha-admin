import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  TextInput,
  FlatList,
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
  Toast,
  Root,
  Spinner,
  Button,
  Fab,
} from 'native-base';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const { width, height } = Dimensions.get('window');
import ModalHome from 'react-native-modalbox';
import basic from './BasicURL';
import { color } from '../color';

export default class GroupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: '',
      NameOfGroup: '',
      collection_day: '',
      start_time: '',
      end_time: '',
      Group_limit: '',
      id: '',
      data: [],
      modalVisable: false,
      modalVisible2: false,
      modalVisable3: false,
      disabled: false,
      showPicker: false,
      showPicker1: false,
      item: '',
      day: '',
      generation_id: this.props.navigation.getParam('generation_id'),
    };
  }

  componentDidMount() {
    // let generation_id = this.props.navigation.getParam('generation_id');
    let data = this.props.navigation.getParam('AllData');
    this.setState({ data: data });
  }
  async _deleteGroup(item) {
    let data_to_send = {
      collection_id: item.collection_id,
    };
    this.setState({ disabled: true });
    let domain = basic.url;

    axios
      .post(
        domain + `admin/delete_collection.php`,

        data_to_send,
      )
      .then((res) => {
        if (res.data != 'error') {
          this.setState({ disabled: false });

          const OriginalArray = this.state.data;

          OriginalArray.splice(this.state.data.indexOf(item), 1);

          this.setState({
            data: OriginalArray,
          });
          Toast.show({
            text: 'تم مسح الجروب بنجاح',
            buttonText: 'شكرا',
            textStyle: { color: '#FFF' },
            buttonTextStyle: { color: '#FFF' },
            type: 'danger',
            duration: 7000,
          });
          this.setState({ modalVisible2: false });
        } else {
          //   Alert.alert(')
          this.setState({ disabled: false, modalVisible2: false });
        }
      });
  }
  async Update_Name_Of_Group() {
    let data_to_send = {
      collection_day: this.state.collection_day,
      collection_id: this.state.id,
      collection_name: this.state.NameOfGroup,
      collection_start_time: this.state.start_time,
      collection_end_time: this.state.end_time,
      collection_limit: this.state.Group_limit,
    };
    let domain = basic.url;

    this.setState({ disabled: true });
    axios
      .post(domain + `admin/update_collection.php`, data_to_send)
      .then((res) => {
        this.setState({ disabled: false });
        // alert(res.data)
        if (res.data != 'error') {
          let arrayx = this.state.data;

          for (let i = 0; i < arrayx.length; i++) {
            if (arrayx[i].collection_id == this.state.id) {
              arrayx[i].collection_name = this.state.NameOfGroup;
              arrayx[i].collection_start_time = this.state.start_time;
              arrayx[i].collection_end_time = this.state.end_time;
              arrayx[i].collection_limit = this.state.Group_limit;
              arrayx[i].collection_day = this.state.collection_day;
            }
          }
          this.setState({
            data: arrayx,
            modalVisable: false,
            NameOfGroup: '',
            start_time: '',
            end_time: '',
            Group_limit: '',
            day: '',
            collection_day: '',
          });

          Toast.show({
            text: 'تم التعديل بنجاح',
            buttonText: 'شكرا',
            textStyle: { color: '#FFF' },
            buttonTextStyle: { color: '#FFF' },
            type: 'success',
            duration: 7000,
          });
        } else if (res.data == 'name_found') {
          this.setState({
            modalVisable: false,
            NameOfGroup: '',
            start_time: '',
            end_time: '',
            Group_limit: '',
            day: '',
          });
          Toast.show({
            text: 'الاسم موجود بالفعل',
            buttonText: 'شكرا',
            textStyle: { color: '#FFF' },
            buttonTextStyle: { color: '#FFF' },
            type: 'warning',
            duration: 7000,
          });
        } else if (res.data == 'time_found') {
          this.setState({
            modalVisable: false,
            NameOfGroup: '',
            start_time: '',
            end_time: '',
            Group_limit: '',
            day: '',
          });
          Toast.show({
            text: 'يوجد مجموعة بالفعل فى هذا الوقت',
            buttonText: 'شكرا',
            textStyle: { color: '#FFF' },
            buttonTextStyle: { color: '#FFF' },
            type: 'warning',
            duration: 7000,
          });
        } else {
          this.setState({
            modalVisable: false,
            NameOfGroup: '',
            start_time: '',
            end_time: '',
            Group_limit: '',
            day: '',
          });
          Toast.show({
            text: 'حدث خطأ ما',
            buttonText: 'شكرا',
            textStyle: { color: '#FFF' },
            buttonTextStyle: { color: '#FFF' },

            duration: 7000,
          });
        }
      });
  }
  componentWillUnmount() {
    let testPage = this.props.navigation.getParam('testPage');

    if (testPage == 0) {
      const { state } = this.props.navigation;
      const params = state.params;

      params._refreshPages();
    }
  }

  async add_Group() {
    let col_name = this.state.NameOfGroup.trim(),
      start = this.state.start_time.trim(),
      end = this.state.end_time.trim(),
      limit = this.state.Group_limit.trim(),
      day = this.state.day.trim();

    if (col_name == '') {
      Alert.alert('أدمن', 'يجب إدخال إسم الجروب');
    } else if (start == '') {
      Alert.alert('أدمن', 'يجب إدخال وقت بدايةالجروب');
    } else if (end == '') {
      Alert.alert('أدمن', 'يجب إدخال وقت نهاية الجروب');
    } else if (limit == '') {
      Alert.alert('أدمن', 'يجب إدخال أكبر عدد ممكن للجروب');
    } else if (day == '') {
      Alert.alert('أدمن', 'يجب إدخال يوم الجروب');
    } else {
      if (limit <= 0) {
        Alert.alert('أدمن', 'يجب إدخال عدد صحيح للجروب');
        return;
      }

      this.setState({ disabled: true });
      let data_to_send = {
        generation_id: this.state.generation_id,
        collection_name: col_name,
        collection_start_time: start,
        collection_end_time: end,
        collection_limit: limit,
        collection_day: day,
      };
      let domain = basic.url;

      axios
        .post(domain + `admin/insert_collection.php`, data_to_send)
        .then((res) => {
          this.setState({ disabled: false });

          if (res.data * 0 == 0) {
            let obj = {
              collection_id: res.data,
              collection_name: col_name,
              collection_start_time: start,
              collection_end_time: end,
              student_without_pending: 0,
              student_with_pending: 0,
              generation_id: this.state.generation_id,
              collection_limit: limit,
              collection_day: day,
            };
            this.state.data.push(obj);
            Alert.alert('أدمن', 'تمت إضافة الجروب بنجاح');

            //   col_name = this.state.NameOfGroup.trim(),
            // start = this.state.start_time.trim(),
            // end = this.state.end_time.trim(),
            // limit = this.state.Group_limit.trim(),
            // day = this.state.day.trim()

            this.setState({
              modalVisable3: false,
              NameOfGroup: '',
              start_time: '',
              end_time: '',
              Group_limit: '',
              day: '',
              // changeButton: false,
            });
          } else {
            Alert.alert('أدمن', 'خطأ');
          }
        });
    }
  }

  renderGroups(item) {
    return (
      <TouchableOpacity
        onPress={
          () => this.setState({ modalVisible2: true, item: item })
          // ActionSheet.show(
          //   {
          //     options: BUTTONS,
          //     cancelButtonIndex: CANCEL_INDEX,
          //     destructiveButtonIndex: DESTRUCTIVE_INDEX,
          //   },
          //   buttonIndex => {
          //     if (buttonIndex == 0) {
          //
          //     } else if (buttonIndex == 1) {
          //       Alert.alert(
          //         'أدمن',
          //         ' هل انت متأكد من مسح المجموعه',
          //         [
          //           {
          //             text: 'نعم',
          //             onPress: () => this._deleteGroup(item),
          //           },

          //           {
          //             text: 'لا',
          //             onPress: () => console.log('OK Pressed'),
          //           },
          //         ],
          //         {cancelable: false},
          //       );
          //     } else if (buttonIndex == 2) {
          //       this.props.navigation.navigate('PendingStudents', {
          //         generation_id: 'no',
          //         collectiont_id: item.collection_id,
          //         status: 'pending',
          //
          //       });
          //     } else if (buttonIndex == 3) {
          //       this.props.navigation.navigate('Students', {
          //         generation_id: 'no',
          //         collectiont_id: item.collection_id,
          //         status: 'approved',
          //
          //       });
          //     } else if (buttonIndex == 4) {
          //       this.props.navigation.navigate('ListOfExams', {
          //         generation_id: item.generation_id,
          //       });
          //     } else if (buttonIndex == 5) {
          //       this.props.navigation.navigate('ListOfQuiz', {
          //         generation_id: item.generation_id,
          //       });
          //     }
          //   },
          // )
        }
        key={item.generation_id}>
        <View style={styles.order}>
          <View style={{ justifyContent: 'center' }}>
            <Text
              // numberOfLines={1}
              // ellipsizeMode="tail"
              style={{
                marginLeft: 10,
                fontSize: 18,
                color: '#000',
                // textAlign: 'right',
                // top: 5,
                fontWeight: 'bold',
              }}>
              {item.collection_name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render_add_collection() {
    return (
      <Modal
        animationType="slide"
        // transparent={true}
        visible={this.state.modalVisable3}
        onRequestClose={() => {
          this.setState({ modalVisable3: false });
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginBottom: 20,
              marginTop: 40,
            }}>
            <Text
              style={{
                margin: 24,
                marginBottom: 10,
                marginTop: 10,
                fontSize: 22,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              إضافة الجروب
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              borderColor: '#ddd',
              borderWidth: 1,
              width: '90%',
              marginBottom: 15,
            }}>
            <TextInput
              style={{
                flexDirection: 'row',
                // justifyContent: 'flex-end',
                textAlign: 'center',
                // alignItems: 'center',
                // alignSelf:'center',
                // justifyContent:'center',
                height: 50,
                width: '90%',
                color: '#888486',
                color: '#000',

                // paddingLeft: 5,
              }}
              placeholder="اسم الجروب"
              placeholderTextColor="#000"
              onChangeText={(NameOfGroup) =>
                this.setState({
                  NameOfGroup: NameOfGroup,
                  showPicker: false,
                  showPicker1: false,
                })
              }
              value={this.state.NameOfGroup}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
              borderColor: '#ddd',
              borderWidth: 1,
              width: '90%',
              marginBottom: 15,
            }}>
            <View
              style={{
                width: '90%',
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ showPicker1: true });
                }}>
                {this.state.start_time == '' ? (
                  <Text style={{ color: '#888486' }}> اختار وقت البدايه</Text>
                ) : (
                  <View>
                    <Text style={{ color: '#888486' }}>
                      {this.state.start_time}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {this.state.showPicker1 ? (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode={'time'}
                minimumDate={new Date()}
                // dateFormat="dayofweek day month"
                is24Hour={true}
                display="default"
                onChange={(data, time) => {
                  // alert("hi")
                  if (data.type != 'dismissed') {
                    let dateFinal = data.nativeEvent.timestamp;

                    let format = moment(dateFinal).format('HH:mm');
                    // alert(format);

                    this.setState({
                      showPicker1: false,

                      start_time: format,
                    });
                  }
                }}
              />
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
              borderColor: '#ddd',
              borderWidth: 1,
              width: '90%',
              marginBottom: 15,
            }}>
            <View
              style={{
                width: '90%',
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ showPicker: true });
                }}>
                {this.state.end_time == '' ? (
                  <Text style={{ color: '#888486' }}> اختار وقت النهاية</Text>
                ) : (
                  <View>
                    <Text style={{ color: '#888486' }}>
                      {this.state.end_time}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {this.state.showPicker ? (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode={'time'}
                minimumDate={new Date()}
                // dateFormat="dayofweek day month"
                is24Hour={true}
                display="default"
                onChange={(data, time) => {
                  // alert("hi")
                  if (data.type != 'dismissed') {
                    let dateFinal = data.nativeEvent.timestamp;

                    let format = moment(dateFinal).format('HH:mm');
                    // alert(format);

                    this.setState({
                      showPicker: false,

                      end_time: format,
                    });
                  }
                }}
              />
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              borderColor: '#ddd',
              borderWidth: 1,
              width: '90%',
              marginBottom: 15,
            }}>
            <TextInput
              style={{
                flexDirection: 'row',
                // justifyContent: 'flex-end',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                height: 50,
                width: '90%',
                color: '#888486',
                // paddingLeft: 5,
                color: '#000',
              }}
              placeholder="عدد المجموعه الواحدة"
              keyboardType="numeric"
              placeholderTextColor="#000"
              onChangeText={(Group_limit) =>
                this.setState({
                  Group_limit: Group_limit,
                  showPicker: false,
                  showPicker1: false,
                })
              }
              value={this.state.Group_limit}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              borderColor: '#ddd',
              borderWidth: 1,
              width: '90%',
              marginBottom: 15,
            }}>
            <TextInput
              style={{
                flexDirection: 'row',
                // justifyContent: 'flex-end',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                height: 50,
                width: '90%',
                color: '#888486',
                color: '#000',

                // paddingLeft: 5,
              }}
              placeholder="اليوم"
              // keyboardType="numeric"
              placeholderTextColor="#000"
              onChangeText={(day) =>
                this.setState({
                  day: day,
                  showPicker: false,
                  showPicker1: false,
                })
              }
              value={this.state.day}
            />
          </View>
          <Button
            disabled={this.state.disabled}
            onPress={() => {
              this.add_Group();
            }}
            style={{
              width: '90%',
              backgroundColor: color,
              justifyContent: 'center',
              marginTop: 20,
              alignSelf: 'center',
            }}>
            {this.state.disabled == true ? (
              <Spinner color="white" size={25} style={{ marginTop: 5 }} />
            ) : (
              <Text
                style={{
                  fontSize: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: '#FFF',
                }}>
                إضافة
              </Text>
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
              this.setState({ modalVisable3: false });
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
      </Modal>
    );
  }

  render() {
    return (
      <Root>
        <Container>
          <Header
            style={{ backgroundColor: color }}
            androidStatusBarColor={color}>
            <Left style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name="angle-right"
                  style={{ fontSize: 35, color: '#fff', marginLeft: 10 }}
                />
              </TouchableOpacity>
            </Left>
            <Body style={{ flex: 3, alignItems: 'center' }}>
              <Title>المجموعات</Title>
            </Body>
            <Right style={{ flex: 1 }} />
          </Header>
          <Modal
            animationType="slide"
            // transparent={true}
            visible={this.state.modalVisable}
            onRequestClose={() => {
              this.setState({ modalVisable: false });
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  marginBottom: 20,
                  marginTop: 40,
                }}>
                <Text
                  style={{
                    margin: 24,
                    marginBottom: 10,
                    marginTop: 10,
                    fontSize: 22,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  تعديل الجروب
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  borderColor: '#ddd',
                  borderWidth: 1,
                  width: '90%',
                  marginBottom: 15,
                }}>
                <TextInput
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'flex-end',
                    textAlign: 'center',
                    // alignItems: 'center',
                    // alignSelf:'center',
                    // justifyContent:'center',
                    height: 50,
                    width: '90%',
                    color: '#888486',
                    color: '#000',

                    // paddingLeft: 5,
                  }}
                  placeholder="اسم الجروب"
                  placeholderTextColor="#000"
                  onChangeText={(NameOfGroup) =>
                    this.setState({
                      NameOfGroup,
                      showPicker: false,
                      showPicker1: false,
                    })
                  }
                  value={this.state.NameOfGroup}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderColor: '#ddd',
                  borderWidth: 1,
                  width: '90%',
                  marginBottom: 15,
                }}>
                <View
                  style={{
                    width: '90%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 50,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ showPicker1: true });
                    }}>
                    {this.state.start_time == '' ? (
                      <Text style={{ color: '#888486' }}> اختار وقت البدايه</Text>
                    ) : (
                      <View>
                        <Text style={{ color: '#888486' }}>
                          {this.state.start_time}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                {this.state.showPicker1 ? (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date()}
                    mode={'time'}
                    minimumDate={new Date()}
                    // dateFormat="dayofweek day month"
                    is24Hour={true}
                    display="default"
                    onChange={(data, time) => {
                      // alert("hi")
                      if (data.type != 'dismissed') {
                        let dateFinal = data.nativeEvent.timestamp;

                        let format = moment(dateFinal).format('HH:mm:ss');
                        // alert(format);

                        this.setState({
                          showPicker1: false,

                          start_time: format,
                        });
                      }
                    }}
                  />
                ) : null}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderColor: '#ddd',
                  borderWidth: 1,
                  width: '90%',
                  marginBottom: 15,
                }}>
                <View
                  style={{
                    width: '90%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 50,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ showPicker: true });
                    }}>
                    {this.state.end_time == '' ? (
                      <Text style={{ color: '#888486' }}> اختار وقت النهاية</Text>
                    ) : (
                      <View>
                        <Text style={{ color: '#888486' }}>
                          {this.state.end_time}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                {this.state.showPicker ? (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date()}
                    mode={'time'}
                    minimumDate={new Date()}
                    // dateFormat="dayofweek day month"
                    is24Hour={true}
                    display="default"
                    onChange={(data, time) => {
                      // alert("hi")
                      if (data.type != 'dismissed') {
                        let dateFinal = data.nativeEvent.timestamp;

                        let format = moment(dateFinal).format('HH:mm:ss');
                        // alert(format);

                        this.setState({
                          showPicker: false,

                          end_time: format,
                        });
                      }
                    }}
                  />
                ) : null}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  borderColor: '#ddd',
                  borderWidth: 1,
                  width: '90%',
                  marginBottom: 15,
                }}>
                <TextInput
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'flex-end',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    height: 50,
                    width: '90%',
                    color: '#000',

                    color: '#888486',
                    // paddingLeft: 5,
                  }}
                  placeholder="عدد المجموعه الواحدة"
                  keyboardType="numeric"
                  placeholderTextColor="#000"
                  onChangeText={(Group_limit) =>
                    this.setState({
                      Group_limit,
                      showPicker: false,
                      showPicker1: false,
                    })
                  }
                  value={this.state.Group_limit}
                />
              </View>

              {/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  borderColor: '#ddd',
                  borderWidth: 1,
                  width: '90%',
                  marginBottom: 15,
                }}>
                <TextInput
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'flex-end',
                    textAlign: 'center',
                    // alignItems: 'center',
                    // alignSelf:'center',
                    // justifyContent:'center',
                    height: 50,
                    width: '90%',
                    color: '#888486',
                    color: '#000',

                    // paddingLeft: 5,
                  }}
                  placeholder="اليوم"
                  placeholderTextColor="#000"
                  onChangeText={(collection_day) =>
                    this.setState({
                      collection_day,
                      showPicker: false,
                      showPicker1: false,
                    })
                  }
                  value={this.state.collection_day}
                />
              </View>

              {/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}

              <Button
                disabled={this.state.disabled}
                onPress={() => {
                  this.Update_Name_Of_Group();
                }}
                style={{
                  width: '90%',
                  backgroundColor: color,
                  justifyContent: 'center',
                  marginTop: 20,
                  alignSelf: 'center',
                }}>
                {this.state.disabled == true ? (
                  <Spinner color="white" size={25} style={{ marginTop: 5 }} />
                ) : (
                  <Text
                    style={{
                      fontSize: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: '#FFF',
                    }}>
                    تعديل
                  </Text>
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
                  this.setState({ modalVisable: false });
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
          </Modal>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 20, marginTop: 20 }}>
            {this.state.disabled == false ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.data}
                numColumns={1}
                renderItem={({ item }) => this.renderGroups(item)}
              />
            ) : (
              <Spinner color={color} style={{ marginTop: 100 }} />
            )}
          </ScrollView>

          <ModalHome
            onRequestClose={() => {
              this.setState({
                modalVisible2: false,
              });
            }}
            style={{
              height: height / 2.1,
              paddingLeft: 15,
              // maxHeight: height / 1.2,
              // borderTopRightRadius: 15,
              // borderTopLeftRadius: 15,
              backgroundColor: '#fff',
              // zIndex: 1235200000000566788899,
            }}
            backButtonClose={true}
            backdropPressToClose={true}
            isOpen={this.state.modalVisible2}
            backdrop={true}
            // entry='bottom'
            onClosed={() => {
              this.setState({
                modalVisible2: false,
              });
            }}
            swipeArea={50}
            // swipeThreshold={50}
            position="bottom"
            useNativeDriver={true}>
            <ScrollView showsVerticalScrollIndicator={false} style={{}}>
              <TouchableOpacity
                style={{ flexDirection: 'row', marginBottom: 20, marginTop: 10 }}
                onPress={() => {
                  this.setState({
                    NameOfGroup: this.state.item.collection_name,
                    collection_day: this.state.item.collection_day,
                    modalVisable: true,
                    id: this.state.item.collection_id,
                    start_time: this.state.item.collection_start_time,
                    end_time: this.state.item.collection_end_time,
                    Group_limit: this.state.item.collection_limit,
                    modalVisible2: false,
                  });
                }}>
                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                  <Icon name="user-edit" size={25} style={{ color: '#2c8ef4' }} />
                </View>
                <Text style={{ fontSize: 18 }}>تعديل</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: 'row', marginBottom: 20 }}
                onPress={() => {
                  Alert.alert(
                    'أدمن',
                    ' هل انت متأكد من مسح المجموعه',
                    [
                      {
                        text: 'نعم',
                        onPress: () => this._deleteGroup(this.state.item),
                      },

                      {
                        text: 'لا',
                        onPress: () => this.setState({ modalVisible2: false }),
                      },
                    ],
                    { cancelable: false },
                  );
                }}>
                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                  <Icon
                    name="trash"
                    size={25}
                    style={{ color: '#fa213b', marginLeft: 10 }}
                  />
                </View>
                <Text style={{ fontSize: 18 }}>مسح</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: 'row', marginBottom: 20 }}
                onPress={() => {
                  this.props.navigation.navigate('Students', {
                    generation_id: 'no',
                    collectiont_id: this.state.item.collection_id,
                    status: 'approved',
                  });
                  this.setState({ modalVisible2: false });
                }}>
                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                  <Icon
                    name="users"
                    size={25}
                    style={{ color: '#f42ced', marginLeft: 5 }}
                  />
                </View>

                <Text style={{ fontSize: 18 }}>جميع الطلاب</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={{flexDirection: 'row', marginBottom: 20}}
                onPress={() => {
                  this.props.navigation.navigate('VideosList', {
                    generation_id: this.state.item.generation_id,
                    collection_id: this.state.item.collection_id,
                  });
                  this.setState({modalVisible2: false});
                }}>
                <View style={{width: '15%', alignItems: 'flex-start'}}>
                  <Icon
                    name="play"
                    size={25}
                    style={{color: '#385898', marginLeft: 5}}
                  />
                </View>

                <Text style={{fontSize: 18}}> الفيديوهات</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={{ flexDirection: 'row', marginBottom: 20 }}
                onPress={() => {
                  this.props.navigation.navigate('SendNotifications', {
                    generation_id: this.state.item.generation_id,
                    collection_id: this.state.item.collection_id,
                  });
                  this.setState({ modalVisible2: false });
                }}>
                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                  <Ionicons
                    name="notifications"
                    size={25}
                    style={{ color: 'gold', marginLeft: 5 }}
                  />
                </View>

                <Text style={{ fontSize: 18 }}>الإشعارات</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: 'row', marginBottom: 20 }}
                onPress={() => {
                  this.props.navigation.navigate('ListOfExams', {
                    generation_id: this.state.item.generation_id,
                    collection_id: this.state.item.collection_id,
                  });
                  this.setState({ modalVisible2: false });
                }}>
                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                  <Icon
                    name="book-open"
                    size={25}
                    style={{ color: '#6CBD8A', marginLeft: 5 }}
                  />
                </View>
                <Text style={{ fontSize: 18 }}> قائمة الامتحانات</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={{flexDirection: 'row', marginBottom: 20}}
                onPress={() => {
                  this.props.navigation.navigate('ListOfQuiz', {
                    generation_id: this.state.item.generation_id,
                    collection_id: this.state.item.collection_id,
                  });
                  this.setState({modalVisible2: false});
                }}>
                <View style={{width: '15%', alignItems: 'flex-start'}}>
                  <Icon
                    name="book-open"
                    size={25}
                    style={{color: color, marginLeft: 5}}
                  />
                </View>
                <Text style={{fontSize: 18}}>قائمة الواجبات</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={{ flexDirection: 'row', marginBottom: 20 }}
                onPress={() => {
                  this.props.navigation.navigate('SummaryList', {
                    generation_id: this.state.item.generation_id,
                  });
                  this.setState({ modalVisible2: false });
                }}>
                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                  <Icon
                    name="file"
                    size={25}
                    style={{ color: color, marginLeft: 5 }}
                  />
                </View>
                <Text style={{ fontSize: 18 }}>قائمة الملخصات</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={{flexDirection: 'row', marginBottom: 20}}
                onPress={() => {
                  this.props.navigation.navigate('InstructionsList', {
                    generation_id: this.state.item.generation_id,
                  });
                  this.setState({modalVisible2: false});
                }}>
                <View style={{width: '15%', alignItems: 'flex-start'}}>
                  <Icon
                    name="file"
                    size={25}
                    style={{color: 'royalblue', marginLeft: 5}}
                  />
                </View>
                <Text style={{fontSize: 18}}>قائمة التعليمات</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={{ flexDirection: 'row', marginBottom: 40 }}
                onPress={() => {
                  this.setState({ modalVisible2: false });
                }}>
                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                  <Icon
                    name="times"
                    size={25}
                    style={{ color: '#ea943b', marginLeft: 10 }}
                  />
                </View>
                <Text style={{ fontSize: 18 }}>الغاء</Text>
              </TouchableOpacity>
            </ScrollView>
          </ModalHome>

          {this.render_add_collection()}

          {this.state.modalVisible2 ? null : (
            <Fab
              direction="up"
              style={{ backgroundColor: color, marginRight: 10 }}
              position="bottomRight"
              onPress={() =>
                this.setState({
                  modalVisable3: true,
                  NameOfClass: '',
                })
              }>
              <Icon name="plus" style={{ fontSize: 30 }} color="#FFF" />
            </Fab>
          )}
        </Container>
      </Root>
    );
  }
}
const styles = StyleSheet.create({
  order: {
    marginTop: 0,
    marginBottom: 10,

    width: '97%',
    marginLeft: 5,
    backgroundColor: 'rgba(255,255,255,.7)',
    padding: 20,

    borderRadius: 10,
    // shadowOffset: { height: 1, width: 6 },
    // shadowOpacity: 0.9,
    // elevation: 1,
    borderColor: '#bcbaba',
    borderWidth: 1,
  },
});
