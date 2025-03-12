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
}


const mockUserDetails = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "nguyenvana@gmail.com",
  enable: true,
  details: [
    {
      title: "Thông tin cá nhân",
      items: [
        { label: "Số điện thoại", value: "0123 456 789" },
        { label: "Ngày sinh", value: "15/03/1990" },
        { label: "Địa chỉ", value: "123 Đường Láng, Hà Nội" },
      ]
    },
    {
      title: "Thông tin tài khoản",
      items: [
        { label: "Ngày tạo", value: "01/01/2023" },
        { label: "Lần đăng nhập cuối", value: "10/03/2025" },
      ]
    }
  ]
};

const API_URL = "http://10.0.2.2:8080/api/authen/get-all";
const TOGGLE_URL = "http://10.0.2.2:8080/api/authen/delete"; // Sử dụng chung URL cho toggle

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
        !u.role?.includes("ADMIN") && // Sửa từ role thành roles để khớp với interface
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
        placeholder="Tìm kiếm..."
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredUsers.length === 0 ? (
          <Text style={styles.noData}>Không tìm thấy người dùng</Text>
        ) : (
          filteredUsers.map((userItem) => (
            <View key={userItem.id} style={styles.userCard}>
              <View>
                <Text style={styles.userName}>{userItem.name || "N/A"}</Text>
                <Text style={styles.userEmail}>{userItem.email || "N/A"}</Text>
                <Text style={styles.userStatus}>
                  Trạng thái: {userItem.enable ? "Đang hoạt động" : "Đã khóa"}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.toggleButton, !userItem.enable && styles.lockedButton]}
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  userStatus: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  toggleButton: {
    padding: 8,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  lockedButton: {
    backgroundColor: "#FF3B30",
  },
  toggleButtonText: {
    color: "#FFF",
    fontWeight: "500",
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