import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Calendar } from "react-native-calendars"; // To render a calendar

const TrainingSchedule = () => {
  // Sample training schedule with some dates marked
  const markedDates = {
    "2025-02-23": { selected: true, selectedColor: "green" },
    "2025-02-25": { selected: true, selectedColor: "green" },
    // Add more dates as needed
  };

  return (
    <View style={styles.container}>
      {/* Training Schedule Calendar */}
      <Text style={styles.calendarTitle}>Training Schedule</Text>
      <View style={styles.calendarContainer}>
        <Calendar
          current={"2025-02-23"}
          markedDates={markedDates} // Highlight dates with training
          markingType={"custom"}
          theme={{
            todayTextColor: "#00adf5", // Highlight today's date
            arrowColor: "#00adf5", // Change the arrow color
            monthTextColor: "#fff", // Color for month/year text
            backgroundColor: "#212020", // Change calendar background to match the theme
            selectedDayBackgroundColor: "#00adf5",
            selectedDayTextColor: "#fff",
            dayTextColor: "#212020",
            textDayFontWeight: "bold",
            textDayStyle: {
              fontSize: 14,
              textAlign: "center",
            },
            "stylesheet.calendar.header": {
              monthText: {
                fontSize: 17,
                fontWeight: "bold",
                color: "#fff",
                textAlign: "center",
                marginTop: 10, // Adjust to center month
              },
            },
          }}
          style={styles.calendar} // Direct style for calendar container
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212020",
    padding: 20,
  },
  calendarTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  calendarContainer: {
    borderRadius: 15, // Rounded corners
    overflow: "hidden", // Ensures the border radius is respected
    marginBottom: 20, // Adds space below the calendar
  },
  calendar: {
    backgroundColor: "#212020", // Ensure the calendar's background is also this color
    borderRadius: 30, // Rounded corners
    overflow: "hidden",
  },
});

export default TrainingSchedule;
