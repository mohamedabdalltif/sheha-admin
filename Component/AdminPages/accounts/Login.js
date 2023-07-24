import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, AsyncStorage} from 'react-native';
import axios from 'axios';
import {COLORS, FONTS, SIZES, Accountspart} from '../../constants';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, TextInput} from 'react-native-paper';
import {ToastAndroid} from 'react-native';
import {UsersContext} from '../../../context/UsersContext';

const Login = ({navigation}) => {
  const {setAdminData} = useContext(UsersContext);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [securePass, setSecurePass] = useState(true);

  useEffect(() => {
    checkAdminLogin();
  }, []);

  const checkAdminLogin = async () => {
    let adminData = await AsyncStorage.getItem('saveAdmin');
    if (adminData != null && adminData != undefined) {
      setPassword('');
      navigation.navigate('ScanOrSearch');
      setAdminData(JSON.parse(adminData));
    }
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

  const login_req = () => {
    setLoadingLogin(true);

    let data_to_send = {
      user_pass: password.trim(),
    };

    axios
      .post(Accountspart.domain + 'login.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          let resData = res.data;
          if (Object.keys(resData).length > 0) {
            if (resData.status == 'success') {
              saveAdminData(resData.body);
              setPassword('');
              navigation.navigate('ScanOrSearch');
              setAdminData(resData.body);
            } else if (resData.status == 'wrong') {
              if (resData.body == 'disable') {
                Toast('الدخول غير مسموح برجاء الرجوع للإدارة');
              } else if (resData.body == 'not_found') {
                Toast('البيانات غير صحيحة');
              } else if (resData.body == 'no_data"') {
                Toast('عفوا لا توجد بيانات لهذا الحساب');
              } else {
                Toast('حدث خطأ برجاء المحاولة لاحقا....');
              }
            } else {
              Toast('حدث خطأ برجاء المحاولة لاحقا...');
            }
          } else {
            Toast('حدث خطأ برجاء المحاولة لاحقا..');
          }
        } else {
          Toast('حدث خطأ برجاء المحاولة لاحقا.');
        }
      })
      .finally(() => {
        setLoadingLogin(false);
      });
  };

  const saveAdminData = async (data) => {
    await AsyncStorage.setItem('saveAdmin', JSON.stringify(data));
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: SIZES.radius,
        paddingHorizontal: SIZES.padding,
        paddingBottom: SIZES.padding * 2,
        backgroundColor: COLORS.white,
        // alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            ...FONTS.h2,
            color: COLORS.black,
            textAlign: 'center',
            marginBottom: SIZES.padding * 2,
          }}>
          الحسابات
        </Text>

        <TextInput
          value={password}
          left={<TextInput.Icon name="security" />}
          right={
            <TextInput.Icon
              onPress={() => {
                setSecurePass(!securePass);
              }}
              name={securePass ? 'eye-off' : 'eye'}
            />
          }
          onChangeText={(val) => {
            setPassword(val);
          }}
          secureTextEntry={securePass}
          mode="outlined"
          theme={{
            colors: {
              primary: COLORS.primary,
              underLineColor: COLORS.transparent,
            },
          }}
          label="أدخل كلمة المرور"
          style={{
            backgroundColor: COLORS.lightGray2,
            marginTop: 20,
            width: '100%',
            alignSelf: 'center',
            borderRadius: 7,
            height: 55,
            fontFamily: FONTS.fontFamily,
          }}
        />

        <Button
          loading={loadingLogin}
          disabled={loadingLogin}
          mode="contained"
          color={COLORS.primary}
          labelStyle={{
            ...FONTS.h3,
            color: COLORS.white,
          }}
          style={{
            marginTop: RFValue(50),
          }}
          onPress={() => {
            if (password.trim() == '') {
              Toast('برجاء إدخال كلمة المرور');
              return;
            }

            login_req();
          }}>
          تسجيل دخول
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Login;
