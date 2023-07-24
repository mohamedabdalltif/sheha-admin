import React, {Component} from 'react';

import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  AsyncStorage,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Root,
  Spinner,
} from 'native-base';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import basic from './BasicURL';

import {color} from '../color';

export default class Generations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: '',
      NameOfClass: '',
      id: '',
      data: [],
      modalVisable: false,
      modalVisible2: false,
      disabled: false,
      menuHeight: 0,
      AllStudents: '',
      AllStudentsPending: '',
      refresh: true,
      item: '',
      changeButton: true,
    };
    this._refreshPages = this._refreshPages.bind(this);
  }
  componentDidMount() {
    this.getgenedata();
  }

  async _refreshPages() {
    let domain = basic.url;

    axios.get(domain + 'select_generations.php').then((res) => {
      this.setState({disabled: false});
      this.setState({data: res.data.gens});
      let array = res.data.gens;
      let Number = 0;
      let NumberPending = 0;
      for (let i = 0; i < array.length; i++) {
        Number =
          Number +
          (parseInt(array[i].student_with_pending) +
            parseInt(array[i].student_without_pending));
        NumberPending = NumberPending + parseInt(array[i].student_with_pending);
      }
      this.setState({AllStudents: Number, AllStudentsPending: NumberPending});
    });
  }

  async getgenedata() {
    this.setState({disabled: true});
    let domain = basic.url;

    axios.get(domain + 'select_generations.php').then((res) => {
      // alert(JSON.stringify(res.data))
      this.setState({disabled: false});
      this.setState({data: res.data.gens});
      let array = res.data.gens;
      let Number = 0;
      let NumberPending = 0;
      for (let i = 0; i < array.length; i++) {
        Number =
          Number +
          (parseInt(array[i].student_with_pending) +
            parseInt(array[i].student_without_pending));
        NumberPending = NumberPending + parseInt(array[i].student_with_pending);
      }
      this.setState({AllStudents: Number, AllStudentsPending: NumberPending});
    });
  }

  renderClasses(item) {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('MainChallenges', {
              AllData: item,
            });
          }}
          key={item.generation_id}>
          <View style={styles.order}>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                {item.generation_name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <Root>
        <Container>
          <Header
            style={{backgroundColor: color}}
            androidStatusBarColor={color}>
            <Left style={{flex: 1}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name="angle-right"
                  size={35}
                  style={{paddingRight: 10, paddingLeft: 10, color: '#FFF'}}
                />
              </TouchableOpacity>
            </Left>

            <Body style={{flex: 3, alignItems: 'center'}}>
              <Title>الدفعات</Title>
            </Body>
            <Right style={{flex: 1}} />
          </Header>

          <ScrollView style={{marginBottom: 20, marginTop: 20}}>
            {this.state.disabled == false ? (
              <FlatList
                keyExtractor={(_, index) => index.toString()}
                data={this.state.data}
                numColumns={1}
                renderItem={({item}) => this.renderClasses(item)}
              />
            ) : (
              <Spinner color={color} style={{marginTop: 100}} />
            )}
          </ScrollView>
        </Container>
      </Root>
    );
  }
}
const styles = StyleSheet.create({
  order: {
    marginTop: 0,
    marginBottom: 10,

    width: '97%',
    marginLeft: 5,
    backgroundColor: 'rgba(255,255,255,.7)',
    padding: 20,
    // height: 150,
    borderRadius: 10,
    borderColor: '#bcbaba',
    borderWidth: 1,
  },
  menu: {
    width: '80%',

    position: 'absolute',
  },
});
