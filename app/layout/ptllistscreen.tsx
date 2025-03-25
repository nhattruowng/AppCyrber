import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput, Alert, ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import {useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {RootState} from "@/app/redux/store";
import {Picker} from "@react-native-picker/picker"; // Thêm Picker

const API_URL = "https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/trainers";

interface PT {
    id: string;
    email: string;
    phone: string;
    status: string;
    enable: boolean;
}

export default function VehicleManagementScreen() {
    const [vehicles, setVehicles] = useState<PT[]>([]);

    const [newEmail, setNewEmail] = useState("");
    const [specialization, setSpecialization] = useState(""); // Thêm state cho specialization
    const [experienceYear, setExperienceYear] = useState(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);


    const [selectedVehicle, setSelectedVehicle] = useState<PT | null>(null);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isLockModalVisible, setLockModalVisible] = useState(false);
    const user = useSelector((state: RootState) => state.user);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);


    // Hàm thêm PT
    const addTrainers = async (email: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    specialization,
                    experienceYear
                }),
            });
            if (response.status !== 200) {
                Alert.alert("Tap Pt voi email: ", `${email} that bai!`);
            }

            return response;
        } catch (error) {
            Alert.alert("Tap Pt voi email: ", `${email} that bai!`);
        } finally {
            setIsLoading(false);
            setAddModalVisible(true);
        }
    };

    // Lấy danh sách PT
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
                const userData = Array.isArray(result.data) ? result.data : result;
                setVehicles(userData);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách trainers:", error);
        } finally {
            setLoading(false);
        }
    };


    // Xử lý thêm PT
    const handleAddVehicle = async () => {
        if (newEmail.trim() === "" || specialization.trim() === "") return;
        try {
            await addTrainers(newEmail); // Gọi hàm addTrainers
            await fetchTrainers(); // Cập nhật danh sách
            setNewEmail("");
            setSpecialization(""); // Reset specialization
            setExperienceYear(0);
            setAddModalVisible(false);
        } catch (error) {
            console.error("Lỗi khi thêm PT:", error);
        }
    };

    // Xử lý khóa/mở khóa PT
    const handleLockVehicle = async () => {
        if (!selectedVehicle) return;
        setIsProcessing(true);
        try {
            const response = await fetch(`${API_URL}/trainer-lock/${selectedVehicle.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                await fetchTrainers();
            } else {
                Alert.alert("Lỗi", "Không thể cập nhật trạng thái PT.");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái khóa:", error);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật trạng thái.");
        } finally {
            setIsProcessing(false);
            setLockModalVisible(false);
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Danh Sách PT</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setAddModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.addButtonText}>➕ Thêm PT</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.listContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#3498db" />
                        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                    </View>
                ) : vehicles.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Không có PT nào</Text>
                        </View>
                ) : (
                    vehicles.map((vehicle) => (
                        <View key={vehicle.id} style={styles.vehicleItem}>
                            <View style={styles.vehicleInfo}>
                                <Text style={styles.vehicleEmail}>{vehicle.email}</Text>
                                <Text
                                    style={[
                                        styles.vehicleStatus,
                                        {color: vehicle.status ? "#28a745" : "#ff4444"},
                                    ]}
                                >
                                    Hoạt động:
                                    {vehicle.status ? "✅" : "❌"}
                                </Text>
                                <Text>sdt: {vehicle?.phone === null ? "" : vehicle.phone}</Text>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.lockButton,
                                    {
                                        backgroundColor: !vehicle.enable ? "#ff4444" : "#28a745",
                                    },
                                ]}
                                onPress={() => {
                                    setSelectedVehicle(vehicle);
                                    setLockModalVisible(true);
                                }}
                                disabled={isProcessing && selectedVehicle?.id === vehicle.id}
                            >
                                <Text style={styles.lockButtonText}>
                                    {isProcessing && selectedVehicle?.id === vehicle.id
                                        ? "Đang xử lý..."
                                        : !vehicle.enable
                                            ? "Khóa"
                                            : "Mở khóa"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Lock Modal */}
            <Modal
                isVisible={isAddModalVisible}
                //                onBackdropPress={() => setAddModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Thêm PT Mới</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập email PT"
                        value={newEmail}
                        onChangeText={setNewEmail}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={[
                            styles.input,
                            specialization.trim() === "" && styles.inputError,
                        ]}
                        placeholder="Nhập chuyên môn"
                        value={specialization}
                        onChangeText={setSpecialization}
                    />
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={experienceYear}
                            onValueChange={(itemValue) => setExperienceYear(itemValue)}
                            style={styles.picker}
                        >
                            {Array.from({length: 51}, (_, i) => i).map((year) => (
                                <Picker.Item
                                    key={year}
                                    label={`${year} năm`}
                                    value={year}
                                />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setAddModalVisible(false)}
                        >
                            <Text style={styles.cancelText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.confirmButton]}
                            onPress={handleAddVehicle}
                            disabled={isLoading}
                        >
                            <Text style={styles.confirmText}>
                                {isLoading ? "Đang xử lý..." :
                                    "Thêm"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            <Modal
                isVisible={isLockModalVisible}
                onBackdropPress={() => setLockModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {selectedVehicle?.enable ? "Mở khóa" : "Khóa"} PT
                    </Text>
                    <Text style={styles.modalMessage}>
                        Bạn có chắc muốn {selectedVehicle?.enable ? "mở khóa" : "khóa"} PT{" "}
                        {selectedVehicle?.email} không?
                    </Text>
                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setLockModalVisible(false)}
                            disabled={isProcessing}
                        >
                            <Text style={styles.cancelText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.confirmButton]}
                            onPress={handleLockVehicle}
                            disabled={isProcessing}
                        >
                            <Text style={styles.confirmText}>
                                {isProcessing ? "Đang xử lý..." : "Xác nhận"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: "#fafafa",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 24, // Extra padding for status bar
        elevation: 3, // Subtle shadow for Android
        shadowColor: '#000', // Subtle shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a1a1a',
        letterSpacing: 0.5,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007bff', // A vibrant blue
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20, // More rounded for a modern look
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    addButtonText: {
        fontSize: 15,
        color: '#ffffff',
        fontWeight: '600',
        marginLeft: 6, // Space between icon and text
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    picker: {
        height: 50,
        width: "100%",
    },
    inputError: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: "#fafafa",
        borderColor: "red",
    },
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    listContainer: {
        flex: 1,
        padding: 15,
    },
    vehicleItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    vehicleInfo: {
        flex: 1,
    },
    vehicleEmail: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    vehicleStatus: {
        fontSize: 14,
        marginTop: 2,
    },
    lockButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    lockButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    modalContainer: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        marginHorizontal: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 15,
    },
    modalMessage: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: "#fafafa",
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    confirmButton: {
        backgroundColor: "#007bff",
    },
    cancelText: {
        color: "#666",
        fontSize: 16,
        fontWeight: "500",
    },
    confirmText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});