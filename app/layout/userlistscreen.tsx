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
  enable: boolean;
  plan: string;
}


const API_URL = "https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/users/all";
const TOGGLE_URL = "https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/users/delete"; // Sử dụng chung URL cho toggle

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);

  // Fetch users
  const fetchUsers = async () => {
    if (!user.token) return setUsers([]);

    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Accept": "application/json",
        },
      });
      if (!response.ok) throw new Error("Không thể tải dữ liệu");
      const data = await response.json();
      const userData = Array.isArray(data.data) ? data.data : data;
      const filteredData = userData.filter((u: User) => !u.roles?.includes("ADMIN"));
      setUsers(filteredData);
      setFilteredUsers(filteredData);
    } catch (err) {
      console.error("Error:", err);
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
        !u.roles?.includes("ADMIN") && // Sửa từ role thành roles để khớp với interface
        ((u.name || "").toLowerCase().includes(lowerSearch) ||
          (u.email || "").toLowerCase().includes(lowerSearch))
    );
    setFilteredUsers(filtered);
    console.log("Filtered users after search:", filtered);
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
      const newStatus = !selectedUser.enable; // Đảo ngược trạng thái hiện tại
      const response = await fetch(`${TOGGLE_URL}/${selectedUser.id}`, {
        method: "DELETE", // Hoặc DELETE nếu backend yêu cầu
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({enable: newStatus}), // Gửi trạng thái mới
      });

      // Kiểm tra Content-Type của phản hồi
      const contentType = response.headers.get("Content-Type");
      let data;
        // Cập nhật state cục bộ
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === selectedUser.id ? {...u, enable: newStatus} : u
          )
        );
        setFilteredUsers((prevFiltered) =>
          prevFiltered.map((u) =>
            u.id === selectedUser.id ? {...u, enable: newStatus} : u
          )
        );
    } catch (err) {
      console.error("Toggle error:", err);
      alert( "Đã xảy ra lỗi khi thay đổi trạng thái người dùng");
    } finally {
      setIsLoading(false);
      setModalVisible(false);
      setSelectedUser(null);
    }
  };

  if (isLoading && !users.length) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF"/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
          style={styles.searchInput}
          placeholder="🔍 Tìm kiếm..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredUsers.length === 0 ? (
          <Text style={styles.noData}>Không tìm thấy người dùng</Text>
        ) : (
          filteredUsers.map((userItem) => (
              <View key={userItem.id} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{userItem.name || "N/A"}</Text>
                  <Text style={styles.userPlan}>Gói: {userItem.plan || "N/A"}</Text>
                  <Text style={styles.userEmail}>{userItem.email || "N/A"}</Text>
                  <Text style={styles.userStatus}>
                    Trạng thái: {userItem.enable ? "Đang hoạt động" : "Đã khóa"}
                  </Text>
                </View>

                <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      !userItem.enable && styles.lockedButton,
                    ]}
                    onPress={() => handleToggleLock(userItem)}
                    disabled={isLoading}
                >
                  <Text style={styles.toggleButtonText}>
                    {!userItem.enable ? "Mở khóa" : "Khóa"}
                  </Text>
                </TouchableOpacity>
              </View>

          ))
        )}
      </ScrollView>

      <Modal isVisible={isModalVisible} onBackdropPress={() => !isLoading && setModalVisible(false)}>
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
              <Text>Hủy</Text>
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
    padding: 15,
    backgroundColor: "#F7F7F7",
  },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 8, // Điều chỉnh khoảng cách xuống dưới
  },
  userInfo: {
    flex: 1,
    gap: 4, // Khoảng cách giữa các dòng thông tin
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  userPlan: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  userEmail: {
    fontSize: 14,
    color: "#777",
  },
  userStatus: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007BFF",
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
  },
  lockedButton: {
    backgroundColor: "#FF4D4F",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noData: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  modal: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 20,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
  },
  confirmButton: {
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "#FFF",
    fontWeight: "500",
  },
});