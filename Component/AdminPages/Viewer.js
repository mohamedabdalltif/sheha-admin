import * as React from 'react';
import { Text, View, StyleSheet, Dimensions,TouchableOpacity } from 'react-native';
import {
  Container,
  Picker,
  Form,
  Header,
  Left,
  Body,
  Right,
  Title,
  Spinner,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PDFViewr from './PDFViewr'

import {color} from '../color'

const { width, height } = Dimensions.get('window');


export default class Viewer extends React.Component {

constructor(props){
  super(props);

this.state={
  summary_name:this.props.navigation.getParam("sum_name"),
  summary_link:this.props.navigation.getParam("sum_link"),
}

}

  render() {
    return (

      <Container style={{ flex: 1 }}>
        <Header
          style={{ backgroundColor: color }}
          androidStatusBarColor={color}>
          <Left style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                  this.props.navigation.goBack();
              }}>
              <Icon
                name="angle-right"
                style={{ fontSize: 26, color: '#fff', marginLeft: 20 }}
              />
            </TouchableOpacity>
          </Left>
          <Body
            style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Title numberOfLines={2} style={{ fontSize: 17, fontFamily: 'serif', alignSelf: "center", textAlign: "center" }}>
              {this.state.summary_name}
            </Title>
          </Body>
          <Right />
        </Header>
        <View style={{
          width: "100%",
          backgroundColor: "#f7f7f7",
          height: height - 10,
          // marginTop:60,
          paddingTop: 10,
          paddingHorizontal: 10,
          paddingBottom: 20,
        }}>
          <View style={{
            width: "100%",
            alignSelf: "center",
            height: "100%",
            // borderRadius:10,
            // paddingTop:10,
          }}>
            <PDFViewr  summary_link={this.state.summary_link}/>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});
