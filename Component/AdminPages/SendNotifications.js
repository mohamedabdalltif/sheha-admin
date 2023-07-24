import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  AsyncStorage,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import basic from './BasicURL';
import {color} from '../color';
import Axios from 'axios';
export default class SendNotifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conectionStatus: true,
      notificationTxt: '',
      requestLoading: false,
    };
  }

  componentDidMount() {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      this.setState({
        conectionStatus: state.isConnected,
      });
    });
  }
  async sendNotification() {
    let noticTxt = this.state.notificationTxt.trim();
    if (noticTxt != '') {
      this.setState({
        requestLoading: true,
      });
      let data_to_send = {
        notificationText: noticTxt,
        generation_id: this.props.navigation.getParam('generation_id'),
        collection_id: this.props.navigation.getParam('collection_id'),
      };

      let domain = basic.url;

      Axios.post(domain + 'admin/send_notification.php', data_to_send)
        .then((res) => {
          console.log(res.data);
          if (res.data == 'success') {
            ToastAndroid.showWithGravityAndOffset(
              'قد تم إرسال الإشعار بنجاح',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'حدث خطأ ما الرجاء المحاولة لاحقا',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          }
        })
        .finally(() => {
          this.setState({
            requestLoading: false,
            notificationTxt: '',
          });
        });
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء كتابة محتوى الإشعار',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
                <FontAwesome5
                  name="angle-right"
                  style={{fontSize: 35, color: '#fff', marginRight: 20}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
              <Text
                style={{color: '#F5FCFF', fontSize: 20, fontWeight: 'bold'}}>
                الإشعارات
              </Text>
            </View>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity>
                {/* <Text style={{fontWeight:'bold',textDecorationLine:'underline',color:'#fff'}} >أخر أمتحان</Text> */}
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{margin: 16, fontSize: 19, fontWeight: 'bold'}}>
            {basic.appName}
          </Text>
          <TextInput
            autoFocus={true}
            theme={{
              colors: {
                primary: color,
                underlineColor: 'transparent',
              },
            }}
            value={this.state.notificationTxt}
            label={'نص الإشعار'}
            multiline={true}
            autoCapitalize={'none'}
            onChangeText={(text) => {
              this.setState({
                notificationTxt: text,
              });
            }}
            autoCorrect={false}
            style={{
              width: '90%',
              alignSelf: 'center',
              marginBottom: '5%',
            }}
          />
          <TouchableOpacity
            disabled={this.state.requestLoading}
            onPress={() => {
              if (this.state.conectionStatus) {
                this.sendNotification();
              } else {
                ToastAndroid.showWithGravityAndOffset(
                  'الرجاء التأكد من اتصالك بالإنترنت',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
              }
            }}
            style={{
              width: '90%',
              padding: 7,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: color,
              borderRadius: 8,
              alignSelf: 'center',
            }}>
            {this.state.requestLoading == false ? (
              <Text style={{fontWeight: 'bold', fontSize: 24, color: '#fff'}}>
                إرسال
              </Text>
            ) : (
              <ActivityIndicator size={30} color="#fff" />
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
