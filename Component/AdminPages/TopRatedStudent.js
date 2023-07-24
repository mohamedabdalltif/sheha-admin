import * as React from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  AsyncStorage,
} from 'react-native';
import {color} from '../color';
import NetInfo from '@react-native-community/netinfo';
import basic from './BasicURL';
import Axios from 'axios';
import {images} from '../../constants';

export default class TopRatedStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoading: true,
      connectionStatus: true,
      AllData: this.props.navigation.getParam('AllData'),

      studentsData: [],
    };
  }
  componentDidMount() {
    const unsubscribe = NetInfo.addEventListener((state) => {
      this.setState({
        connectionStatus: state.isConnected,
      });
      if (state.isConnected) {
        this.getTopStudents();
      }
    });
  }
  async getTopStudents() {
    let dataToSend = {
      generation_id: this.state.AllData.generation_id,
    };

    let domain = basic.url;

    Axios.post(domain + 'challenge/select_first_winners.php', dataToSend)
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data);
          if (Array.isArray(res.data)) {
            this.setState({
              studentsData: res.data,
            });
          } else {
            this.setState({
              studentsData: [],
            });
          }
        } else {
          this.setState({
            studentsData: [],
          });
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
          pageLoading: false,
        });
      });
  }
  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.connectionStatus == false &&
        this.state.studentsData.length == 0 ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>
              الرجاء التأكد من اتصالك بالإنترنت
            </Text>
          </View>
        ) : this.state.pageLoading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={50} color="#000" />
          </View>
        ) : (
          <FlatList
            removeClippedSubviews={true}
            data={this.state.studentsData}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            ListHeaderComponent={() => (
              <View
                style={{
                  width: '100%',
                  backgroundColor: color,
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#fff', fontSize: 24, fontWeight: 'bold'}}>
                  الطلاب الأعلى تقيماً
                </Text>
              </View>
            )}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    paddingTop: '70%',
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 24,
                      textAlign: 'center',
                    }}>
                    لايوجد طلاب
                  </Text>
                </View>
              );
            }}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('UpdateProfile', {
                      student_name: item.student_name,
                      subscription_end: item.subscription_end,
                      student_email: item.student_email,
                      student_password: item.student_password,
                      generation_name: item.generation_name,
                      collection_name: item.collection_name,
                      generation_id: item.student_generation_id,
                      collection_id: item.student_collection_id,
                      student_id: item.student_id,
                      student_phone: item.student_phone,
                      parent_phone: item.parent_phone,
                      view_count: item.view_count,
                      student_city: item.student_city,
                      testPage: '1',
                    });
                  }}
                  style={{
                    width: '95%',
                    alignSelf: 'center',
                    backgroundColor: '#fff',
                    elevation: 5,
                    marginVertical: 10,
                    borderRadius: 10,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    padding: 8,
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50 / 2,
                      backgroundColor: color,
                      marginRight: 7,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-start'}}>
                    <Text style={{fontWeight: '700', fontSize: 18}}>
                      {item.student_name}
                    </Text>

                    <Text style={{fontWeight: '700', fontSize: 18}}>
                      عدد النقاط: {item.student_points}
                    </Text>
                  </View>
                  {index == 0 ? (
                    <Image
                      source={images.Rank1}
                      style={{
                        width: 50,
                        height: 50,
                      }}
                    />
                  ) : index == 1 ? (
                    <Image
                      source={images.Rank2}
                      style={{
                        width: 50,
                        height: 50,
                      }}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    );
  }
}
