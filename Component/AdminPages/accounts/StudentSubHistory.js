import React, {useState, useEffect} from 'react';
import {View, FlatList, Text, BackHandler} from 'react-native';
import {Button} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {icons} from '../../../constants';
import {Accountspart, COLORS, FONTS, SIZES} from '../../constants';
import {Header, IconButton} from './components';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
const StudentSubHistory = ({navigation}) => {
  const [passedData, setPassedData] = useState({});
  const [selectSub, setSelectSub] = useState('0'); // 0->ph , 1->ch , 2->both

  useEffect(() => {
    setPassedData(navigation.getParam('sHistory'));
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

  function renderHeader() {
    return (
      <Header
        title={passedData?.student_name}
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
            // marginVertical: RFValue(20),
          }}>
          <Button
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
              width: '100%',
              //   flex: 1,
            }}
            color={selectSub == '0' ? COLORS.primary : COLORS.lightGray2}>
            فيزياء {`\n${passedData?.phy_collection_name}`}
          </Button>
          <Button
            onPress={() => {
              setSelectSub('1');
            }}
            mode="contained"
            style={{
              width: '48%',
              //   marginVertical: RFValue(20),
            }}
            labelStyle={{
              ...FONTS.h3,
              color: selectSub == '1' ? COLORS.white : COLORS.black,
              width: '100%',
            }}
            color={selectSub == '1' ? COLORS.primary : COLORS.lightGray2}>
            كيمياء {`\n${passedData?.ch_collection_name}`}
          </Button>
        </View>

        <FlatList
          data={
            selectSub == '0' ? passedData?.phy_months : passedData?.ch_months
          }
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
                      item.check == 'yes' ? 'checkmark-circle' : 'close-circle'
                    }
                    color={item.check == 'yes' ? COLORS.green : COLORS.red}
                    size={30}
                  />
                </View>
              </View>
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
                    width: RFValue(80),
                    height: RFValue(80),
                    borderRadius: 100,
                    marginRight: 10,
                  }}>
                  <Text
                    style={{
                      ...FONTS.h2,
                      color: COLORS.black,
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
      {renderBody()}
    </View>
  );
};

export default StudentSubHistory;
