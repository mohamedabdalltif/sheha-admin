import * as React from 'react';
import {StatusBar} from 'react-native';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  FlatList,
  AsyncStorage,
  ImageBackground,
  Alert,
  ToastAndroid,
  Modal,
} from 'react-native';
import {Header, Left, Right, Body, Title, Spinner} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TextInput, Switch} from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';

import {RefreshControl} from 'react-native';

import basic from './BasicURL';
import {color} from '../color';

const {width, height} = Dimensions.get('window');
export default class VideosList extends React.Component {
  constructor() {
    super();
    this.state = {
      My_videos_array: [],
      loading_lock: [],
      isPageLoading: true,
      unableWatchModal: false,
      alertBeforeWatchingModal: false,
      vedio_details: null,
      wrongModal: false,
      WrongModalReason: '',
      thereIsVideos: false,
      checkInsertViewFun: false,
      //
      visableAddVideo: false,
      video_title: '',
      video_description: '',
      viemo_id: '',
      requestLoading: false,
      addOreditVideo: 'add',
      selectedItem: {},
      selectedItemIndex: 0,
      visableActionSheet: false,
      selected_video: {},
      selected_video_index: {},
    };
  }

  componentDidMount() {
    this.setState({isPageLoading: true});

    this.getAllMyVediosFor();
  }

  closeModal() {
    this.setState({
      requestLoading: false,
      visableAddVideo: false,
      video_title: '',
      video_description: '',
      viemo_id: '',
      selectedItem: {},
      addOreditVideo: 'add',
      selectedItemIndex: 0,
    });
  }

  async toggleVideoToBuy() {
    let video = this.state.selected_video;
    let video_index = this.state.selected_video_index;
    let can_buy = this.state.selected_video.can_buy;

    let data_to_send = {
      video_id: video.video_id,
    };
    let domain = basic.url;

    axios
      .post(domain + 'admin/update_buy_video.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            let allData = this.state.My_videos_array;
            allData[video_index].can_buy = can_buy == '1' ? '0' : '1';
            video.can_buy = can_buy == '1' ? '0' : '1';
            this.setState({
              My_videos_array: allData,
              selected_video: video,
            });
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'حدث خطأ ما الرجاء المحاولة فى وقت لاحق',
              ToastAndroid.BOTTOM,
              ToastAndroid.SHORT,
              25,
              50,
            );
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'حدث خطأ ما الرجاء المحاولة فى وقت لاحق',
            ToastAndroid.BOTTOM,
            ToastAndroid.SHORT,
            25,
            50,
          );
        }
      });
  }
  async addVideo() {
    this.setState({
      requestLoading: true,
    });

    let domain = basic.url;

    let video_title = this.state.video_title.trim();
    let video_description = this.state.video_description.trim();
    let viemo_id = this.state.viemo_id.trim();

    let error = 0;

    if (video_title.length == 0) {
      error++;
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء كتابة عنوان للفيديو',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else if (viemo_id.length == 0) {
      error++;
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء كتابة ال ID الخاص بالفيديو',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }

    if (error == 0) {
      let dataToSend = {
        video_title,
        video_description,
        viemo_id,
        generation_id: this.props.navigation.getParam('generation_id'),
      };

      axios
        .post(domain + 'admin/upload_video_data.php', dataToSend)
        .then((res) => {
          if (res.status == 200) {
            if (res.data == 'success') {
              ToastAndroid.showWithGravityAndOffset(
                'تمت الإضافة بنجاح',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                50,
              );
              this.componentDidMount();
            } else {
              Alert.alert('أدمن', 'خطأ');
            }
          } else {
            Alert.alert('أدمن', 'حدث شئ خطأ');
          }
        })
        .finally(() => {
          this.closeModal();
        });
    } else {
      this.setState({
        requestLoading: false,
      });
    }
  }

  async editVideo() {
    this.setState({
      requestLoading: true,
    });
    let itemIndex = this.state.selectedItemIndex;
    let allData = this.state.My_videos_array;
    allData[itemIndex].editLoading = true;
    this.setState({
      My_videos_array: allData,
    });
    let type = JSON.parse(await AsyncStorage.getItem('type'));

    let domain;
    if (type == 1) {
      domain = basic.url;
    } else {
      domain = basic.url1;
    }
    let video_title = this.state.video_title.trim();
    let video_description = this.state.video_description.trim();
    let viemo_id = this.state.viemo_id.trim();
    let error = 0;
    if (video_title.length == 0) {
      error++;
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء كتابة عنوان للفيديو',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else if (viemo_id.length == 0) {
      error++;
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء كتابة ال ID الخاص بالفيديو',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }

    if (error == 0) {
      let dataToSend = {
        video_title,
        video_description,
        viemo_id,
        video_id: allData[itemIndex].video_id,
      };
      console.log(dataToSend);
      axios
        .post(domain + 'admin/edit_video_data.php', dataToSend)
        .then((res) => {
          if (res.status == 200) {
            if (res.data == 'success') {
              ToastAndroid.showWithGravityAndOffset(
                'تم التعديل بنجاح',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                50,
              );
              this.componentDidMount();
            } else {
              Alert.alert('أدمن', 'خطأ');
            }
          } else {
            Alert.alert('أدمن', 'حدث شئ خطأ');
          }
        })
        .finally(() => {
          this.closeModal();
          allData[itemIndex].editLoading = false;
          this.setState({
            My_videos_array: allData,
          });
        });
    } else {
      this.setState({
        requestLoading: false,
      });
    }
  }

  async deleteVideo(index) {
    Alert.alert(
      'أدمن',
      'هل انت متأكد من حذف هذا الفيديو ؟',
      [
        {
          text: 'حذق',
          onPress: async () => {
            let allData = this.state.My_videos_array;
            allData[index].deleteLoading = true;
            this.setState({
              My_videos_array: allData,
            });
            let domain = basic.url;

            let dataToSend = {
              video_id: allData[index].video_id,
            };
            console.log(dataToSend);
            axios
              .post(domain + 'admin/delete_video.php', dataToSend)
              .then((res) => {
                console.log(res.data);
                if (res.data == 'success') {
                  allData.splice(index, 1);
                  ToastAndroid.showWithGravityAndOffset(
                    'قد تم حذف الفيديو',
                    ToastAndroid.BOTTOM,
                    ToastAndroid.SHORT,
                    25,
                    50,
                  );
                } else {
                  ToastAndroid.showWithGravityAndOffset(
                    'حدث خطأ ما الرجاء المحاولة فى وقت لاحق',
                    ToastAndroid.BOTTOM,
                    ToastAndroid.SHORT,
                    25,
                    50,
                  );
                }
              })
              .finally(() => {
                allData.map((item) => (item.deleteLoading = false));
                this.setState({
                  My_videos_array: allData,
                });
              });
          },
        },
        {
          text: 'إلغاء',
          style: 'cancel',
          onPress: () => {},
        },
      ],
      {
        cancelable: true,
      },
    );
  }

  async update_show_video(video_index) {
    let generation_id = this.props.navigation.getParam('generation_id');
    let collection_id = this.props.navigation.getParam('collection_id');
    let videos = this.state.My_videos_array;
    let value = videos[video_index].show;
    let id = videos[video_index].video_id;

    let loading = this.state.loading_lock;
    loading[video_index] = true;
    this.setState({loading_lock: loading});

    let data_to_send = {
      video_id: id,
      generation_id: generation_id,
      collection_id: collection_id,
      value: value == 0 ? 1 : 0,
    };

    let domain = basic.url;

    axios
      .post(domain + `admin/update_show_video.php`, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // alert(res.data)
          if (res.data == 'success') {
            videos[video_index].show = value == 0 ? 1 : 0;
            this.setState({My_videos_array: videos});
            Alert.alert('أدمن', 'تمت العمليه بنجاح');
          } else {
            Alert.alert('أدمن', 'خطأ');
          }
        } else {
          Alert.alert('أدمن', 'حدث شئ خطأ');
        }
        loading[video_index] = false;
        this.setState({loading_lock: loading});
      });
  }

  getAllMyVediosFor = async () => {
    let generation_id = this.props.navigation.getParam('generation_id');
    let collection_id = this.props.navigation.getParam('collection_id');
    this.setState({
      isPageLoading: true,
    });
    // let data_to_send = {
    //   playlist_id: this.state.chainDetails.chain_id,
    //   student_id: StudentData.student_id,
    // };
    let data_to_send = {
      generation_id: generation_id,
      collection_id: collection_id == -1 ? '0' : collection_id,
    };

    // alert(JSON.stringify(data_to_send));

    let domain = basic.url;

    axios
      .post(domain + 'admin/select_videos.php', data_to_send)
      .then((res) => {
        console.log(res.data);
        this.setState({
          isPageLoading: false,
        });
        if (Array.isArray(res.data) && res.data.length != 0) {
          let allData = res.data;
          allData.map((item) => (item.deleteLoading = false));
          allData.map((item) => (item.editLoading = false));

          this.setState({My_videos_array: allData, thereIsVideos: true});
        } else {
          this.setState({My_videos_array: []});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderMyVideoDetails = ({item, index}) => {
    // alert(JSON.stringify(item));
    return (
      <TouchableOpacity
        onLongPress={() => {
          console.log(item);
          this.setState({
            visableActionSheet: true,
            selected_video: item,
            selected_video_index: index,
          });
        }}
        style={{
          width: '90%',
          margin: '5%',
          flexDirection: 'row',
          backgroundColor: '#f7f4f4',
          shadowColor: '#ddd',
          shadowOffset: {width: 5, height: 5},
          shadowOpacity: 0.26,
          elevation: 8,
          borderRadius: 20,
        }}>
        <View style={{minHeight: 150, width: '40%'}}>
          <ImageBackground
            source={{uri: item.video_image_link}}
            imageStyle={{borderRadius: 20}}
            style={{
              flex: 1,
              width: null,
              height: null,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              disabled={true}
              onPress={() => {
                this.setState({vedio_details: item});
                if (item.can_see) {
                  this.setState({alertBeforeWatchingModal: true});
                } else {
                  this.setState({unableWatchModal: true});
                }
              }}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#385898',
                borderRadius: 50,
              }}>
              <FontAwesome5 name="play" color="#FFF" size={20} />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <View
          style={{
            margin: 10,
            width: '50%',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '100%'}}>
            <Text
              numberOfLines={2}
              style={{fontFamily: 'Janna LT Bold', fontSize: 20}}>
              {item.video_title}
            </Text>
          </View>
          <View style={{width: '100%'}}>
            <Text
              numberOfLines={2}
              style={{fontFamily: 'Janna LT Bold', fontSize: 16}}>
              {item.video_description}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              numberOfLines={1}
              style={{fontFamily: 'Janna LT Bold', fontSize: 16}}>
              {item.video_price} LE
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                numberOfLines={1}
                style={{fontFamily: 'Janna LT Bold', fontSize: 16}}>
                {item.view_count}
              </Text>
              <Icon
                name={'eye'}
                style={{
                  fontSize: 20,
                  color: '#385898',
                  // marginTop: 10,
                  marginRight: 30,
                  alignSelf: 'center',
                }}
              />
            </View>
          </View>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.deleteVideo(index);
              }}
              style={{
                width: 20,
                height: 20,
                // backgroundColor:"#f00"
              }}
              disabled={item.deleteLoading}>
              {item.deleteLoading ? (
                <Spinner
                  color="#f07f"
                  size={20}
                  style={{
                    alignSelf: 'center',
                    padding: 0,
                    marginTop: -30,
                  }}
                />
              ) : (
                <Icon
                  name="trash-alt"
                  style={{
                    fontSize: 24,
                    color: '#f07f',
                    // marginTop: 10,
                    // alignSelf: 'center',
                    // marginRight:30
                  }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  addOreditVideo: 'edit',
                  visableAddVideo: true,
                  selectedItem: item,
                  selectedItemIndex: index,
                  video_title: item.video_title,
                  video_description: item.video_description,
                  viemo_id: item.video_player_id,
                });
              }}
              style={{
                width: 20,
                height: 20,
                // backgroundColor:"#f00"
              }}
              disabled={item.editLoading}>
              {item.editLoading ? (
                <Spinner
                  color="#f07f41"
                  size={20}
                  style={{
                    alignSelf: 'center',
                    padding: 0,
                    marginTop: -30,
                  }}
                />
              ) : (
                <Icon
                  name="edit"
                  style={{
                    fontSize: 24,
                    color: '#f07f41',
                    // marginTop: 10,
                    // alignSelf: 'center',
                    // marginRight:30
                  }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.update_show_video(index);
              }}
              style={{
                width: 20,
                height: 20,
                // backgroundColor:"#f00"
              }}
              disabled={this.state.loading_lock[index] ? true : false}>
              {this.state.loading_lock[index] ? (
                <Spinner
                  color="#385898"
                  size={20}
                  style={{
                    alignSelf: 'center',
                    padding: 0,
                    marginTop: -30,
                  }}
                />
              ) : (
                <Icon
                  name={item.show == 0 ? 'lock' : 'lock-open'}
                  style={{
                    fontSize: 20,
                    color: '#385898',
                    // marginTop: 10,
                    // alignSelf: 'center',
                    // marginRight:30
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header style={{backgroundColor: color}} androidStatusBarColor={color}>
          <Left style={{flex: 1}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon
                name="angle-right"
                style={{fontSize: 35, color: '#fff', marginLeft: 10}}
              />
            </TouchableOpacity>
          </Left>
          <Body style={{flex: 3, alignItems: 'center'}}>
            <Title>الفيديوهات</Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isPageLoading}
              onRefresh={this.componentDidMount.bind(this)}
              colors={['#385898', '#385898']}
            />
          }>
          <View style={{flex: 1}}>
            {this.state.isPageLoading ? null : this.state.thereIsVideos ? (
              <>
                <FlatList
                  data={this.state.My_videos_array}
                  style={{paddingBottom: 70}}
                  keyExtractor={(item) => item.video_id}
                  renderItem={this.renderMyVideoDetails}
                />
              </>
            ) : (
              <View
                style={{
                  height: height - height * 0.2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '90%',
                  margin: '5%',
                }}>
                <Text style={{fontFamily: 'Janna LT Bold', fontSize: 20}}>
                  لا توجد فيديوهات حتى الأن
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        {this.state.isPageLoading == false &&
        (this.state.thereIsVideos == true ||
          this.state.thereIsVideos == false) ? (
          <TouchableOpacity
            onPress={() => {
              this.setState({
                visableAddVideo: true,
              });
            }}
            style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              backgroundColor: color,
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 60 / 2,
            }}>
            <Ionicons name="add" color="#fff" size={28} />
          </TouchableOpacity>
        ) : null}

        {/*   --------------------------------------------   */}

        <Modal
          visible={this.state.visableAddVideo}
          transparent={true}
          onRequestClose={() => {
            this.setState({
              visableAddVideo: false,
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
                  {this.state.addOreditVideo == 'add'
                    ? 'إضافة فيديو'
                    : 'تعديل الفيديو'}
                </Text>

                <TextInput
                  autoFocus={true}
                  theme={{
                    colors: {
                      primary: color,
                      underlineColor: 'transparent',
                    },
                  }}
                  value={this.state.video_title}
                  label={'إسم الفيديو'}
                  autoCapitalize={'none'}
                  onChangeText={(text) => {
                    this.setState({
                      video_title: text,
                    });
                  }}
                  autoCorrect={false}
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    margin: '5%',
                  }}
                />

                <TextInput
                  theme={{
                    colors: {
                      primary: color,
                      underlineColor: 'transparent',
                    },
                  }}
                  value={this.state.video_description}
                  label={'وصف الفيديو'}
                  multiline={true}
                  autoCapitalize={'none'}
                  onChangeText={(text) => {
                    this.setState({
                      video_description: text,
                    });
                  }}
                  autoCorrect={false}
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    margin: '5%',
                    maxHeight: 190,
                  }}
                />
                <TextInput
                  theme={{
                    colors: {
                      primary: color,
                      underlineColor: 'transparent',
                    },
                  }}
                  value={this.state.viemo_id}
                  label={'Video Link ID'}
                  autoCapitalize={'none'}
                  onChangeText={(text) => {
                    this.setState({
                      viemo_id: text,
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
                    if (this.state.addOreditVideo == 'add') {
                      this.addVideo();
                    } else {
                      this.editVideo();
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
                      {this.state.addOreditVideo == 'add' ? 'إضافة' : 'تعديل'}
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
        <Modal
          visible={this.state.visableActionSheet}
          onRequestClose={() => {
            this.setState({
              visableActionSheet: false,
            });
          }}
          transparent={true}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({visableActionSheet: false});
              }}
              style={{flex: 1, width: '100%', height: '100%'}}>
              <View style={{flex: 1, width: '100%', height: '100%'}}></View>
            </TouchableWithoutFeedback>

            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                backgroundColor: '#FFF',
                elevation: 10,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                padding: 30,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Switch
                  value={
                    this.state.selected_video.can_buy == '1' ? true : false
                  }
                  onValueChange={() => {
                    this.toggleVideoToBuy();
                  }}
                />
                <Text>
                  Enabled (
                  {this.state.selected_video.can_buy == '1' ? 'on' : 'off'})
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
