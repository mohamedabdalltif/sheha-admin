import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
  ToastAndroid,
  Dimensions
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  ActivityIndicator,
  Button,
  IconButton,
  RadioButton,
  TextInput,
} from 'react-native-paper';
import {color} from '../color';
import basic from './BasicURL';
import Axios from 'axios';
import ModalHome from 'react-native-modalbox';
import { RFValue } from 'react-native-responsive-fontsize';
import { COLORS } from '../constants';
const { width, height } = Dimensions.get('window');
const ChainDetails = ({navigation}) => {
  const [chainData, setChainData] = useState({});
  const [chainVideos, setChainVideos] = useState([]);
  //
  const [showAddModal, setShowAddModal] = useState(false);
  const [videoName, setVideoName] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoPlayerId, setVideoPlayerId] = useState('');
  const [canBuy, setCanBuy] = useState('0');
  const [addLoading, setAddLoading] = useState(false);
  //
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState({});
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [networkConnection, setNetworkConnection] = useState(true);
  const [gotenCols, setGotenCols] = useState([]);
  const [showColsLoading, setShowColsLoading] = useState(false);
  const [showColsModal, setShowColsModal] = useState(false);
  const [showAppendixModal, setShowAppendixModal] = useState(true);


  // funs

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkConnection(state.isInternetReachable);
    });

    // console.log("collections",Object.keys(navigation.getParam("collections")[0]))
    // console.log("videos",Object.keys(navigation.getParam("cData").video[0]))

    let passData = navigation.getParam('cData');
    let passDataVi = navigation.getParam('cData').video;

    passDataVi?.map((item) => (item.dcLoading = false));
    setChainData(passData);
    setChainVideos(passDataVi);
    return async () => {
      const refLasPage = JSON.parse(await AsyncStorage.getItem('refLasPage'));
      if (refLasPage == '1') {
        let refreshPage = navigation.getParam('refreshPage');
        refreshPage();
        await AsyncStorage.setItem('refLasPage', '0');
      }
    };
  }, []);

  const checkAddConfig = () => {
    if (networkConnection) {
      if (videoName == '') {
        showToast('الرجاء كتابة اسم الفيديو');
        return;
      }
      // if(videoDesc==""){
      //     showToast("الرجاء كتابة وصف الفيديو")
      //     return
      // }
      if (videoPlayerId == '') {
        showToast('الرجاء كتابة عنوان الفيديو Link Id ');
        return;
      }
      _reqAddVideo();
    } else {
      showToast('الرجاء التأكد من اتصالك بالإنترنت');
    }
  };
  const _reqAddVideo = async () => {
    setAddLoading(true);

    let data_to_send = {
      video_title: videoName.trim(),
      description: videoDesc.trim(),
      video_id: videoPlayerId.trim(),
      chain_id: chainData.chain_id,
      can_buy: canBuy,
    };
    let domain = basic.url;

    Axios.post(domain + 'admin/add_video.php', data_to_send)
      .then(async (res) => {
        if (res.status == 200) {
          // console.log(res.data);
          // console.log(res.data * 0 == 0);
          // console.log({
          //   video_description: videoDesc.trim(),
          //   video_id: res.data + '',
          //   video_title: videoName.trim(),
          //   video_player_id: videoPlayerId.trim(),
          //   dcLoading: false,
          // });

          if (res.data * 0 == 0) {
            await AsyncStorage.setItem('refLasPage', '1');

            setChainVideos([
              ...chainVideos,
              {
                video_description: videoDesc.trim(),
                video_id: res.data + '',
                video_title: videoName.trim(),
                video_player_id: videoPlayerId.trim(),
                dcLoading: false,
              },
            ]);

            showToast('تم إضافة الفيديو بنحاج ✅');

            setShowAddModal(false);
            setVideoName('');
            setVideoDesc('');
            setVideoPlayerId('');
            setCanBuy('0');
          } else if (res.data == 'name_found') {
            showToast('تكرر اسم هذا الفيديو');
          } else {
            showToast('...حدث خطأ ما برجاء المحاولة لاحقا');
          }
        } else {
          showToast('..حدث خطأ ما برجاء المحاولة لاحقا');
        }
      })
      .finally(() => {
        setAddLoading(false);
      });
  };

  const checkUpdateConfig = () => {
    if (networkConnection) {
      if (selectedVideo?.video_title == '') {
        showToast('الرجاء كتابة اسم الفيديو');
        return;
      }
      // if(selectedVideo?.video_description==""){
      //     showToast("الرجاء كتابة وصف الفيديو")
      //     return
      // }
      if (selectedVideo?.video_player_id == '') {
        showToast('الرجاء كتابة عنوان الفيديو Link Id ');
        return;
      }
      _reqUpdateVideo();
    } else {
      showToast('الرجاء التأكد من اتصالك بالإنترنت');
    }
  };

  const _reqUpdateVideo = async () => {
    setUpdateLoading(true);

    let data_to_send = {
      video_title: selectedVideo?.video_title.trim(),
      description: selectedVideo?.video_description.trim(),
      video_player_id: selectedVideo?.video_player_id.trim(),
      can_buy: selectedVideo?.can_buy,
      video_id: selectedVideo?.video_id,
    };
    let domain = basic.url;

    Axios.post(domain + 'admin/update_vedio.php', data_to_send)
      .then(async (res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            await AsyncStorage.setItem('refLasPage', '1');
            const AllData = [...chainVideos];

            AllData[selectedVideoIndex] = Object.assign(
              AllData[selectedVideoIndex],
              selectedVideo,
            );
            setChainVideos(AllData);
            showToast('تم الحديث بنحاج ✅');
            setSelectedVideo({});
            setShowEditModal(false);
          } else {
            showToast('.حدث خطأ ما برجاء المحاولة لاحقا');
          }
        } else {
          showToast('حدث خطأ ما برجاء المحاولة لاحقا');
        }
      })
      .finally(() => {
        setUpdateLoading(false);
      });
  };

  const _deleteVideo = async (cIndex) => {
    let allData = [...chainVideos];
    allData[cIndex] = Object.assign(allData[cIndex], {dcLoading: true});
    setChainVideos(allData);

    let data_to_send = {
      video_id: allData[cIndex].video_id,
    };
    let domain = basic.url;

    Axios.post(domain + 'admin/delete_video.php', data_to_send).then(
      async (res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            await AsyncStorage.setItem('refLasPage', '1');

            setChainVideos(chainVideos.filter((_, index) => index != cIndex));
            showToast('تم حذف الفيديو بنحاج ✅');
          } else {
            let allData = [...chainVideos];
            allData[cIndex] = Object.assign(allData[cIndex], {
              dcLoading: false,
            });
            setChainVideos(allData);
            showToast('...حدث خطأ ما برجاء المحاولة لاحقا');
          }
        } else {
          let allData = [...chainVideos];
          allData[cIndex] = Object.assign(allData[cIndex], {dcLoading: false});
          setChainVideos(allData);
          showToast('..حدث خطأ ما برجاء المحاولة لاحقا');
        }
      },
    );
  };

  const _getColsFoVid = async (item) => {
    setShowColsLoading(true);
    let domain = basic.url;

    Axios.post(domain + 'admin/select_cols_show.php', {
      video_id: item.video_id,
    })
      .then((res) => {
        if (res.status == 200) {
          if (Array.isArray(res.data)) {
            let alldata = res.data;
            alldata.map((item) => (item.loading = false));
            setGotenCols(alldata);
          } else {
            showToast('هنا خطأ فى إرجاع المجموعات ❌.');
          }
        } else {
          showToast('هنا خطأ فى إرجاع المجموعات ❌');
        }
      })
      .finally(() => {
        setShowColsLoading(false);
      });
  };

  const _updateShowVide = async (item, vIndex) => {
    let alldata = [...gotenCols];
    alldata[vIndex] = Object.assign(alldata[vIndex], {loading: true});
    setGotenCols(alldata);
    let domain = basic.url;

    Axios.post(domain + 'admin/update_ved_show.php', {
      collection_id: item.show_collection_id,
      show_value: item.show_value == '1' ? '0' : '1',
      video_id: item.show_video_id,
    })
      .then((res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            let alldata = [...gotenCols];
            alldata[vIndex] = Object.assign(alldata[vIndex], {
              show_value: item.show_value == '1' ? '0' : '1',
            });
            setGotenCols(alldata);
            showToast(`تم تعديل عرض الفيديو للمجموعات ✅`);
          } else {
            showToast(`خطأ فى تعديل عرض الفيديو ❌.`);
          }
        } else {
          showToast(`خطأ فى تعديل عرض الفيديو ❌`);
        }
      })
      .finally(() => {
        let alldata = [...gotenCols];
        alldata[vIndex] = Object.assign(alldata[vIndex], {loading: false});
        setGotenCols(alldata);
      });
  };

  const showToast = (msg) => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  // components
  function renderHeader() {
    return (
      <>
        <View
          style={{
            ...styles.headerContainer,
            marginHorizontal: 10,
          }}>
          <IconButton
            size={24}
            icon={() => (
              <Ionicons name="arrow-forward" size={30} color={'#000'} />
            )}
            onPress={() => navigation.goBack()}
          />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: 4,
              textAlign: 'left',
              fontWeight: '800',
              fontSize: 22,
              flex: 1,
            }}>
            {chainData?.chain_name}
          </Text>
          <IconButton
            size={24}
            icon={() => (
              <Ionicons name="md-add-circle" size={30} color={'#000'} />
            )}
            onPress={() => {
              setShowAddModal(true);
            }}
          />
        </View>
      </>
    );
  }

  function renderBody() {
    return (
      <FlatList
        data={chainVideos}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => `c-${index}`}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '80%',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 22,
              }}>
              لاتوجد فيديوهات ⚠️
            </Text>
          </View>
        }
        renderItem={({item, index}) => (
          <View
            style={{
              ...styles.chainContainer,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 22}}>
                  {item.video_title}
                </Text>
                <Text
                  numberOfLines={3}
                  style={{fontWeight: '300', fontSize: 16, color: 'darkgray'}}>
                  {item.video_description}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                <Button
                  onPress={() => {
                    setSelectedVideo(item);
                    setShowColsModal(true);
                    _getColsFoVid(item);
                  }}
                  mode="contained"
                  color={'#00a3e0'}>
                  مجموعات العرض
                </Button>
                <Button
                  onPress={() => {
                    setShowAppendixModal(true)
                  }}
                  mode="contained"
                  style={{marginVertical: 5}}
                  color={'#007A33'}>
                إضافة ملحق
                </Button>
                <Button
                  onPress={() => {
                    setShowEditModal(true);
                    setSelectedVideo(item);
                    setSelectedVideoIndex(index);
                  }}
                  mode="contained"
                  style={{marginVertical: 5}}
                  color={'#007A33'}>
                  تعديل
                </Button>
                
                <Button
                  loading={item.dcLoading}
                  onPress={() => {
                    Alert.alert(
                      'Admin ⚠️',
                      `هل انت متأكد من حذف ${item.video_title}`,
                      [
                        {
                          text: 'إلغاء',
                          onPress: async () => {
                            console.log('cancel delete chain');
                          },
                        },
                        {
                          text: 'حذف',
                          onPress: () => {
                            _deleteVideo(index);
                          },
                        },
                      ],
                    );
                  }}
                  mode="contained"
                  color={'#DA291C'}>
                  حذف
                </Button>
              </View>
            </View>
          </View>
        )}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
      }}>
      {renderHeader()}
      {chainData?.video?.length == 0 && networkConnection == false ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 22,
            }}>
            برجاء التأكد من اتصالك بالإنترنت
          </Text>
        </View>
      ) : (
        renderBody()
      )}

      {/* Add Modal */}

      <Modal
        visible={showAddModal}
        onRequestClose={() => {
          if (!addLoading) {
            setShowAddModal(false);
            setVideoName('');
            setVideoDesc('');
            setVideoPlayerId('');
            setCanBuy('0');
          }
        }}
        transparent={true}
        animationType="slide">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>
          <TouchableOpacity
            onPress={() => {
              if (!addLoading) {
                setShowAddModal(false);
                setVideoName('');
                setVideoDesc('');
                setVideoPlayerId('');
                setCanBuy('0');
              }
            }}
            style={StyleSheet.absoluteFillObject}></TouchableOpacity>

          <View
            style={{
              width: '90%',
              height: '80%',
              padding: 10,
              backgroundColor: 'white',
              borderRadius: 8,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={{fontWeight: 'bold', fontSize: 22, marginVertical: 8}}>
                اسم الفيديو
              </Text>
              <TextInput
                value={videoName}
                onChangeText={(value) => {
                  setVideoName(value);
                }}
                mode="outlined"
                label="اسم الفيديو"
                theme={{
                  colors: {
                    primary: color,
                    underlineColor: 'transparent',
                  },
                }}
              />
              <Text
                style={{fontWeight: 'bold', fontSize: 22, marginVertical: 8}}>
                وصف الفيديو
              </Text>
              <TextInput
                value={videoDesc}
                onChangeText={(value) => {
                  setVideoDesc(value);
                }}
                mode="outlined"
                label="وصف الفيديو"
                theme={{
                  colors: {
                    primary: color,
                    underlineColor: 'transparent',
                  },
                }}
                multiline={true}
              />
              <Text
                style={{fontWeight: 'bold', fontSize: 22, marginVertical: 8}}>
                Video Player Id
              </Text>
              <TextInput
                value={videoPlayerId}
                onChangeText={(value) => {
                  setVideoPlayerId(value);
                }}
                keyboardType="number-pad"
                mode="outlined"
                label="Video Player Id"
                theme={{
                  colors: {
                    primary: color,
                    underlineColor: 'transparent',
                  },
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  متاح للشراء{' '}
                </Text>
                <RadioButton
                  status={canBuy == '1' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setCanBuy(canBuy == '1' ? '0' : '1');
                  }}
                />
              </View>

              <Button
                loading={addLoading}
                disabled={addLoading}
                color={color}
                mode="contained"
                labelStyle={{fontWeight: 'bold', fontSize: 20}}
                onPress={() => {
                  checkAddConfig();
                }}
                style={{
                  marginVertical: 20,
                }}>
                إضافة فيديو
              </Button>

              <Button
                disabled={addLoading}
                color={'#DA291C'}
                mode="contained"
                labelStyle={{fontWeight: 'bold', fontSize: 20}}
                onPress={() => {
                  if (!addLoading) {
                    setShowAddModal(false);
                    setVideoName('');
                    setVideoDesc('');
                    setVideoPlayerId('');
                    setCanBuy('0');
                  }
                }}>
                إلغاء
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}

      <Modal
        visible={showEditModal}
        onRequestClose={() => {
          if (!updateLoading) {
            setSelectedVideo({});
            setShowEditModal(false);
          }
        }}
        transparent={true}
        animationType="slide">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>
          <TouchableOpacity
            onPress={() => {
              if (!updateLoading) {
                setSelectedVideo({});
                setShowEditModal(false);
              }
            }}
            style={StyleSheet.absoluteFillObject}></TouchableOpacity>

          <View
            style={{
              width: '90%',
              height: '80%',
              padding: 10,
              backgroundColor: 'white',
              borderRadius: 8,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={{fontWeight: 'bold', fontSize: 22, marginVertical: 8}}>
                اسم الفيديو
              </Text>
              <TextInput
                value={selectedVideo?.video_title}
                onChangeText={(value) => {
                  setSelectedVideo({...selectedVideo, video_title: value});
                }}
                mode="outlined"
                label="اسم الفيديو"
                theme={{
                  colors: {
                    primary: color,
                    underlineColor: 'transparent',
                  },
                }}
              />
              <Text
                style={{fontWeight: 'bold', fontSize: 22, marginVertical: 8}}>
                وصف الفيديو
              </Text>
              <TextInput
                value={selectedVideo?.video_description}
                onChangeText={(value) => {
                  setSelectedVideo({
                    ...selectedVideo,
                    video_description: value,
                  });
                }}
                mode="outlined"
                label="وصف الفيديو"
                theme={{
                  colors: {
                    primary: color,
                    underlineColor: 'transparent',
                  },
                }}
                multiline={true}
              />
              <Text
                style={{fontWeight: 'bold', fontSize: 22, marginVertical: 8}}>
                Video Player Id
              </Text>
              <TextInput
                value={selectedVideo?.video_player_id}
                onChangeText={(value) => {
                  setSelectedVideo({...selectedVideo, video_player_id: value});
                }}
                keyboardType="number-pad"
                mode="outlined"
                label="Video Player Id"
                theme={{
                  colors: {
                    primary: color,
                    underlineColor: 'transparent',
                  },
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  متاح للشراء{' '}
                </Text>
                <RadioButton
                  status={
                    selectedVideo?.can_buy == '1' ? 'checked' : 'unchecked'
                  }
                  onPress={() => {
                    setSelectedVideo({
                      ...selectedVideo,
                      can_buy: selectedVideo?.can_buy == '1' ? '0' : '1',
                    });
                  }}
                />
              </View>

              <Button
                loading={updateLoading}
                disabled={updateLoading}
                color={color}
                mode="contained"
                labelStyle={{fontWeight: 'bold', fontSize: 20}}
                onPress={() => {
                  checkUpdateConfig();
                }}
                style={{
                  marginVertical: 20,
                }}>
                تعديل فيديو
              </Button>

              <Button
                disabled={updateLoading}
                color={'#DA291C'}
                mode="contained"
                labelStyle={{fontWeight: 'bold', fontSize: 20}}
                onPress={() => {
                  if (!updateLoading) {
                    setSelectedVideo({});
                    setShowEditModal(false);
                  }
                }}>
                إلغاء
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Cols Modal */}

      <Modal
        visible={showColsModal}
        onRequestClose={() => {
          setSelectedVideo({});
          setShowColsModal(false);
        }}
        transparent={true}
        animationType="slide">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>
          <TouchableOpacity
            onPress={() => {
              setSelectedVideo({});
              setShowColsModal(false);
            }}
            style={StyleSheet.absoluteFillObject}></TouchableOpacity>

          <View
            style={{
              width: '90%',
              height: '80%',
              padding: 10,
              backgroundColor: 'white',
              borderRadius: 8,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={{fontWeight: 'bold', fontSize: 22, marginVertical: 8}}>
                المجموعات المتاحة لعرض الفيديو
              </Text>

              {showColsLoading ? (
                <ActivityIndicator
                  size={40}
                  color={color}
                  style={{marginVertical: 40}}
                />
              ) : gotenCols.length > 0 ? (
                gotenCols?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                      //   justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flex: 1,
                      }}>
                      <Text style={{fontWeight: 'bold', fontSize: 20}}>
                        {item.collection_name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {item.loading ? (
                        <ActivityIndicator color={color} />
                      ) : (
                        <RadioButton
                          color={color}
                          status={
                            item.show_value == '1' ? 'checked' : 'unchecked'
                          }
                          onPress={() => {
                            _updateShowVide(item, index);
                          }}
                        />
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <View>
                  <Text
                    style={{
                      fontWeight: '800',
                      fontSize: 19,
                    }}>
                    لا توجد مجموعات متاحة ⚠️
                  </Text>
                </View>
              )}

              <Button
                color={'#DA291C'}
                mode="contained"
                labelStyle={{fontWeight: 'bold', fontSize: 20}}
                onPress={() => {
                  setSelectedVideo({});
                  setShowColsModal(false);
                }}>
                إلغاء
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>




      {/* add appendix */}
      <ModalHome
            onRequestClose={() => {
              // this.setState({
              //   modalVisible2: false,
              // });
              setShowAppendixModal(false)
            }}
            style={{
              // height:RFValue(10),
              padding: 15,
              maxHeight:RFValue(150),
              // borderTopRightRadius: 15,
              // borderTopLeftRadius: 15,
              backgroundColor: '#fff',
              // zIndex: 1235200000000566788899,
            }}
            backButtonClose={true}
            backdropPressToClose={true}
            isOpen={showAppendixModal}
            backdrop={true}
            // entry='bottom'
            onClosed={() => {
              setShowAppendixModal(false)
            }}
            // swipeArea={20}
            // swipeThreshold={50}
            position="bottom"
            useNativeDriver={true}>
            {/* <ScrollView showsVerticalScrollIndicator={false} style={{}}> */}
              
              <TouchableOpacity
                style={{ flexDirection: 'row', marginBottom: 20 }}
                onPress={() => {
                  // this.props.navigation.navigate('ListOfExams', {
                  //   generation_id: this.state.item.generation_id,
                  //   collection_id: this.state.item.collection_id,
                  // });
                  // this.setState({ modalVisible2: false });
                  navigation.navigate("VidQuestion")
                  setShowAppendixModal(false)
                }}>
                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                  <Icon
                    name="question"
                    size={25}
                    style={{ color: '#6CBD8A', marginLeft: 5 }}
                  />
                </View>
                <Text style={{ fontSize: 18 }}>إضافة الأسئله</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: 'row', marginBottom: 20 }}
                onPress={() => {
                  
                 navigation.navigate("AddVidSummary")
                  setShowAppendixModal(false)
                }}>
                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                  <Icon
                    name="book-open"
                    size={25}
                    style={{ color:COLORS.red, marginLeft: 5 }}
                  />
                </View>
                <Text style={{ fontSize: 18 }}>إضافة الملخص</Text>
              </TouchableOpacity>
             

             

              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => {
                  // this.setState({ modalVisible2: false });
                  setShowAppendixModal(false)
                }}>
                <View style={{ width: '15%', alignItems: 'flex-start' }}>
                  <Icon
                    name="times"
                    size={25}
                    style={{ color: '#ea943b', marginLeft: 10 }}
                  />
                </View>
                <Text style={{ fontSize: 18 }}>الغاء</Text>
              </TouchableOpacity>
            {/* </ScrollView> */}
          </ModalHome>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent:"space-between",
    borderRadius: 8,
    backgroundColor: '#F5F5F8',
    paddingHorizontal: 10,
  },
  chainContainer: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    marginVertical: 10,
    alignSelf: 'center',
  },
});
export default ChainDetails;
