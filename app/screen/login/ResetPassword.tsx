import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  ResetPassword: undefined;
  Login: undefined;
};

type ResetPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, "ResetPassword">;

interface ResetPasswordScreenProps {
  navigation: ResetPasswordScreenNavigationProp;
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    console.log("Đặt lại mật khẩu thành công!");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt Lại Mật Khẩu</Text>
      <TextInput
        style={styles.inputField}
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
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

      <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
        <Text style={styles.resetButtonText}>Đặt lại mật khẩu</Text>
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
  resetButton: {
    height: 44,
    width: 200,
    backgroundColor: "#4CAF50",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});

export default ResetPasswordScreen;
