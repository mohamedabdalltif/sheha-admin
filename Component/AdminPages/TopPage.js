import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    Image,
    ImageBackground,
    Dimensions,
    KeyboardAvoidingView,
} from 'react-native';
import {
    Container,
    Header,
    Left,
    Body,
    Right,
    Title,
    Toast,
    Spinner,
} from 'native-base';
import { Hoshi } from 'react-native-textinput-effects';
import Icon from 'react-native-vector-icons/FontAwesome5';
const { width, height } = Dimensions.get('window');
import axios from 'axios';
import { Searchbar } from 'react-native-paper';
import basic from './BasicURL'
import { color } from '../color'


export default class TopPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exam_id: 'Exam_1',
            data: [],
            students: [],
            loading: true,
            studentId: '',
            searchQuery: '',
        };
    }


    allert(name, exam_id, index) {
        Alert.alert(
            "ادمن",

            " هل انت متاكد من اعاده امتحان ( " + name + " ) للطالب ؟ ",
            [
                {
                    text: "الغاء",
                    onPress: () => console.log("cansel Pressed"),

                },
                {
                    text: "اعادة", onPress: () => this.Re_Start_Exam(exam_id, index)
                }
            ],
            { cancelable: false }
        );
    }

    componentDidMount() {
        this.info();
    }
    info = () => {
        this.setState({ loading: true });
        let exam_id = this.props.navigation.getParam('exam_id');
        let generation_id = this.props.navigation.getParam('generation_id');
        let data_to_send = {
            generation_id: generation_id
        };
        // alert(JSON.stringify(data_to_send)) 

        // console.log(data_to_send)
        // alert(JSON.stringify(generation_id))
        axios
            .post(
                basic.url + 'select_generation_order.php',
                data_to_send
            )
            .then((res) => {
                if (res.status == 200) {
                    // alert(JSON.stringify(res.data))

                    if (res.data != 'error') {
                        this.setState({
                            // generation_id: generation_id,
                            data: res.data

                        });
                    } else {
                        Alert.alert('أدمن', 'هناك خطأ ما في استرجاع بيانات الامتحان');

                    }
                } else {
                    alert('error');

                }

                this.setState({ loading: false });
            });
    };

    onChangeSearch = (searchQuery) => {
        // let searchQuery = this.state.searchQuery;

        let list = this.state.students;
        let data = [];
        for (let i = 0; i < list.length; i++) {
            // console.log(list[i].student_name.startsWith(searchQuery))
            // console.log(searchQuery)
            if (
                list[i].student_name.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
                data.push(list[i]);
            }
        }

        this.setState({ data: data });
    };

    render() {
        return (
            <Container
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#EAEAEA',
                    // alignItems: 'center',
                    // justifyContent: 'center',
                }}>
                <Header
                    style={{ backgroundColor: color }}
                    androidStatusBarColor={color}>
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.goBack();
                            }
                            }
                        >
                            <Icon
                                name="angle-right"
                                size={35}
                                style={{ color: '#fff', marginLeft: 10 }}
                            />
                        </TouchableOpacity>
                    </Left>
                    <Body
                        style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                        <Title style={{ fontSize: 22, fontFamily: 'serif' }}>
                            الاوائل
            </Title>
                    </Body>
                    <Right />
                </Header>
                <ScrollView>
                    {this.state.loading == true ? (
                        <Spinner color={color} size={40} style={{ marginTop: 200 }} />
                    ) : (
                            <View>
                                {this.state.data == null ? (
                                    <View
                                        style={{
                                            width: width,
                                            height: height - 100,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                color: color,
                                            }}>
                                            لا يوجد طلاب بعد
                  </Text>
                                    </View>
                                ) : (
                                        <View style={{ paddingHorizontal: 10, paddingVertical: 15 }}>
                                            <Searchbar
                                                placeholder="اسم الطالب"
                                                onChangeText={(query) => {
                                                    this.setState({ searchQuery: query });
                                                    this.onChangeSearch(query);
                                                }}
                                                value={this.state.searchQuery}
                                                style={{
                                                    width: '95%',
                                                    marginBottom: 0,
                                                    alignSelf: 'center',
                                                }}
                                            />
                                            <View
                                                style={{
                                                    width: '95%',
                                                    flexDirection: 'row',
                                                    marginTop: 25,
                                                    // height: height * 0.05,
                                                    marginBottom: 5,
                                                    alignSelf: 'center',
                                                    // backgroundColor:"#000"

                                                }}>
                                                <View
                                                    style={{
                                                        backgroundColor: 'white',
                                                        width: '15%',
                                                        justifyContent: 'center',
                                                        borderTopStartRadius: 20,
                                                        borderBottomStartRadius: 20,

                                                        borderRightWidth: 2,
                                                        borderRightColor: "#000",
                                                        paddingVertical: 10,
                                                    }}>
                                                    <Icon
                                                        name="award"
                                                        style={{ fontSize: 20, color: '#000', alignSelf: 'center', }}
                                                    />
                                                </View>

                                                <View
                                                    style={{
                                                        backgroundColor: 'white',
                                                        width: '60%',
                                                        borderRightWidth: 2,
                                                        justifyContent: 'center',

                                                    }}>
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontSize: 18,
                                                            fontWeight: 'bold',
                                                        }}>
                                                        اسم الطالب
                      </Text>
                                                </View>

                                                <View
                                                    style={{
                                                        backgroundColor: 'white',
                                                        width: '25%',
                                                        justifyContent: 'center',
                                                        borderTopEndRadius: 20,
                                                        borderBottomEndRadius: 20,

                                                    }}>
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontSize: 18,
                                                            fontWeight: 'bold',
                                                        }}>
                                                        التراكمي
                      </Text>
                                                </View>
                                            </View>

                                            {this.state.data.map((str, index) => (
                                                // return (
                                                <View
                                                    style={{
                                                        width: '95%',
                                                        flexDirection: 'row',
                                                        marginTop: 5,
                                                        // height: height * 0.05,
                                                        marginBottom: 5,
                                                        alignSelf: 'center',

                                                    }}

                                                >
                                                    <View
                                                        style={{
                                                            backgroundColor: 'white',
                                                            width: '15%',
                                                            justifyContent: 'center',
                                                            borderTopStartRadius: 20,
                                                            borderBottomStartRadius: 20,
                                                            borderRightWidth: 2,
                                                            borderRightColor: "#000",
                                                            paddingVertical: 10,
                                                        }}>
                                                        <Text

                                                            style={{ fontSize: 16, color: '#000', alignSelf: 'center', }}
                                                        >
                                                            {index + 1}
                                                        </Text>
                                                    </View>

                                                    <View
                                                        style={{
                                                            backgroundColor: 'white',
                                                            width: '60%',
                                                            borderRightWidth: 2,
                                                            justifyContent: 'center',

                                                        }}>
                                                        <Text
                                                            style={{
                                                                textAlign: 'center',
                                                                fontSize: 16,
                                                                // fontWeight: 'bold',
                                                            }}>
                                                            {str.student_name}
                                                        </Text>
                                                    </View>

                                                    <View
                                                        style={{
                                                            backgroundColor: 'white',
                                                            width: '25%',
                                                            justifyContent: 'center',
                                                            borderTopEndRadius: 20,
                                                            borderBottomEndRadius: 20,

                                                        }}>
                                                        <Text
                                                            style={{
                                                                textAlign: 'center',
                                                                fontSize: 16,
                                                                // fontWeight: 'bold',
                                                            }}>
                                                            {str.final_score}

                                                        </Text>
                                                    </View>
                                                </View>
                                                // );
                                            ))}
                                        </View>
                                    )}
                            </View>
                        )}
                </ScrollView>
            </Container>
        );
    }
}
