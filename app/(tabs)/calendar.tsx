import {useState} from "react";
import {Text, Switch, View, StyleSheet} from "react-native";
import {Calendar, LocaleConfig} from "react-native-calendars";
import moment from "moment";
import "moment/locale/vi";

// Cấu hình ngôn ngữ tiếng Việt cho lịch
LocaleConfig.locales["vi"] = {
    monthNames: [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ],
    monthNamesShort: [
        "Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6",
        "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"
    ],
    dayNames: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
    dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    today: "Hôm nay"
};
LocaleConfig.defaultLocale = "vi";

export default function CalendarScreen() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");

    return (
        <View style={[styles.container, {backgroundColor: isDarkMode ? "#121212" : "#fff"}]}>
            <Calendar
                onDayPress={(day) => setSelectedDate(moment(day.dateString).format("DD/MM/YYYY"))}
                markedDates={{
                    [moment(selectedDate, "DD/MM/YYYY").format("YYYY-MM-DD")]: {
                        selected: true, selectedColor: isDarkMode ? "#FF8C00" : "#007AFF"
                    },
                }}
                theme={{
                    backgroundColor: isDarkMode ? "#121212" : "#fff",
                    calendarBackground: isDarkMode ? "#121212" : "#fff",
                    textSectionTitleColor: isDarkMode ? "#fff" : "#000",
                    dayTextColor: isDarkMode ? "#fff" : "#000",
                    selectedDayTextColor: "#fff",
                    selectedDayBackgroundColor: isDarkMode ? "#FF8C00" : "#007AFF",
                    monthTextColor: isDarkMode ? "#fff" : "#000",
                    arrowColor: isDarkMode ? "#FF8C00" : "#007AFF",
                }}
            />

            {/* Hiển thị ngày đã chọn */}
            {selectedDate ? (
                <Text style={[styles.selectedDate, {color: isDarkMode ? "#FF8C00" : "#007AFF"}]}>
                    Ngày chọn: {selectedDate}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,  // Tạo khoảng cách từ viền trên màn hình
        paddingHorizontal: 20,  // Khoảng cách hai bên màn hình
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center"  // Căn giữa tiêu đề
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15
    },
    text: {
        fontSize: 18
    },
    selectedDate: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    },
    calendar: {
        borderRadius: 10,  // Bo góc lịch
        overflow: "hidden",
        marginBottom: 20  // Tạo khoảng cách phía dưới lịch
    }
});
