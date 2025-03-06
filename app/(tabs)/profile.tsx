import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useRouter } from "expo-router";
import { clearUser } from "@/app/redux/userSlice";

export default function ProfileScreen() {
    const router = useRouter();
    const dispatch = useDispatch();

    // Lấy thông tin user từ Redux store
    const user = useSelector((state: RootState) => state.user);

    console.log(user)

    // State cho thông tin người dùng
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);

    // State kiểm tra chế độ chỉnh sửa
    const [isEditing, setIsEditing] = useState<{ name: boolean; email: boolean; phone: boolean }>({
        name: false,
        email: false,
        phone: false,
    });

    // Hàm bật/tắt chỉnh sửa
    const toggleEdit = (field: keyof typeof isEditing) => {
        setIsEditing(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    // Hàm đăng xuất
    const logout = () => {
        Alert.alert("Xác nhận đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Đăng xuất",
                onPress: () => {
                    console.log("Người dùng đã đăng xuất");
                    dispatch(clearUser());
                    router.push("/authen/login");
                },
                style: "destructive",
            },
        ]);
    };

    return (
        <View style={styles.container}>
            {user?.id?.trim() ? (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.profileHeader}>
                        <Ionicons name="person-circle" size={120} color="#fff" />
                        <Text style={styles.profileTitle}>Hồ sơ của tôi</Text>
                        <Text>{user.email}</Text>
                    </View>

                    <View style={styles.infoContainer}>
                        <InfoRow label="Họ và tên" value={name} isEditing={isEditing.name} setValue={setName} toggleEdit={() => toggleEdit("name")} />
                        <InfoRow label="Email" value={email} isEditing={isEditing.email} setValue={setEmail} toggleEdit={() => toggleEdit("email")} />
                        <InfoRow label="Số điện thoại" value={phone} isEditing={isEditing.phone} setValue={setPhone} toggleEdit={() => toggleEdit("phone")} />
                    </View>
                </ScrollView>
            ) : null}

            <TouchableOpacity style={styles.logoutButton} onPress={user?.token ? logout : () => router.push("/authen/login")}>
                <Text style={styles.logoutButtonText}>{user?.token ? "Đăng xuất" : "Đăng nhập"}</Text>
            </TouchableOpacity>
        </View>
    );
}

// Component chỉnh sửa thông tin
const InfoRow = ({ label, value, isEditing, setValue, toggleEdit }: { label: string; value: string; isEditing: boolean; setValue: (text: string) => void; toggleEdit: () => void }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        {isEditing ? (
            <TextInput style={styles.input} value={value} onChangeText={setValue} />
        ) : (
            <Text style={styles.infoText}>{value}</Text>
        )}
        <TouchableOpacity onPress={toggleEdit} style={styles.editIcon}>
            <Ionicons name="pencil" size={20} color="#FFD700" />
        </TouchableOpacity>
    </View>
);

// **Styles**
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#005f73",
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "space-between",
    },
    profileHeader: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
    },
    profileTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 15,
    },
    infoContainer: {
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginTop: 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
    },
    input: {
        height: 40,
        width: "60%",
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    infoText: {
        fontSize: 16,
        color: "#333",
        flex: 1,
    },
    editIcon: {
        padding: 5,
    },
    logoutButton: {
        backgroundColor: "#ee6c4d",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginTop: 30,
        alignSelf: "center",
        marginBottom: 20,
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});




/// //import {View, StyleSheet, Text, Switch, ScrollView, TouchableOpacity, TextInput} from 'react-native';
//import {useEffect, useState} from 'react';
//import Ionicons from "@expo/vector-icons/Ionicons";
//import {Alert} from "react-native";
//import {useSelector} from "react-redux";
//import {RootState} from "@/app/redux/store";
//
//import {useRouter} from "expo-router";
//
//
//export default function ProfileScreen() {
//
//    const router = useRouter();
//    const user = useSelector((state: RootState) => state.user);
//
//
//    // State cho thông tin người dùng
//    const [name, setName] = useState(user.name);
//    const [email, setEmail] = useState(user.email);
//    const [phone, setPhone] = useState(user.phone);
////    const [birthdate, setBirthdate] = useState("");
////    const [weight, setWeight] = useState("75 Kg");
////    const [height, setHeight] = useState("1.65 CM");
////    const [age, setAge] = useState("28");
//
//    // State để kiểm tra nếu đang ở chế độ chỉnh sửa cho từng mục
//    const [isEditingName, setIsEditingName] = useState(false);
//    const [isEditingEmail, setIsEditingEmail] = useState(false);
//    const [isEditingPhone, setIsEditingPhone] = useState(false);
//    const [isEditingBirthdate, setIsEditingBirthdate] = useState(false);
//    const [isEditingWeight, setIsEditingWeight] = useState(false);
//    const [isEditingHeight, setIsEditingHeight] = useState(false);
//
//    const login = () => {
//        router.push("/authen/login");
//    };
//    const handleSave = () => {
//        setIsEditingName(false);
//        setIsEditingEmail(false);
//        setIsEditingPhone(false);
//        setIsEditingBirthdate(false);
//        setIsEditingWeight(false);
//        setIsEditingHeight(false);
//    };
//
//
//    return (
//        <View style={styles.container}>
//            {user?.id?.trim() ? (
//                <ScrollView contentContainerStyle={styles.scrollContainer}>
//                    <View style={styles.profileHeader}>
//                        <Ionicons name="person-circle" size={125} color="#fff"/>
//                        <Text style={styles.profileTitle}>My Profile</Text>
//                    </View>
//                    <View style={styles.infoContainer}>
//                        <View style={styles.row}>
//                            <Text style={styles.label}>Full name</Text>
//                            {isEditingName ? (
//                                <TextInput
//                                    style={styles.input}
//                                    value={name}
//                                    onChangeText={setName}
//                                />
//                            ) : (
//                                <Text style={styles.infoText}>{name}</Text>
//                            )}
//                            <TouchableOpacity onPress={() => setIsEditingName(!isEditingName)} style={styles.editIcon}>
//                                <Ionicons name="pencil" size={20} color="#007BFF"/>
//                            </TouchableOpacity>
//                        </View>
//
//                        <View style={styles.row}>
//                            <Text style={styles.label}>Email</Text>
//                            {isEditingEmail ? (
//                                <TextInput
//                                    style={styles.input}
//                                    value={email}
//                                    onChangeText={setEmail}
//                                />
//                            ) : (
//                                <Text style={styles.infoText}>{email}</Text>
//                            )}
//                            <TouchableOpacity onPress={() => setIsEditingEmail(!isEditingEmail)}
//                                              style={styles.editIcon}>
//                                <Ionicons name="pencil" size={20} color="#007BFF"/>
//                            </TouchableOpacity>
//                        </View>
//
//                        <View style={styles.row}>
//                            <Text style={styles.label}>Phone</Text>
//                            {isEditingPhone ? (
//                                <TextInput
//                                    style={styles.input}
//                                    value={phone}
//                                    onChangeText={setPhone}
//                                />
//                            ) : (
//                                <Text style={styles.infoText}>{phone}</Text>
//                            )}
//                            <TouchableOpacity onPress={() => setIsEditingPhone(!isEditingPhone)}
//                                              style={styles.editIcon}>
//                                <Ionicons name="pencil" size={20} color="#007BFF"/>
//                            </TouchableOpacity>
//                        </View>
//                    </View>
//                </ScrollView>
//            ) : (
//                <></>
//            )}
//            <TouchableOpacity style={styles.logoutButton} onPress={user?.id ? logout : login}>
//                <Text style={styles.logoutButtonText}>
//                    {user?.id ? "Đăng xuất" : "Đăng nhập"}
//                </Text>
//            </TouchableOpacity>
//        </View>
//    );
//}
//
//const logout = () => {
//    Alert.alert(
//        "Xác nhận đăng xuất",
//        "Bạn có chắc chắn muốn đăng xuất?",
//        [
//            {text: "Hủy", style: "cancel"},
//            {
//                text: "Đăng xuất",
//                onPress: () => {
//                    console.log("Người dùng đã đăng xuất");
//                },
//                style: "destructive",
//            },
//        ]
//    );
//};
//
//
//const styles = StyleSheet.create({
//    infoContainer: {
//        padding: 16,
//        backgroundColor: "#f5f5f5",
//        borderRadius: 8,
//    },
//    container: {
//        flex: 1,
//        backgroundColor: "#cbc1c1",
//        padding: 20,
//    },
//    scrollContainer: {
//        flexGrow: 1,
//        justifyContent: "space-between", // Ensures the content is spread out
//    },
//    profileHeader: {
//        alignItems: "center",
//        justifyContent: "center",
//        marginTop: 120,
//    },
//    profileTitle: {
//        fontFamily: "Poppins-Bold",
//        fontWeight: "700",
//        fontSize: 20,
//        color: "#030303",
//        marginTop: 20,
//    },
//    basicInfoBox: {
//        backgroundColor: "#6b5b5b",
//        borderRadius: 10,
//        marginBottom: 20,
//        padding: 10,
//        flexDirection: "row",
//        justifyContent: "space-around", // Giảm khoảng cách giữa các mục
//        alignItems: "center",
//    },
//    basicInfoItem: {
//        alignItems: "center",
//        marginBottom: 5, // Giảm khoảng cách giữa các mục
//    },
//    infoLabel: {
//        fontSize: 14,
//        color: "#030303",
//        marginBottom: 5,
//    },
//    infoText: {
//        fontSize: 16,
//        color: "#030303",
//    },
//    separator: {
//        fontSize: 20,
//        color: "#100f0f",
//        marginHorizontal: 10,
//    },
//    row: {
//        flexDirection: "row",
//        justifyContent: "space-between",
//        alignItems: "center",
//        marginBottom: 20,
//    },
//    label: {
//        fontFamily: "LeagueSpartan-Regular",
//        fontSize: 16,
//        color: "#1c1a1a",
//        marginBottom: 8,
//        flex: 1,
//    },
//    input: {
//        height: 40,
//        width: "70%",
//        backgroundColor: "#1c1a1a",
//        borderRadius: 5,
//        paddingHorizontal: 10,
//        fontSize: 16,
//        marginBottom: 20,
//    },
//    editIcon: {
//        marginLeft: 10,
//    },
//    saveButton: {
//        backgroundColor: "#28a745",
//        paddingVertical: 10,
//        paddingHorizontal: 40,
//        borderRadius: 5,
//        marginTop: 20,
//        alignSelf: "center",
//    },
//    buttonText: {
//        color: "#fff",
//        fontSize: 16,
//        fontWeight: "600",
//    },
//    logoutButton: {
//        backgroundColor: "#5e8c8c",
//        paddingVertical: 10,
//        paddingHorizontal: 40,
//        borderRadius: 5,
//        marginTop: 30,
//        alignSelf: "center",
//        marginBottom: 20,
//    },
//    logoutButtonText: {
//        color: "#fff",
//        fontSize: 16,
//        fontWeight: "600",
//    },
//});
