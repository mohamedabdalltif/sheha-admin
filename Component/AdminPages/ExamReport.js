import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  FlatList,
  ScrollView,
  AsyncStorage,
  Linking,
} from 'react-native';
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
import axios from 'axios';
import basic from './BasicURL';
import {color} from '../color';
import Ionicons from 'react-native-vector-icons/Ionicons';

// import {
//   LineChart,
//   BarChart,
//   PieChart,
//   ProgressChart,
//   ContributionGraph,
//   StackedBarChart,
// } from 'react-native-chart-kit';

const {width, height} = Dimensions.get('window');

export default class ExamReport extends React.Component {
  //constructor

  constructor(props) {
    super(props);

    this.state = {
      generation_id: 1,
      exam_id: 'Exam_1',
      info: {
        failed_ratio: '',
        first_name: '',
        max_score: '',
        sloved_count: '',
        student_count: '',
        success_ratio: '',
        unsloved_count: '',
      },
      loading: true,
      exam_name: '',
    };
  }

  componentDidMount() {
    this.get_quiz_info();
  }

  async get_quiz_info() {
    let exam_name = this.props.navigation.getParam('exam_name');
    let exam_id = this.props.navigation.getParam('exam_id');
    let generation_id = this.props.navigation.getParam('generation_id');
    let test_id = this.props.navigation.getParam('test_id');
    let send_collection_id = this.props.navigation.getParam('collection_id');

    this.setState({
      exam_name: exam_name,
    });
    let domain = basic.url;

    this.setState({loading: true});
    let data_to_send = {
      generation_id: generation_id,
      exam_id: test_id == 1 ? 'Exam_' + exam_id : 'Quiz_' + exam_id,
      collection_id: send_collection_id,
    };
    // console.log(data_to_send)
    axios
      .post(domain + `admin/select_exam_info.php`, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data);
          if (res.data != 'error') {
            this.setState({
              info: res.data,
            });
            // console.log(this.state.info);
          } else {
            Alert.alert('دروسي', 'خطأ');
          }
        } else {
          Alert.alert('دروسي', 'حدث شئ خطأ');
        }
        this.setState({loading: false});
      });
  }
  downloadStatistic = async () => {
    let domain = basic.url;

    let exam_id = this.props.navigation.getParam('exam_id');
    let generation_id = this.props.navigation.getParam('generation_id');

    let data_to_send = {
      exam_id,
      generation_id,
    };
    // console.log(data_to_send);
    // console.log(domain + 'reports_data/exam_reports_xlsx.php');

    axios
      .post(domain + 'reports_data/exam_reports_xlsx.php', data_to_send)
      .then((res) => {
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
  render() {
    return (
      <Container style={{backgroundColor: '#f7f7f7'}}>
        <Header style={{backgroundColor: color}} androidStatusBarColor={color}>
          <Left style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Icon
                name="angle-right"
                style={{fontSize: 26, color: '#fff', marginLeft: 10}}
              />
            </TouchableOpacity>
          </Left>
          <Body
            style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
            <Title style={{fontSize: 18, fontFamily: 'serif'}}>
              {this.state.exam_name}
            </Title>
          </Body>
          <Right style={{flex: 1}}>
            <TouchableOpacity
              disabled={this.state.loading}
              onPress={async () => {
                this.downloadStatistic();
              }}>
              <Ionicons name="md-stats-chart" size={30} color="#fff" />
            </TouchableOpacity>
          </Right>
        </Header>
        {this.state.loading == true ? (
          <Spinner color={color} size={40} style={{marginTop: 200}} />
        ) : (
          <ScrollView>
            <View
              style={{
                padding: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: 'white',
                    borderRadius: 10,
                    marginTop: 5,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.37,
                    shadowRadius: 7.49,
                    paddingHorizontal: 10,
                    paddingVertical: 20,
                    elevation: 12,
                  }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '600',
                      marginBottom: 15,
                      color: '#000',
                      textAlign: 'center',
                    }}>
                    {this.state.info.student_count}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '400',
                      // marginBottom:5,
                      color: '#555',
                      textAlign: 'center',
                    }}>
                    عدد الطلاب المتاح لهم الامتحان
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                  // flexWrap:"wrap"
                }}>
                <View
                  style={{
                    width: '45%',
                    backgroundColor: 'white',
                    borderRadius: 10,
                    marginTop: 5,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.37,
                    shadowRadius: 7.49,
                    padding: 10,
                    elevation: 12,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '600',
                      marginBottom: 10,
                      color: '#000',
                      textAlign: 'center',
                    }}>
                    {this.state.info.sloved_count}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '400',
                      // marginBottom:5,
                      color: '#555',
                      textAlign: 'center',
                    }}>
                    عدد من حل الامتحان
                  </Text>
                </View>

                <View
                  style={{
                    width: '45%',
                    backgroundColor: 'white',
                    borderRadius: 10,
                    marginTop: 5,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.37,
                    shadowRadius: 7.49,
                    padding: 10,
                    elevation: 12,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '600',
                      marginBottom: 10,
                      color: '#000',
                      textAlign: 'center',
                    }}>
                    {this.state.info.unsloved_count}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '400',
                      // marginBottom:5,
                      color: '#555',
                      textAlign: 'center',
                    }}>
                    عدد من لم يحل الامتحان
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}>
                <View
                  style={{
                    width: '45%',
                    backgroundColor: '#51c74a',
                    borderRadius: 10,
                    marginTop: 5,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.37,
                    shadowRadius: 7.49,
                    padding: 10,
                    elevation: 12,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '600',
                      marginBottom: 10,
                      color: '#fff',
                      textAlign: 'center',
                    }}>
                    {this.state.info.success_ratio}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '400',
                      // marginBottom:5,
                      color: '#fff',
                      textAlign: 'center',
                    }}>
                    نسبة النجاح
                  </Text>
                </View>

                <View
                  style={{
                    width: '45%',
                    backgroundColor: '#f85959',
                    borderRadius: 10,
                    marginTop: 5,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.37,
                    shadowRadius: 7.49,
                    padding: 10,
                    elevation: 12,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '600',
                      marginBottom: 10,
                      color: '#fff',
                      textAlign: 'center',
                    }}>
                    {this.state.info.failed_ratio}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '400',
                      // marginBottom:5,
                      color: '#fff',
                      textAlign: 'center',
                    }}>
                    نسبة الرسوب
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // marginBottom: 20,
                }}>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: 'white',
                    borderRadius: 10,
                    marginTop: 5,
                    // alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.37,
                    shadowRadius: 7.49,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    elevation: 12,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '400',
                      marginBottom: 20,
                      color: '#555',
                      // textAlign:'center',
                    }}>
                    أعلي نتيجه سجلت :{' '}
                  </Text>
                  <View style={{alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '600',
                        marginBottom: 10,
                        color: '#000',
                        textAlign: 'center',
                      }}>
                      {this.state.info.max_score}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '400',
                      marginBottom: 20,
                      color: '#555',
                      // textAlign:'center',
                    }}>
                    عدد من سجلها :{' '}
                  </Text>
                  <View style={{alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '400',
                        marginBottom: 15,
                        color: '#555',
                        textAlign: 'center',
                      }}>
                      {this.state.info.first_name}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
                  width={Dimensions.get('window').width - 30} // from react-native
                  height={220}
                  // yAxisLabel="$"
                  // yAxisSuffix="k"
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor: '#8A3982',
                    backgroundGradientFrom: '#8A3982',
                    backgroundGradientTo: '#000',
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
                  width={Dimensions.get('window').width - 30} // from react-native
                  height={220}
                  // yAxisLabel="$"
                  // yAxisSuffix="k"
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor: '#8A3982',
                    backgroundGradientFrom: '#000',
                    backgroundGradientTo: '#8A3982',
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
              </View> */}
          </ScrollView>
        )}
      </Container>
    );
  }
}
