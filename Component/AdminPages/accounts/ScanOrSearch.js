import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  BackHandler,
  Modal,
  ToastAndroid,
  AsyncStorage,
} from 'react-native';
import Axios from 'axios';
import {ActivityIndicator, Button} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {UsersContext} from '../../../context/UsersContext';
import {Accountspart, COLORS, FONTS, SIZES} from '../../constants';
import {QRScanModal} from './components';

const ScanOrSearch = ({navigation}) => {
  const {adminData, setAdminData} = useContext(UsersContext);
  const [visableQrModal, setVisableQrModal] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [visableStoredMoney, setVisableStoredMoney] = useState(false);
  const [money, setMoney] = useState('');
  const [reqLoading, setReqLoading] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('HomePage');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const _sendMoney = () => {
    setReqLoading(true);
    let data_to_send = {
      admin_id: adminData?.finance_user_id,
      money,
    };
    Axios.post(Accountspart.domain + 'custody_finances.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            setVisableStoredMoney(false);
            clearMoney();
            Toast('تم تسليم العهدة بنجاح');
          } else {
            Toast('حدث خطأ برجاء المحاولة لاحقا');
          }
        } else {
          Toast('حدث خطأ برجاء المحاولة لاحقا');
        }
      })
      .finally(() => {
        setReqLoading(false);
      });
  };

  const getStoredMoney = async () => {
    let total = 0;
    let storedMoney = await AsyncStorage.getItem('storedMoney');
    if (storedMoney != null && storedMoney != undefined) {
      total = parseFloat(storedMoney);
    }

    setMoney(JSON.stringify(total));
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
  const clearMoney = async () => {
    await AsyncStorage.removeItem('storedMoney');
    setMoney('0');
  };

  const checkAdmin = async () => {
    let adminData = JSON.parse(await AsyncStorage.getItem('saveAdmin'));
    let data_to_send = {
      user_pass: adminData.user_pass,
    };

    Axios.post(Accountspart.domain + 'check_user.php', data_to_send).then(
      (res) => {
        if (res.status == 200) {
          if (res.data.status == 'success') {
            setPageLoading(false);
          } else {
            removeAdmin();
          }
        }
      },
    );
  };

  const getStudentData = (sId) => {
    let data_to_send = {
      user_id: sId,
    };
    Axios.post(Accountspart.domain + 'scan_user.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          let resData = res.data;
          if (resData.status == 'success') {
            if (typeof resData.body === 'object') {
              navigation.navigate('StudentAccount', {
                sData: resData.body,
              });
            } else {
              Toast('تاريخ اشتراكات الطالب غير صالح للعرض');
            }
          } else {
            Toast('تاريخ اشتراكات الطالب غير صالح للعرض.');
          }
        } else {
          Toast('حدث خطأ برجاء المحالوة لاحقا.s');
        }
      })
      .finally(() => {
        setPageLoading(false);
      });
  };
  const removeAdmin = async () => {
    await AsyncStorage.removeItem('saveAdmin');
    navigation.navigate('ChosseSubjects');

    ToastAndroid.showWithGravityAndOffset(
      'هذا الحساب غير صالح للحسابات',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };
  function renderHeader() {
    return (
      <View style={{...styles.header, flexDirection: 'row'}}>
        <View style={{flex: 1}} />

        <View
          style={{
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...FONTS.h2,
              color: '#fff',
            }}>
            الرئيسية
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            logOut();
          }}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <SimpleLineIcons name="logout" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  function renderBody() {
    return (
      <View
        style={{
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          paddingBottom: SIZES.padding * 2,
        }}>
        <Text
          style={{
            ...FONTS.h2,
            color: COLORS.black,
          }}>
          مرحباَ {adminData.user_name}
        </Text>
        <Button
          mode="contained"
          color={COLORS.primary}
          labelStyle={{
            ...FONTS.h3,
            color: COLORS.white,
          }}
          style={{
            marginVertical: SIZES.padding,
          }}
          onPress={() => {
            setVisableQrModal(true);
          }}>
          QR
        </Button>

        <Button
          mode="contained"
          color={COLORS.primary}
          labelStyle={{
            ...FONTS.h3,
            color: COLORS.white,
          }}
          onPress={() => {
            navigation.navigate('SearchStudents');
          }}>
          بحث عن طلاب
        </Button>
        <Button
          mode="contained"
          color={COLORS.primary}
          labelStyle={{
            ...FONTS.h3,
            color: COLORS.white,
          }}
          style={{
            marginVertical: SIZES.padding,
          }}
          onPress={() => {
            setVisableStoredMoney(true);
            getStoredMoney();
          }}>
          العهدة
        </Button>
        <Button
          mode="contained"
          color={COLORS.primary}
          labelStyle={{
            ...FONTS.h3,
            color: COLORS.white,
          }}
          onPress={() => {
            navigation.navigate('Months');
          }}>
          سجلات الشهور السابقة
        </Button>
        <Button
          mode="contained"
          color={COLORS.primary}
          labelStyle={{
            ...FONTS.h3,
            color: COLORS.white,
          }}
          style={{
            marginTop: SIZES.padding,
          }}
          onPress={() => {
            navigation.navigate('HistoryGenerations');
          }}>
          سجل الشهر الحالى
        </Button>

        {adminData?.pay_history == '1' && (
          <Button
            mode="contained"
            color={COLORS.primary}
            labelStyle={{
              ...FONTS.h3,
              color: COLORS.white,
            }}
            style={{
              marginVertical: SIZES.padding,
            }}
            onPress={() => {
              navigation.navigate('FinanceUsers');
            }}>
            سجل العهدة
          </Button>
        )}
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderBody()}
      </ScrollView>

      <Button
        mode="contained"
        color={COLORS.primary}
        labelStyle={{
          ...FONTS.h3,
          color: COLORS.white,
        }}
        style={{
          marginVertical: SIZES.padding * 2,
          width: '90%',
          alignSelf: 'center',
        }}
        onPress={async () => {
          await AsyncStorage.removeItem('saveAdmin');
          setAdminData({});
          navigation.goBack();
        }}>
        تسجيل الخروج
      </Button>

      <QRScanModal
        visable={visableQrModal}
        close={(isNav, data) => {
          if (isNav == 'nav') {
            setPageLoading(true);
            getStudentData(data);
          }
          setVisableQrModal(false);
        }}
      />

      <Modal
        visible={visableStoredMoney}
        transparent={true}
        onRequestClose={() => {
          setVisableStoredMoney(false);
          setMoney('');
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}>
          <TouchableOpacity
            onPress={() => {
              setVisableStoredMoney(false);
              setMoney('');
            }}
            style={{
              ...StyleSheet.absoluteFillObject,
            }}></TouchableOpacity>
          <View
            style={{
              width: '90%',
              backgroundColor: COLORS.white,
              padding: RFValue(10),
              borderRadius: 10,
            }}>
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.black,
              }}>
              العهدة
            </Text>
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.primary,
                textAlign: 'center',
              }}>
              {money} ج.م
            </Text>
            <Button
              loading={reqLoading}
              disabled={reqLoading}
              mode="contained"
              color={COLORS.primary}
              labelStyle={{
                ...FONTS.h3,
                color: COLORS.white,
              }}
              style={{
                marginVertical: SIZES.padding,
              }}
              onPress={() => {
                if (money > 0) {
                  _sendMoney();
                } else {
                  Toast('العهدة فارغة');
                }
              }}>
              تسليم العهدة
            </Button>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={pageLoading}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}>
          <ActivityIndicator size={40} color={COLORS.primary} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ScanOrSearch;
