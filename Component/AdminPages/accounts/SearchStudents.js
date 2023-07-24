import React, {useContext, useEffect, useState} from 'react';
import {Alert, Modal} from 'react-native';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {icons} from '../../../constants';
import {UsersContext} from '../../../context/UsersContext';
import {COLORS, FONTS, SIZES} from '../../constants';
import {Header, IconButton} from './components';
import * as Animatable from 'react-native-animatable';
import lodash from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import {RefreshControl} from 'react-native';
import Axios from 'axios';
import basic from '../BasicURL';

const SearchStudents = ({navigation}) => {
  const {studentData, setStudentsData} = useContext(UsersContext);
  const [loadingPage, setLoadingPage] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [allStudentsData, setAllStudentsData] = useState([]);
  const [allStudentsDataCopy, setAllStudentsDataCopy] = useState([]);

  const [isRefresh, setIsRefresh] = useState(false);
  useEffect(() => {
    // alert("00")
    if (!studentData.length > 0) {
      setLoadingPage(true);
      getAllStudents();
    } else {
      setAllStudentsData(studentData);
      setAllStudentsDataCopy(studentData);
    }
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

  const getAllStudents = () => {
    let data_to_send = {
      collectiont_id: 'no',
      generation_id: 'no',
      status: 'approved',
      isAll: '1',
    };
    Axios.post(basic.url + 'admin/select_students.php', data_to_send)
      .then((res) => {
        console.log(res.data);
        if (res.status == 200) {
          if (res.data == 'error') {
            Alert.alert('مرحبا', 'هناك خطأ ما في استرجاع البيانات ');
          } else if (Array.isArray(res.data.students)) {
            setAllStudentsData(res.data.students);
            setAllStudentsDataCopy(res.data.students);
            setStudentsData(res.data.students);
          }
        } else {
          alert('error');
        }
      })
      .finally(() => {
        setLoadingPage(false);
        setIsRefresh(false);
      });
    // setTimeout(() => {

    // }, 2000);
  };

  function handelSearch(text) {
    const formattedQuery = text;
    const filteredData = lodash.filter(allStudentsData, (user) => {
      return contains(user, formattedQuery);
    });
    setAllStudentsDataCopy(filteredData);

    setSearchText(text);
  }

  const contains = (user, query) => {
    const {student_name, student_code} = user;
    if (student_name.includes(query)) {
      return true;
    }
    if (student_code) {
      if (student_code.includes(query)) {
        return true;
      }
    }
    return false;
  };

  function renderHeader() {
    return (
      <Header
        title={'بحث الطلاب'}
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

        <FlatList
          data={allStudentsDataCopy}
          keyExtractor={(item, index) => `student-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: SIZES.padding * 2,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefresh}
              onRefresh={() => {
                setIsRefresh(true);

                getAllStudents();
              }}
            />
          }
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
                width: '98%',
                alignSelf: 'center',
                padding: 10,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('StudentAccount', {
                    sData: item,
                  });
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
                      {item.student_name}
                    </Text>
                  </View>
                  <View>
                    <Text>{item.student_code && item.student_code}</Text>
                  </View>
                </View>
              </TouchableOpacity>
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
                    paddingTop: '60%',
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: COLORS.primary,
                      width: RFValue(80),
                      height: RFValue(80),
                      borderRadius: 100,
                      marginRight: 10,
                    }}>
                    <Ionicons
                      name={'ios-person'}
                      size={40}
                      color={COLORS.white}
                    />
                  </View>

                  <Text
                    style={{
                      ...FONTS.h2,
                      color: COLORS.black,
                    }}>
                    لا يوجد طلاب
                  </Text>
                </View>
              );
            }
            return <View />;
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
      {renderBody()}

      <Modal
        onRequestClose={() => {
          navigation.goBack();
          setLoadingPage(false);
        }}
        visible={loadingPage}
        transparent={true}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}>
          <ActivityIndicator color={COLORS.primary} size={60} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({});

export default SearchStudents;
