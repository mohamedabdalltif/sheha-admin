import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, BackHandler, TextInput} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import {icons} from '../../../constants';
import {Accountspart, COLORS, FONTS, SIZES} from '../../constants';
import {Header, IconButton} from './components';
import * as Animatable from 'react-native-animatable';
import Axios from 'axios';
import {RFValue} from 'react-native-responsive-fontsize';
import {ToastAndroid} from 'react-native';
import moment from 'moment/moment';

const AdminPaymentRecords = ({navigation}) => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [paymentData, setPaymentData] = useState([]);
  const [monthDate, setMonthDate] = useState('');

  useEffect(() => {
    let month = navigation.getParam('month');
    setMonthDate(month);
    getMonthData();
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

  const getMonthData = () => {
    let data = navigation.getParam('passData');
    let month = navigation.getParam('month');

    let data_to_send = {
      admin_id: data.finance_user_id,
      month,
    };

    Axios.post(Accountspart.domain + 'get_finace_records.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (Array.isArray(res.data)) {
            setPaymentData(res.data);
          }
        }
      })
      .finally(() => {
        setLoadingPage(false);
      });
  };

  const Toast = (msg) => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };
  function handelTimeOrder(time) {
    return moment(time).format('LLLL');
  }

  function totalSum() {
    let initialValue = 0;

    let sum = paymentData.reduce(function (total, currentValue) {
      return Number(total) + Number(currentValue.custody_money);
    }, initialValue);

    return sum;
  }

  function renderHeader() {
    return (
      <Header
        title={monthDate}
        containerStyle={{
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 25,
        }}
        titleStyle={{
          ...FONTS.h5,
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
        rightComponent={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...FONTS.body5,
              }}>
              المبلغ الكلى
            </Text>
            <Text
              style={{
                ...FONTS.body5,
              }}>
              {totalSum()}
            </Text>
          </View>
        }
      />
    );
  }

  function renderBody() {
    if (loadingPage) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={45} color={COLORS.primary} />
        </View>
      );
    }

    return (
      <FlatList
        data={paymentData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: SIZES.radius,
          paddingHorizontal: 22,
          paddingBottom: SIZES.padding * 2,
        }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item, index}) => (
          <Animatable.View
            animation={'fadeInRightBig'}
            delay={index * 50}
            style={{
              backgroundColor: COLORS.white,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              borderRadius: SIZES.base,
              padding: SIZES.radius,
              borderWidth: 1,
              borderColor: COLORS.green,
              marginBottom: RFValue(10),
            }}>
            <Text
              style={{
                ...FONTS.h3,
              }}>
              المبلغ: {item.custody_money} ج.م
            </Text>

            <Text
              style={{
                ...FONTS.h3,
              }}>
              تاريخ الدفع:{' '}
              <Text style={{color: COLORS.primary}}>
                {handelTimeOrder(item.custody_date)}
              </Text>
            </Text>
          </Animatable.View>
        )}
        ListEmptyComponent={() => {
          if (!loadingPage) {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: '50%',
                }}>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.black,
                  }}>
                  لا توجد مدفوعات متاحة للعرض
                </Text>
              </View>
            );
          }
        }}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default AdminPaymentRecords;
