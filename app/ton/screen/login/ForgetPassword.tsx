import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  ForgetPassword: undefined;
  ResetPassword: undefined;
};

type ForgetPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, "ForgetPassword">;

interface ForgetPasswordScreenProps {
  navigation: ForgetPasswordScreenNavigationProp;
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const ForgetPasswordScreen: React.FC<ForgetPasswordScreenProps> = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const handleSendResetLink = () => {
    console.log("Gửi mã xác nhận đến:", emailOrPhone);
    navigation.navigate("ResetPassword");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên Mật Khẩu</Text>
      <TextInput
        style={styles.inputField}
        placeholder="Email hoặc số điện thoại"
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
        keyboardType="email-address"
        placeholderTextColor="#A9A9A9"
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleSendResetLink}>
        <Text style={styles.sendButtonText}>Gửi mã xác nhận</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: windowHeight * 0.05,
  },
  inputField: {
    height: 45,
    width: windowWidth * 0.8,
    maxWidth: 350,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#232323",
  },
  sendButton: {
    height: 44,
    width: 200,
    backgroundColor: "#4CAF50",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});

export default ForgetPasswordScreen;
