import {View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator} from "react-native";
import {useEffect, useState} from "react";
import Modal from "react-native-modal";
import {useSelector} from "react-redux";
import {RootState} from "@/app/redux/store";

interface User {
  id: string;
  name: string;
  email: string;
  roles?: string[];
  locked: boolean;
}

const API_URL = "http://10.0.2.2:8080/api/authen/get-all";
const DELETE_URL = "http://10.0.2.2:8080/api/authen/delete";

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${user.token}`,
            "Accept": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw API response:", JSON.stringify(data, null, 2)); // Log dữ liệu gốc

        // Kiểm tra và xử lý dữ liệu
        const userData = data.data || data; // Nếu không có data.data, thử dùng data trực tiếp
        if (!Array.isArray(userData)) {
          throw new Error("Dữ liệu trả về không phải là mảng");
        }

        const filteredData = userData.filter((u: User) => !u.roles?.includes("Admin"));
        console.log("Filtered data:", filteredData); // Log dữ liệu sau khi lọc

        setUsers(filteredData);
        setFilteredUsers(filteredData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể tải danh sách người dùng";
        setError(errorMessage);
        console.error("Error fetching users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user.token) {
      fetchUsers();
    } else {
      setError("Không có token, vui lòng đăng nhập lại");
    }
  }, [user.token]);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.role !== "ADMIN" &&
        ((u.name || "").toLowerCase().includes(lowerSearch) ||
          (u.email || "").toLowerCase().includes(lowerSearch))
    );
    setFilteredUsers(filtered);
    console.log("Filtered users after search:", filtered);
  }, [search, users]);


  const handleLockPress = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const confirmLockUser = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${DELETE_URL}?id=${encodeURIComponent(selectedUser.id)}`, {
        method: "DELETE", // Dùng DELETE cho cả khóa và mở khóa
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Accept": "application/json",
        },
      });

      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response body:", responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`Thao tác thất bại: ${response.status} - ${responseText}`);
        }
        throw new Error(errorData.message || "Thao tác thất bại");
      }

      // Đảo ngược trạng thái locked vì BE tự động toggle
      const newLockedState = !selectedUser.locked;
      setUsers(prev => prev.map(u =>
        u.id === selectedUser.id ? {...u, locked: newLockedState} : u
      ));
      setFilteredUsers(prev => prev.map(u =>
        u.id === selectedUser.id ? {...u, locked: newLockedState} : u
      ));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Lỗi khi ${selectedUser?.locked ? "mở khóa" : "khóa"} người dùng`;
      setError(errorMessage);
      console.error(`Error toggling lock state:`, err);
    } finally {
      setIsLoading(false);
      setModalVisible(false);
      setSelectedUser(null);
    }
  };

  // Render loading state
  if (isLoading && users.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF"/>
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách khách hàng</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm theo tên hoặc email"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredUsers.length === 0 ? (
          <Text style={styles.noResults}>
            {users.length === 0 ? "Không có dữ liệu" : "Không tìm thấy khách hàng"}
          </Text>
        ) : (
          filteredUsers.map((userItem) => (
            <View key={userItem.id} style={styles.userItem}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userItem.name || "Không có tên"}</Text>
                <Text style={styles.userEmail}>{userItem.email || "Không có email"}</Text>
              </View>
             <TouchableOpacity
                style={[styles.lockButton, userItem.locked && styles.locked, isLoading && styles.disabledButton]}
                onPress={() => handleLockPress(userItem)}
                disabled={isLoading}
              >
                <Text style={[styles.lockText, userItem.locked && styles.lockedText]}>
                  {isLoading && selectedUser?.id === userItem.id
                    ? "Đang xử lý..."
                    : userItem.locked
                      ? "🔒 Đã khóa"
                      : "🔒 Khóa"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => !isLoading && setModalVisible(false)}
        backdropOpacity={0.3}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {selectedUser?.locked ? "Xác nhận mở khóa" : "Xác nhận khóa"}
          </Text>
          <Text style={styles.modalMessage}>
            Bạn có chắc muốn {selectedUser?.locked ? "mở khóa" : "khóa"} người dùng "
            {selectedUser?.name || "Không tên"}" không?
          </Text>
          {isLoading && <ActivityIndicator size="small" color="#ff4444" />}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.cancelButton, isLoading && styles.disabledButton]}
              onPress={() => setModalVisible(false)}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                selectedUser?.locked && styles.confirmButtonUnlocked, // Thay đổi màu nếu mở khóa
                isLoading && styles.disabledButton
              ]}
              onPress={confirmLockUser}
              disabled={isLoading}
            >
              <Text style={styles.confirmButtonText}>
                {selectedUser?.locked ? "Mở khóa" : "Khóa"}
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
    padding: 20,
    backgroundColor: "#f5f5f5"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333"
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  userItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  confirmButtonUnlocked: {
    backgroundColor: "#4CAF50", // Màu xanh cho mở khóa
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333"
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2
  },
  lockButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
  },
  locked: {
    backgroundColor: "#ff4444"
  },
  lockText: {
    fontSize: 14,
    fontWeight: "500"
  },
  lockedText: {
    color: "#fff"
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333"
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#666"
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ff4444",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500"
  },
  confirmButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500"
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  noResults: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});