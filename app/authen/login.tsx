import {StyleSheet, TouchableOpacity, View, Text, TextInput, Dimensions, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Ionicons} from "@expo/vector-icons";
import {setUser} from '../redux/userSlice'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {useRouter} from "expo-router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/redux/store";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
    webClientId: '1062171005115-9ds8cailu4f4lgmrb9q9f6ub3je13474.apps.googleusercontent.com',
    offlineAccess: true,
});

const LoginScreen = () => {
    const user = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const dispatch = useDispatch();

    const [showInput, setShowInput] = useState<boolean>(false);

    const [userstore, setUserStore] = useState<any>(null);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const usertor = await AsyncStorage.getItem("user");
                if (usertor) {
                    const parsedUser = JSON.parse(usertor); // Parse JSON thành object
                    setUserStore(parsedUser);
                    console.log("✅ Đã load user:", parsedUser);
                } else {
                    console.log("⚠️ Không tìm thấy user trong AsyncStorage");
                }
            } catch (error) {
                console.error("❌ Lỗi khi load user:", error);
            }
        };

        loadToken();
    }, []);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem("user");
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    setUser(userData); // Cập nhật state với userData
                    setEmail(userData.email); // Nếu muốn cập nhật email
                }
            } catch (error) {
                console.error("Lỗi khi load user data:", error);
            }
        };
        loadUserData();
    }, []);

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
            const decoded: any = jwtDecode(data.data.token);
            const roles = decoded.roles || [];

            console.log(roles)
            dispatch(
                setUser({
                    id: data.data.id,
                    name: data.data.name,
                    email: data.data.email,
                    phone: data.data.phone || "",
                    avata: data.data.avata instanceof ArrayBuffer ? new Uint8Array(data.data.avata) : null,
                    token: data.data.token,
                    roles: roles,
                })
            );
            if (user) {
                router.push("/calendar")
            }
            console.log('Đăng nhập thành công!');
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
        }
    };


    const signIn = async () => {
        try {
            // Đăng xuất trước khi đăng nhập lại
            await GoogleSignin.signOut();
            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

            // Đăng nhập Google
            const signInResult = await GoogleSignin.signIn();
            const idTokengg = signInResult.data?.idToken ? signInResult.data?.idToken: " ";

            const googleCredential = auth.GoogleAuthProvider.credential(idTokengg);

            const firebaseUserCredential = await auth().signInWithCredential(googleCredential);

            // Lấy Firebase ID Token
            const idToken = await firebaseUserCredential.user.getIdToken(true);

            const response = await fetch("https://gymbe-production-233d.up.railway.app/api/authen/firebase-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({token: idToken}),
            });

            const data = await response.json();
            const decoded: any = jwtDecode(data.data.token);
            const roles = decoded.roles || [];

            console.log(roles)

            dispatch(
                setUser({
                    id: data.data.id,
                    name: data.data.name,
                    email: data.data.email,
                    phone: data.data.phone || "",
                    avata: data.data.avata instanceof ArrayBuffer ? new Uint8Array(data.data.avata) : null,
                    token: data.data.token,
                    roles: roles,
                })
            );

            if (user) {
                router.push("/profile")
            }
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.loginTitle}>Đăng Nhập</Text>

            {userstore && !showInput ? (
                <View style={styles.userContainer}>
                    <Ionicons name="person-circle" size={60} color="#fff" style={styles.userIcon}/>
                    <Text style={styles.userName}>{userstore?.email}</Text>
                    <Text style={styles.userEmail}>{userstore?.name ?? userstore?.phone ?? "Chưa có email"}</Text>
                </View>
            ) : (
                // Hiển thị ô nhập email
                <TextInput
                    style={styles.inputField}
                    placeholder="Số điện thoại hoặc email"
                    keyboardType="email-address"
                    placeholderTextColor="#A9A9A9"
                    value={email}
                    onChangeText={setEmail}
                />
            )}
            <>
                {/* Ô nhập mật khẩu */}
                <TextInput
                    style={styles.inputField}
                    placeholder="Mật khẩu"
                    secureTextEntry
                    placeholderTextColor="#A9A9A9"
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginText}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowInput(!showInput)}>
                    <Text style={styles.infoText}>
                        {showInput ? "Đăng nhập tài khoản có trên máy" : "Đăng nhập bằng tài khoản khác"}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.alternativeText}>Hoặc đăng nhập bằng</Text>

                <TouchableOpacity style={styles.googleButton} onPress={() => signIn()}>
                    <Ionicons name="logo-google" size={24} color="white" style={styles.googleIcon}/>
                    <Text style={styles.buttonText}>Đăng nhập với Google</Text>
                </TouchableOpacity>

                <View style={styles.bottomText}>
                    <Text style={{color: "#fff", fontSize: 14}}>Chưa có tài khoản?</Text>
                    <TouchableOpacity onPress={regis}>
                        <Text style={styles.link}>Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>
            </>

        </View>
    );

}
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
    userContainer: {
        width: "85%",
        backgroundColor: "#2A2A2A",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: {width: 0, height: 3},
        shadowRadius: 5,
        elevation: 5,
        marginBottom: 20,
    },
    userInfo: {
        alignItems: "center",
        marginBottom: 10,
    },
    userIcon: {
        marginBottom: 10,
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: "#ccc",
    },
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
    infoText: {
        fontSize: 12,
        color: "#ccc",
        marginTop: 5,
        textAlign: "center",
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
    link: {
        color: "#4DA6FF",
        fontSize: 14,
        fontWeight: "bold",
    },
});
export default LoginScreen;