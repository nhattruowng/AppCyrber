import * as React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Sử dụng Ionicons cho các icon
import RegisterScreen from "./RegisterScreen";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      
      {/* Chữ "Trang đăng nhập" */}
      <Text style={styles.loginTitle}>Trang Đăng Nhập</Text>

      {/* Trường nhập số điện thoại */}
      <TextInput
        style={styles.inputField}
        placeholder="Số điện thoại hoặc email"
        keyboardType="name-phone-pad"
        placeholderTextColor="#A9A9A9"
      />

      {/* Trường nhập mật khẩu */}
      <TextInput
        style={styles.inputField}
        placeholder="Mật khẩu"
        secureTextEntry
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

      {/* Button đăng nhập */}
      <TouchableOpacity style={styles.loginButton}>
        <View style={styles.gradientButtonInner} />
        <View style={styles.rectangleView} />
        <Text style={styles.loginText}>Đăng nhập</Text>
      </TouchableOpacity>

          <Text style={styles.link} onPress={() => RegisterScreen}>
              Chưa có tài khoản? Đăng kí ngay</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Để phần Gradient không chặn các phần tử
  },
  loginTitle: {
    position: "absolute",
    top: windowHeight * 0.1,
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  login: {
    position: "absolute",
    top: windowHeight * 0.4,
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  log: {
    position: "absolute",
    top: windowHeight * 0.6,
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  inputField: {
    height: 45,
    width: windowWidth * 0.8, // 80% chiều rộng màn hình
    maxWidth: 350, // Giới hạn chiều rộng tối đa
    maxHeight: 60, // Giới hạn chiều cao tối đa của trường nhập liệu
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#232323",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: windowWidth * 0.5,
    maxWidth: 300, // Giới hạn chiều rộng tối đa
    marginTop: 30,
    top: 40,
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
  loginButton: {
    top: windowHeight * 0.5,
    height: 44,
    width: 179,
    position: "absolute",
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
  loginText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
    textAlign: "center",
    color: "#fff",
    },
    link: {
        marginTop: 12,
        color: '#fff',
        textAlign: 'center',
        top: 140,
      },
});

export default LoginScreen;
