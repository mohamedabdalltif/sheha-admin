import * as React from 'react';
import {StatusBar} from 'react-native';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
  FlatList,
  AsyncStorage,
  ImageBackground,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  // Icon,
  Item,
  Toast,
  Root,
  Spinner,
  ActionSheet,
  Button,
  Fab,
} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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
      active: 0,
      xTabOne: 0,
      xTabTwo: 0,
      translateX: new Animated.Value(0),
      translateXTabTwo: new Animated.Value(width),
      translateXTabOne: new Animated.Value(0),
      translateY: -1000,
      Buy_videos_array: [],
      My_videos_array: [],
      isPageLoading: true,
      unableWatchModal: false,
      alertBeforeWatchingModal: false,
      vedio_details: null,
      wrongModal: false,
      WrongModalReason: '',
      thereIsVideos: false,
      checkInsertViewFun: false,
    };
  }

  componentDidMount() {
    this.setState({isPageLoading: true});

    this.getAllMyVediosFor();
  }

  handelSlide = (type) => {
    Animated.spring(this.state.translateX, {
      toValue: type - 162,
      duration: 100,
      useNativeDriver: true,
    }).start();
    if (this.state.active === 1) {
      Animated.parallel([
        Animated.spring(this.state.translateXTabOne, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start(),
        Animated.spring(this.state.translateXTabTwo, {
          toValue: width,
          duration: 100,
          useNativeDriver: true,
        }).start(),
      ]);
    } else {
      Animated.parallel([
        Animated.spring(this.state.translateXTabOne, {
          toValue: -width,
          duration: 100,
          useNativeDriver: true,
        }).start(),
        Animated.spring(this.state.translateXTabTwo, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start(),
      ]);
    }
  };

  getAllMyVediosFor = async () => {
    let generation_id = this.props.navigation.getParam('generation_id');

    this.setState({
      isPageLoading: true,
    });
    // let data_to_send = {
    //   playlist_id: this.state.chainDetails.chain_id,
    //   student_id: StudentData.student_id,
    // };
    let data_to_send = {
      generation_id: generation_id,
    };

    // alert(JSON.stringify(data_to_send));

    axios
      .post(basic.url + 'admin/select_videos.php', data_to_send)
      .then((res) => {
      
        this.setState({
          isPageLoading: false,
        });
        if (Array.isArray(res.data) && res.data.length != 0) {
          this.setState({My_videos_array: res.data, thereIsVideos: true});
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
      <View
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
          <View style={{width: '100%', alignItems: 'center',flexDirection:'row',justifyContent:'space-between'}}>
            <Text
              numberOfLines={1}
              style={{fontFamily: 'Janna LT Bold', fontSize: 16}}>
              {item.video_price} LE
            </Text>
            <View style={{flexDirection:'row'}}>
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
                alignSelf: 'center',
              }}
            />
            
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
       
        <Header
            style={{backgroundColor: color}}
            androidStatusBarColor={color}>
            <Left style={{flex: 1}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name="angle-right"
                  style={{fontSize: 35, color: '#fff', marginLeft: 10}}
                />
              </TouchableOpacity>
            </Left>
            <Body style={{flex: 3, alignItems: 'center'}}>
              <Title>الفديوهات</Title>
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
              <FlatList
                data={this.state.My_videos_array}
                keyExtractor={(item) => item.video_id}
                renderItem={this.renderMyVideoDetails}
              />
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
      </View>
    );
  }
}
