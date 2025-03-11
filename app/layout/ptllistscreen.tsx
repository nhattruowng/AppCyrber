import {useState} from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from "react-native";
import Modal from "react-native-modal";

export default function VehicleManagementScreen() {
    const [vehicles, setVehicles] = useState([
        {id: 1, email: "pt1@example.com", locked: false},
        {id: 2, email: "pt2@example.com", locked: false},
    ]);

    const [newEmail, setNewEmail] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isLockModalVisible, setLockModalVisible] = useState(false);

    // Xử lý thêm PT
    const handleAddVehicle = () => {
        if (newEmail.trim() === "") return;
        setVehicles([...vehicles, {id: Date.now(), email: newEmail, locked: false}]);
        setNewEmail("");
        setAddModalVisible(false);
    };

    // Xử lý khóa PT
    const handleLockVehicle = () => {
        if (!selectedVehicle) return;
        setVehicles(
            vehicles.map((v) =>
                v.id === selectedVehicle.id ? {...v, locked: !v.locked} : v
            )
        );
        setLockModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản lý phương tiện</Text>

            {/* Nút thêm PT */}
            <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
                <Text style={styles.addButtonText}>➕ Thêm PT</Text>
            </TouchableOpacity>

            <ScrollView>
                {vehicles.map((vehicle) => (
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
                ))}
            </ScrollView>

            {/* Dialog Thêm PT */}
            <Modal isVisible={isAddModalVisible} onBackdropPress={() => setAddModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Thêm Phương Tiện</Text>
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
                            <Text style={{color: "#fff"}}>Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Dialog Khóa PT */}
            <Modal isVisible={isLockModalVisible} onBackdropPress={() => setLockModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Xác nhận khóa</Text>
                    <Text style={styles.modalMessage}>
                        Bạn có chắc muốn {selectedVehicle?.locked ? "mở khóa" : "khóa"} phương tiện
                        "{selectedVehicle?.email}" không?
                    </Text>
                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setLockModalVisible(false)}>
                            <Text>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleLockVehicle}>
                            <Text style={{color: "#fff"}}>{selectedVehicle?.locked ? "Mở khóa" : "Khóa"}</Text>
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
