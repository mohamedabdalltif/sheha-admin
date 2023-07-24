import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Axios from 'axios';

import {IconButton, TextInput, Button} from 'react-native-paper';
import {color} from '../color';
import basic from './BasicURL';

const DataSection = ({title, data}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
        borderBottomWidth: 0.5,
        borderBottomColor: 'black',
      }}>
      <Text style={{fontWeight: 'bold', color: '#000000'}}>{title}</Text>
      <Text
        style={{fontWeight: '700', color: 'gray', flex: 1, textAlign: 'right'}}>
        {data}
      </Text>
    </View>
  );
};
const CardsInquiries = ({navigation}) => {
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyCodeLoading, setVerifyCodeLoading] = useState(false);

  const [chargeCode, setChargeCode] = useState('');
  const [chargeCodeLoading, setChargeCodeLoading] = useState(false);

  const [showDataModal, setShowDataModal] = useState(false);
  const [studentData, setStudentData] = useState({});

  const [showWarnModal, setShowWarnModal] = useState(false);
  const [wornMsg, setWornMsg] = useState('');
  const [sub, setSub] = useState('');

  //   funs

  useEffect(() => {
    getSub();
  }, []);
  const getSub = async () => {
    let type = JSON.parse(await AsyncStorage.getItem('type'));
    setSub(type);
  };
  const _checkCode = async (whichLoad) => {
    if (whichLoad == 'charge') {
      setChargeCodeLoading(true);
    } else {
      setVerifyCodeLoading(true);
    }
    let domain = basic.url;

    let data_to_send = {
      type: whichLoad == 'charge' ? 'charge' : 'verifi',
      card_code:
        whichLoad == 'charge'
          ? chargeCode.replace(/\s/g, '')
          : verifyCode.replace(/\s/g, ''),
    };

    Axios.post(domain + 'admin/cards_info.php', data_to_send)
      .then((res) => {
        console.log(res.data);
        if (res.status == 200) {
          if (typeof res.data === 'object') {
            setStudentData(res.data);
            setShowDataModal(true);
          } else if (
            res.data == 'not_used_yet' ||
            res.data == 'card_not_found' ||
            res.data == 'error'
          ) {
            setWornMsg(res.data);
            setShowWarnModal(true);
          } else {
            Alert.alert('أدمن', 'هناك خطأ اعد المحاوله لاحقا.');
          }
        } else {
          Alert.alert('أدمن', 'هناك خطأ اعد المحاوله لاحقا');
        }
      })
      .finally(() => {
        setVerifyCodeLoading(false);
        setChargeCodeLoading(false);
      });
  };

  // components
  function renderHeader() {
    return (
      <>
        <View
          style={{
            ...styles.headerContainer,
            marginHorizontal: 10,
          }}>
          <IconButton
            size={24}
            icon={() => (
              <Ionicons name="arrow-forward" size={30} color={'#000'} />
            )}
            onPress={() => navigation.goBack()}
          />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: 4,
              textAlign: 'left',
              fontWeight: '800',
              fontSize: 22,
              flex: 1,
            }}>
            إستعلامات الكروت
          </Text>
        </View>
      </>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 10,
      }}>
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            //   alignItems: 'center',
            marginTop: 20,
            justifyContent: 'center',
          }}>
          {sub == 1 && (
            <View
              style={{
                backgroundColor: 'darkgray',
                borderRadius: 10,
                padding: 20,
                marginBottom: 30,
              }}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>
                كروت تأكيد دخول التطبيق
              </Text>
              <TextInput
                value={verifyCode}
                onChangeText={(e) => {
                  setVerifyCode(
                    e
                      .replace(/\s/g, '')
                      .replace(/(\d{4})/g, '$1 ')
                      .trim(),
                  );
                }}
                // keyboardType="number-pad"
                label="أدخل الكود"
                left={
                  <TextInput.Icon
                    color={color}
                    name={() => (
                      <FontAwesome5 color={color} name="shield-alt" size={30} />
                    )}
                  />
                }
                theme={{
                  colors: {
                    primary: color,
                    underlineColor: 'transparent',
                  },
                }}
                mode="outlined"
              />
              <Button
                loading={verifyCodeLoading}
                color="#3a86ff"
                mode="contained"
                style={{
                  marginTop: 20,
                  //   height: 50,
                  // height:RFValue(40)
                }}
                labelStyle={{fontSize: 22, fontWeight: '800'}}
                onPress={() => {
                  _checkCode('verify');
                }}>
                استعلام
              </Button>
            </View>
          )}

          <View
            style={{
              backgroundColor: 'darkgray',
              borderRadius: 10,
              padding: 20,
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>كروت الحصص</Text>
            <TextInput
              value={chargeCode}
              onChangeText={(e) => {
                setChargeCode(
                  e
                    .replace(/\s/g, '')
                    .replace(/(\d{4})/g, '$1 ')
                    .trim(),
                );
              }}
              // keyboardType="number-pad"
              label="أدخل الكود"
              left={
                <TextInput.Icon
                  color={color}
                  name={() => (
                    <FontAwesome5 color={color} name="shield-alt" size={30} />
                  )}
                />
              }
              theme={{
                colors: {
                  primary: color,
                  underlineColor: 'transparent',
                },
              }}
              mode="outlined"
            />
            <Button
              loading={chargeCodeLoading}
              color="#3a86ff"
              mode="contained"
              style={{
                marginTop: 20,
                //   height: 50,
                // height:RFValue(40)
              }}
              labelStyle={{fontSize: 22, fontWeight: '800'}}
              onPress={() => {
                _checkCode('charge');
              }}>
              استعلام
            </Button>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showDataModal}
        transparent={true}
        onRequestClose={() => {
          setShowDataModal(false);
        }}
        animationType="slide">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <TouchableOpacity
            style={{...StyleSheet.absoluteFillObject}}
            onPress={() => {
              setShowDataModal(false);
            }}></TouchableOpacity>

          <View
            style={{
              width: '90%',
              borderRadius: 10,
              backgroundColor: '#ffffff',
              padding: 10,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <DataSection
                title={'رقم الكرت'}
                data={studentData?.card_info?.card_code}
              />
              <DataSection
                title={'تاريخ الشحن'}
                data={studentData?.card_info?.card_used_date}
              />
              <DataSection
                title={'تاريخ الإنتهاء'}
                data={studentData?.card_info?.card_end_date}
              />
              <DataSection
                title={'إسم المجموعة'}
                data={studentData?.collection_name}
              />
              <DataSection
                title={'إسم الطالب'}
                data={studentData?.student_info?.student_name}
              />
              <DataSection
                title={'رقم هاتف ولى الامر'}
                data={studentData?.student_info?.parent_phone}
              />
              <DataSection
                title={'رقم هاتف الطالب'}
                data={studentData?.student_info?.student_phone}
              />
              <DataSection
                title={'بريد الطالب'}
                data={studentData?.student_info?.student_email}
              />
              <DataSection
                title={'بداية الإشتراك'}
                data={studentData?.student_info?.subscription_start}
              />
              <DataSection
                title={'نهاية الإشتراك'}
                data={studentData?.student_info?.subscription_end}
              />

              <Button
                mode="contained"
                color={'#DA291C'}
                onPress={() => {
                  setShowDataModal(false);
                }}
                labelStyle={{fontWeight: 'bold', fontSize: 19}}>
                إغلاق
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showWarnModal}
        transparent={true}
        onRequestClose={() => {
          setShowWarnModal(false);
        }}
        animationType="slide">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <TouchableOpacity
            style={{...StyleSheet.absoluteFillObject}}
            onPress={() => {
              setShowWarnModal(false);
            }}></TouchableOpacity>

          <View
            style={{
              width: '90%',
              borderRadius: 10,
              backgroundColor: '#ffffff',
              padding: 10,
            }}>
            <Text
              style={{fontWeight: 'bold', fontSize: 19, marginVertical: 20}}>
              {wornMsg == 'not_used_yet'
                ? 'لم يُستخدم هذا الكارت بعد'
                : wornMsg == 'card_not_found'
                ? 'هذا الكارت غير موجود'
                : 'حدث خطأ ما برجاء المحاولة لاحقا'}
            </Text>
            <Button
              mode="contained"
              color={'#DA291C'}
              onPress={() => {
                setShowWarnModal(false);
              }}
              labelStyle={{fontWeight: 'bold', fontSize: 19}}>
              إغلاق
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent:"space-between",
    borderRadius: 8,
    backgroundColor: '#F5F5F8',
    paddingHorizontal: 10,
  },
});

export default CardsInquiries;
