import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Sử dụng Ionicons cho các icon

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }

    // Logic đăng ký ở đây
    console.log('Đăng ký với tên người dùng:', username);
    console.log('Email hoặc số điện thoại:', emailOrPhone);

    navigation.navigate('Login'); // Chuyển về màn hình đăng nhập sau khi đăng ký
  };

  return (
    <View style={styles.container}>
      
      {/* Chữ "Trang đăng ký" */}
      <Text style={styles.loginTitle}>Trang Đăng Ký</Text>

      {/* Tên người dùng */}
      <TextInput
        style={styles.inputField}
        placeholder="Tên người dùng"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#A9A9A9"
      />

      {/* Email hoặc số điện thoại */}
      <TextInput
        style={styles.inputField}
        placeholder="Email hoặc số điện thoại"
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
        keyboardType="email-address" // Hoặc phone-pad tùy vào yêu cầu
        placeholderTextColor="#A9A9A9"
      />

      {/* Mật khẩu */}
      <TextInput
        style={styles.inputField}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#A9A9A9"
      />

      {/* Xác nhận mật khẩu */}
      <TextInput
        style={styles.inputField}
        placeholder="Xác nhận mật khẩu"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#A9A9A9"
      />
      
      <Text style={styles.login}>Hoặc đăng nhập bằng</Text>

      {/* Các icon */}
      <View style={styles.iconContainer}>
        <Ionicons
          name="logo-google"
          style={styles.googleIcon}
          size={34}
          color="#DB4437"
        />
        <Ionicons
          name="finger-print"
          style={styles.fingerprintIcon}
          size={34}
          color="#000"
        />
        <Ionicons
          name="logo-facebook"
          style={styles.facebookIcon}
          size={34}
          color="#4267B2"
        />
      </View>

      {/* Button Đăng ký */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>Đăng ký</Text>
        <View style={styles.gradientButtonInner} />
        <View style={styles.rectangleView} />
      </TouchableOpacity>

      {/* Link chuyển đến trang đăng nhập */}
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Đã có tài khoản? Đăng nhập
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 20,  // Thêm padding ngang cho màn hình nhỏ
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: windowHeight * 0.05,  // Cách phần trên của màn hình
  },
  login: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  inputField: {
    height: 45,
    width: windowWidth * 0.8, // 80% chiều rộng màn hình
    maxWidth: 350, // Giới hạn chiều rộng tối đa
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
    width: windowWidth * 0.6,  // Sử dụng tỷ lệ phần trăm thay vì giá trị cố định
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
    maxHeight: 60, // Giới hạn chiều cao tối đa cho button
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
