import React, {useEffect, useState} from "react";
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Dimensions, Alert,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {StackNavigationProp} from "@react-navigation/stack";
import {useRouter} from "expo-router";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Register"
>;

interface RegisterScreenProps {
    navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
    const [username, setUsername] = useState("");
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setUsername(emailOrPhone.concat("@gmail.com"))
    }, [emailOrPhone]);

    const Register = async () => {
        setLoading(true);
        const register = await fetch(`https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: username,
                email: emailOrPhone,
                password: password,
            }),
        });
        setLoading(false)
        if (register.status == 200) {
            Alert.alert("Tạo tài khoản thành công");
            login()
        } else {
            Alert.alert(`tạo tài khoản thất bại!`)
        }
    }

    const handleRegister = () => {
        Register();
    };

    const login = () => {
        router.push("/authen/login");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.loginTitle}>Tạo tài khoản mới</Text>

            <TextInput
                style={styles.inputField}
                placeholder="Email hoặc số điện thoại"
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
                keyboardType="email-address"
                placeholderTextColor="#A9A9A9"
            />

            <TextInput
                style={styles.inputField}
                placeholder="Mật khẩu"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#A9A9A9"
            />

            <TextInput
                style={styles.inputField}
                placeholder="Xác nhận mật khẩu"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#A9A9A9"
            />

            <TouchableOpacity style={styles.loginButton} onPress={() => handleRegister()}>
                <Text style={styles.loginText}>{loading ? "Đang xử lý" : "Tạo Tài khoản"}</Text>
            </TouchableOpacity>

            <View style={styles.bottomText}>
                <Text style={{color: "#fff", fontSize: 14}}>Đã có tài khoản?</Text>
                <TouchableOpacity onPress={login}>
                    <Text style={styles.link}> Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#232323",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    loginTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
    },
    inputField: {
        height: 45,
        width: windowWidth * 0.85,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#232323",
    },
    alternativeText: {
        fontSize: 16,
        color: "#fff",
        marginVertical: 15,
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#DB4437",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: windowWidth * 0.7,
        justifyContent: "center",
        marginBottom: 20,
    },
    loginButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#DB4437",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: windowWidth * 0.7,
        justifyContent: "center",
    },
    loginText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    googleIcon: {
        marginRight: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    registerButton: {
        width: windowWidth * 0.6,
        height: 50,
        backgroundColor: "#007BFF",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
    },
    registerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    bottomText: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    link: {
        color: "#4DA6FF",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default RegisterScreen;
