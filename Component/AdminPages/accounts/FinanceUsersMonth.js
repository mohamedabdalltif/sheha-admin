import React, {useState, useEffect, useContext} from 'react';
import {View, Text, FlatList, BackHandler} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import {icons} from '../../../constants';
import {Accountspart, COLORS, FONTS, SIZES} from '../../constants';
import {Header, IconButton} from './components';
import * as Animatable from 'react-native-animatable';
import Axios from 'axios';
import {RFValue} from 'react-native-responsive-fontsize';
const FinanceUsersMonth = ({navigation, route}) => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [financeMonths, setFinanceMonths] = useState([]);

  useEffect(() => {
    getFinanceMonths();
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
  function getFinanceMonths() {
    let domain = Accountspart.domain;

    let data_to_send = {
      collection_id: -1,
    };

    Axios.post(domain + 'get_months.php', data_to_send)
      .then((res) => {
        let resData = res.data;
        if (resData.status == 'success' && Array.isArray(resData.body)) {
          setFinanceMonths(resData.body);
        } else {
          Toast('حدث خطأ برجاء المحالوة لاحقا');
        }
      })
      .finally(() => {
        setLoadingPage(false);
      });
  }
  function renderHeader() {
    return (
      <Header
        title={'شهور المدفوعات'}
        containerStyle={{
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 25,
        }}
        titleStyle={{
          ...FONTS.h2,
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
        data={financeMonths}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: SIZES.radius,
          paddingHorizontal: 22,
          paddingBottom: SIZES.padding * 2,
        }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item, index}) => (
          <Animatable.View animation={'fadeInRightBig'} delay={index * 100}>
            <Button
              mode="contained"
              color={COLORS.primary}
              onPress={() => {
                navigation.navigate('AdminPaymentRecords', {
                  month: item.month,
                  passData: navigation.getParam('passData'),
                });
                // onPress(item);
              }}
              style={{
                marginBottom: RFValue(20),
              }}
              labelStyle={{
                ...FONTS.h3,
                fontSize: 18,
                color: COLORS.white,
                // flex: 1,
              }}>
              {item.month}
            </Button>
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
                  لا يوجد اشخاص متاحة للعرض
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

export default FinanceUsersMonth;
