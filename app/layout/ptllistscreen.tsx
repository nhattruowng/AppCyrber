import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from "react-native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const API_URL = "http://10.0.2.2:8080/api/trainers";

export default function VehicleManagementScreen() {
    const [vehicles, setVehicles] = useState([]);
    const [newEmail, setNewEmail] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isLockModalVisible, setLockModalVisible] = useState(false);
    const user = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);

    // Lấy danh sách PT từ API
    const fetchTrainers = async () => {
        try {
            const response = await fetch(`${API_URL}/list-all`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    "Accept": "application/json",
                },
            });
            const result = await response.json();
            if (result.httpStatus === "OK") {
                setVehicles(result.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách trainers:", error);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý thêm PT
    const handleAddVehicle = async () => {
        if (newEmail.trim() === "") return;
        try {
            const response = await fetch(`${API_URL}/add`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: newEmail }),
            });
            if (response.ok) {
                fetchTrainers();
            }
        } catch (error) {
            console.error("Lỗi khi thêm PT:", error);
        }
        setNewEmail("");
        setAddModalVisible(false);
    };

    // Xử lý khóa/mở khóa PT
    const handleLockVehicle = async () => {
        if (!selectedVehicle) return;
        try {
            const response = await fetch(`${API_URL}/lock/${selectedVehicle.id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                },
            });
            if (response.ok) {
                fetchTrainers();
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái khóa:", error);
        }
        setLockModalVisible(false);
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
                <Text style={styles.addButtonText}>➕ Thêm PT</Text>
            </TouchableOpacity>
            <ScrollView>
                {vehicles.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>Không có PT nào.</Text>
                ) : (
                    vehicles.map((vehicle) => (
                        <View key={vehicle.id} style={styles.vehicleItem}>
                            <Text style={styles.vehicleText}>
                                {vehicle.email} {vehicle.locked ? "(Đã khóa)" : ""}
                            </Text>
                            <TouchableOpacity
                                style={styles.lockButton}
                                onPress={() => {
                                    setSelectedVehicle(vehicle);
                                    setLockModalVisible(true);
                                }}
                            >
                                <Text style={styles.lockText}>{vehicle.locked ? "🔓 Mở khóa" : "🔒 Khóa"}</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
            <Modal isVisible={isAddModalVisible} onBackdropPress={() => setAddModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Thêm PT</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập email"
                        value={newEmail}
                        onChangeText={setNewEmail}
                    />
                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setAddModalVisible(false)}>
                            <Text>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleAddVehicle}>
                            <Text style={{ color: "#fff" }}>Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal isVisible={isLockModalVisible} onBackdropPress={() => setLockModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Xác nhận khóa</Text>
                    <Text style={styles.modalMessage}>
                        Bạn có chắc muốn {selectedVehicle?.locked ? "mở khóa" : "khóa"} PT "{selectedVehicle?.email}" không?
                    </Text>
                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setLockModalVisible(false)}>
                            <Text>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleLockVehicle}>
                            <Text style={{ color: "#fff" }}>{selectedVehicle?.locked ? "Mở khóa" : "Khóa"}</Text>
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
    addButton: {
        padding: 12,
        backgroundColor: "#007bff",
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    vehicleItem: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    vehicleText: {
        fontSize: 16,
    },
    lockButton: {
        padding: 10,
    },
    lockText: {
        fontSize: 16,
        color: "red",
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
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        width: "100%",
        padding: 10,
        marginBottom: 10,
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
