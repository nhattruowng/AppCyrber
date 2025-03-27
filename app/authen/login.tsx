import {StyleSheet, TouchableOpacity, View, Text, TextInput, Dimensions, Image, Modal, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {setUser} from '../redux/userSlice'
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useRouter} from "expo-router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import Ionicons from "@expo/vector-icons/Ionicons";

GoogleSignin.configure({
    webClientId: '1062171005115-9ds8cailu4f4lgmrb9q9f6ub3je13474.apps.googleusercontent.com',
    offlineAccess: true,
});

const API_LOCAL_URL = process.env.LOCAL_API_URL;


const LoginScreen = () => {
    const user = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const dispatch = useDispatch();

    const [showInput, setShowInput] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [userstore, setUserStore] = useState<any>(null);

    const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);


    useEffect(() => {
        const requestPermission = async () => {
            try {
                const authStatus = await messaging().requestPermission();
                if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
                    const token = await messaging().getToken();
                    const response = await fetch(
                        `https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/users/save-fcm-token/${user.id}`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${user.token}`,
                                'Content-Type': 'application/json',
                                'accept': '*/*',
                            },
                            body: JSON.stringify({token}),
                        }
                    );

                    if (!response.ok) {
                        return;
                    }
                } else {
                    Alert.alert('Quyền bị từ chối!');
                }
            } catch (error) {

            }
        };
        requestPermission();
    }, [user.id, user.token]);


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
                console.log("❌ Lỗi khi load user:", error);
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
                console.log("Lỗi khi load user data:", error);
            }
        };
        loadUserData();
    }, []);

    const regis = () => {
        router.push("/authen/register");
    };


    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/users/login', {
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
            setLoading(false);
        } catch (error) {
            console.log('Lỗi khi đăng nhập:', error);
        } finally {
            setLoading(false);
        }
    };


    const signIn = async () => {
        try {
            // Đăng xuất trước khi đăng nhập lại
            await GoogleSignin.signOut();
            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

            // Đăng nhập Google
            const signInResult = await GoogleSignin.signIn();
            const idTokengg = signInResult.data?.idToken ? signInResult.data.idToken : " ";

            const googleCredential = auth.GoogleAuthProvider.credential(idTokengg);

            const firebaseUserCredential = await auth().signInWithCredential(googleCredential);

            // Lấy Firebase ID Token
            const idToken = await firebaseUserCredential.user.getIdToken(true);

            const response = await fetch("https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/users/firebase-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({token: idToken}),
            });

            const data = await response.json();
            const decoded: any = jwtDecode(data.data.token);
            const roles = decoded.roles || [];

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
            console.log("Error signing in:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.loginTitle}>Đăng Nhập</Text>

            {userstore && !showInput ? (
                <View style={styles.userContainer}>
                    <Ionicons name="person-circle" size={60} color="#fff"/>
                    <Text style={styles.userName}>{userstore?.email}</Text>
                    <Text style={styles.userEmail}>
                        {userstore?.name ?? "Chưa có thông tin"}
                    </Text>
                </View>
            ) : (
                <TextInput
                    style={styles.inputField}
                    placeholder="Số điện thoại hoặc email"
                    keyboardType="email-address"
                    placeholderTextColor="#A9A9A9"
                    value={email}
                    onChangeText={setEmail}
                />
            )}

            <TextInput
                style={styles.inputField}
                placeholder="Mật khẩu"
                secureTextEntry
                placeholderTextColor="#A9A9A9"
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity onPress={() => setForgotPasswordVisible(true)}>
                <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={() => handleLogin()}>
                <Text style={styles.loginText}>{loading ? "Đang tải .." : "Đăng nhập"}</Text>
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
                    <Text style={styles.link}> Đăng ký ngay</Text>
                </TouchableOpacity>
            </View>
            <ForgotPasswordDialog
                visible={forgotPasswordVisible}
                onClose={() => setForgotPasswordVisible(false)}
            />
        </View>
    );

}


const ForgotPasswordDialog = ({visible, onClose}) => {
    const [resetEmail, setResetEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showFields, setShowFields] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false); // Kiểm soát nút gửi mã

    const handClost = () => {
        setResetEmail("");
        setVerificationCode("");
        setNewPassword("");
        setConfirmPassword("");
        setIsCodeSent(false);
        setShowFields(false)
        onClose();
    }

    const handChangePass = async () => {
        if (!verificationCode) {
            Alert.alert("Vui lòng nhập mã xác.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Mật khẩu không khớp!");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/users/sendmail/${resetEmail}/${verificationCode}`, {
                body: JSON.stringify({newPassword: newPassword}),
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            console.log(response)
            if (response.status === 200) {
                setShowFields(true);
                setIsCodeSent(true);
                handClost();
            } else {
                Alert.alert("Email không đúng hoặc tài khoản chưa tồn tại.");
            }

        } catch (e) {
            Alert.alert("Lỗi kết nối, vui lòng thử lại.");
        } finally {
            setIsLoading(false);
            handClost();
        }
    }

    const handleSendCode = async () => {
        if (!resetEmail) {
            Alert.alert("Vui lòng nhập email.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/users/sendmail/${resetEmail}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                setShowFields(true);
                setIsCodeSent(true);
            } else {
                Alert.alert("Email không đúng hoặc tài khoản chưa tồn tại.");
            }
        } catch (error) {
            Alert.alert("Lỗi kết nối, vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Quên Mật Khẩu</Text>
                    <TextInput style={styles.input} placeholder="Email" value={resetEmail}
                               onChangeText={setResetEmail}/>

                    {/* Chỉ ẩn khi API gửi thành công */}
                    {!isCodeSent && (
                        <TouchableOpacity style={styles.button} onPress={handleSendCode}>
                            <Text style={styles.buttonText}>
                                {isLoading ? "Đang gửi mã..." : "Gửi mã"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {showFields && (
                        <>
                            <TextInput style={styles.input} placeholder="Mã xác nhận" value={verificationCode}
                                       onChangeText={setVerificationCode}/>
                            <TextInput style={styles.input} placeholder="Mật khẩu mới" secureTextEntry
                                       value={newPassword} onChangeText={setNewPassword}/>
                            <TextInput style={styles.input} placeholder="Xác nhận mật khẩu" secureTextEntry
                                       value={confirmPassword} onChangeText={setConfirmPassword}/>
                            <TouchableOpacity style={styles.button}
                                              onPress={() => handChangePass()}
                            >
                                <Text style={styles.buttonText}>
                                    {isLoading ? "Đang sử lý..." : "Xác nhận"}
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity onPress={() => handClost()}>
                        <Text style={styles.closeText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};


const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "85%",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        width: "100%",
        padding: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        marginBottom: 8,
    },
    button: {
        backgroundColor: "#4DA6FF",
        paddingVertical: 8,
        width: "100%",
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 8,
    },
    buttonConfirm: {
        backgroundColor: "#FF4D4D",
        paddingVertical: 8,
        width: "100%",
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 8,
    },
    closeText: {
        color: "#007BFF",
        marginTop: 5,
    },
    container: {
        flex: 1,
        backgroundColor: "#232323",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    loginTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
    },
    userContainer: {
        width: "90%",
        backgroundColor: "#2A2A2A",
        borderRadius: 12,
        paddingVertical: 20,
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: {width: 0, height: 3},
        shadowRadius: 5,
        elevation: 5,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 8,
    },
    userEmail: {
        fontSize: 14,
        color: "#ccc",
    },
    inputField: {
        height: 50,
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#232323",
    },
    forgotPassword: {
        fontSize: 14,
        color: "#4DA6FF",
        alignSelf: "flex-end",
        marginRight: 20,
        marginBottom: 10,
    },
    loginButton: {
        backgroundColor: "#DB4437",
        paddingVertical: 12,
        width: "90%",
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15,
    },
    loginText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    infoText: {
        fontSize: 14,
        color: "#4DA6FF",
        marginBottom: 15,
        textAlign: "center",
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
        borderRadius: 8,
        width: "90%",
        justifyContent: "center",
        marginBottom: 15,
    },
    googleIcon: {
        marginRight: 10,
    },
    bottomText: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    link: {
        color: "#4DA6FF",
        fontSize: 14,
        fontWeight: "bold",
    },
});
export default LoginScreen;