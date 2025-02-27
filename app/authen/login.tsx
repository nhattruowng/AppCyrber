import {StyleSheet, TouchableOpacity, View, Text, TextInput, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Ionicons} from "@expo/vector-icons";
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useRouter} from "expo-router";

export default function LoginScreen() {

    const router = useRouter();
    const regis = () => {
        router.push("/authen/register");
    };
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '1062171005115-9ds8cailu4f4lgmrb9q9f6ub3je13474.apps.googleusercontent.com',
        });
    }, [])

    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [initializing, setInitializing] = useState(true);

    // useEffect(() => {
    //     const subscriber = auth().onAuthStateChanged((user) => {
    //         setUser(user);
    //         if (initializing) setInitializing(false);
    //     });
    //     return subscriber;
    // }, []);

    useEffect(() => {
        if (token) {
            const fetchData = async () => {
                const data = await firebaseLogin();
                console.log("Firebase Login Response:", data);
            };
            fetchData();
        }
    }, [token]);

    const signIn = async () => {
        try {
            await GoogleSignin.signOut();
            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

            const signInResult = await GoogleSignin.signIn();
            const idToken = signInResult.data?.idToken;
            if (!idToken) throw new Error("Không tìm thấy ID token");

            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            const userCredential = await auth().signInWithCredential(googleCredential);

            setUser(userCredential.user);
            setToken(idToken);

            console.log("Token:", idToken);
        } catch (error) {
            console.error("Lỗi đăng nhập Google:", error);
        }
    };

    const firebaseLogin = async () => {
        try {
            const response = await fetch("https://gymbe-production-233d.up.railway.app/api/authen/firebase-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                throw new Error("Đăng nhập thất bại");
            }

            const data = await response.json();
            console.log("Login Success:", data);
            return data;
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    };




    if (initializing) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.loginTitle}>Đăng Nhập</Text>
            <TextInput
                style={styles.inputField}
                placeholder="Số điện thoại hoặc email"
                keyboardType="email-address"
                placeholderTextColor="#A9A9A9"
            />

            <TextInput
                style={styles.inputField}
                placeholder="Mật khẩu"
                secureTextEntry
                placeholderTextColor="#A9A9A9"
            />

            {/* Sửa lỗi: Thêm onPress và sử dụng đúng style */}
            <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>

            <Text style={styles.alternativeText}>Hoặc đăng nhập bằng</Text>

            <TouchableOpacity style={styles.googleButton} onPress={signIn}>
                <Ionicons name="logo-google" size={24} color="white" style={styles.googleIcon}/>
                <Text style={styles.buttonText}>Đăng nhập với Google</Text>
            </TouchableOpacity>

            <View style={styles.bottomText}>
                <Text style={{color: "#fff", fontSize: 14}}>Chưa có tài khoản?</Text>
                <TouchableOpacity onPress={regis}>
                    <Text style={styles.link}>Đăng ký ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#232323",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    loginTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: windowHeight * 0.05,
    },
    inputField: {
        height: 50,
        width: windowWidth * 0.85,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#232323",
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
    alternativeText: {
        fontSize: 16,
        color: "#fff",
        marginVertical: 10,
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
    },
    googleIcon: {
        marginRight: 10,
    },
    bottomText: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    userInfoContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#333",
        borderRadius: 8,
    },
    userInfo: {
        color: "#fff",
        fontSize: 16,
    },
    link: {
        color: "#4DA6FF",
        fontSize: 14,
        fontWeight: "bold",
    },
});
