import React, {Component} from 'react';

import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Spinner,
  Button,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RNFetchBlob from 'rn-fetch-blob';
import basic from './BasicURL';
import {color} from '../color';

import DocumentPicker from 'react-native-document-picker';

const {width, height} = Dimensions.get('window');

export default class AddInstruction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generation_id: this.props.navigation.getParam('generation_id'),
      summery_name: '',
      path: '',
      loading: false,
      file: null,
    };
  }

  componentWillUnmount() {
    let refrish = this.props.navigation.getParam('refrish');
    refrish();
  }

  componentDidMount() {}

  uploadFile = async () => {
    //Check if any file is selected or not
    this.setState({loading: true});
    let singleFile = this.state.file;
    if (singleFile != null) {
      //If file selected then create FormData
      const fileToUpload = singleFile;
      const data = new FormData();
      data.append('name', 'Image Upload');
      data.append('file_attachment', fileToUpload);
      data.append('title', this.state.summery_name);
      data.append('generation_id', this.state.generation_id);
      //Please change file upload URL
      let domain = basic.url;

      let res = await fetch(domain + 'admin/upload_info.php', {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data; ',
        },
      });
      let responseJson = await res.json();
      if (responseJson == 'success') {
        Alert.alert('أدمن', 'تم رفع الملف بنجاح');
        this.props.navigation.goBack();
      } else if (responseJson == 'Sorry, your file is too large.') {
        Alert.alert('أدمن', 'حجم هذا الملف كبير لرفعه');
      } else if (responseJson == 'Sorry, file already exists.') {
        Alert.alert('أدمن', 'هذا الملف موجود بالفعل');
      } else {
        Alert.alert('أدمن', 'عفوا حدث خطأ أثناء رفع الملف');
      }
    } else {
      //if no file selected the show alert
      Alert.alert('أدمن', 'عفوا يجب اختيار ملف اولا');
    }
    this.setState({loading: false});
  };

  selectOneFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      this.setState({
        summery_name: res.name,
        path: res.uri,
        file: res,
      });
    } catch (err) {}
  };

  render() {
    return (
      <>
        <Header style={{backgroundColor: color}} androidStatusBarColor={color}>
          <Left style={{flex: 1}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon
                name="angle-right"
                size={25}
                style={{paddingRight: 10, paddingLeft: 10, color: '#FFF'}}
              />
            </TouchableOpacity>
          </Left>

          <Body style={{flex: 3, alignItems: 'center'}}>
            <Title>إضافة ملف تعليمات</Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>
        <Container>
          <ScrollView>
            <View style={{paddingVertical: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderColor: '#ddd',
                  borderWidth: 1,
                  width: '90%',
                }}>
                <TextInput
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    height: 50,
                    width: '90%',
                    // paddingLeft: 5,
                    color: '#000',
                  }}
                  multiline={true}
                  placeholder="إسم الملف"
                  placeholderTextColor="#000"
                  onChangeText={(text) => {
                    this.setState({summery_name: text});
                  }}
                  value={this.state.summery_name}
                />
              </View>

              <Button
                disabled={this.state.disabled}
                onPress={() => {
                  this.selectOneFile();
                }}
                style={{
                  width: '90%',
                  backgroundColor: color,
                  justifyContent: 'center',
                  marginTop: 5,
                  marginBottom: 10,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: '#FFF',
                  }}>
                  {this.state.path.trim() == '' ? 'اختيار ملف' : 'تغيير الملف'}
                </Text>
              </Button>

              {this.state.path.trim() != '' ? (
                <Button
                  disabled={this.state.disabled}
                  onPress={() => {
                    this.props.navigation.navigate('Viewer', {
                      sum_name: this.state.summery_name,
                      sum_link: this.state.path,
                      refrish: this.componentDidMount,
                    });
                  }}
                  style={{
                    width: '90%',
                    backgroundColor: color,
                    justifyContent: 'center',
                    marginTop: 5,
                    marginBottom: 10,
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: '#FFF',
                    }}>
                    عرض الملف
                  </Text>
                </Button>
              ) : null}

              <Button
                disabled={this.state.loading}
                onPress={() => {
                  this.uploadFile();
                }}
                style={{
                  width: '90%',
                  backgroundColor: color,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 60,
                  alignSelf: 'center',
                }}>
                {this.state.loading == false ? (
                  <Text
                    style={{
                      fontSize: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: '#FFF',
                    }}>
                    اضافة
                  </Text>
                ) : (
                  <Spinner
                    color="#fff"
                    size={26}
                    style={{
                      alignSelf: 'center',
                      padding: 0,
                    }}
                  />
                )}
              </Button>

              <TouchableOpacity
                style={{
                  width: '90%',
                  backgroundColor: '#ddd',
                  justifyContent: 'center',
                  marginTop: 20,
                  alignSelf: 'center',
                  height: 45,
                }}
                disabled={this.state.loading}
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 20,
                    textAlign: 'center',
                  }}>
                  الغاء
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Container>
      </>
    );
  }
}
