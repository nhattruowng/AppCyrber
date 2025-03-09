import { useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Modal } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";
import "moment/locale/vi";

LocaleConfig.locales["vi"] = {
    monthNames: [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ],
    dayNames: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
    dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    today: "Hôm nay"
};
LocaleConfig.defaultLocale = "vi";

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const getEventsForDate = (date: string) => {
        const day = moment(date, "DD/MM/YYYY").date();
        return day % 2 === 0
            ? [
                { id: "1", title: "Sự kiện 1", details: "Chi tiết sự kiện 1" },
                { id: "2", title: "Sự kiện 2", details: "Chi tiết sự kiện 2" },
            ]
            : [
                { id: "3", title: "Sự kiện 2", details: "Chi tiết sự kiện 2" },
                { id: "4", title: "Sự kiện 4", details: "Chi tiết sự kiện 4" },
            ];
    };

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={(day) => setSelectedDate(moment(day.dateString).format("DD/MM/YYYY"))}
                markedDates={{
                    [moment(selectedDate, "DD/MM/YYYY").format("YYYY-MM-DD")]: {
                        selected: true, selectedColor: "#007AFF"
                    },
                }}
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
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{selectedItem}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButton}>Đóng</Text>
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
        backgroundColor: "#fff"
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    closeButton: {
        fontSize: 16,
        color: "blue",
    }
});
