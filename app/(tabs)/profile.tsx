import {View, StyleSheet, Text, Switch, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import {useEffect, useState} from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import {Alert} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "@/app/redux/store";

import {useRouter} from "expo-router";


export default function ProfileScreen() {

    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);


    // State cho thông tin người dùng
    const [name, setName] = useState("Madison Smith");
    const [email, setEmail] = useState("madisons@example.com");
    const [phone, setPhone] = useState("+1234567890");
    const [birthdate, setBirthdate] = useState("01/04/1997");
    const [weight, setWeight] = useState("75 Kg");
    const [height, setHeight] = useState("1.65 CM");
    const [age, setAge] = useState("28");

    // State để kiểm tra nếu đang ở chế độ chỉnh sửa cho từng mục
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingBirthdate, setIsEditingBirthdate] = useState(false);
    const [isEditingWeight, setIsEditingWeight] = useState(false);
    const [isEditingHeight, setIsEditingHeight] = useState(false);


    const login = () => {
        router.push("/authen/login");
    };
    // Hàm để lưu thông tin chỉnh sửa
    const handleSave = () => {
        setIsEditingName(false);
        setIsEditingEmail(false);
        setIsEditingPhone(false);
        setIsEditingBirthdate(false);
        setIsEditingWeight(false);
        setIsEditingHeight(false);
    };


    return (
        <View style={styles.container}>
            {user?.id?.trim() ? (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.profileHeader}>
                        <Ionicons name="person-circle" size={125} color="#fff"/>
                        <Text style={styles.profileTitle}>My Profile</Text>
                    </View>
                    {/* Thông tin cá nhân */}
                    <View style={styles.infoContainer}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Full name</Text>
                            {isEditingName ? (
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                />
                            ) : (
                                <Text style={styles.infoText}>{name}</Text>
                            )}
                            <TouchableOpacity onPress={() => setIsEditingName(!isEditingName)} style={styles.editIcon}>
                                <Ionicons name="pencil" size={20} color="#007BFF"/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Email</Text>
                            {isEditingEmail ? (
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            ) : (
                                <Text style={styles.infoText}>{email}</Text>
                            )}
                            <TouchableOpacity onPress={() => setIsEditingEmail(!isEditingEmail)}
                                              style={styles.editIcon}>
                                <Ionicons name="pencil" size={20} color="#007BFF"/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Phone</Text>
                            {isEditingPhone ? (
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                            ) : (
                                <Text style={styles.infoText}>{phone}</Text>
                            )}
                            <TouchableOpacity onPress={() => setIsEditingPhone(!isEditingPhone)}
                                              style={styles.editIcon}>
                                <Ionicons name="pencil" size={20} color="#007BFF"/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Date of birth</Text>
                            {isEditingBirthdate ? (
                                <TextInput
                                    style={styles.input}
                                    value={birthdate}
                                    onChangeText={setBirthdate}
                                />
                            ) : (
                                <Text style={styles.infoText}>{birthdate}</Text>
                            )}
                            <TouchableOpacity onPress={() => setIsEditingBirthdate(!isEditingBirthdate)}
                                              style={styles.editIcon}>
                                <Ionicons name="pencil" size={20} color="#007BFF"/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Weight</Text>
                            {isEditingWeight ? (
                                <TextInput
                                    style={styles.input}
                                    value={weight}
                                    onChangeText={setWeight}
                                />
                            ) : (
                                <Text style={styles.infoText}>{weight}</Text>
                            )}
                            <TouchableOpacity onPress={() => setIsEditingWeight(!isEditingWeight)}
                                              style={styles.editIcon}>
                                <Ionicons name="pencil" size={20} color="#007BFF"/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Height</Text>
                            {isEditingHeight ? (
                                <TextInput
                                    style={styles.input}
                                    value={height}
                                    onChangeText={setHeight}
                                />
                            ) : (
                                <Text style={styles.infoText}>{height}</Text>
                            )}
                            <TouchableOpacity onPress={() => setIsEditingHeight(!isEditingHeight)}
                                              style={styles.editIcon}>
                                <Ionicons name="pencil" size={20} color="#007BFF"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <></>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={user?.id ? logout : login}>
                <Text style={styles.logoutButtonText}>
                    {user?.id ? "Đăng xuất" : "Đăng nhập"}
                </Text>
            </TouchableOpacity>


        </View>
    );
}

const logout = () => {
    Alert.alert(
        "Xác nhận đăng xuất",
        "Bạn có chắc chắn muốn đăng xuất?",
        [
            {text: "Hủy", style: "cancel"},
            {
                text: "Đăng xuất",
                onPress: () => {
                    console.log("Người dùng đã đăng xuất");
                },
                style: "destructive",
            },
        ]
    );
};


const styles = StyleSheet.create({
    infoContainer: {
        padding: 16,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
    },
    container: {
        flex: 1,
        backgroundColor: "#cbc1c1",
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "space-between", // Ensures the content is spread out
    },
    profileHeader: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 120,
    },
    profileTitle: {
        fontFamily: "Poppins-Bold",
        fontWeight: "700",
        fontSize: 20,
        color: "#030303",
        marginTop: 20,
    },
    basicInfoBox: {
        backgroundColor: "#6b5b5b",
        borderRadius: 10,
        marginBottom: 20,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-around", // Giảm khoảng cách giữa các mục
        alignItems: "center",
    },
    basicInfoItem: {
        alignItems: "center",
        marginBottom: 5, // Giảm khoảng cách giữa các mục
    },
    infoLabel: {
        fontSize: 14,
        color: "#030303",
        marginBottom: 5,
    },
    infoText: {
        fontSize: 16,
        color: "#030303",
    },
    separator: {
        fontSize: 20,
        color: "#100f0f",
        marginHorizontal: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    label: {
        fontFamily: "LeagueSpartan-Regular",
        fontSize: 16,
        color: "#1c1a1a",
        marginBottom: 8,
        flex: 1,
    },
    input: {
        height: 40,
        width: "70%",
        backgroundColor: "#1c1a1a",
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    editIcon: {
        marginLeft: 10,
    },
    saveButton: {
        backgroundColor: "#28a745",
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginTop: 20,
        alignSelf: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    logoutButton: {
        backgroundColor: "#5e8c8c",
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginTop: 30,
        alignSelf: "center",
        marginBottom: 20,
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
