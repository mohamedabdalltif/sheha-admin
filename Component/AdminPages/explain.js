import * as React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
    FlatList,
    AsyncStorage,
    ScrollView,
    TextInput,
    Linking, ToastAndroid
} from 'react-native';
import {
    Container,
    Header,
    Left,
    Body,
    Right,
    Title,
    Spinner,
    Fab,
    Button,

} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import basic from './BasicURL'
import { color } from '../color'


const { width, height } = Dimensions.get('window');

export default class SummaryList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            collection_id: this.props.navigation.getParam("collection_id"),
            //   student_id: "",
            summary: [],
            loading: true,
            value: "",
            namelink: "",
            openexpline: ''

        };
    }




    componentDidMount() {
        this.get_summary();
    }







    add_zoom_link() {
        let zoom_name = this.state.namelink.trim(),
            zoom_link = this.state.openexpline.trim(),
            zoom_collection_id = this.state.collection_id

        if (zoom_name == "") {
            Alert.alert(
                'أدمن',
                'يجب إدخال إسم الاجتماع'
            )
            return
        } else if (zoom_link == "") {
            Alert.alert(
                'أدمن',
                'يجب إدخال إسم اللينك'
            )
            return
        } else {


            this.setState({ loading: true })
            let data_to_send = {
                zoom_name: zoom_name,
                zoom_link: zoom_link,
                zoom_collection_id: zoom_collection_id,

            }


            axios
                .post(
                    basic.url + `admin/insert_link.php`,
                    data_to_send
                )
                .then((res) => {
                    if (res.status == 200) {
                        // alert(res.data)
                        if (res.data == 'success') {
                            this.get_summary()
                            this.setState({
                                openexpline: '',
                                namelink: ''
                            })
                            Alert.alert(
                                'أدمن',
                                'تمت إضافة الاجتماع بنجاح'
                            )
                        } else {
                            Alert.alert('أدمن', 'خطأ');
                        }
                    } else {
                        Alert.alert('أدمن', 'خطأ');
                    }
                    this.setState({ loading: false })
                }
                );
        }
    }


    delete_link(index) {
        let data_to_send = {
            zoom_id: this.state.summary[index].zoom_id
        }
        // alert(JSON.stringify(data_to_send))


        axios.post(basic.url + `admin/delete_link.php`,
            data_to_send
        ).then((res) => {
            this.setState({ loading: true })
            if (res.status == 200) {
                if (res.data == 'success') {
                    this.get_summary()

                    ToastAndroid.showWithGravity(
                        "تم حذف الاجتماع بنجاح",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM
                    );
                } else {
                    Alert.alert('أدمن', 'خطأ');
                }
            } else {
                Alert.alert('أدمن', 'خطأ');
            }

        }
        );

    }







    allert(index) {
        Alert.alert(
            "ادمن",
            "هل انت متاكد من مسح الرابط",
            [
                {
                    text: "الغاء",
                    onPress: () => console.log("cansel Pressed"),

                },
                {
                    text: "مسح", onPress: () => this.delete_link(index)
                }
            ],
            { cancelable: false }
        );
    }

















    get_summary = () => {
        // this.setState({disabled: true});
        // this.setState({ loading: true });
        let data_to_send = {
            collection_id: this.state.collection_id,

        };
        axios
            .post(
                basic.url + `select_links.php`,
                data_to_send
            )
            .then((res) => {
                // alert(JSON.stringify(res.data))
                if (res.status == 200) {
                    console.log(JSON.stringify(res.data.zoom))
                    if (res.data != 'error') {
                        if (res.data.zoom.length > 0) {

                            this.setState({
                                summary: res.data.zoom,
                            });
                            // console.log(this.state.exams)
                        } else {
                            this.setState({
                                summary: [],
                            });
                        }
                    } else {
                        Alert.alert('أدمن', 'عذرا يرجي المحاوله في وقتا لاحق');
                    }
                } else {
                    Alert.alert('أدمن', 'عذرا يرجي المحاوله في وقتا لاحق');
                }
                this.setState({ loading: false });
            });
    }

    render() {
        return (
            <Container style={{ backgroundColor: '#f7f7f7' }}>
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
                                size={35}
                                style={{ color: '#fff', marginLeft: 10 }}
                            />
                        </TouchableOpacity>
                    </Left>
                    <Body
                        style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        <Title numberOfLines={2} style={{ fontSize: 17, fontFamily: 'serif', alignSelf: "center", textAlign: "center" }}>
                            الشرح
                        </Title>
                    </Body>
                    <Right />
                </Header>


                {
                    // <Text>{item.exam_name}</Text>
                }
                <ScrollView>
                    {this.state.loading == true ? (
                        <Spinner color={color} size={40} style={{ marginTop: 200 }} />
                    ) : (

                        <View>


                            <TextInput
                                // value={this.state.value}
                                onChangeText={(text) => {
                                    this.setState({ namelink: text })

                                }}
                                multiline={true}
                                placeholder="      الاسم"
                                style={{ width: "90%", borderWidth: .5, borderRadius: 20, alignSelf: "center", marginTop: 20, color: "#000" }}
                            >

                            </TextInput>


                            <TextInput
                                // value={this.state.value}
                                onChangeText={(text) => {
                                    this.setState({ openexpline: text })

                                }}
                                multiline={true}
                                placeholder="      ضع الرابط"
                                style={{ width: "90%", borderWidth: .5, borderRadius: 20, alignSelf: "center", marginTop: 20, color: "#000" }}
                            >

                            </TextInput>

                            <Button
                                disabled={this.state.loading}
                                onPress={() => {
                                    this.add_zoom_link()

                                }}
                                style={{
                                    width: '90%',
                                    backgroundColor: color,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 20,
                                    alignSelf: 'center',
                                    borderRadius: 10,
                                    marginBottom: 20,

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
                            {this.state.summary.length == 0 ? (
                                <View
                                    style={{
                                        width: width,
                                        height: height - 50,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            color: color,
                                        }}>
                                        لا يوجد شرح
                                    </Text>
                                </View>

                            ) : (
                                <View style={{ marginVertical: 5 }}>
                                    <View style={{ justifyContent: "center", alignContent: "center", marginBottom: 15 }}>
                                        <Text style={{ color: "#9a9999", textAlign: "center" }}>
                                            (اضغط مطولا للمسح)
                                        </Text>

                                    </View>




                                    {/* <ScrollView> */}

                                    <FlatList
                                        data={this.state.summary}
                                        renderItem={({ item, index }) => (
                                            <>

                                                <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>

                                                    <TouchableOpacity
                                                        style={{
                                                            width: '79%',
                                                            alignSelf: 'center',
                                                            paddingHorizontal: 12,
                                                            paddingVertical: 15,
                                                            borderRadius: 7,
                                                            backgroundColor: '#fff',
                                                            marginBottom: 10,
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                        }}
                                                        onLongPress={() => {
                                                            this.allert(index)
                                                        }}
                                                        onPress={() => {

                                                            Linking.openURL(item.zoom_link)


                                                        }}>

                                                        <View style={{ padding: -1 }}>

                                                            <Text style={{ fontSize: 22, color: '#444' }}>
                                                                {item.zoom_name}
                                                            </Text>

                                                        </View>


                                                    </TouchableOpacity>

                                                    <View style={{ justifyContent: "center", alignItems: "center", width: "12%" }}>

                                                        <Icon
                                                            name='video'
                                                            style={{
                                                                fontSize: 30,
                                                                color: color,
                                                                marginLeft: 10,
                                                            }}
                                                        />

                                                    </View>
                                                </View>








                                            </>
                                        )}
                                    />
                                    {/* <View style={{ width: "100%", height: 350 }}>

                                                </View> */}
                                    {/* </ScrollView> */}

                                </View>

                            )}
                        </View>
                    )}

                </ScrollView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({});

