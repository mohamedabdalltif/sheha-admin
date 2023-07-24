import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, BackHandler} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import {icons} from '../../../constants';
import {COLORS, FONTS, SIZES, Accountspart} from '../../constants';
import {Header, IconButton} from './components';
import * as Animatable from 'react-native-animatable';
import Axios from 'axios';
import {RFValue} from 'react-native-responsive-fontsize';
import {ToastAndroid} from 'react-native';
const CollectionMonths = ({navigation, route}) => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [months, setMonths] = useState([]);

  useEffect(() => {
    getGenerations();
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

  function getGenerations() {
    let colData = navigation.getParam('colData');
    let domain = Accountspart.domain;
    let data_to_send = {
      collection_id: colData.collection_id,
    };

    Axios.post(domain + 'get_months.php', data_to_send)
      .then((res) => {
        let resData = res.data;
        if (resData.status == 'success' && Array.isArray(resData.body)) {
          setMonths(resData.body);
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
  function renderHeader() {
    return (
      <Header
        title={'الشهور'}
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
        data={months}
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
                navigation.navigate('PaymentHistory', {
                  colData: navigation.getParam('colData'),
                  monthData: item,
                });
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
                  لا توجد شهور متاحة للعرض
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

export default CollectionMonths;
