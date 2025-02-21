import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Sử dụng Ionicons cho các icon

const Profile = () => {
  // State cho thông tin người dùng
  const [name, setName] = useState("Madison Smith");
  const [email, setEmail] = useState("madisons@example.com");
  const [phone, setPhone] = useState("+1234567890");
  const [birthdate, setBirthdate] = useState("01/04/1997"); // Thay đổi định dạng ngày/tháng/năm
  const [weight, setWeight] = useState("75 Kg");
  const [height, setHeight] = useState("1.65 CM");
  const [age, setAge] = useState("28");

  // State để kiểm tra nếu đang ở chế độ chỉnh sửa cho từng mục
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingBirthdate, setIsEditingBirthdate] = useState(false);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [isEditingHeight, setIsEditingHeight] = useState(false);

  // Hàm để tính tuổi từ ngày sinh
  const calculateAge = (birthdate) => {
    const birthDateParts = birthdate.split("/");
    const birthDate = new Date(
      birthDateParts[2],
      birthDateParts[1] - 1,
      birthDateParts[0]
    );
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  useEffect(() => {
    const calculatedAge = calculateAge(birthdate);
    setAge(calculatedAge.toString());
  }, [birthdate]);

  // Hàm để lưu thông tin chỉnh sửa
  const handleSave = () => {
    setIsEditingName(false);
    setIsEditingEmail(false);
    setIsEditingPhone(false);
    setIsEditingBirthdate(false);
    setIsEditingWeight(false);
    setIsEditingHeight(false);
    // Logic lưu thông tin có thể thêm vào đây
    console.log("Information saved.");
  };

  // Hàm log out
  const handleLogout = () => {
    console.log("Logged out");
    // Logic log out có thể thêm vào đây
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileHeader}>
          <Ionicons name="person-circle" size={125} color="#fff" />
          <Text style={styles.profileTitle}>My Profile</Text>
        </View>

        {/* Ô vuông hiển thị thông tin cơ bản với dấu gạch dọc ngăn cách */}
        <View style={styles.basicInfoBox}>
          <View style={styles.basicInfoItem}>
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoText}>{weight}</Text>
          </View>
          <Text style={styles.separator}>|</Text>
          <View style={styles.basicInfoItem}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoText}>{age}</Text>
          </View>
          <Text style={styles.separator}>|</Text>
          <View style={styles.basicInfoItem}>
            <Text style={styles.infoLabel}>Height</Text>
            <Text style={styles.infoText}>{height}</Text>
          </View>
        </View>

        {/* Thông tin cá nhân */}

        <View style={styles.row}>
          <Text style={styles.label}>Full name</Text>
          {isEditingName ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          ) : (
            <Text style={styles.infoText}>{name}</Text>
          )}
          <TouchableOpacity
            onPress={() => {
              if (isEditingName) handleSave();
              setIsEditingName(!isEditingName);
            }}
            style={styles.editIcon}
          >
            <Ionicons
              name={isEditingName ? "checkmark" : "pencil"}
              size={20}
              color="#007BFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          {isEditingEmail ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          ) : (
            <Text style={styles.infoText}>{email}</Text>
          )}
          <TouchableOpacity
            onPress={() => {
              if (isEditingEmail) handleSave();
              setIsEditingEmail(!isEditingEmail);
            }}
            style={styles.editIcon}
          >
            <Ionicons
              name={isEditingEmail ? "checkmark" : "pencil"}
              size={20}
              color="#007BFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          {isEditingPhone ? (
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
            />
          ) : (
            <Text style={styles.infoText}>{phone}</Text>
          )}
          <TouchableOpacity
            onPress={() => {
              if (isEditingPhone) handleSave();
              setIsEditingPhone(!isEditingPhone);
            }}
            style={styles.editIcon}
          >
            <Ionicons
              name={isEditingPhone ? "checkmark" : "pencil"}
              size={20}
              color="#007BFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date of birth</Text>
          {isEditingBirthdate ? (
            <TextInput
              style={styles.input}
              value={birthdate}
              onChangeText={setBirthdate}
            />
          ) : (
            <Text style={styles.infoText}>{birthdate}</Text>
          )}
          <TouchableOpacity
            onPress={() => {
              if (isEditingBirthdate) handleSave();
              setIsEditingBirthdate(!isEditingBirthdate);
            }}
            style={styles.editIcon}
          >
            <Ionicons
              name={isEditingBirthdate ? "checkmark" : "pencil"}
              size={20}
              color="#007BFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Weight</Text>
          {isEditingWeight ? (
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
            />
          ) : (
            <Text style={styles.infoText}>{weight}</Text>
          )}
          <TouchableOpacity
            onPress={() => {
              if (isEditingWeight) handleSave();
              setIsEditingWeight(!isEditingWeight);
            }}
            style={styles.editIcon}
          >
            <Ionicons
              name={isEditingWeight ? "checkmark" : "pencil"}
              size={20}
              color="#007BFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Height</Text>
          {isEditingHeight ? (
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
            />
          ) : (
            <Text style={styles.infoText}>{height}</Text>
          )}
          <TouchableOpacity
            onPress={() => {
              if (isEditingHeight) handleSave();
              setIsEditingHeight(!isEditingHeight);
            }}
            style={styles.editIcon}
          >
            <Ionicons
              name={isEditingHeight ? "checkmark" : "pencil"}
              size={20}
              color="#007BFF"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212020",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between", // Ensures the content is spread out
  },
  profileHeader: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  profileTitle: {
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
    fontSize: 20,
    color: "#fff",
    marginTop: 20,
  },
  basicInfoBox: {
    backgroundColor: "#3a3a3a",
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around", // Giảm khoảng cách giữa các mục
    alignItems: "center",
  },
  basicInfoItem: {
    alignItems: "center",
    marginBottom: 5, // Giảm khoảng cách giữa các mục
  },
  infoLabel: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#fff",
  },
  separator: {
    fontSize: 20,
    color: "#fff",
    marginHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontFamily: "LeagueSpartan-Regular",
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
    flex: 1,
  },
  input: {
    height: 40,
    width: "70%",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  editIcon: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 30,
    alignSelf: "center",
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Profile;
