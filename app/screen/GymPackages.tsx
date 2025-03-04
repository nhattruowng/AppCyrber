import React from "react";
import { StyleSheet, View, Text, FlatList, Dimensions, TouchableOpacity } from "react-native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const gymPackages = [
  { id: "1", name: "Gói Cơ Bản", description: "Truy cập phòng tập trong giờ hành chính", price: 500000 },
  { id: "2", name: "Gói Tiêu Chuẩn", description: "Truy cập 24/7 + Hướng dẫn cơ bản", price: 800000 },
  { id: "3", name: "Gói Cao Cấp", description: "Truy cập 24/7 + PT riêng + Sauna", price: 1500000 },
];

const GymPackagesScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.packageCard}>
      <Text style={styles.packageName}>{item.name}</Text>
      <Text style={styles.packageDescription}>{item.description}</Text>
      <Text style={styles.packagePrice}>{item.price.toLocaleString()} VND / tháng</Text>
      <TouchableOpacity style={styles.subscribeButton}>
        <Text style={styles.subscribeText}>Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gói Đăng Ký Tập Gym</Text>
      <FlatList
        data={gymPackages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: windowHeight * 0.05,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  packageCard: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 15,
    width: windowWidth * 0.9,
    marginBottom: 15,
  },
  packageName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  packageDescription: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 10,
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  subscribeButton: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  subscribeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default GymPackagesScreen;
