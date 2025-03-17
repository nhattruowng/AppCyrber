import {View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Alert} from "react-native";
import {useEffect, useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/redux/store";
import {useRouter} from "expo-router";
import {clearUser, setUser} from "@/app/redux/userSlice";


export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [isEditing, setIsEditing] = useState<{ name: boolean; phone: boolean }>({
    name: false,
    phone: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.token) {
      router.push("/authen/login");
    }
  }, [user?.token]);

  const khachhangs = () => {
    router.push("/layout/userlistscreen");
  }
  const pt = () => {
    router.push("/layout/ptllistscreen");
  }
  const logout = () => {
    Alert.alert("Xác nhận đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {text: "Hủy", style: "cancel"},
      {
        text: "Đăng xuất",
        onPress: () => {
          dispatch(clearUser());
          router.push("/authen/login");
        },
        style: "destructive",
      },
    ]);
  };

  const toggleEdit = (field: "name" | "phone") => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateInput = (field: "name" | "phone", value: string): boolean => {
    if (!value.trim()) {
      Alert.alert("Lỗi", "Thông tin không được để trống.");
      return false;
    }
    if (field === "phone" && !/^\d{10}$/.test(value)) {
      Alert.alert("Lỗi", "Số điện thoại phải có 10 chữ số.");
      return false;
    }
    return true;
  };

  const updateUserInfo = async (field: "name" | "phone", value: string) => {
    if (!validateInput(field, value)) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/users/edit/${user.id}/${field === "name" ? "Name" : "Phone"}?content=${encodeURIComponent(value)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Cập nhật thất bại");
      }

      Alert.alert("Thành công", `${field === "name" ? "Họ tên" : "Số điện thoại"} đã được cập nhật.`);
      dispatch(setUser({ ...user, [field]: value }));
      toggleEdit(field);
    } catch (error) {
      Alert.alert("Lỗi", error instanceof Error ? error.message : "Không thể kết nối đến server.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.fixedSection}>
        <View style={styles.profileHeader}>
          <Ionicons name="person-circle" size={120} color="#fff"/>
          <Text style={styles.profileTitle}>Hồ sơ của tôi</Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>

        <View style={styles.infoContainer}>
          <InfoRow
            label="Họ và tên"
            value={name}
            isEditing={isEditing.name}
            setValue={setName}
            toggleEdit={() => toggleEdit("name")}
            onSave={() => updateUserInfo("name", name)}
          />
          <InfoRow
            label="Số điện thoại"
            value={phone}
            isEditing={isEditing.phone}
            setValue={setPhone}
            toggleEdit={() => toggleEdit("phone")}
            onSave={() => updateUserInfo("phone", phone)}
          />
        </View>

      </View>

      {user.roles.includes("ROLE_ADMIN") && (
        <>
          <Text style={styles.serviceTitle}>Quản lý</Text>
          <TouchableOpacity style={styles.serviceItem} onPress={() => khachhangs()}>
            <Text style={styles.serviceText}>Khách hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem} onPress={() => pt()}>
            <Text style={styles.serviceText}>PT</Text>
          </TouchableOpacity>
        </>
      )}

      {user.roles.includes("ROLE_ADMIN") && (
        <ScrollView style={styles.serviceList} contentContainerStyle={styles.serviceContent}>
          {["Dịch vụ 1", "Dịch vụ 2", "Dịch vụ 3", "Dịch vụ 4", "Dịch vụ 5"].map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={user.token ? logout : () => router.push("/authen/login")}>
        <Text style={styles.logoutButtonText}>{isLoading ? "Đang xử lý..." : user.token ? "Đăng xuất" : "Đăng nhập"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, isEditing, setValue, toggleEdit, onSave }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    {isEditing ? (
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        autoFocus
      />
    ) : (
      <Text style={styles.infoText}>{value}</Text>
    )}
    <TouchableOpacity onPress={isEditing ? onSave : toggleEdit} style={styles.editIcon}>
      <Ionicons name={isEditing ? "checkmark" : "pencil"} size={20} color="#FFD700" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#005f73",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fixedSection: {
    marginTop: 50,
  },
  profileHeader: {
    alignItems: "center",
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 15,
  },
  emailText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  input: {
    height: 40,
    width: "60%",
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  editIcon: {
    padding: 5,
  },
  serviceList: {
    flex: 1,
    marginTop: 20,
  },
  serviceContent: {
    paddingBottom: 20,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  serviceItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  serviceText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#ee6c4d",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

