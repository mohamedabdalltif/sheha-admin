import Axios from 'axios';
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ToastAndroid,
  Modal,
  BackHandler,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {ActivityIndicator, Button, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {icons} from '../../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Accountspart, COLORS, FONTS, SIZES} from '../../constants';
import {Header, IconButton} from './components';
import * as Animatable from 'react-native-animatable';
import {UsersContext} from '../../../context/UsersContext';
import moment from 'moment/moment';
const StudentAccount = ({navigation}) => {
  const {adminData} = useContext(UsersContext);

  const [selectSubHis, setSelectSubHis] = useState('0');
  const [studentData, setStudentData] = useState({});
  const [selectSub, setSelectSub] = useState('0'); // 0->ph , 1->ch , 2->both
  const [theAmount, setTheAmount] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [freeLoading, setFreeLoading] = useState(false);
  const [successData, setSuccessData] = useState({});
  const [visableSuccessPay, setVisableSuccessPay] = useState(false);
  //
  const [sHistoryLoading, setSHistoryLoading] = useState(true);
  const [sHistoryData, setSHistoryData] = useState({});
  const [disablePh, setDisablePh] = useState(false);
  const [disableCh, setDisableCh] = useState(false);
  const [disableBoth, setDisableBoth] = useState(false);
  const [selMonth, setSelMonth] = useState('');

  useEffect(() => {
    setSelMonth(moment().lang('en').format('YYYY-MM'));
    setStudentData(navigation.getParam('sData'));
    getStudentHistory();
  }, []);
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const getStudentHistory = () => {
    let data_to_send = {
      user_id: navigation.getParam('sData').student_id,
      col: navigation.getParam('sData').student_collection_id,
    };
    Axios.post(Accountspart.domain + 'scan_user.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          let resData = res.data;
          if (resData.status == 'success') {
            if (typeof resData.body === 'object') {
              console.log(resData.body);
              setSHistoryData(resData.body);
            } else {
              Toast('تاريخ اشتراكات الطالب غير صالح للعرض');
            }
          } else {
            Toast('تاريخ اشتراكات الطالب غير صالح للعرض.');
          }
        } else {
          Toast('حدث خطأ برجاء المحاولة لاحقا');
        }
      })
      .finally(() => {
        setSHistoryLoading(false);
      });
  };

  const req_pay_student = async (isFree) => {
    if (isFree) {
      setFreeLoading(true);
    } else {
      setPayLoading(true);
    }

    let adminData = JSON.parse(await AsyncStorage.getItem('saveAdmin'));
    let data_to_send = {
      student_id: studentData.student_id,
      admin_id: adminData.finance_user_id,
      money: isFree ? 'free' : theAmount,
      col: studentData.student_collection_id,
      gen: studentData.student_generation_id,
      month: selMonth,
    };

    Axios.post(Accountspart.domain + 'new_pay_to_month.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          let resData = res.data;
          if (resData.status == 'success') {
            storePaidMoney(resData.body.paid);
            setSuccessData(resData.body);
            getStudentHistory();
            setVisableSuccessPay(true);
          } else if (resData.status == 'wrong') {
            if (resData.body == 'already_paid') {
              Toast('تم دفع المادة بالفعل');
            }
          } else {
            Toast('حدث خطأ برجاء المحاولة لاحقا..');
          }
        } else {
          Toast('حدث خطأ برجاء المحاولة لاحقا.');
        }
      })
      .finally(() => {
        setPayLoading(false);
        setFreeLoading(false);
      });
  };

  const storePaidMoney = async (money) => {
    let total = 0;
    let storedMoney = await AsyncStorage.getItem('storedMoney');
    if (storedMoney != null && storedMoney != undefined) {
      total = parseFloat(storedMoney) + parseFloat(money);
    } else {
      total = parseFloat(money);
    }
    await AsyncStorage.setItem('storedMoney', JSON.stringify(total));
  };
  const Toast = (msg) => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  function renderHeader() {
    return (
      <Header
        title={studentData?.student_name}
        containerStyle={{
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 25,
        }}
        titleStyle={{
          ...FONTS.h3,
        }}
        leftComponent={
          <IconButton
            icon={icons.back}
            containerStyle={{
              width: 40,
              transform: [{rotate: '180deg'}],
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: SIZES.radius,
              borderColor: COLORS.black,
            }}
            iconStyle={{
              width: 20,
              height: 20,
              tintColor: COLORS.black,
            }}
            onPress={() => navigation.goBack()}
          />
        }
        rightComponent={<View style={{width: 40}} />}
      />
    );
  }

  function renderBody() {
    return (
      <View
        style={{
          marginTop: SIZES.radius,
          paddingHorizontal: 22,
          paddingBottom: SIZES.padding * 2,
          flexWrap: 'wrap',
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginVertical: RFValue(20),
          }}>
          <Button
            disabled={disablePh}
            onPress={() => {
              setSelectSub('0');
            }}
            mode="contained"
            style={{
              width: '48%',
            }}
            labelStyle={{
              ...FONTS.h3,
              color: selectSub == '0' ? COLORS.white : COLORS.black,
            }}
            color={selectSub == '0' ? COLORS.primary : COLORS.lightGray2}>
            {Accountspart.subName}
          </Button>
        </View>
        <Text
          style={{
            ...FONTS.h2,
          }}>
          أدخل المبلغ
        </Text>

        <TextInput
          value={theAmount}
          onChangeText={(val) => {
            setTheAmount(val.trim());
          }}
          keyboardType="number-pad"
          mode="outlined"
          theme={{
            colors: {
              primary: COLORS.primary,
            },
          }}
          placeholder="المبلغ"
          label="المبلغ"
          style={{
            // alignSelf: 'center',
            width: '100%',
          }}
        />

        <Button
          loading={payLoading}
          disabled={payLoading || freeLoading}
          onPress={() => {
            req_pay_student(false);
          }}
          mode="contained"
          style={{
            width: '100%',
            marginVertical: RFValue(20),
          }}
          labelStyle={{
            ...FONTS.h3,
          }}
          color={COLORS.primary}>
          تأكيد
        </Button>

        <Button
          loading={freeLoading}
          disabled={freeLoading || payLoading}
          onPress={() => {
            req_pay_student(true);
          }}
          mode="contained"
          style={{
            width: '100%',
            // marginVertical: RFValue(20),
          }}
          labelStyle={{
            ...FONTS.h3,
          }}
          color={COLORS.primary}>
          إعفاء
        </Button>
      </View>
    );
  }

  function renderStudentSubHistory() {
    return (
      <View
        style={{
          // marginTop: SIZES.radius,
          // paddingHorizontal: 22,
          paddingBottom: SIZES.padding * 2,
          // flexWrap: 'wrap',
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-around',
            // marginVertical: RFValue(20),
          }}>
          <Button
            onPress={() => {
              setSelectSubHis('0');
            }}
            mode="contained"
            style={{
              width: '88%',
            }}
            labelStyle={{
              ...FONTS.h3,
              color: selectSubHis == '0' ? COLORS.white : COLORS.black,
              width: '100%',
              //   flex: 1,
            }}
            color={selectSubHis == '0' ? COLORS.primary : COLORS.lightGray2}>
            {Accountspart.subName} {`\n${sHistoryData?.phy_collection_name}`}
          </Button>
        </View>

        <FlatList
          data={sHistoryData?.phy_months}
          keyExtractor={(item, index) => `studentHistory-${index}`}
          contentContainerStyle={{
            paddingBottom: SIZES.padding * 2,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <Animatable.View
              animation="fadeInRight"
              delay={index * 30}
              useNativeDriver
              style={{
                backgroundColor: COLORS.lightGray2,
                marginTop: SIZES.radius,
                paddingHorizontal: SIZES.radius,
                borderRadius: SIZES.radius,
                width: '90%',
                alignSelf: 'center',
                padding: 10,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                // marginRight:80,
                elevation: 5,
                borderWidth: 1.5,
                borderColor:
                  selMonth == item.month ? COLORS.green : COLORS.gray,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setSelMonth(item.month);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      marginRight: RFValue(10),
                    }}>
                    <Ionicons
                      name="person-circle-outline"
                      size={30}
                      color={COLORS.black}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        ...FONTS.h3,
                        color: COLORS.black,
                        textAlign: 'left',
                      }}>
                      {item.month}
                    </Text>
                  </View>
                  <View>
                    <Ionicons
                      name={
                        item.check == 'yes'
                          ? 'checkmark-circle'
                          : 'close-circle'
                      }
                      color={item.check == 'yes' ? COLORS.green : COLORS.red}
                      size={30}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </Animatable.View>
          )}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: '60%',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.primary,
                    width: RFValue(150),
                    height: RFValue(80),
                    borderRadius: 100,
                    marginRight: 10,
                  }}>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.white,
                    }}>
                    لا يوجد إشتراكات متاحة
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderBody()}
        {sHistoryLoading ? (
          <ActivityIndicator color={COLORS.primary} size={30} />
        ) : (
          renderStudentSubHistory()
        )}
      </ScrollView>

      {/* <Button
        loading={sHistoryLoading}
        disabled={sHistoryLoading}
        onPress={() => {
          if (Object.keys(sHistoryData).length > 0) {
            navigation.navigate('StudentSubHistory', {
              sHistory: sHistoryData,
            });
          } else {
            Toast('تاريخ اشتراكات الطالب غير صالح للعرض..');
          }
        }}
        mode="contained"
        style={{
          width: '90%',
          alignSelf: 'center',
          marginVertical: RFValue(20),
        }}
        labelStyle={{
          ...FONTS.h3,
        }}
        color={COLORS.primary}>
        تاريخ إشتراكات الطالب/ة
      </Button> */}
      <Modal
        visible={visableSuccessPay}
        transparent={true}
        onRequestClose={() => {
          setVisableSuccessPay(false);
          setSuccessData({});
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}>
          <TouchableOpacity
            style={{...StyleSheet.absoluteFillObject}}
            onPress={() => {
              setVisableSuccessPay(false);
              setSuccessData({});
            }}></TouchableOpacity>
          <View
            style={{
              backgroundColor: COLORS.white,
              width: '90%',
              borderRadius: 10,
              padding: SIZES.radius,
            }}>
            <Text
              style={{
                ...FONTS.h3,
              }}>
              {studentData.student_name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                marginVertical: RFValue(10),
              }}>
              {successData?.phy_color?.startsWith('#') && (
                <View
                  style={{
                    width: '48%',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      ...FONTS.h3,
                    }}>
                    شحن مادة {Accountspart.subName}
                  </Text>
                  <View
                    style={{
                      height: RFValue(110),
                      width: '100%',
                      backgroundColor: successData?.phy_color,
                      borderRadius: 15,
                    }}
                  />
                </View>
              )}

              <Text
                style={{
                  ...FONTS.h2,
                  textAlign: 'center',
                }}>
                المبلغ المدفوع {successData?.paid}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StudentAccount;
