import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Agenda } from 'react-native-calendars';

function TrainingSchedule() {
  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        items={{
          '2025-02-10': [{name: 'Meeting 5', data: 'Lorem ipsum...'}],
          '2025-02-15': [{name: 'Meeting 6', data: 'Lorem ipsum...'}],
          '2025-02-20': [{name: 'Meeting 1', data: 'Lorem ipsum...'}],
          '2025-02-21': [{name: 'Meeting 2', data: 'Lorem ipsum...'}],
          '2025-02-25': [{name: 'Meeting 3', data: 'Lorem ipsum...'}],
          '2025-02-27': [{name: 'Meeting 4', data: 'Lorem ipsum...'}],
        }}
        renderItem={(item, isFirst) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>{item.data}</Text>
          </TouchableOpacity>
        )}
        theme={{
          backgroundColor: '#212020',
          calendarBackground: '#212020',
          dayTextColor: 'white',
          todayTextColor: 'red',
          selectedDayTextColor: 'blue',
          selectedDayBackgroundColor: 'lightblue',
          arrowColor: 'white',
        }}
        showOnlySelectedDayItems={true} // Ẩn các ngày không có sự kiện
        renderEmptyData={() => null} // Ẩn "loading" cho ngày không có sự kiện
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#212020',
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    backgroundColor: 'lightblue',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
    paddingBottom: 20,
  },
  itemText: {
    color: 'black',
    fontSize: 16,
  }
});

export default TrainingSchedule;
