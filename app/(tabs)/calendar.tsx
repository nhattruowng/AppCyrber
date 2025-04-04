import React, { useEffect, useState, useCallback } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/vi";
import { RootState } from "@/app/redux/store";

// Cấu hình API và constants
const API_URL = "https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api";
const API_DURATION = 15;
const START_HOUR = 6;

LocaleConfig.locales["vi"] = {
    monthNames: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    dayNames: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
    dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    today: "Hôm nay",
};
LocaleConfig.defaultLocale = "vi";

// Định nghĩa types
interface User {
    id: string;
    token: string;
    roles: string[];
}

interface PT {
    id: string;
    email: string;
    phone: string;
    status: string;
    enable: boolean;
}

interface Schedule {
    id: string;
    TrainerId: string | null;
    checkout: boolean;
    checkin: boolean;
    dateTime: string;
    UserEmail?: string;
}

interface PtDataMap {
    [key: string]: PT | null;
}

interface PtLoadingMap {
    [key: string]: boolean;
}

// Utility functions
const formatDate = (dateString: string): string => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const CalendarScreen: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const [loadingBooking, setLoadingBooking] = useState(false);
    const [loadingPTlist, setloadingPTlist] = useState(false);
    const [ptLoading, setPtLoading] = useState<PtLoadingMap>({});
    const [scheduleList, setScheduleList] = useState<Schedule[]>([]);
    const [availablePTs, setAvailablePTs] = useState<PT[]>([]);
    const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
    const [ptData, setPtData] = useState<PtDataMap>({});
    const [selectedItem, setSelectedItem] = useState<Schedule | null>(null);
    const [selectedPT, setSelectedPT] = useState<PT | null>(null);

    const user = useSelector((state: RootState) => state.user as User);

    // Memoized fetch functions
    const fetchSchedules = useCallback(async () => {
        setLoadingCategory(true);
        try {
            const response = await fetch(`${API_URL}/schedules-io/user/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    Accept: "application/json",
                },
            });
            const result = await response.json();
            if (response.ok && result.httpStatus === "OK") {
                setScheduleList(Array.isArray(result.data) ? result.data : []);
            } else {
                setScheduleList([]);
            }
        } catch (error) {
            console.log("Fetch schedules error:", error);
            setScheduleList([]);
        } finally {
            setLoadingCategory(false);
        }
    }, [user.id, user.token]);

    const fetchAvailablePTs = useCallback(async () => {
        if (!selectedDate) return;
        try {
            setloadingPTlist(true);
            const date = formatDate(selectedDate);
            const response = await fetch(`${API_URL}/trainers/trainer/free/${date}`, {
                headers: { Accept: "application/json" },
            });
            const result = await response.json();
            setAvailablePTs(Array.isArray(result.data) ? result.data : []);
            setloadingPTlist(false);
        } catch (error) {
            console.log("Fetch PTs error:", error);
            setAvailablePTs([]);
        }
    }, [selectedDate]);

    const fetchPTDetails = useCallback(async (ptid: string | null) => {
        if (!ptid) {
            setPtData(prev => ({ ...prev, [ptid as any]: null }));
            return;
        }

        setPtLoading(prev => ({ ...prev, [ptid]: true }));
        try {
            const response = await fetch(`${API_URL}/trainers/trainer/${ptid}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    Accept: "application/json",
                },
            });
            const result = await response.json();
            if (result.httpStatus === "OK") {
                setPtData(prev => ({ ...prev, [ptid]: result.data }));
            }
        } catch (error) {
            console.log("Fetch PT details error:", error);
        } finally {
            setPtLoading(prev => ({ ...prev, [ptid]: false }));
        }
    }, [user.token]);

    const fetchAdminData = useCallback(async () => {
        if (!selectedDate || !user.roles.includes("ROLE_ADMIN")) return;
        setLoadingCategory(true);
        try {
            const date = formatDate(selectedDate);
            const response = await fetch(
                `${API_URL}/schedules-io/category/total-day/${date}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const result = await response.json();
            if (response.ok && result.httpStatus === "OK") {
                setScheduleList(Array.isArray(result.data) ? result.data : []);
            } else {
                setScheduleList([]);
            }
        } catch (error) {
            console.log("Fetch admin data error:", error);
        } finally {
            setLoadingCategory(false);
        }
    }, [selectedDate, user.roles, user.token]);


    // Effects
    useEffect(() => { fetchSchedules(); }, [fetchSchedules]);
    useEffect(() => { fetchAvailablePTs(); }, [fetchAvailablePTs]);
    useEffect(() => { fetchAdminData(); }, [fetchAdminData]);

    useEffect(() => {
        const marks: Record<string, any> = {};
        if (!scheduleList.length) {
            setMarkedDates(marks);
            return;
        }

        scheduleList.forEach(item => {
            const date = moment(item.dateTime).format("YYYY-MM-DD");
            marks[date] = {
                marked: true,
                dotColor: item.checkin && item.checkout
                    ? "#02ff17"
                    : item.checkin
                        ? "#c42e01"
                        : "#007AFF"
            };
        });
        setMarkedDates(marks);
    }, [scheduleList]);

    // Render helpers
    const getEventsForDate = (date: string): Schedule[] => {
        return scheduleList.filter(event =>
            moment(event.dateTime).format("DD/MM/YYYY") === date
        );
    };

    const isPastDate = selectedDate && moment(selectedDate, "DD/MM/YYYY").isBefore(moment(), "day");

    const renderScheduleItem = ({ item }: { item: Schedule }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => {
                setSelectedItem(item);
                setModalVisible(true);
                if (item.TrainerId) {
                    fetchPTDetails(item.TrainerId);
                }
            }}
        >
            {item.UserEmail && <Text style={styles.emailText}>Email: {item.UserEmail}</Text>}

            <Text style={styles.statusText}>Check-in: {item.checkin ? "✅" : "❌"}</Text>
            <Text style={styles.statusText}>Check-out: {item.checkout ? "✅" : "❌"}</Text>

            <Text style={styles.statusText}>
                PT: {item.TrainerId
                ? `✅`
                : "❌"}
            </Text>
        </TouchableOpacity>
    );

    const handleBookingPT = useCallback(async (idSchedule: string, idPT: string) => {
        if (!idSchedule || !idPT) {
            Alert.alert("Lỗi", "Vui lòng chọn lịch hẹn và PT hợp lệ");
            return;
        }

        setLoadingBooking(true);
        try {
            const response = await fetch(`${API_URL}/booking/trainner`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idSchedule,
                    idPT,
                }),
            });

            if (response.status === 200) {
                Alert.alert("Thành công", "Đăng ký PT thành công!");
                await Promise.all([fetchAdminData(), fetchSchedules()]);
            } else {
                const result = await response.json();
                Alert.alert("Thất bại", result.message || "Đăng ký PT thất bại, vui lòng thử lại!");
            }
        } catch (error) {
            console.log("Lỗi khi booking PT:", error);
            Alert.alert("Thất bại", "Đã xảy ra lỗi khi đăng ký PT!");
        } finally {
            setLoadingBooking(false);
        }
    }, [user.token, fetchAdminData, fetchSchedules]);

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={day => setSelectedDate(moment(day.dateString).format("DD/MM/YYYY"))}
                markedDates={{
                    ...markedDates,
                    [moment(selectedDate, "DD/MM/YYYY").format("YYYY-MM-DD")]: {
                        ...markedDates[moment(selectedDate, "DD/MM/YYYY").format("YYYY-MM-DD")],
                        selected: true,
                        selectedColor: "#007AFF",
                    },
                }}
            />

            {loadingCategory ? (
                <Text style={styles.loadingText}>Đang tải...</Text>
            ) : selectedDate ? (
                <View style={styles.scheduleContainer}>
                    <Text style={styles.dateText}>Ngày: {selectedDate}</Text>
                    <FlatList
                        data={getEventsForDate(selectedDate)}
                        renderItem={renderScheduleItem}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={<Text style={styles.emptyText}>Không có lịch hẹn</Text>}
                        contentContainerStyle={styles.scheduleList}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                    />
                </View>
            ) : null}

            {user.roles.includes("ROLE_USER") && (
                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Thông tin lịch hẹn</Text>

                            <Text style={styles.modalLabel}>Ngày: {selectedDate}</Text>

                            {selectedItem && (
                                <>
                                    <Text style={styles.modalLabel}>
                                        Trạng thái: {isPastDate ? "⏳ Đã qua" : "🔄 Chưa thực thi"}
                                    </Text>
                                    {selectedItem.UserEmail && (
                                        <Text style={styles.modalLabel}>Email: {selectedItem.UserEmail}</Text>
                                    )}
                                    <Text style={styles.statusText}>
                                        Check-in: <Text style={selectedItem.checkin ? styles.successIcon : styles.errorIcon}>
                                        {selectedItem.checkin ? "✅ Có" : "❌ Không"}
                                    </Text>
                                    </Text>
                                    <Text style={styles.statusText}>
                                        Check-out: <Text style={selectedItem.checkout ? styles.successIcon : styles.errorIcon}>
                                        {selectedItem.checkout ? "✅ Có" : "❌ Không"}
                                    </Text>
                                    </Text>
                                    <Text style={styles.statusText}>
                                        PT: {ptLoading[selectedItem.TrainerId ?? ""]
                                        ? "Đang tải..."
                                        : selectedItem.TrainerId && ptData[selectedItem.TrainerId]?.email
                                            ? <Text style={styles.successIcon}>{`${ptData[selectedItem.TrainerId].email} ✅`}</Text>
                                            : <Text style={styles.errorIcon}>❌</Text>}
                                    </Text>
                                </>
                            )}

                            {!isPastDate && !selectedItem?.TrainerId && (
                                <View style={styles.pickerContainer}>
                                    {loadingPTlist ? (
                                        <Text style={styles.loadingText}>Đang tải danh sách PT...</Text>
                                    ) : (
                                        <Picker
                                            selectedValue={selectedPT}
                                            onValueChange={itemValue => setSelectedPT(itemValue)}
                                            style={styles.picker}
                                        >
                                            <Picker.Item label="Chọn PT" value={null} />
                                            {availablePTs.map(pt => (
                                                <Picker.Item
                                                    key={pt.id}
                                                    label={`${pt.email} (${pt.enable ? "Có" : "Không"})`}
                                                    value={pt}
                                                />
                                            ))}
                                        </Picker>
                                    )}
                                </View>
                            )}

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Đóng</Text>
                                </TouchableOpacity>

                                {!isPastDate && !selectedItem?.TrainerId && (
                                    <TouchableOpacity
                                        style={[styles.confirmButton, loadingBooking && styles.disabledButton]}
                                        onPress={() => handleBookingPT(selectedItem?.id ?? "", selectedPT?.id ?? "")}
                                        disabled={loadingBooking || !selectedPT}
                                    >
                                        <Text style={styles.buttonText}>
                                            {loadingBooking ? "Đang xử lý..." : "Xác nhận"}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)"
    },
    calendarContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    scheduleContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    scheduleList: {
        paddingBottom: 20,
    },
    scheduleItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statusText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    successIcon: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    errorIcon: {
        color: '#e74c3c',
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    pickerContainer: {
        marginVertical: 10,
    },
    picker: {
        width: '100%',
        height: 50,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    modalContainer: {
        width: "85%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        elevation: 5
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20
    },
    modalLabel: {
        fontSize: 16,
        fontWeight: "600",
        marginVertical: 5
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20
    },
    closeButton: {
        backgroundColor: "#ff4444",
        padding: 12,
        borderRadius: 8
    },
    confirmButton: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 8
    },
    disabledButton: {
        backgroundColor: "#cccccc",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },
    container: { flex: 1, backgroundColor: "#fff" },
    item: {
        backgroundColor: "#f0f0f0",
        padding: 15,
        borderRadius: 8,
        marginVertical: 5
    },
    emailText: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
    listContent: {
        paddingBottom: 20
    },
});

export default CalendarScreen;