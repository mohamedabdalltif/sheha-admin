import React, {Component} from 'react';

import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  LayoutAnimation,
  Animated,
  Image,
  TextInput,
  FlatList,
  TouchableHighlight,
  Dimensions,
  AsyncStorage,
  Linking,
  TouchableWithoutFeedback,
  Picker,
  CheckBox,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import {
  // CheckBox,
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  // Icon,
  Item,
  Toast,
  Root,
  Spinner,
  ActionSheet,
  Button,
  Fab,
} from 'native-base';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ModalHome from 'react-native-modalbox';
import basic from './BasicURL';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const {width, height} = Dimensions.get('window');
import {color} from '../color';
import RNFetchBlob from 'rn-fetch-blob';
// var DESTRUCTIVE_INDEX = 1;
// var CANCEL_INDEX = 6;

export default class ClassPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: '',
      NameOfClass: '',
      id: '',
      data: [],
      modalVisable: false,
      modalVisible2: false,
      disabled: false,
      menuHeight: 0,
      AllStudents: '',
      AllStudentsPending: '',
      refresh: true,
      item: '',
      changeButton: true,
      visableStatisticModal: false,
      collections: [],
      pickerValue: '',
      pickerID: '',
      selectAllGen: false,
      monthId: '1',
    };
    this._refreshPages = this._refreshPages.bind(this);
  }
  componentDidMount() {
    this.getgenedata();
  }

  async _refreshPages() {
    let domain = basic.url;

    axios.get(domain + 'select_generations.php').then((res) => {
      let colls = [];
      for (let i = 0; i < res.data.gens.length; i++) {
        colls = [...colls, ...res.data.gens[i].cols];
      }

      this.setState({disabled: false});
      this.setState({
        data: res.data.gens,
        collections: colls,
        pickerValue: colls[0].collection_name,
        pickerID: colls[0].collection_id,
      });
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
      this.setState({AllStudents: Number, AllStudentsPending: NumberPending});
    });
  }

  // _getAllStudents(){
  //   let array=this.state.data
  //   let Number=0;
  //   for(let i=0;i<array.length;i++){
  //      Number= parseInt(array[i].student_with_pending)+parseInt(array[i].student_without_pending)
  //   }
  //  this.setState({AllStudents:Number})
  //     // return Number;
  // }
  closeModal() {
    this.setState({
      visableStatisticModal: false,
      selectAllGen: false,
    });
  }

  downloadPdf = async (url, name) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ToastAndroid.showWithGravity(
          '1 item will be downloaded. see notification for details',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );

        var file_url = url;
        const {
          dirs: {DownloadDir, DocumentDir},
        } = RNFetchBlob.fs;
        const {config} = RNFetchBlob;
        const isIos = Platform.OS === 'ios';
        const aPath = Platform.select({ios: DocumentDir, android: DownloadDir});
        var ext = 'pdf';
        var file_ex = name + '.pdf';
        const fPath = `${aPath}/${file_ex}`;
        const configOption = Platform.select({
          ios: {
            fileCache: true,
            path: fPath,
            appendExt: ext,
          },
          android: {
            fileCache: false,
            appendExt: ext,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              path: aPath + '/' + file_ex,
              description: name + '.pdf',
            },
          },
        });
        if (isIos) {
          RNFetchBlob.config(configOption)
            .fetch('GET', file_url)
            .then((res) => {
              RNFetchBlob.ios.previewDocument('file://' + res.path());
            });

          return;
        } else {
          config(configOption)
            .fetch('GET', file_url)
            .then((res) => {
              RNFetchBlob.android.actionViewIntent('file://' + res.path());
            })
            .catch((errorMessage, statusCode) => {
              console.log('error with downloading file ', errorMessage);
            });
        }
      } else {
        console.log('Permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  async openWebStatisticPage() {
    let domain = basic.url;

    if (this.state.selectAllGen) {
      const url = domain + `reports_data/create_xlsx_file.php`;
      this.downloadStatistic(url, '-1', this.state.monthId);
    } else {
      const url = domain + `reports_data/create_xlsx_file.php`;
      this.downloadStatistic(url, this.state.pickerID, this.state.monthId);

      // this.downloadPdf(url, name);
    }
  }

  downloadStatistic = (url, collection_id, month) => {
    let data_to_send = {
      collection_id,
      month,
    };
    axios.post(url, data_to_send).then((res) => {
      if (res.status == 200) {
        // console.log(res.data);
        if (res.data != 'error' && res.data.startsWith('https')) {
          Linking.openURL(res.data);

          // this.downloadXLSXFile(res.data);
        } else {
          Alert.alert('أدمن', 'خطأ');
        }
      } else {
        Alert.alert('أدمن', 'خطأ');
      }
    });
  };
  async getgenedata() {
    this.setState({disabled: true});
    let domain = basic.url;

    axios.get(domain + 'select_generations.php').then((res) => {
      let colls = [];
      for (let i = 0; i < res.data.gens.length; i++) {
        colls = [...colls, ...res.data.gens[i].cols];
      }

      this.setState({disabled: false});
      this.setState({
        data: res.data.gens,
        collections: colls,
        pickerValue: colls[0].collection_name,
        pickerID: colls[0].collection_id,
      });
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
      this.setState({AllStudents: Number, AllStudentsPending: NumberPending});
    });
  }
  openMenu = () => {
    LayoutAnimation.spring();
    if (this.state.menuHeight == 0) {
      this.setState({menuHeight: 500});
    }
  };

  closeMenu = () => {
    LayoutAnimation.spring();
    if (this.state.menuHeight != 0) {
      this.setState({menuHeight: 0});
    }
  };

  async _deleteClass(item) {
    let data_to_send = {
      generation_id: item.generation_id,
    };
    let domain = basic.url;

    this.setState({disabled: true});
    axios
      .post(
        domain + `admin/delete_generation.php`,

        data_to_send,
      )
      .then((res) => {
        if (res.data != 'error') {
          this.setState({disabled: false});

          const OriginalArray = this.state.data;

          OriginalArray.splice(this.state.data.indexOf(item), 1);

          this.setState({
            data: OriginalArray,
          });
          Toast.show({
            text: 'تم مسح الدفعه بنجاح',
            buttonText: 'شكرا',
            textStyle: {color: '#FFF'},
            buttonTextStyle: {color: '#FFF'},
            type: 'danger',
            duration: 7000,
          });
          this.setState({modalVisible2: false});
        } else {
          //   Alert.alert(')
          this.setState({disabled: false, modalVisible2: false});
        }
      });
  }
  renderClasses(item) {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('GroupPage', {
              generation_id: item.generation_id,
              AllData: item.cols,
              _refreshPages: this._refreshPages.bind(this),
              testPage: '0',
            });
          }}
          onLongPress={
            () => this.setState({modalVisible2: true, item: item})
            // ActionSheet.show(
            //   {
            //     options: BUTTONS,
            //     // cancelButtonIndex: CANCEL_INDEX,
            //     // destructiveButtonIndex: DESTRUCTIVE_INDEX,
            //   },
            //   buttonIndex => {
            //     if (buttonIndex == 0) {
            //       this.setState({
            //         NameOfClass: item.generation_name,
            //         modalVisable: true,
            //         id: item.generation_id,
            //       });
            //     } else if (buttonIndex == 1) {
            //
            //     } else if (buttonIndex == 2) {
            //       this.props.navigation.navigate('PendingStudents', {
            //         generation_id: item.generation_id,
            //         collectiont_id: 'no',
            //         status: 'pending',
            //         NumOfStudentPending: this.state.data[
            //           this.state.data.indexOf(item)
            //         ].student_with_pending,
            //       });
            //     } else if (buttonIndex == 3) {
            //       this.props.navigation.navigate('Students', {
            //         generation_id: item.generation_id,
            //         collectiont_id: 'no',
            //         status: 'approved',

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
            <View style={{justifyContent: 'center'}}>
              <Text
                // numberOfLines={1}
                // ellipsizeMode="tail"
                style={{
                  marginLeft: 10,
                  fontSize: 18,
                  // color: '#000',
                  // textAlign: 'right',
                  // top: 5,
                  fontWeight: 'bold',
                }}>
                {item.generation_name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  async add_Class() {
    if (this.state.NameOfClass.trim() != '') {
      // let arr = this.state.data;

      let data_to_send = {
        generation_name: this.state.NameOfClass.trim(),
      };
      let domain = basic.url;

      this.setState({disabled: true});
      axios
        .post(domain + `admin/insert_generation.php`, data_to_send)
        .then((res) => {
          this.setState({disabled: false});

          if (res.data * 0 == 0) {
            let obj = {
              generation_id: res.data,
              generation_name: this.state.NameOfClass.trim(),
              student_with_pending: 0,
              student_without_pending: 0,
              cols: [],
            };
            this.state.data.push(obj);
            Alert.alert('أدمن', 'تمت إضافة الدفعه بنجاح');
            this.setState({
              modalVisable: false,
              changeButton: false,
            });
          } else {
            Alert.alert('أدمن', 'خطأ');
          }
        });
    } else {
      Alert.alert('أدمن', 'يجب إدخال إسم الدفعه');
    }

    // } else {
    //   Alert.alert('PROMO WEDDING', "Type all fields please, it's required")
    // }
  }
  async Update_Name_Of_Class() {
    let data_to_send = {
      generation_id: this.state.id,
      generation_name: this.state.NameOfClass,
    };
    this.setState({disabled: true});
    let domain = basic.url;

    axios
      .post(domain + `admin/update_generation.php`, data_to_send)
      .then((res) => {
        this.setState({disabled: false});
        // alert(res.data)
        if (res.data != 'error' && res.data != 'name_found') {
          let arrayx = this.state.data;

          for (let i = 0; i < arrayx.length; i++) {
            if (arrayx[i].generation_id == this.state.id) {
              arrayx[i].generation_name = this.state.NameOfClass;
            }
          }
          this.setState({data: arrayx, modalVisable: false});

          Toast.show({
            text: 'تم تعديل الاسم بنجاح',
            buttonText: 'شكرا',
            textStyle: {color: '#FFF'},
            buttonTextStyle: {color: '#FFF'},
            type: 'success',
            duration: 7000,
          });
        } else if (res.data == 'name_found') {
          Toast.show({
            text: 'الاسم موجود بالفعل',
            buttonText: 'شكرا',
            textStyle: {color: '#FFF'},
            buttonTextStyle: {color: '#FFF'},
            type: 'warning',
            duration: 7000,
          });
        } else {
          Toast.show({
            text: 'حدث خطأ ما',
            buttonText: 'شكرا',
            textStyle: {color: '#FFF'},
            buttonTextStyle: {color: '#FFF'},

            duration: 7000,
          });
        }
      });
  }
  render() {
    return (
      <Root>
        <Container>
          <Header
            style={{backgroundColor: color}}
            androidStatusBarColor={color}>
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
              <Title>الدفعات</Title>
            </Body>
            <Right style={{flex: 1}}>
              {/* <TouchableOpacity
                disabled={this.state.disabled}
                onPress={async () => {
                  this.setState({
                    visableStatisticModal: true,
                  });
                }}>
                <Ionicons name="md-stats-chart" size={30} color="#fff" />
              </TouchableOpacity> */}
            </Right>
          </Header>
          <Modal
            animationType="slide"
            // transparent={true}
            visible={this.state.modalVisable}
            onRequestClose={() => {
              this.setState({modalVisable: false});
            }}>
            <View
              style={{
                marginBottom: 20,
                marginTop: 40,
              }}>
              {this.state.changeButton == false ? (
                <Text
                  style={{
                    margin: 24,
                    marginBottom: 10,
                    marginTop: 10,
                    fontSize: 22,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  تعديل اسم الدفعة
                </Text>
              ) : (
                <Text
                  style={{
                    margin: 24,
                    marginBottom: 10,
                    marginTop: 10,
                    fontSize: 22,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  اضافة دفعة
                </Text>
              )}
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
                  height: 50,
                  width: '90%',
                  // paddingLeft: 5,
                  color: '#000',
                }}
                multiline={true}
                placeholder="اسم الدفعه"
                placeholderTextColor="#000"
                onChangeText={(NameOfClass) => this.setState({NameOfClass})}
                value={this.state.NameOfClass}
              />
            </View>
            <Button
              disabled={this.state.disabled}
              onPress={() => {
                if (this.state.changeButton == false) {
                  this.Update_Name_Of_Class();
                } else {
                  this.add_Class();
                }
              }}
              style={{
                width: '90%',
                backgroundColor: color,
                justifyContent: 'center',
                marginTop: 20,
                alignSelf: 'center',
              }}>
              {this.state.disabled == true ? (
                <Spinner color="white" size={25} style={{marginTop: 5}} />
              ) : this.state.changeButton == false ? (
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
              ) : (
                <Text
                  style={{
                    fontSize: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: '#FFF',
                  }}>
                  اضافة
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
                this.setState({modalVisable: false});
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
          </Modal>
          <ScrollView style={{marginBottom: 20, marginTop: 20}}>
            {this.state.disabled == false ? (
              <FlatList
                data={this.state.data}
                numColumns={1}
                renderItem={({item}) => this.renderClasses(item)}
              />
            ) : (
              <Spinner color={color} style={{marginTop: 100}} />
            )}
          </ScrollView>
          <ModalHome
            onRequestClose={() => {
              this.setState({
                modalVisible2: false,
              });
            }}
            style={{
              height: height / 1.7,
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
            <ScrollView style={{}}>
              <TouchableOpacity
                style={{flexDirection: 'row', marginBottom: 20, marginTop: 10}}
                onPress={() => {
                  this.setState({
                    NameOfClass: this.state.item.generation_name,
                    modalVisable: true,
                    NameOfClass: this.state.item.generation_name,
                    id: this.state.item.generation_id,
                    modalVisible2: false,
                    changeButton: false,
                  });
                }}>
                <View style={{width: '15%', alignItems: 'flex-start'}}>
                  <Icon name="user-edit" size={25} style={{color: '#2c8ef4'}} />
                </View>
                <Text style={{fontSize: 18}}>تعديل</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row', marginBottom: 20}}
                onPress={() => {
                  Alert.alert(
                    'أدمن',
                    ' هل انت متأكد من مسح الدفعه',
                    [
                      {
                        text: 'نعم',
                        onPress: () => this._deleteClass(this.state.item),
                      },

                      {
                        text: 'لا',
                        onPress: () => this.setState({modalVisible2: false}),
                      },
                    ],
                    {cancelable: false},
                  );
                }}>
                <View style={{width: '15%', alignItems: 'flex-start'}}>
                  <Icon
                    name="trash"
                    size={25}
                    style={{color: '#fa213b', marginLeft: 10}}
                  />
                </View>
                <Text style={{fontSize: 18}}>مسح</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{flexDirection: 'row', marginBottom: 20}}
                onPress={() => {
                  this.props.navigation.navigate('Students', {
                    generation_id: this.state.item.generation_id,
                    collectiont_id: 'no',
                    status: 'approved',
                  });
                  this.setState({modalVisible2: false});
                }}>
                <View style={{width: '15%', alignItems: 'flex-start'}}>
                  <Icon
                    name="users"
                    size={25}
                    style={{color: '#f42ced', marginLeft: 5}}
                  />
                </View>

                <Text style={{fontSize: 18}}>جميع الطلاب</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: 'row', marginBottom: 20 }}
                onPress={() => {
                  this.props.navigation.navigate('TopPage', {
                    generation_id: this.state.item.generation_id,
                    // collectiont_id: 'no',
                  });
                  this.setState({ modalVisible2: false });
                }}>
                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                  <Icon
                    name="user-graduate"
                    size={25}
                    style={{ color: '#000', marginLeft: 5 }}
                  />
                </View>
                <Text style={{ fontSize: 18 }}>قائمة الاوائل</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: 'row', marginBottom: 20 }}
                onPress={() => {
                  this.props.navigation.navigate('TopPageWeekly', {
                    generation_id: this.state.item.generation_id,
                    // collectiont_id: 'no',
                  });
                  this.setState({ modalVisible2: false });
                }}>
                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                  <Icon
                    name="user-tie"
                    size={25}
                    style={{ color: '#ea943b', marginLeft: 5 }}
                  />
                </View>
                <Text style={{ fontSize: 18 }}>أوائل الاسبوع</Text>
              </TouchableOpacity>


              {/* <TouchableOpacity
                style={{flexDirection: 'row', marginBottom: 20}}
                onPress={() => {
                  this.props.navigation.navigate('LateStudent', {
                    generation_id: this.state.item.generation_id,
                    collectiont_id: 'no',
                  });
                  this.setState({modalVisible2: false});
                }}>
                <View style={{width: '15%', alignItems: 'flex-start'}}>
                  <Icon
                    name="users"
                    size={25}
                    style={{color: 'red', marginLeft: 5}}
                  />
                </View>

                <Text style={{fontSize: 18}}> المتخلفين عن الدفع</Text>
              </TouchableOpacity> */}

              {/* <TouchableOpacity
                style={{flexDirection: 'row', marginBottom: 20}}
                onPress={() => {
                  this.props.navigation.navigate('VideosList', {
                    generation_id: this.state.item.generation_id,
                    collection_id: -1,
                  });
                  this.setState({modalVisible2: false});
                }}>
                <View style={{width: '15%', alignItems: 'flex-start'}}>
                  <FontAwesome5
                    name="play"
                    size={25}
                    style={{color: '#385898', marginLeft: 5}}
                  />
                </View>

                <Text style={{fontSize: 18}}> الفيديوهات</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={{flexDirection: 'row', marginBottom: 20}}
                onPress={() => {
                  this.props.navigation.navigate('Chains', {
                    generation_id: this.state.item.generation_id,
                    collection_id: -1,
                    collections: this.state.item.cols,
                  });
                  this.setState({modalVisible2: false});
                }}>
                <View style={{width: '15%', alignItems: 'flex-start'}}>
                  <MaterialIcons
                    name="video-library"
                    size={28}
                    color={'#385898'}
                  />
                </View>

                <Text style={{fontSize: 18}}>الشباتر</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row', marginBottom: 20}}
                onPress={() => {
                  this.props.navigation.navigate('SendNotifications', {
                    generation_id: this.state.item.generation_id,
                    collection_id: -1,
                  });
                  this.setState({modalVisible2: false});
                }}>
                <View style={{width: '15%', alignItems: 'flex-start'}}>
                  <Ionicons
                    name="notifications"
                    size={25}
                    style={{color: 'gold', marginLeft: 5}}
                  />
                </View>

                <Text style={{fontSize: 18}}>الإشعارات</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row', marginBottom: 20}}
                onPress={() => {
                  this.props.navigation.navigate('ListOfExams', {
                    generation_id: this.state.item.generation_id,
                    collection_id: -1,
                  });
                  this.setState({modalVisible2: false});
                }}>
                <View style={{width: '15%', alignItems: 'flex-start'}}>
                  <Icon
                    name="book-open"
                    size={25}
                    style={{color: '#6CBD8A', marginLeft: 5}}
                  />
                </View>

                <Text style={{fontSize: 18}}> قائمة الامتحانات</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={{flexDirection: 'row', marginBottom: 20}}
                onPress={() => {
                  this.props.navigation.navigate('ListOfQuiz', {
                    generation_id: this.state.item.generation_id,
                    collection_id: -1,
                  });
                  this.setState({modalVisible2: false});
                }}>
                <View style={{width: '15%', alignItems: 'flex-start'}}>
                  <Icon
                    name="book-open"
                    size={25}
                    style={{color: '#984989', marginLeft: 5}}
                  />
                </View>
                <Text style={{fontSize: 18}}>قائمة الواجبات</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={{flexDirection: 'row', marginBottom: 20}}
                onPress={() => {
                  this.props.navigation.navigate('SummaryList', {
                    generation_id: this.state.item.generation_id,
                  });
                  this.setState({modalVisible2: false});
                }}>
                <View style={{width: '15%', alignItems: 'flex-start'}}>
                  <Icon
                    name="file"
                    size={25}
                    style={{color: '#385898', marginLeft: 5}}
                  />
                </View>
                <Text style={{fontSize: 18}}>قائمة الملخصات</Text>
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
                style={{flexDirection: 'row', marginBottom: height / 7}}
                onPress={() => {
                  this.setState({modalVisible2: false});
                }}>
                <View style={{width: '15%', alignItems: 'flex-start'}}>
                  <Icon
                    name="times"
                    size={25}
                    style={{color: '#ea943b', marginLeft: 10}}
                  />
                </View>
                <Text style={{fontSize: 18}}> الغاء</Text>
              </TouchableOpacity>
            </ScrollView>
          </ModalHome>

          <Modal
            visible={this.state.visableStatisticModal}
            onRequestClose={() => {
              this.closeModal();
            }}
            transparent={true}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.closeModal();
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
                <Text
                  style={{fontSize: 19, fontWeight: 'bold', marginLeft: 15}}>
                  اختر المجموعة
                </Text>
                <Picker
                  selectedValue={this.state.pickerID}
                  style={{height: 70, width: '90%'}}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({
                      pickerID: itemValue,
                    });
                  }}>
                  {this.state.collections.map((item) => (
                    <Picker.Item
                      label={item.collection_name}
                      value={item.collection_id}
                    />
                  ))}
                </Picker>
                <Text
                  style={{fontSize: 19, fontWeight: 'bold', marginLeft: 15}}>
                  اختر الشهر
                </Text>
                <Picker
                  selectedValue={this.state.monthId}
                  style={{height: 70, width: '90%'}}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({
                      monthId: itemValue,
                    });
                  }}>
                  {[
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                  ].map((item) => (
                    <Picker.Item label={item} value={item} />
                  ))}
                </Picker>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 20,
                    alignItems: 'center',
                  }}>
                  <CheckBox
                    value={this.state.selectAllGen}
                    onValueChange={() => {
                      this.setState({
                        selectAllGen: !this.state.selectAllGen,
                      });
                    }}
                    style={{
                      alignSelf: 'center',
                    }}
                  />
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    اختيار كل الدفعات
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.openWebStatisticPage();
                  }}
                  style={{
                    width: '90%',
                    padding: 8,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 11,
                    backgroundColor: color,
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 18,
                      color: '#fff',
                    }}>
                    تأكيد الاحصائيات
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.closeModal();
                }}
                style={{flex: 1, width: '100%', height: '100%'}}>
                <View style={{flex: 1, width: '100%', height: '100%'}}></View>
              </TouchableWithoutFeedback>
            </View>
          </Modal>

          {!this.state.modalVisible2 ? (
            <Fab
              direction="up"
              // containerStyle={{}}
              style={{backgroundColor: color, marginRight: 10}}
              position="bottomRight"
              onPress={() =>
                this.setState({
                  modalVisable: true,
                  NameOfClass: '',
                  changeButton: true,
                })
              }>
              <Icon name="plus" style={{fontSize: 30}} color="#FFF" />
            </Fab>
          ) : null}
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
    // height: 150,
    borderRadius: 10,
    borderColor: '#bcbaba',
    borderWidth: 1,
  },
  menu: {
    width: '80%',

    position: 'absolute',
  },
  contentBig: {
    backgroundColor: color,
    borderBottomRightRadius: 100,
  },
  menuLink: {
    height: 60,
    // justifyContent: 'center',
    flexDirection: 'row',
  },
  link_text: {
    color: '#FFF',
    marginTop: 17,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,

    // textAlign: 'center',
  },
  closeBttn: {
    backgroundColor: color,
    width: 40,
    height: 40,
    borderRadius: 20,

    justifyContent: 'center',

    alignSelf: 'center',
    marginTop: 20,
  },

  xBttn: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  bttnpairent: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
