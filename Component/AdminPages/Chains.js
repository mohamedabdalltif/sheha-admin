import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
  ToastAndroid,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Ionicons from 'react-native-vector-icons/Ionicons';
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

const Chains = ({navigation}) => {
  const [chains, setChains] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedChain, setSelectedChain] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedChainIndex, setSelectedChainIndex] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);
  //
  const [showAddModal, setShowAddModal] = useState(false);
  const [chainName, setChainName] = useState('');
  const [chainDesc, setChainDesc] = useState('');
  const [canBuy, setCanBuy] = useState('0');
  const [opened, setOpened] = useState('0');
  const [addLoading, setAddLoading] = useState(false);

  //

  const [networkConnection, setNetworkConnection] = useState(true);

  // funs

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkConnection(state.isInternetReachable);
    });
    _getChains();
  }, []);

  const _getChains = async () => {
    setPageLoading(true);

    let data_to_send = {
      generation_id: navigation.getParam('generation_id'),
    };
    let domain = basic.url;

    Axios.post(domain + 'admin/chains.php', data_to_send)
      .then((res) => {
        if ((res.status = 200)) {
          let allData = res.data;
          allData.map((item) => (item.dcLoading = false));
          setChains(allData);
        } else {
          showToast('-حدث خطأ ما برجاء المحاولة لاحقا');
        }
      })
      .finally(() => {
        setPageLoading(false);
      });
  };

  const checkUpdateConfig = () => {
    if (networkConnection) {
      if (selectedChain?.chain_name == '') {
        showToast('الرجاء كتابة اسم الشابتر');
        return;
      }
      // if(selectedChain?.description==""){
      //     showToast("الرجاء كتابة وصف الشابتر")
      //     return
      // }
      _reqUpdateChain();
    } else {
      showToast('الرجاء التأكد من اتصالك بالإنترنت');
    }
  };

  const _reqUpdateChain = async () => {
    setUpdateLoading(true);

    let data_to_send = {
      chain_name: selectedChain.chain_name.trim(),
      description: selectedChain.description.trim(),
      can_buy: selectedChain.can_buy,
      opened: selectedChain.opened,
      chain_id: chains[selectedChainIndex].chain_id,
    };
    let domain = basic.url;

    Axios.post(domain + 'admin/update_chain.php', data_to_send)
      .then((res) => {
        if ((res.status = 200)) {
          if (res.data == 'success') {
            const AllData = [...chains];

            AllData[selectedChainIndex] = Object.assign(
              AllData[selectedChainIndex],
              selectedChain,
            );
            setChains(AllData);
            showToast('تم الحديث بنحاج ✅');
            setSelectedChain({});
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

  const checkAddConfig = () => {
    if (networkConnection) {
      if (chainName == '') {
        showToast('الرجاء كتابة اسم الشابتر');
        return;
      }
      // if(chainDesc==""){
      //     showToast("الرجاء كتابة وصف الشابتر")
      //     return
      // }
      _reqAddChain();
    } else {
      showToast('الرجاء التأكد من اتصالك بالإنترنت');
    }
  };
  const _reqAddChain = async () => {
    setAddLoading(true);

    let data_to_send = {
      chain_name: chainName.trim(),
      generation_id: navigation.getParam('generation_id'),
      description: chainDesc.trim(),
      can_buy: canBuy,
      opened: opened,
    };
    let domain = basic.url;

    Axios.post(domain + 'admin/insert_chain.php', data_to_send)
      .then((res) => {
        if ((res.status = 200)) {
          if (res.data * 0 == 0) {
            setChains([
              ...chains,
              {
                chain_name: chainName.trim(),
                description: chainDesc.trim(),
                chain_id: res.data,
                can_buy: canBuy,
                opened: opened,
                video: [],
              },
            ]);

            showToast('تم إضافة الشابتر بنحاج ✅');

            setShowAddModal(false);
            setChainName('');
            setChainDesc('');
            setCanBuy('0');
            setOpened('0');
          } else if (res.data == 'name_found') {
            showToast('تكرر اسم هذا الشابتر');
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

  const _deleteChain = async (cIndex) => {
    let allData = [...chains];
    allData[cIndex] = Object.assign(allData[cIndex], {dcLoading: true});
    setChains(allData);

    let data_to_send = {
      chain_id: allData[cIndex].chain_id,
    };
    let domain = basic.url;

    Axios.post(domain + 'admin/delete_chain.php', data_to_send).then((res) => {
      if ((res.status = 200)) {
        if (res.data == 'success') {
          setChains(chains.filter((_, index) => index != cIndex));
          showToast('تم حذف الشابتر بنحاج ✅');
        } else {
          let allData = [...chains];
          allData[cIndex] = Object.assign(allData[cIndex], {dcLoading: false});
          setChains(allData);
          showToast('...حدث خطأ ما برجاء المحاولة لاحقا');
        }
      } else {
        let allData = [...chains];
        allData[cIndex] = Object.assign(allData[cIndex], {dcLoading: false});
        setChains(allData);
        showToast('..حدث خطأ ما برجاء المحاولة لاحقا');
      }
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
            الشباتر
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
        data={chains}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => `c-${index}`}
        refreshControl={
          <RefreshControl
            refreshing={pageLoading}
            onRefresh={() => {
              _getChains();
            }}
            colors={[color]}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '80%',
            }}>
            {pageLoading ? (
              <></>
            ) : (
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 22,
                }}>
                لاتوجد شباتر ⚠️
              </Text>
            )}
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
                  {item.chain_name}
                </Text>
                <Text
                  numberOfLines={3}
                  style={{fontWeight: '300', fontSize: 16, color: 'darkgray'}}>
                  {item.description}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                <Button
                  onPress={() => {
                    navigation.navigate('ChainDetails', {
                      cData: item,
                      generation_id: navigation.getParam('generation_id'),
                      refreshPage: _getChains,
                      collections: navigation.getParam('collections'),
                    });
                  }}
                  mode="contained"
                  color={'#00a3e0'}>
                  عرض
                </Button>
                <Button
                  onPress={() => {
                    setSelectedChain(item);
                    setShowEditModal(true);
                    setSelectedChainIndex(index);
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
                      `هل انت متأكد من حذف ${item.chain_name}`,
                      [
                        {
                          text: 'حذف',
                          onPress: () => {
                            _deleteChain(index);
                          },
                        },
                        {
                          text: 'إلغاء',
                          onPress: () => {
                            console.log('cancel delete chain');
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
      {chains.length == 0 && networkConnection == false ? (
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

      {/* Edit Modal */}

      <Modal
        visible={showEditModal}
        onRequestClose={() => {
          if (!updateLoading) {
            setSelectedChain({});
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
                setSelectedChain({});
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
                اسم الشابتر
              </Text>
              <TextInput
                value={selectedChain?.chain_name}
                onChangeText={(value) => {
                  setSelectedChain({...selectedChain, chain_name: value});
                }}
                mode="outlined"
                label="اسم الشابتر"
                theme={{
                  colors: {
                    primary: color,
                    underlineColor: 'transparent',
                  },
                }}
              />
              <Text
                style={{fontWeight: 'bold', fontSize: 22, marginVertical: 8}}>
                وصف الشابتر
              </Text>
              <TextInput
                value={selectedChain?.description}
                onChangeText={(value) => {
                  setSelectedChain({...selectedChain, description: value});
                }}
                mode="outlined"
                label="وصف الشابتر"
                theme={{
                  colors: {
                    primary: color,
                    underlineColor: 'transparent',
                  },
                }}
                multiline={true}
              />
              {/* <View
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
                    selectedChain?.can_buy == '1' ? 'checked' : 'unchecked'
                  }
                  onPress={() => {
                    setSelectedChain({
                      ...selectedChain,
                      can_buy: selectedChain.can_buy == '1' ? '0' : '1',
                    });
                  }}
                />
              </View> */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  متاح للعرض
                </Text>
                <RadioButton
                  status={
                    selectedChain?.opened == '1' ? 'checked' : 'unchecked'
                  }
                  onPress={() => {
                    setSelectedChain({
                      ...selectedChain,
                      opened: selectedChain.opened == '1' ? '0' : '1',
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
                تعديل
              </Button>

              <Button
                disabled={updateLoading}
                color={'#DA291C'}
                mode="contained"
                labelStyle={{fontWeight: 'bold', fontSize: 20}}
                onPress={() => {
                  if (!updateLoading) {
                    setSelectedChain({});
                    setShowEditModal(false);
                  }
                }}>
                إلغاء
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Modal */}

      <Modal
        visible={showAddModal}
        onRequestClose={() => {
          if (!addLoading) {
            setShowAddModal(false);
            setChainName('');
            setChainDesc('');
            setCanBuy('0');
            setOpened('0');
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
                setChainName('');
                setChainDesc('');
                setCanBuy('0');
                setOpened('0');
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
                اسم الشابتر
              </Text>
              <TextInput
                value={chainName}
                onChangeText={(value) => {
                  setChainName(value);
                }}
                mode="outlined"
                label="اسم الشابتر"
                theme={{
                  colors: {
                    primary: color,
                    underlineColor: 'transparent',
                  },
                }}
              />
              <Text
                style={{fontWeight: 'bold', fontSize: 22, marginVertical: 8}}>
                وصف الشابتر
              </Text>
              <TextInput
                value={chainDesc}
                onChangeText={(value) => {
                  setChainDesc(value);
                }}
                mode="outlined"
                label="وصف الشابتر"
                theme={{
                  colors: {
                    primary: color,
                    underlineColor: 'transparent',
                  },
                }}
                multiline={true}
              />
              {/* <View
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
              </View> */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  متاح للعرض
                </Text>
                <RadioButton
                  status={opened == '1' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setOpened(opened == '1' ? '0' : '1');
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
                إضافة شابتر
              </Button>

              <Button
                disabled={addLoading}
                color={'#DA291C'}
                mode="contained"
                labelStyle={{fontWeight: 'bold', fontSize: 20}}
                onPress={() => {
                  if (!addLoading) {
                    setShowAddModal(false);
                    setChainName('');
                    setChainDesc('');
                    setCanBuy('0');
                    setOpened('0');
                  }
                }}>
                إلغاء
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
export default Chains;
