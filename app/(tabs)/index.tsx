import { Image, StyleSheet, FlatList, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const services = [
  { id: '1', name: 'Dịch vụ A', days: 7, hoursPerDay: 5, price: '500.000đ' },
  { id: '2', name: 'Dịch vụ B', days: 3, hoursPerDay: 4, price: '300.000đ' },
  { id: '3', name: 'Dịch vụ C', days: 10, hoursPerDay: 6, price: '800.000đ' },
  { id: '4', name: 'Dịch vụ D', days: 5, hoursPerDay: 5, price: '450.000đ' },
  { id: '5', name: 'Dịch vụ E', days: 8, hoursPerDay: 6, price: '700.000đ' },
  { id: '6', name: 'Dịch vụ F', days: 4, hoursPerDay: 3, price: '250.000đ' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <ThemedView style={styles.headerContainer}>

            <ThemedView style={styles.titleContainer}>
              <ThemedText type="title">Welcome!</ThemedText>
              <HelloWave />
            </ThemedView>
            <ThemedText type="subtitle" style={styles.header}>
              Danh sách dịch vụ
            </ThemedText>
          </ThemedView>
        }
        renderItem={({ item }) => (
          <ThemedView style={styles.serviceItem}>
            <ThemedText type="defaultSemiBold" style={styles.serviceName}>
              {item.name}
            </ThemedText>
            <ThemedView style={styles.serviceDetails}>
              <ThemedText style={styles.detailText}>Thời gian: {item.days} ngày</ThemedText>
              <ThemedText style={styles.detailText}>Giờ/ngày: {item.hoursPerDay}h</ThemedText>
              <ThemedText style={styles.priceText}>Giá: {item.price}</ThemedText>
            </ThemedView>
          </ThemedView>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  reactLogo: {
    height: 100,
    width: 150,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  serviceItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 6,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceName: {
    fontSize: 18,
    marginBottom: 8,
  },
  serviceDetails: {
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  priceText: {
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: 'bold',
  },
});