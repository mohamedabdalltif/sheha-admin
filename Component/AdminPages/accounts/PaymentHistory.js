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
import lodash from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default function PaymentHistory({navigation}) {
  const [loadingPage, setLoadingPage] = useState(true);
  const [collectionData, setCollectionData] = useState({});
  const [students, setStudents] = useState([]);
  const [studentsOriginal, setStudentsOriginal] = useState([]);

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getPaymentHistory();
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

  function getPaymentHistory() {
    let collectionData = navigation.getParam('colData');
    setCollectionData(collectionData);
    let monthData = navigation.getParam('month');
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const rightMonth = month < 10 ? '0' + month : month;

    let data_to_send = {
      collection_id: collectionData.collection_id,
      month_date: monthData == -1 ? year + '-' + rightMonth : monthData,
      all: monthData == -1 ? true : false,
    };
    let domain = Accountspart.domain;

    Axios.post(domain + 'get_month_students.php', data_to_send)
      .then((res) => {
        let resData = res.data;
        if (resData.status == 'success') {
          setStudents(resData.body);
          setStudentsOriginal(resData.body);
        } else {
          Toast('حدث خطأ برجاء المحالوة لاحقا');
        }
      })
      .finally(() => {
        setLoadingPage(false);
      });
  }

  const Toast = (msg) => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };
  function handelDateOrder(time) {
    return moment(time).format('LL');
  }
  function handelTimeOrder(time) {
    return moment(time).format('hh:mm A');
  }

  function totalSum() {
    let initialValue = 0;

    let sum = students.reduce(function (total, currentValue) {
      return Number(total) + Number(currentValue.money);
    }, initialValue);

    return sum;
  }

  function handelSearch(text) {
    const formattedQuery = text.toLowerCase();
    const filteredData = lodash.filter(studentsOriginal, (user) => {
      return contains(user, formattedQuery);
    });
    setStudents(filteredData);

    setSearchText(text);
  }

  const contains = (user, query) => {
    const {student_name} = user;
    if (student_name.toLowerCase().includes(query)) {
      return true;
    }

    return false;
  };
  function renderHeader() {
    return (
      <Header
        title={collectionData?.collection_name}
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
        data={students.sort((a, b) => {
          return b.money < a.money ? -1 : b.money > a.money ? 1 : 0;
        })}
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
              padding: 8,
              borderWidth: 1.5,
              borderColor:
                navigation.getParam('month') != '-1'
                  ? COLORS.green
                  : item.isPaid
                  ? COLORS.green
                  : COLORS.red,
              marginBottom: RFValue(10),
            }}>
            <Text
              style={{
                ...FONTS.h3,
              }}>
              الإسم: {item.student_name}
            </Text>

            {item.date != '' && (
              <>
                <Text
                  style={{
                    ...FONTS.h3,
                  }}>
                  تاريخ الدفع: {handelDateOrder(item.date)}
                </Text>
                <Text
                  style={{
                    ...FONTS.h3,
                  }}>
                  وقت الدفع: {handelTimeOrder(item.date)}
                </Text>

                <Text
                  style={{
                    ...FONTS.h3,
                  }}>
                  المبلغ: {item.money == '0' ? 'إعفاء' : item.money} ج.م
                </Text>
              </>
            )}
          </Animatable.View>
        )}
        ListHeaderComponent={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.lightGray2,
              borderRadius: 200,
              paddingHorizontal: 10,
              // marginHorizontal: SIZES.padding,
              marginVertical: SIZES.radius,
              width: '100%',
            }}>
            <Ionicons name="search" size={24} color={COLORS.black} />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              value={searchText}
              onChangeText={(val) => {
                handelSearch(val);
              }}
              placeholder="ابحث عن طالب"
              style={{
                ...FONTS.h4,
                flex: 1,
                textAlign: 'right',
              }}
            />
          </View>
        }
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
                  لا توجد دفعات متاحة للعرض
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
}
