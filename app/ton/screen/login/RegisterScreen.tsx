import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

// Định nghĩa kiểu StackParamList nếu chưa có
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }

    console.log('Đăng ký với tên người dùng:', username);
    console.log('Email hoặc số điện thoại:', emailOrPhone);

    navigation.navigate('Login'); // Chuyển về màn hình đăng nhập sau khi đăng ký
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loginTitle}>Trang Đăng Ký</Text>

      <TextInput
        style={styles.inputField}
        placeholder="Tên người dùng"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#A9A9A9"
      />

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
      
      <Text style={styles.login}>Hoặc đăng nhập bằng</Text>

      <View style={styles.iconContainer}>
        <Ionicons name="logo-google" style={styles.googleIcon} size={34} color="#DB4437" />
        <Ionicons name="finger-print" style={styles.fingerprintIcon} size={34} color="#000" />
        <Ionicons name="logo-facebook" style={styles.facebookIcon} size={34} color="#4267B2" />
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>Đăng ký</Text>
        <View style={styles.gradientButtonInner} />
        <View style={styles.rectangleView} />
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Đã có tài khoản? Đăng nhập
      </Text>
    </View>
  );
};

// Style giữ nguyên
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: windowHeight * 0.05,
  },
  login: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  inputField: {
    height: 45,
    width: windowWidth * 0.8,
    maxWidth: 350,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#232323',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth * 0.6,
    marginTop: 30,
  },
  googleIcon: {
    marginRight: 10,
  },
  fingerprintIcon: {
    marginLeft: 10,
  },
  facebookIcon: {
    marginLeft: 10,
  },
  registerButton: {
    height: 44,
    width: 179,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    maxHeight: 60,
  },
  gradientButtonInner: {
    backgroundColor: "rgba(255, 255, 255, 0.09)",
    height: 44,
    width: 179,
    borderRadius: 100,
    position: "absolute",
  },
  rectangleView: {
    borderWidth: 0.5,
    borderColor: "#fff",
    borderRadius: 100,
    height: 44,
    width: 179,
    position: "absolute",
  },
  registerText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    textAlign: 'center',
    color: '#fff',
  },
  link: {
    marginTop: 12,
    color: '#fff',
    textAlign: 'center',
    top: 80,
  },
});

export default RegisterScreen;
