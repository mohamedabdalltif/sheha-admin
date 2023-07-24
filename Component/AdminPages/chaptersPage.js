import * as React from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  ToastAndroid,
  Modal,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import {TextInput} from 'react-native-paper';

import {color} from '../color';
import Axios from 'axios';
import basic from './BasicURL';
export default class chaptersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoading: true,
      AllData: this.props.navigation.getParam('AllData'),
      requestLoading: false,
      newChapter: '',
      visableAddModal: false,
      connectionStatus: false,
      chaptersData: [],
    };
  }

  componentDidMount() {
    this.getChapters();
    const unsubscribe = NetInfo.addEventListener((state) => {
      this.setState({
        connectionStatus: state.isConnected,
      });
      if (state.isConnected) {
        this.getChapters();
      }
    });
  }
  async deleteChapter(chapter_id, index) {
    let dataToSend = {
      chapter_id,
    };
    let domain = basic.url;

    Axios.post(domain + 'delete_chapters.php', dataToSend).then((res) => {
      if (res.status == 200) {
        console.log(res.data);

        if (res.data == 'success') {
          let allData = this.state.chaptersData;
          allData.splice(index, 1);
          this.setState({
            chaptersData: allData,
          });
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجى المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      } else {
        ToastAndroid.showWithGravityAndOffset(
          'عذرا يرجى المحاوله فى وقت لاحق',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50,
        );
      }
    });
  }
  closeModal() {
    this.setState({
      visableAddModal: false,
      newChapter: '',
    });
  }
  async addChapter() {
    this.setState({
      requestLoading: true,
    });
    let dataToSend = {
      chapter_name: this.state.newChapter.trim(),
      generation_id: this.state.AllData.generation_id,
    };
    let domain = basic.url;

    Axios.post(domain + 'challenge/add_chapter.php', dataToSend)
      .then((res) => {
        if (res.status == 200) {
          if (res.data) {
            let allData = this.state.chaptersData;
            let obj = {
              chapter_id: res.data,
              chapter_name: this.state.newChapter.trim(),
              generation_id: this.state.AllData.generation_id,
            };
            allData.push(obj);
            this.setState({
              chaptersData: allData,
            });
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'عذرا يرجى المحاوله فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجى المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      })
      .finally(() => {
        this.setState({
          newChapter: '',
          requestLoading: false,
          visableAddModal: false,
        });
      });
  }

  async getChapters() {
    let dataToSend = {
      generation_id: this.state.AllData.generation_id,
    };
    let domain = basic.url;

    Axios.post(domain + 'select_chapterts.php', dataToSend)
      .then((res) => {
        if (res.status == 200) {
          if (Array.isArray(res.data)) {
            this.setState({
              chaptersData: res.data,
            });
          } else {
            this.setState({
              chaptersData: [],
            });
          }
        } else {
          this.setState({
            chaptersData: [],
          });
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجى المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      })
      .finally(() => {
        this.setState({
          pageLoading: false,
        });
      });
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {this.state.connectionStatus == false &&
        this.state.chaptersData.length == 0 ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>
              الرجاء التأكد من اتصالك بالإنترنت
            </Text>
          </View>
        ) : this.state.pageLoading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={50} color="#000" />
          </View>
        ) : (
          <FlatList
            removeClippedSubviews={true}
            keyExtractor={(_, index) => index.toString()}
            data={this.state.chaptersData}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: 'space-around',
            }}
            ListHeaderComponent={() => {
              return (
                <View
                  style={{
                    width: '100%',
                    height: 60,
                    backgroundColor: color,
                    flexDirection: 'row',
                    elevation: 5,
                  }}>
                  <View style={{flex: 1}}></View>
                  <View
                    style={{
                      flex: 3,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{color: '#fff', fontSize: 24, fontWeight: 'bold'}}>
                      الشباتر
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      console.log(this.state.connectionStatus);
                      if (this.state.connectionStatus) {
                        this.setState({
                          visableAddModal: true,
                        });
                      } else {
                        ToastAndroid.showWithGravityAndOffset(
                          'برجاء التأكد من اتصالك بالإنترنت',
                          ToastAndroid.LONG,
                          ToastAndroid.BOTTOM,
                          25,
                          50,
                        );
                      }
                    }}>
                    <Ionicons name="add-circle" size={35} color="#fff" />
                  </TouchableOpacity>
                </View>
              );
            }}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: '90%',
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 22}}>
                    لا توجد شباتر
                  </Text>
                </View>
              );
            }}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('ChapterQuestions', {
                      chapter_id: item.chapter_id,
                    });
                  }}
                  style={{
                    elevation: 5,
                    backgroundColor: '#fff',
                    marginVertical: 10,
                    width: 150,
                    borderRadius: 10,
                    //   alignItems: 'center',
                    //   justifyContent: 'center',
                    padding: 8,
                    height: 180,
                  }}>
                  <View
                    style={{
                      flex: 0.25,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          'Admin',
                          'هل انت متأكد من حذف الشابتر؟',
                          [
                            {
                              text: 'حذف',

                              onPress: () => {
                                let chapterId = item.chapter_id;
                                this.deleteChapter(chapterId, index);
                              },
                            },
                            {
                              text: 'إلغاء',
                              onPress: () => {},
                            },
                          ],
                          {
                            cancelable: true,
                          },
                        );
                      }}>
                      <FontAwesome5 name="trash-alt" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{fontWeight: '700', fontSize: 20}}
                      numberOfLines={3}>
                      {item.chapter_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}

        <Modal
          visible={this.state.visableAddModal}
          transparent={true}
          onRequestClose={() => {
            this.setState({
              visableAddModal: false,
            });
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.closeModal();
              }}
              style={{flex: 1, width: '100%', height: '100%'}}>
              <View style={{flex: 1, width: '100%', height: '100%'}}></View>
            </TouchableWithoutFeedback>
            <View
              style={{
                paddingVertical: 20,
                backgroundColor: '#fff',
                marginHorizontal: 20,
                borderRadius: 10,
                width: '90%',
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    marginLeft: 20,
                    fontWeight: 'bold',
                  }}>
                  إضافة شابتر
                </Text>

                <TextInput
                  autoFocus={true}
                  theme={{
                    colors: {
                      primary: color,
                      underlineColor: 'transparent',
                    },
                  }}
                  value={this.state.newChapter}
                  label={'إسم الشابتر'}
                  autoCapitalize={'none'}
                  onChangeText={(text) => {
                    this.setState({
                      newChapter: text,
                    });
                  }}
                  autoCorrect={false}
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    margin: '5%',
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <TouchableOpacity
                  disabled={this.state.requestLoading}
                  onPress={() => {
                    if (this.state.newChapter.trim().length < 2) {
                      ToastAndroid.showWithGravityAndOffset(
                        'برجاء كتابة إسم الشابتر',
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                        25,
                        50,
                      );
                      // Toast.show({
                      //   text: '',
                      //   buttonText: 'شكرا',
                      //   textStyle: {color: '#000'},
                      //   buttonTextStyle: {color: '#000'},
                      //   type: 'danger',
                      //   duration: 7000,
                      // });
                    } else {
                      this.addChapter();
                    }
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: color,
                    width: '35%',
                    height: 50,
                    padding: 10,
                    alignSelf: 'center',
                    borderRadius: 10,
                  }}>
                  {this.state.requestLoading ? (
                    <ActivityIndicator color="#fff" size={18} />
                  ) : (
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#fff',
                      }}>
                      إضافة
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={this.state.requestLoading}
                  onPress={() => {
                    this.closeModal();
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    width: '35%',
                    height: 50,

                    padding: 10,
                    alignSelf: 'center',
                    borderRadius: 10,
                  }}>
                  <Text style={{fontSize: 18, color: '#fff'}}>إلغاء</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                this.closeModal();
              }}
              style={{flex: 1, width: '100%', height: '100%'}}>
              <View style={{flex: 1, width: '100%', height: '100%'}}></View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    );
  }
}
