import { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Modal } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";
import "moment/locale/vi";
import { Picker } from "@react-native-picker/picker";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";

const API_URL = "https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/trainers";

LocaleConfig.locales["vi"] = {
    monthNames: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    dayNames: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
    dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    today: "Hôm nay",
};
LocaleConfig.defaultLocale = "vi";

interface PT {
    id: string;
    email: string;
    phone: string;
    status: string;
    enable: boolean;
}

interface Schedule {
    id: string;
    TrainerId: string;
    checkout: boolean;
    checkin: boolean;
    dateTime: string;
}

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedPT, setSelectedPT] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const user = useSelector((state: RootState) => state.user);

    const [scheduleList, setScheduleList] = useState<Schedule[]>([]);
    const [availablePTs, setAvailablePTs] = useState<PT[]>([]);

    const apiDuration = 15; // Thời gian khả dụng là 15 tiếng tính từ 6h sáng
    const startHour = 6; // Bắt đầu từ 6h sáng

    useEffect(() => {
        const category = async () => {
            const rs = await fetch(`https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/schedules-io/user/${user.id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    Accept: "application/json",
                },
            });
            if (rs.status === 200) {
                const result = await rs.json();
                if (result.httpStatus === "OK") {
                    const userData = Array.isArray(result.data) ? result.data : result;
                    setScheduleList(userData);
                }
            } else {
                setScheduleList([]);
            }
        };
        category();
    }, [user.token]);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const response = await fetch(`${API_URL}/list-all`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        Accept: "application/json",
                    },
                });
                const result = await response.json();
                if (result.httpStatus === "OK") {
                    const userData = Array.isArray(result.data) ? result.data : result;
                    setAvailablePTs(userData);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách trainers:", error);
            }
        };
        fetchTrainers();
    }, []);

    useEffect(() => {
        const currentHour = new Date().getHours();
        const endHour = startHour + apiDuration;
        const actualStartHour = Math.max(currentHour, startHour);
        const times = [];
        for (let i = actualStartHour; i <= endHour && i < 24; i++) {
            times.push(`${i}:00`);
        }
        setAvailableTimes(times);
    }, [modalVisible]);

    // Hàm tạo markedDates từ scheduleList
    const getMarkedDates = () => {
        const markedDates = {};

        if (scheduleList.length === 0) return markedDates;

        // Sắp xếp để lấy ngày cuối cùng
        const sortedSchedules = [...scheduleList].sort((a, b) =>
            moment(a.dateTime).diff(moment(b.dateTime))
        );
        const lastDate = sortedSchedules[sortedSchedules.length - 1].dateTime;

        scheduleList.forEach((schedule) => {
            const date = moment(schedule.dateTime).format("YYYY-MM-DD");
            if (schedule.checkin && schedule.checkout) {
                // Tích xanh cho cả checkin và checkout đều true
                markedDates[date] = {
                    marked: true,
                    dotColor: "green",
                };
            } else if (schedule.checkin) {
                // Tích vàng cho chỉ checkin
                markedDates[date] = {
                    marked: true,
                    dotColor: "yellow",
                };
            }

            // Đánh dấu ngày cuối cùng bằng tích đỏ (ghi đè nếu cần)
            if (date === moment(lastDate).format("YYYY-MM-DD")) {
                markedDates[date] = {
                    marked: true,
                    dotColor: "red",
                };
            }
        });

        // Thêm ngày được chọn
        if (selectedDate) {
            markedDates[moment(selectedDate, "DD/MM/YYYY").format("YYYY-MM-DD")] = {
                ...markedDates[moment(selectedDate, "DD/MM/YYYY").format("YYYY-MM-DD")],
                selected: true,
                selectedColor: "#007AFF",
            };
        }

        return markedDates;
    };

    const getEventsForDate = (date) => {
        const day = moment(date, "DD/MM/YYYY").date();
        return day % 2 === 0
            ? [
                { id: "1", title: "Sự kiện 1", details: "Chi tiết sự kiện 1" },
                { id: "2", title: "Sự kiện 2", details: "Chi tiết sự kiện 2" },
            ]
            : [
                { id: "3", title: "Sự kiện 3", details: "Chi tiết sự kiện 3" },
                { id: "4", title: "Sự kiện 4", details: "Chi tiết sự kiện 4" },
            ];
    };

    const isPastDate = selectedDate && moment(selectedDate, "DD/MM/YYYY").isBefore(moment(), "day");

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={(day) => setSelectedDate(moment(day.dateString).format("DD/MM/YYYY"))}
                markedDates={getMarkedDates()}
            />
            {selectedDate && (
                <View style={styles.listContainer}>
                    <Text style={styles.selectedDate}>Ngày: {selectedDate}</Text>
                    <FlatList
                        data={getEventsForDate(selectedDate)}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => {
                                    setSelectedItem(item.details);
                                    setModalVisible(true);
                                    setSelectedTime(null);
                                    setSelectedPT(null);
                                }}
                            >
                                <Text style={styles.itemText}>{item.title}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Thông tin lịch hẹn</Text>
                        <View style={styles.modalSection}>
                            <Text style={styles.modalLabel}>Ngày hẹn:</Text>
                            <Text style={styles.modalValue}>{selectedDate || "Chưa chọn"}</Text>
                        </View>
                        {/* Các phần khác của Modal giữ nguyên */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Đóng</Text>
                            </TouchableOpacity>
                            {!isPastDate && (
                                <TouchableOpacity onPress={() => console.log("Xác nhận đặt lịch")} style={styles.closeButton}>
                                    <Text style={styles.confirmButtonText}>Xác nhận</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 20},
    confirmButtonText: {fontSize: 16, color: "white"},
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    listContainer: {
        marginTop: 20,
    },
    selectedDate: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    item: {
        backgroundColor: "#f0f0f0",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    itemText: {
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Tăng độ mờ nền
    },
    modalContainer: {
        backgroundColor: "#fff",
        width: "85%",
        padding: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
    },
    modalSection: {
        marginBottom: 20,
        width: "100%",
    },
    modalLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#555",
        marginBottom: 8,
    },
    modalValue: {
        fontSize: 16,
        color: "#333",
    },
    statusPast: {
        color: "#e74c3c", // Màu đỏ cho trạng thái "Đã qua"
    },
    statusPending: {
        color: "#3498db", // Màu xanh cho trạng thái "Chưa thực thi"
    },
    picker: {
        width: "100%",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
    },
    closeButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignSelf: "center",
        marginTop: 10,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});