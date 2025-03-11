import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import Modal from "react-native-modal";

export default function UserListScreen() {
  const [users, setUsers] = useState([
        { id: 1, name: "Nguyễn Văn A", email: "a@example.com", locked: false },
        { id: 2, name: "Trần Thị B", email: "b@example.com", locked: false },
      ]);
      const [selectedUser, setSelectedUser] = useState(null);
      const [isModalVisible, setModalVisible] = useState(false);

      const handleLockPress = (user) => {
        setSelectedUser(user);
        setModalVisible(true);
      };

      const confirmLockUser = () => {
        if (selectedUser) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === selectedUser.id ? { ...user, locked: true } : user
            )
          );
        }
        setModalVisible(false);
      };

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Danh sách khách hàng</Text>
          <ScrollView>
            {users.map((user) => (
              <View key={user.id} style={styles.userItem}>
                <View>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.lockButton, user.locked && styles.locked]}
                  onPress={() => handleLockPress(user)}
                  disabled={user.locked}
                >
                  <Text style={styles.lockText}>{user.locked ? "🔒 Đã khóa" : "🔒"}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Modal Xác Nhận Khóa */}
          <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Xác nhận khóa</Text>
              <Text style={styles.modalMessage}>
                Bạn có chắc muốn khóa user "{selectedUser?.name}" không?
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmLockUser}>
                  <Text style={{ color: "#fff" }}>Khóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
      },
      title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
      },
      userItem: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      userName: {
        fontSize: 16,
        fontWeight: "bold",
      },
      userEmail: {
        fontSize: 14,
        color: "#666",
      },
      lockButton: {
        padding: 10,
        backgroundColor: "#ddd",
        borderRadius: 5,
      },
      locked: {
        backgroundColor: "#ff4444",
      },
      lockText: {
        fontSize: 16,
      },
      modalContainer: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
      },
      modalMessage: {
        fontSize: 16,
        marginBottom: 20,
      },
      modalActions: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
      },
      cancelButton: {
        padding: 10,
        backgroundColor: "#ddd",
        borderRadius: 5,
      },
      confirmButton: {
        padding: 10,
        backgroundColor: "#ff4444",
        borderRadius: 5,
      },
    });

