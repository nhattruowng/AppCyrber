import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";

const windowWidth = Dimensions.get("window").width;
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());

const sampleData: Record<string, Record<string, { users: number; orders: number; revenue: number }>> = {
  "2025": {
    "1": { users: 1500, orders: 350, revenue: 25000 },
    "2": { users: 1600, orders: 400, revenue: 27000 },
    "3": { users: 1700, orders: 450, revenue: 29000 },
  },
  "2024": {
    "1": { users: 1400, orders: 300, revenue: 23000 },
    "2": { users: 1300, orders: 280, revenue: 22000 },
    "3": { users: 1250, orders: 260, revenue: 21000 },
  },
};

const AdminDashboard = () => {
  const [timeFrame, setTimeFrame] = useState("Tháng");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  const stats =
    timeFrame === "Tháng"
      ? sampleData[selectedYear]?.[selectedMonth] || { users: 0, orders: 0, revenue: 0 }
      : Object.values(sampleData[selectedYear] || {}).reduce(
          (acc, curr) => ({
            users: acc.users + curr.users,
            orders: acc.orders + curr.orders,
            revenue: acc.revenue + curr.revenue,
          }),
          { users: 0, orders: 0, revenue: 0 }
        );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bảng Thống kê</Text>
      
      <View style={styles.timeFrameContainer}>
        <TouchableOpacity 
          style={[styles.timeFrameButton, timeFrame === "Tháng" && styles.activeButton]} 
          onPress={() => setTimeFrame("Tháng")}
        >
          <Text style={styles.buttonText}>Tháng</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeFrameButton, timeFrame === "Năm" && styles.activeButton]} 
          onPress={() => setTimeFrame("Năm")}
        >
          <Text style={styles.buttonText}>Năm</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.pickerContainer}>
        {timeFrame === "Tháng" && (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedMonth}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            >
              {months.map((month) => (
                <Picker.Item key={month} label={`Tháng ${month}`} value={month} />
              ))}
            </Picker>
          </View>
        )}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedYear}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
          >
            {years.map((year) => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>
        </View>
      </View>
      
      <Text style={styles.selectedTimeFrame}>{timeFrame === "Tháng" ? `Thống kê tháng ${selectedMonth} năm ${selectedYear}` : `Thống kê năm ${selectedYear}`}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.users}</Text>
          <Text style={styles.statLabel}>Người dùng</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.orders}</Text>
          <Text style={styles.statLabel}>Đơn hàng</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>${stats.revenue}</Text>
          <Text style={styles.statLabel}>Doanh thu</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  timeFrameContainer: {
    flexDirection: "row",
    backgroundColor: "#444",
    borderRadius: 20,
    padding: 5,
    marginBottom: 20,
  },
  timeFrameButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#666",
  },
  pickerContainer: {
    flexDirection: "row",
    marginBottom: 20,
    
  },
  pickerWrapper: {
    backgroundColor: "#444",
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  picker: {
    backgroundColor: "#444",
    borderRadius: 20,
    height: 150,
    width: 150,
    color: "#fff",
    textAlign: "center",
  },
  
  selectedTimeFrame: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
  },
  statsContainer: {
    width: windowWidth * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 200,
  },
  statBox: {
    backgroundColor: "#444",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: windowWidth * 0.28,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 14,
    color: "#ccc",
  },
});

export default AdminDashboard;
