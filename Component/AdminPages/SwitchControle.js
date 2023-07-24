import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  StatusBar,
  Image,
} from 'react-native';

export default class SwitchControle extends React.Component {
  componentDidMount() {
    // setTimeout(()=>{
    //   if(SwitchNavigation!=null){
    //     if(SwitchNavigation=="Auth"){
    //       this.props.navigation.navigate("Auth")
    //     }else if(SwitchNavigation=="Home"){
    //       this.props.navigation.navigate("HomePages")
    //     }
    //   }else{
    //     this.props.navigation.navigate("Auth")
    //   }
    // },4000)
  }

  render() {
    return (
      <View style={{backgroundColor: '#fff', width: '100%', height: '100%'}}>
        <StatusBar backgroundColor="#8A3982" />
        <Image
          source={require('../images/logo.jpg')}
          style={{
            width: '95%',
            height: 400,
            alignSelf: 'center',
            marginTop: 200,
          }}
        />
      </View>
    );
  }
}
