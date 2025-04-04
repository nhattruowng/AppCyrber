import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useNavigation } from "@react-navigation/native";

interface User {
  id: string;
  name: string;
  email: string;
  roles?: string[];
  enable: boolean;
  plan: string;
}

const API_URL = "https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/users/all";
const TOGGLE_URL = "https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/users/delete";

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();

  // Fetch users
  const fetchUsers = async () => {
    if (!user.token) return setUsers([]);

    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("Không thể tải dữ liệu");
      const data = await response.json();
      const userData = Array.isArray(data.data) ? data.data : data;
      const filteredData = userData.filter((u: User) => !u.roles?.includes("ADMIN"));
      setUsers(filteredData);
      setFilteredUsers(filteredData);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [user.token]);

  // Filter users based on search
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = users.filter(
        (u) =>
            !u.roles?.includes("ADMIN") &&
            ((u.name || "").toLowerCase().includes(lowerSearch) ||
                (u.email || "").toLowerCase().includes(lowerSearch))
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  // Toggle lock/unlock user
  const handleToggleLock = (userItem: User) => {
    if (!user.token) {
      alert("Vui lòng đăng nhập lại để thực hiện thao tác này");
      return;
    }
    setSelectedUser(userItem);
    setModalVisible(true);
  };

  const confirmToggleLock = async () => {
    if (!selectedUser || !user.token) return;

    setIsLoading(true);
    try {
      const newStatus = !selectedUser.enable;
      const response = await fetch(`${TOGGLE_URL}/${selectedUser.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enable: newStatus }),
      });

      if (!response.ok) throw new Error("Không thể thay đổi trạng thái");

      // Update local state
      setUsers((prevUsers) =>
          prevUsers.map((u) =>
              u.id === selectedUser.id ? { ...u, enable: newStatus } : u
          )
      );
      setFilteredUsers((prevFiltered) =>
          prevFiltered.map((u) =>
              u.id === selectedUser.id ? { ...u, enable: newStatus } : u
          )
      );
    } catch (err) {
      console.log("Toggle error:", err);
      alert("Đã xảy ra lỗi khi thay đổi trạng thái người dùng");
    } finally {
      setIsLoading(false);
      setModalVisible(false);
      setSelectedUser(null);
    }
  };

  if (isLoading && !users.length) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Danh Sách Khách Hàng</Text>
        </View>

        {/* Search Input */}
        <TextInput
            style={styles.searchInput}
            placeholder="🔍 Tìm kiếm..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
        />

        {/* User List */}
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
        >
          {filteredUsers.length === 0 ? (
              <Text style={styles.noData}>Không tìm thấy người dùng</Text>
          ) : (
              filteredUsers.map((userItem) => (
                  <View key={userItem.id} style={styles.userCard}>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{userItem.name || "N/A"}</Text>
                      <View style={styles.infoRow}>
                        <Text style={styles.label}>Gói:</Text>
                        <Text style={styles.value}>{userItem.plan || "N/A"}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{userItem.email || "N/A"}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.label}>Trạng thái:</Text>
                        <Text
                            style={[
                              styles.status,
                              { color: userItem.enable ? "#27ae60" : "#e74c3c" },
                            ]}
                        >
                          {userItem.enable ? "Đang hoạt động" : "Đã khóa"}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                        style={[
                          styles.toggleButton,
                          { backgroundColor: userItem.enable ? "#e74c3c" : "#27ae60" },
                        ]}
                        onPress={() => handleToggleLock(userItem)}
                        disabled={isLoading}
                    >
                      {!userItem.roles?.includes("USER_ADMIN") && (
                          <Text style={styles.toggleButtonText}>
                            {userItem.enable ? "Khóa" : "Mở khóa"}
                          </Text>
                      )}

                    </TouchableOpacity>
                  </View>
              ))
          )}
        </ScrollView>

        {/* Back Button */}
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>

        {/* Modal for Confirmation */}
        <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => !isLoading && setModalVisible(false)}
        >
          <View style={styles.modal}>
            <Text style={styles.modalText}>
              {`Bạn muốn ${selectedUser?.enable ? "khóa" : "mở khóa"} "${selectedUser?.name || "N/A"}"?`}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                  disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={confirmToggleLock}
                  disabled={isLoading}
              >
                <Text style={styles.confirmButtonText}>
                  {isLoading ? "Đang xử lý..." : "Xác nhận"}
                </Text>
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
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 24,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: 0.5,
  },
  searchInput: {
    height: 48,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginRight: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#3498db",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  noData: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 16,
  },
  modal: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "500",
    fontSize: 14,
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "#FFF",
    fontWeight: "500",
    fontSize: 14,
  },
});