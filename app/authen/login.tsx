import {StyleSheet, TouchableOpacity, View, Text, TextInput, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Ionicons} from "@expo/vector-icons";
import {setUser} from '../redux/userSlice'
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useRouter} from "expo-router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/redux/store";
import { useNavigation } from "@react-navigation/native";


GoogleSignin.configure({
    webClientId: '1062171005115-9ds8cailu4f4lgmrb9q9f6ub3je13474.apps.googleusercontent.com',
    offlineAccess: true,
});

const LoginScreen = () => {
    const user = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const dispatch = useDispatch();
    const [initializing, setInitializing] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const regis = () => {
        router.push("/authen/register");
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('https://gymbe-production-233d.up.railway.app/api/authen/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });
            if (!response.ok) {
                throw new Error('Đăng nhập thất bại');
            }
            const data = await response.json();
            dispatch(
                setUser({
                    id: data.data.id,
                    name: data.data.name,
                    email: data.data.email,
                    phone: data.data.phone || "",
                    avata: data.data.avata instanceof ArrayBuffer ? new Uint8Array(data.data.avata) : null,
                    token: data.data.token,
                })
            );
//            if (user.token != ""){
//                router.push("/")
//            }
            console.log('Đăng nhập thành công!');
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
        }
    };

    // useEffect(() => {
    //     if (token) {
    //         const fetchData = async () => {
    //             try {
    //                 const data = await firebaseLogin();
    //                 console.log("Firebase Login Response:", data);
    //             } catch (error) {
    //                 console.error("Lỗi khi gọi API:", error);
    //             }
    //         };
    //         fetchData();
    //     }
    // }, [token]);


    const signIn = async () => {
        // Check if your device supports Google Play
        await GoogleSignin.signOut();
        await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
        // Get the users ID token
        const signInResult = await GoogleSignin.signIn();

        let idToken = signInResult.data?.idToken;
        if (!idToken) {
            idToken = signInResult.data?.idToken;
        }
        if (!idToken) {
            throw new Error('No ID token found');
        }
        console.log(idToken)
        // const loginResponse = await firebaseLogin(idToken);


        // const response = await fetch("https://gymbe-production-233d.up.railway.app/api/authen/firebase-login", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({token: idToken}),
        // });
        // const response = await fetch("http://localhost:8080/api/authen/firebase-login", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({token: idToken}),
        // });
        // const data = await response.json();

        console.log(idToken)
        // console.log(response)

        ///
        return null;
    };


    const firebaseLogin = async (idToken: string) => {
        try {
            const response = await fetch("https://gymbe-production-233d.up.railway.app/api/authen/firebase-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({token: idToken}),
            });

            if (!response.ok) {
                throw new Error("Đăng nhập thất bại");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
            return null;
        }
    };

    // if (initializing) return null;

    return (

        <View style={styles.container}>
            <Text style={styles.loginTitle}>Đăng Nhập</Text>
            <TextInput
                style={styles.inputField}
                placeholder="Số điện thoại hoặc email"
                keyboardType="email-address"
                placeholderTextColor="#A9A9A9"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.inputField}
                placeholder="Mật khẩu"
                secureTextEntry
                placeholderTextColor="#A9A9A9"
                value={password}
                onChangeText={setPassword}
            />

            {/* Sửa lỗi: Thêm onPress và sử dụng đúng style */}
            <TouchableOpacity style={styles.loginButton} onPress={() => handleLogin()}>
                <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>

            <Text style={styles.alternativeText}>Hoặc đăng nhập bằng</Text>

            <TouchableOpacity style={styles.googleButton}
                              onPress={() => signIn()}
            >
                <Ionicons name="logo-google" size={24} color="white" style={styles.googleIcon}/>
                <Text style={styles.buttonText}>Đăng nhập với Google</Text>
            </TouchableOpacity>

            <View style={styles.bottomText}>
                <Text style={{color: "#fff", fontSize: 14}}>Chưa có tài khoản?</Text>
                <TouchableOpacity
                    onPress={regis}
                >
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
export default LoginScreen;