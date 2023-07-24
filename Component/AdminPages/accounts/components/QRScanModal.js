import React, {useState} from 'react';
import {Modal} from 'react-native';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {RFValue} from 'react-native-responsive-fontsize';
import {COLORS, FONTS} from '../../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const QRScanModal = ({visable, close}) => {
  const [isFlash, setIsFlash] = useState(false);
  const onclose = (msg = '', data) => {
    close(msg, data);
  };
  const onSuccess = (e) => {
    onclose('nav', e.data);
  };
  return (
    <Modal
      visible={visable}
      onRequestClose={() => {
        onclose();
      }}
      animationType="fade">
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={
          isFlash
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off
        }
        topContent={
          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.black,
              textAlign: 'center',
            }}>
            قم بمسح Qr لتحديد ملف الطالب
          </Text>
        }
        showMarker={true}
        markerStyle={{
          borderColor: COLORS.primary,
          borderRadius: 10,
        }}
        bottomContent={
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              setIsFlash(!isFlash);
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.primary,
                width: RFValue(60),
                height: RFValue(60),
                borderRadius: 100,
                marginRight: 10,
              }}>
              <MaterialCommunityIcons
                name={isFlash ? 'flash' : 'flash-off'}
                size={40}
                color={COLORS.white}
              />
            </View>
          </TouchableOpacity>
        }
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default QRScanModal;
