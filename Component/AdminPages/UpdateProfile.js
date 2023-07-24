import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  Picker,
  Linking,
  ToastAndroid,
  AsyncStorage,
  TextInput,
  Clipboard,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  Form,
  Header,
  Left,
  Body,
  Right,
  Title,
  Spinner,
} from 'native-base';
// import {Picker} from '@react-native-community/picker'
import { Hoshi } from 'react-native-textinput-effects';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

const { width, height } = Dimensions.get('window');
import axios from 'axios';
import basic from './BasicURL';
import { color } from '../color';

export default class UpdateProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataa: {
        exams: [],
      },
      data: [],
      data2: [],
      visable: false,
      student_id: 1,
      generation_id: this.props.navigation.getParam('generation_id'),
      collection_id: this.props.navigation.getParam('collection_id'),
      collection_name: this.props.navigation.getParam('collection_name'),
      generation_name: this.props.navigation.getParam('generation_name'),
      student_phone: this.props.navigation.getParam('student_phone'),
      student_email: this.props.navigation.getParam('student_email'),
      student_password: this.props.navigation.getParam('student_password'),
      subscription_end: this.props.navigation.getParam('subscription_end'),

      generation_selected_id: '',
      generation_selected_value: '',
      selectederr: '',
      collection_selected_id: '',
      collection_selected_value: '',
      selectederr2: '',
      loading: false,
      student_name: '',
      profile_image: '',
      visableChart: false,
      parent_phone: '',
      view_count: 0,
      student_city: '',
      checkLogoutLoading: false,
      endSubLoading: false,

      visable_to_id: false,
      loading_up: false,
      newName: '',
      name_error: '',
    };
  }

  allert(index, name, id) {
    Alert.alert(
      'ادمن',

      ' هل انت متاكد من اعاده امتحان ( ' + name + ' ) للطالب ؟ ',
      [
        {
          text: 'الغاء',
          onPress: () => { },
        },
        {
          text: 'اعادة',
          onPress: () => this.Re_Start_Exam(index, id),
        },
      ],
      { cancelable: false },
    );
  }

  allertStudentendSub() {
    Alert.alert(
      'ادمن',

      ' هل انت متاكد من إنهاء الإشتراك لهذا الطالب',
      [
        {
          text: 'الغاء',
          onPress: () => { },
        },
        {
          text: 'تأكيد',
          onPress: () => this.endSubForStudent(),
        },
      ],
      { cancelable: false },
    );
  }
  async endSubForStudent() {
    this.setState({ endSubLoading: true });

    // alert("Hi")
    let student_id = this.props.navigation.getParam('student_id');
    // alert(student_id)
    let data_to_send = {
      student_id: student_id,
    };
    let domain = basic.url;

    axios
      .post(domain + 'admin/endSubscribeForStudent.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // alert(res.data);
          if (res.data == 'success') {
            ToastAndroid.showWithGravityAndOffset(
              'تم إنهاء الإشتراك لهذا الطالب',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'error') {
            ToastAndroid.showWithGravityAndOffset(
              'عذرا يرجي المحاوله في وقتا لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'not_sub') {
            ToastAndroid.showWithGravityAndOffset(
              'هذا الطالب غير مشترك فى المادة',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'not_found') {
            ToastAndroid.showWithGravityAndOffset(
              'خطأ فى بيانات هذا الطالب',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجي المحاوله في وقتا لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      })
      .finally(() => {
        this.setState({ endSubLoading: false });
      });
  }

  allertStudentLogOut() {
    Alert.alert(
      'ادمن',

      ' هل انت متاكد من تسجيل خروج لهذا الطالب',
      [
        {
          text: 'الغاء',
          onPress: () => { },
        },
        {
          text: 'تأكيد',
          onPress: () => this.logoutForStudent(),
        },
      ],
      { cancelable: false },
    );
  }
  async logoutForStudent() {
    this.setState({ checkLogoutLoading: true });

    // alert("Hi")
    let student_id = this.props.navigation.getParam('student_id');
    // alert(student_id)
    let data_to_send = {
      student_id: student_id,
      admin: 'admin',
    };
    let domain = basic.url;

    axios
      .post(domain + 'admin/log_out_student.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // alert(res.data);
          if (res.data == 'success') {
            ToastAndroid.showWithGravityAndOffset(
              'تم تسجيل الخروج لهذا الطالب',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'error') {
            ToastAndroid.showWithGravityAndOffset(
              'عذرا يرجي المحاوله في وقتا لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'already_logged_out') {
            ToastAndroid.showWithGravityAndOffset(
              'هذا الطالب تم تسجيل خروج له بالفعل',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجي المحاوله في وقتا لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      })
      .finally(() => {
        this.setState({ checkLogoutLoading: false });
      });
  }

  async Re_Start_Exam(index, item) {
    let data_to_send = {
      solved_exam_id: item,
    };
    this.setState({ loading: true });
    // alert(JSON.stringify(data_to_send))

    let domain = basic.url;

    axios
      .post(
        domain + `admin/delete_solved_exam.php`,

        data_to_send,
      )

      .then((res) => {
        if (res.data != 'error') {
          this.setState({ loading: false });

          const OriginalArray = this.state.dataa;

          OriginalArray.exams.splice(index, 1);

          this.setState({
            data: OriginalArray,
          });
          // alert(JSON.stringify(OriginalArray))
          // this.getgenedata();

          Toast.show({
            text: 'تم اعادة الاختبار بنجاح',
            buttonText: 'شكرا',
            textStyle: { color: '#FFF' },
            buttonTextStyle: { color: '#FFF' },
            type: 'danger',
            duration: 7000,
          });
          this.setState({ modalVisible2: false });
        } else {
          //   Alert.alert(')
          this.setState({ loading: false, modalVisible2: false });
        }
      });
  }

  async update_name() {
    this.setState({ loading_up: true });
    let name = this.state.newName;
    let data_to_send = {
      student_id: this.state.student_id,
      student_name: name,
    };
    let domain = basic.url;

    axios
      .post(domain + 'admin/update_student_name.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if ((res.data = 'success')) {
            this.setState({
              student_name: name,
              newName: '',
              visable_to_id: false,
            });

            Toast.show({
              text: 'تم تغير الاسم',
              buttonText: 'شكرا',
              textStyle: { color: '#fff' },
              buttonTextStyle: { color: '#fff' },
              type: 'danger',
              duration: 5000,
            });

            this.setState({ visable_to_id: false });

            var realArray = this.state.data;
          }
        }
        this.setState({ loading_up: false });
      });
  }

  componentDidMount() {
    this.info();
    this.getgenedata();
    let student_name = this.props.navigation.getParam('student_name');
    let profile_image = this.props.navigation.getParam('profile_image');
    let student_id = this.props.navigation.getParam('student_id');
    let view_count = this.props.navigation.getParam('view_count');
    let parent_phone = this.props.navigation.getParam('parent_phone');
    let student_city = this.props.navigation.getParam('student_city');
    let student_email = this.props.navigation.getParam('student_email');

    // let generation_id = this.props.navigation.getParam('generation_id');
    // let collectiont_id = this.props.navigation.getParam('collectiont_id');
    // let generation_name=this.props.navigation.getParam('generation_name')
    // alert(collectiont_id)

    this.setState({
      student_name: student_name,
      profile_image: profile_image,
      student_id: student_id,
      view_count: view_count,
      parent_phone: parent_phone,
      student_city: student_city,
      // generation_id:generation_id,
      // collectiont_id:collectiont_id
    });
  }
  async getgenedata() {
    let domain = basic.url;

    axios.get(domain + 'select_generations.php').then((res) => {
      // alert(JSON.stringify(res.data.gens))
      for (let i = 0; i < res.data.gens.length; i++) {
        if (res.data.gens[i].generation_id == this.state.generation_id) {
          for (let y = 0; y < res.data.gens[i].cols.length; y++) {
            if (
              res.data.gens[i].cols[y].collection_id == this.state.collection_id
            ) {
              this.setState({
                data: res.data.gens,
                generation_selected_value: res.data.gens[i].generation_name,
                generation_selected_id: res.data.gens[i].generation_id,
                collection_selected_value:
                  res.data.gens[i].cols[y].collection_name,
                collection_selected_id: res.data.gens[i].cols[y].collection_id,
                data2: res.data.gens[i].cols,
              });

              // console.log(this.state.collection_selected_value);
            }
          }
        }
      }
    });
  }
  Graph() {
    return (
      <Container>
        <Header style={{ backgroundColor: color }} androidStatusBarColor={color}>
          <Left style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ visableChart: false });
              }}>
              <Icon
                name="angle-right"
                style={{ fontSize: 26, color: '#fff', marginLeft: 10 }}
              />
            </TouchableOpacity>
          </Left>
          <Body
            style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{ fontSize: 22, fontFamily: 'serif' }}>
              الرسم البيانى
            </Title>
          </Body>
          <Right />
        </Header>
        <View>
          <LineChart
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June'],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={Dimensions.get('window').width} // from react-native
            height={220}
            // yAxisLabel="$"
            // yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: color,
              backgroundGradientFrom: color,
              backgroundGradientTo: color,
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <BarChart
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June'],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={Dimensions.get('window').width} // from react-native
            height={220}
            // yAxisLabel="$"
            // yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: color,
              backgroundGradientFrom: color,
              backgroundGradientTo: color,
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
              marginTop: 20,
            }}
          />
        </View>
        {/* <TouchableOpacity
          style={{
            marginTop: 30,
            alignItems: 'center',
            justifyContent: 'center',
            width: '88%',
            height: 50,
            backgroundColor: '#984989',
            alignSelf: 'center',
            borderRadius: 10,
          }}
          onPress={() => this.setState({visableChart: false})}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 25,
              color: '#FFF',
              fontFamily: 'serif',
            }}>
            اغلاق
          </Text>
        </TouchableOpacity> */}
      </Container>
    );
  }
  onValueChange(value, index) {
    if (index >= 0) {
      this.setState({
        generation_selected_id: this.state.data[index].generation_id,
        generation_selected_value: value,
        data2: this.state.data[index].cols,
        collection_selected_value: this.state.data[index].cols[0]
          .collection_name,
        collection_selected_id: this.state.data[index].cols[0].collection_id,
      });
    } else {
      this.setState({
        generation_selected_value: value,
        generation_selected_id: 0,
      });
    }
  }
  onValueChange2(value, index) {
    if (index >= 0) {
      // console.log(this.state.data2[index - 1].collection_id);
      this.setState({
        collection_selected_id: this.state.data2[index].collection_id,
        collection_selected_value: value,
      });
    } else {
      this.setState({
        collection_selected_value: value,
        collection_selected_id: 0,
      });
    }
  }

  async update() {
    let load = this.state.loading_up;
    this.setState({ loading_up: true });
    // let list = this.state.quiz;
    // let data_to_send = {};

    // console.log();
    let gen_id = 0,
      col_id = 0,
      Type = 0;
    if (
      this.state.generation_selected_id == this.state.generation_id &&
      this.state.collection_selected_id == this.state.collection_id
    ) {
      // Alert.alert('أدمن', 'يجب تغيير الدفعه او المجموعه');
      // alert(this.state.generation_selected_id )

      this.setState({ loading_up: false, visable: false });
      return;
    } else if (
      this.state.generation_selected_id != this.state.generation_id &&
      this.state.collection_selected_id == this.state.collection_id
    ) {
      (gen_id = this.state.generation_selected_id),
        (col_id = this.state.collection_selected_id),
        (Type = 1);
    } else if (
      this.state.generation_selected_id == this.state.generation_id &&
      this.state.collection_selected_id != this.state.collection_id
    ) {
      (gen_id = this.state.generation_selected_id),
        (col_id = this.state.collection_selected_id),
        (Type = 2);
    } else if (
      this.state.generation_selected_id != this.state.generation_id &&
      this.state.collection_selected_id != this.state.collection_id
    ) {
      (gen_id = this.state.generation_selected_id),
        (col_id = this.state.collection_selected_id),
        (Type = 3);
    }

    let generation_id = this.props.navigation.getParam('generation_id');
    let collectiont_id = this.props.navigation.getParam('collectiont_id');
    let data_to_send = {
      student_id: this.state.student_id,
      generation_id: gen_id,
      collectiont_id: col_id,
      type: Type,
    };
    let domain = basic.url;

    axios
      .post(domain + `admin/update_student_gen_col.php`, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // console.log(res.data)
          if (res.data == 'success') {
            this.setState({
              visable: false,
              generation_id: gen_id,
              collection_id: col_id,
              type: 0,
            });
            Alert.alert('أدمن', 'تمت العمليه بنجاح');
          } else {
            Alert.alert('أدمن', 'خطأ');
          }
        } else {
          Alert.alert('أدمن', 'حدث شئ خطأ');
        }
        this.setState({ loading_up: false });
      });
  }
  form() {
    return (
      <Form>
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
          onValueChange={this.onValueChange.bind(this)}>
          {/* <Picker.Item label="اختر اسم الدفعه" value="" /> */}
          {this.state.data.map((res) => (
            <Picker.Item
              label={res.generation_name}
              value={res.generation_name}
              id={res.generation_id}
            />
          ))}
        </Picker>
        <Picker
          enabled={this.state.generation_selected_id == 0 ? false : true}
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          placeholder="Gender"
          placeholderStyle={{ color: '#bfc6ea' }}
          placeholderIconColor="#9B9B9B"
          style={{
            width: '100%',
            fontWeight: '500',
            fontSize: 14,
            color: '#333',
            // marginLeft: 5,
            alignSelf: 'center',
          }}
          selectedValue={this.state.collection_selected_value}
          onValueChange={this.onValueChange2.bind(this)}>
          {/* <Picker.Item label="اختر اسم المجموعه" value="" /> */}
          {this.state.data2.map((res) => (
            <Picker.Item
              label={res.collection_name}
              value={res.collection_name}
              id={res.collection_id}
            />
          ))}
        </Picker>
      </Form>
    );
  }
  componentWillUnmount() {
    let testPage = this.props.navigation.getParam('testPage');

    if (testPage == 0) {
      const { state } = this.props.navigation;
      const params = state.params;

      params._refreshPage();
    }
  }

  info = async () => {
    let generation_id = this.props.navigation.getParam('generation_id');
    let student_id = this.props.navigation.getParam('student_id');

    this.setState({ loading: true });
    let data_to_send = {
      generation_id: generation_id,
      student_id: student_id,
    };

    let domain = basic.url;

    axios.post(domain + 'get_profile_info.php', data_to_send).then((res) => {
      if (res.status == 200) {
        this.setState({
          dataa: res.data,
        });
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
        }}>
        <Header style={{ backgroundColor: color }} androidStatusBarColor={color}>
          <Left style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Icon
                name="angle-right"
                size={35}
                style={{ color: '#fff', marginLeft: 10 }}
              />
            </TouchableOpacity>
          </Left>
          <Body
            style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{ fontSize: 22, fontFamily: 'serif' }}>
              الصفحة الشخصية
            </Title>
          </Body>
          <Right />
        </Header>
        <Modal
          visible={this.state.visableChart}
          onRequestClose={() => {
            this.setState({ visableChart: false });
          }}>
          {this.Graph()}
        </Modal>

        {this.state.loading == true ? (
          <Spinner color={color} size={40} style={{ marginTop: 200 }} />
        ) : (
          <ScrollView>
            <View>
              <View
                style={{
                  width: width * 0.9,
                  backgroundColor: 'white',
                  borderRadius: 25,
                  alignSelf: 'center',
                  marginTop: 20,
                  // alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.37,
                  shadowRadius: 7.49,

                  elevation: 12,
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                  }}>
                  <View style={{ marginTop: 10 }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          visable_to_id: true,
                        });
                      }}>
                      <Icon
                        name="user-edit"
                        size={30}
                        style={{ color: '#8A3982', alignSelf: 'center' }}
                      />
                    </TouchableOpacity>
                    <Text>تغيير الاسم</Text>
                  </View>
                  <View style={{ padding: 10, width: '20%' }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          visable: true,
                        });
                      }}>
                      <Image
                        style={{
                          width: 40,
                          height: 40,
                          // marginLeft: 20,
                          // marginRight: 5,
                          // borderRadius: 5,
                        }}
                        source={require('../images/Edit.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity>
                    {/* <Icon name="user" size={50} style={{marginTop: 20}} /> */}
                    <Image
                      style={{
                        width: 100,
                        height: 100,
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 5,
                      }}
                      source={require('../images/AllStudent.png')}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: '600',
                      marginBottom: 5,
                      textAlign: 'center',
                    }}>
                    {this.state.student_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '500',
                      marginVertical: 5,
                    }}>
                    {this.state.generation_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '500',
                      marginVertical: 5,
                    }}>
                    {this.state.collection_name}
                  </Text>

                  {/* <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '500',
                      marginTop: 5,
                      marginBottom: 5,
                    }}>
                    {this.state.dataa.position}
                  </Text> */}

                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '500',
                      // marginTop: 5,
                      marginBottom: 15,
                    }}>
                    {this.state.student_city}
                  </Text>

                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      // marginTop: 5,
                      textAlign: 'center',
                      marginBottom: 15,
                    }}>
                    الإيميل:{' '}
                    <Text
                      onPress={() => {
                        Clipboard.setString(this.state.student_email);
                        ToastAndroid.showWithGravityAndOffset(
                          'تم نسخ البريد الإلكترونى',
                          ToastAndroid.LONG,
                          ToastAndroid.BOTTOM,
                          25,
                          50,
                        );
                      }}
                      style={{
                        color: color,
                        fontWeight: 'bold',
                      }}>
                      {this.state.student_email}
                    </Text>
                  </Text>
                  {/* <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      // marginTop: 5,
                      textAlign: 'center',
                      marginBottom: 15,
                    }}>
                    كلمة المرور:{' '}
                    <Text
                      onPress={() => {
                        Clipboard.setString(this.state.student_password);
                        ToastAndroid.showWithGravityAndOffset(
                          'تم نسخ كلمة المرور',
                          ToastAndroid.LONG,
                          ToastAndroid.BOTTOM,
                          25,
                          50,
                        );
                      }}
                      style={{
                        color: color,
                        fontWeight: 'bold',
                      }}>
                      {this.state.student_password}
                    </Text>
                  </Text> */}

                  {/* <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      // marginTop: 5,
                      textAlign: 'center',
                      marginBottom: 15,
                    }}>
                    نهاية الإشتراك:{' '}
                    <Text
                      style={{
                        color: color,
                        fontWeight: 'bold',
                      }}>
                      {this.state.subscription_end}
                    </Text>
                  </Text> */}

                  {this.state.student_phone == '' ? null : (
                    <View
                      style={{
                        marginBottom: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}>
                      <TouchableOpacity
                        style={{ marginRight: 10 }}
                        onPress={() => {
                          Linking.openURL(
                            'https://wa.me/+2' + this.state.student_phone,
                          );
                        }}>
                        <Icon
                          size={35}
                          name="whatsapp"
                          style={{ color: 'green' }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ marginHorizontal: 5 }}
                        onPress={() => {
                          Linking.openURL('tel:' + this.state.student_phone);
                        }}>
                        <Icon size={30} name="phone" style={{ color: color }} />
                      </TouchableOpacity>
                      <Text style={{ fontSize: 20, fontWeight: '800' }}>
                        {this.state.student_phone}
                      </Text>
                      <Ionicons
                        name="ios-phone-portrait-outline"
                        size={35}
                        style={{ color: color }}
                      />
                    </View>
                  )}
                  {this.state.parent_phone == '' ? null : (
                    <View
                      style={{
                        marginBottom: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}>
                      <TouchableOpacity
                        style={{ marginRight: 10 }}
                        onPress={() => {
                          Linking.openURL(
                            'https://wa.me/+2' + this.state.parent_phone,
                          );
                        }}>
                        <Icon
                          size={35}
                          name="whatsapp"
                          style={{ color: 'green' }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ marginHorizontal: 5 }}
                        onPress={() => {
                          Linking.openURL('tel:' + this.state.parent_phone);
                        }}>
                        <Icon size={30} name="phone" style={{ color: color }} />
                      </TouchableOpacity>
                      <Text style={{ fontSize: 20, fontWeight: '800' }}>
                        {this.state.parent_phone}
                      </Text>
                      <Ionicons
                        name="ios-phone-portrait-outline"
                        size={35}
                        style={{ color: color }}
                      />
                    </View>
                  )}
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <View
                  style={{
                    width: width * 0.4,
                    backgroundColor: 'white',
                    borderRadius: 25,
                    marginTop: 15,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.37,
                    shadowRadius: 7.49,

                    elevation: 12,
                  }}>
                  <Text
                    style={{ fontSize: 20, fontWeight: '600', marginTop: 15 }}>
                    {this.state.dataa.count}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      marginTop: 5,
                      marginBottom: 20,
                    }}>
                    امتحانات منهيه
                  </Text>
                </View>
                <View
                  style={{
                    width: width * 0.4,
                    backgroundColor: 'white',
                    borderRadius: 25,
                    marginTop: 15,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.37,
                    shadowRadius: 7.49,

                    elevation: 12,
                  }}>
                  <Text
                    style={{ fontSize: 20, fontWeight: '600', marginTop: 15 }}>
                    {this.state.dataa.final_score}
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 5 }}>
                    مجموع تراكمى
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <View
                  style={{
                    width: width * 0.27,
                    height: height * 0.12,
                    backgroundColor: '#B82700',
                    borderRadius: 20,
                    marginTop: 15,
                    alignItems: 'center',
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      marginTop: 15,
                      color: 'white',
                    }}>
                    {this.state.dataa.failed_ratio}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      marginTop: 5,
                      color: 'white',
                    }}>
                    رسوب
                  </Text>
                </View>
                <View
                  style={{
                    width: width * 0.27,
                    height: height * 0.12,
                    backgroundColor: color,
                    borderRadius: 25,
                    marginTop: 15,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      marginTop: 15,
                      color: 'white',
                    }}>
                    {this.state.dataa.final_ratio}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      marginTop: 5,
                      color: 'white',
                    }}>
                    متوسط
                  </Text>
                </View>
                <View
                  style={{
                    width: width * 0.27,
                    height: height * 0.12,
                    backgroundColor: '#00B859',
                    borderRadius: 25,
                    marginTop: 15,
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      marginTop: 15,
                      color: 'white',
                    }}>
                    {this.state.dataa.success_ratio}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      marginTop: 5,
                      color: 'white',
                    }}>
                    نجاح
                  </Text>
                </View>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  marginTop: 7,
                }}>
                <Text style={{ color: '#9a9999', textAlign: 'center' }}>
                  ( اضغط مطولا علي اسم الامتحان للإعادة )
                </Text>
              </View>

              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  marginTop: 15,
                  height: height * 0.05,
                  marginBottom: 10,
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
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.37,
                    shadowRadius: 7.49,

                    elevation: 12,
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
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.37,
                    shadowRadius: 7.49,

                    elevation: 12,
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

              {this.state.dataa.exams.slice(0, 5).map((str, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('Seloved_Student_Exam', {
                        exam_quiz_id: str.exam_quiz_id,
                        student_id: str.solved_exam_student_id,
                      });
                    }}
                    onLongPress={() => {
                      this.allert(index, str.exam_name, str.solved_exam_id);
                    }}
                    style={{
                      width: '90%',
                      flexDirection: 'row',
                      backgroundColor: 'white',
                      alignSelf: 'center',
                      marginVertical: 5,
                      padding: 10,
                      borderRadius: 20,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 6,
                      },
                      shadowOpacity: 0.37,
                      shadowRadius: 7.49,

                      elevation: 12,
                      // width: '90%',
                      // flexDirection: 'row',
                      // marginTop: 5,
                      // height: height * 0.05,
                      // marginBottom: 5,
                      // alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1.6,
                        borderRightWidth: 2,
                        borderRightColor: 'black',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 16,
                          // fontWeight: '500',
                        }}>
                        {str.exam_name}
                        {/* {alert(JSON.stringify(str))} */}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 0.5,
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
                );
              })}
              {this.state.dataa.exams_count >= 5 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    width: '50%',
                    alignSelf: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('SeeMore', {
                        generation_id: this.state.generation_id,
                        student_id: this.state.student_id,
                      });
                    }}
                    style={{ width: '100%' }}>
                    <View
                      style={{
                        width: '100%',
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        backgroundColor: 'gray',
                        alignSelf: 'center',
                        borderRadius: 20,
                        marginBottom: 20,
                        marginTop: 20,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 4,
                        },
                        shadowOpacity: 0.32,
                        shadowRadius: 5.46,

                        // elevation: 9,
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#FFFFFF',
                          fontWeight: 'bold',
                          fontFamily: 'Metropolis',
                          fontStyle: 'normal',
                        }}>
                        اضغط للمزيد ..
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View />
              )}
            </View>

            {/* <TouchableOpacity
              disabled={this.state.endSubLoading}
              style={{
                backgroundColor: color,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                width: '90%',
                height: 40,
                marginTop: 30,
                // marginBottom: 10,
              }}
              onPress={() => {
                this.allertStudentendSub();
              }}>
              {this.state.endSubLoading ? (
                <ActivityIndicator color={'#fff'} size={19} />
              ) : (
                <Text
                  style={{
                    color: '#FFF',
                    fontFamily: 'Janna LT Bold',
                    fontSize: 18,
                  }}>
                  إنهاء الإشتراك لهذا الطالب
                </Text>
              )}
            </TouchableOpacity> */}
            <TouchableOpacity
              disabled={this.state.checkLogoutLoading}
              style={{
                backgroundColor: color,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                width: '90%',
                height: 40,
                // marginTop: 30,
                marginVertical: 10,
              }}
              onPress={() => {
                this.allertStudentLogOut();
              }}>
              {this.state.checkLogoutLoading ? (
                <ActivityIndicator color={'#fff'} size={19} />
              ) : (
                <Text
                  style={{
                    color: '#FFF',
                    fontFamily: 'Janna LT Bold',
                    fontSize: 18,
                  }}>
                  تسجيل خروج لهذا الطالب
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}

        {!this.state.visable ? (
          <></>
        ) : (
          <View
            style={{
              width: width,
              height: height - 10,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 56,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                width: width * 0.9,
                // height: height * 0.25,
                backgroundColor: '#fff',
                borderRadius: 25,
                alignSelf: 'center',
                // marginTop: 15,
                // alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.37,
                shadowRadius: 7.49,
                elevation: 12,
              }}>
              <View style={{ padding: 10 }}>
                <TouchableOpacity
                  style={{ width: '10%', marginLeft: 5 }}
                  onPress={() => {
                    this.setState({
                      visable: false,
                    });
                  }}>
                  <Icon name="times" size={30} />
                </TouchableOpacity>
              </View>
              <View style={{ width: '90%' }}>{this.form()}</View>

              <TouchableOpacity
                onPress={() => {
                  this.update();
                }}
                style={{ width: '40%', alignSelf: 'center' }}
                disabled={this.state.loading_up}>
                <View
                  style={{
                    width: '95%',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: '#00B859',
                    // alignSelf: 'center',
                    borderRadius: 5,
                    marginBottom: 20,
                    marginTop: 20,
                    // shadowColor: '#000',
                    // shadwOffset: {
                    //   width: 0,
                    //   height: 4,o
                    // },
                    // shadowOpacity: 0.32,
                    // shadowRadius: 5.46,
                    // alignSelf: 'center',
                    // elevation: 9,
                  }}>
                  {this.state.loading_up ? (
                    <Spinner
                      color="#fff"
                      size={26}
                      style={{
                        alignSelf: 'center',
                        padding: 0,
                        marginTop: 0,
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        fontFamily: 'Metropolis',
                        fontStyle: 'normal',
                      }}>
                      تعديل
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {
          // <Modal visible={false}>
          //   <Container
          //     style={{
          //       width: '100%',
          //       height: '100%',
          //       backgroundColor: '#EAEAEA',
          //       justifyContent: 'center',
          //     }}>
          //     <View>
          //       <View
          //         style={{
          //           width: width * 0.95,
          //           height: height * 0.25,
          //           backgroundColor: '#AAAAAA',
          //           borderRadius: 25,
          //           alignSelf: 'center',
          //           marginTop: 15,
          //           // alignItems: 'center',
          //           shadowColor: '#000',
          //           shadowOffset: {
          //             width: 0,
          //             height: 6,
          //           },
          //           shadowOpacity: 0.37,
          //           shadowRadius: 7.49,
          //           elevation: 12,
          //         }}>
          //         <View style={{ padding: 10 }}>
          //           <TouchableOpacity
          //             onPress={() => {
          //               this.setState({
          //                 visable: false,
          //               });
          //             }}>
          //             <Icon name="times" size={30} />
          //           </TouchableOpacity>
          //         </View>
          //         <View style={{ width: '90%' }}>{this.form()}</View>
          //       </View>
          //     </View>
          //   </Container>
          // </Modal>
        }

        <Modal
          visible={this.state.visable_to_id}
          onRequestClose={() => {
            this.setState({
              visable_to_id: false,
            });
          }}
          animationType="slide"
          transparent={true}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                width: width * 0.9,
                // height: height * 0.25,
                backgroundColor: '#fff',
                borderRadius: 25,
                alignSelf: 'center',
                // marginTop: 15,
                // alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.37,
                shadowRadius: 7.49,
                elevation: 12,
              }}>
              <View style={{ padding: 10 }}>
                <TouchableOpacity
                  style={{ width: '10%', marginLeft: 5 }}
                  onPress={() => {
                    this.setState({
                      visable_to_id: false,
                    });
                  }}>
                  <Icon name="times" size={30} />
                </TouchableOpacity>
              </View>

              <TextInput
                mode="outlined"
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  backgroundColor: '#f7f7f7',
                  color: '#000',
                }}
                placeholder="تغيير الاسم"
                label="تغيير الاسم"
                placeholderTextColor="#333"
                value={this.state.newName}
                onChangeText={(value) => {
                  this.setState({
                    newName: value,
                    // loading_up:true
                    // loading:true
                  });
                }}
                theme={{
                  colors: {
                    text: '#000',
                    background: '#f5fcff',
                    primary: color,
                    underlineColor: 'transparent',
                  },
                }}
              />
              <Text
                style={{ alignSelf: 'center', color: 'red', fontWeight: 'bold' }}>
                {this.state.name_error}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  if (this.state.newName.length >= 3) {
                    this.update_name();
                    this.info();
                  } else {
                    this.setState({ name_error: 'الرجاء إدخال الاسم صحيحاً' });
                  }
                }}
                style={{ width: '40%', alignSelf: 'center' }}
                disabled={this.state.loading_up}>
                <View
                  style={{
                    width: '95%',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: '#00B859',
                    // alignSelf: 'center',
                    borderRadius: 5,
                    marginBottom: 20,
                    marginTop: 15,
                    // shadowColor: '#000',
                    // shadowOffset: {
                    //   width: 0,
                    //   height: 4,
                    // },
                    // shadowOpacity: 0.32,
                    // shadowRadius: 5.46,
                    // alignSelf: 'center',
                    // elevation: 9,
                  }}>
                  {this.state.loading_up ? (
                    <Spinner
                      color="#fff"
                      size={26}
                      style={{
                        alignSelf: 'center',
                        padding: 0,
                        marginTop: 0,
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        fontFamily: 'Metropolis',
                        fontStyle: 'normal',
                      }}>
                      تعديل
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}
