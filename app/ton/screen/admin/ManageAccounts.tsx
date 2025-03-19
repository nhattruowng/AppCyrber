import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

interface Account {
  id: string;
  name: string;
  role: string;
}

const initialAccounts: Account[] = [
  { id: "1", name: "Nguyễn Văn A", role: "Admin" },
  { id: "2", name: "Trần Thị B", role: "Manager" },
  { id: "3", name: "Lê Văn C", role: "Staff" },
  { id: "4", name: "Phạm Minh D", role: "User" },
];

const ManageAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  const renderItem = ({ item }: { item: Account }) => (
    <View style={styles.accountCard}>
      <Text style={styles.accountName}>{item.name}</Text>
      <Text style={styles.accountRole}>{item.role}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản Lý Tài Khoản</Text>
      <FlatList
        data={accounts}
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
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  accountCard: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    width: windowWidth * 0.9,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountName: {
    fontSize: 18,
    color: "#fff",
  },
  accountRole: {
    fontSize: 16,
    color: "#bbb",
  },
  deleteButton: {
    backgroundColor: "#E53935",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default ManageAccounts;