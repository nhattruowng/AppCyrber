import {Image, StyleSheet, FlatList, View, Text, TextInput, TouchableOpacity, Modal, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HelloWave} from '@/components/HelloWave';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import axios from 'axios';
import {useSelector} from "react-redux";
import {RootState} from "@/app/redux/store";
import {FontAwesome} from "@expo/vector-icons";
import DatePicker from 'react-native-date-picker';

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  startedDate: string;
  endDate: string;
  timeInDay: number;
}

export default function HomeScreen() {
  const user = useSelector((state: RootState) => state.user);

  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [editPlan, setEditPlan] = useState<MembershipPlan | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);


  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://10.0.2.2:8080/api/membership-plans/all', {
          headers: {Accept: '*/*'},
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setPlans(result.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);


  const handleEditPress = (plan: MembershipPlan) => {
    setEditPlan(plan);
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editPlan) return;

    console.log("///editPlan///")
    console.log(editPlan)
    console.log("///editPlan///")

    try {
      const response = await fetch(`http://10.0.2.2:8080/api/membership-plans/update-mbplan/${editPlan.id}`, {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(editPlan),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setPlans(prevPlans =>
        prevPlans.map(plan => (plan.id === editPlan.id ? editPlan : plan))
      );
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };


  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log(plans)
  return (
    <View style={styles.container}>
      <FlatList
        data={plans}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <ThemedView style={styles.serviceItem}>
            <ThemedText type="defaultSemiBold" style={styles.serviceName}>
              {item.name}
            </ThemedText>


            <ThemedView style={styles.serviceDetails}>
              <ThemedText style={styles.detailText}>Mô tả: {item.description}</ThemedText>
              <ThemedText style={styles.detailText}>Bắt đầu: {item.startedDate} - {item.endDate}</ThemedText>
              <ThemedText style={styles.priceText}>Giá: {item.price}đ</ThemedText>
              <ThemedText style={styles.priceText}>Hoạt động: {item.timeInDay}h/ngay</ThemedText>
            </ThemedView>
            {/* Chỉ hiển thị nút sửa & xóa nếu role là "ROLE_ADMIN" */}
            {user.roles.includes("ROLE_ADMIN") && (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditPress(item)}>
                  <FontAwesome name="edit" size={20} color="#fff"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton}>
                  <FontAwesome name="trash" size={20} color="#fff"/>
                </TouchableOpacity>
              </View>
            )}
          </ThemedView>
        )}
        contentContainerStyle={styles.listContent}
      />
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa gói</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên gói"
              value={editPlan?.name}
              onChangeText={(text) => setEditPlan(prev => prev ? {...prev, name: text} : null)}
            />
            <TextInput
              style={styles.input}
              placeholder="Mô tả"
              value={editPlan?.description}
              onChangeText={(text) => setEditPlan(prev => prev ? {...prev, description: text} : null)}
            />
            <TextInput
              style={styles.input}
              placeholder="Giá"
              keyboardType="numeric"
              value={editPlan?.price.toString()}
              onChangeText={(text) => setEditPlan(prev => prev ? {...prev, price: text ? parseFloat(text) : 0} : null)}
            />
            <TextInput
              style={styles.input}
              placeholder="Thời gian"
              keyboardType="numeric"
              value={editPlan?.timeInDay ? editPlan.timeInDay.toString() : ""}
              onChangeText={(text) => setEditPlan(prev => prev ? {...prev, timeInDay: text ? parseInt(text, 10) : 0} : null)}
            />
          

            <TextInput
              style={styles.input}
              placeholder="Ngày bắt đầu"
              value={editPlan?.startedDate}
              onFocus={() => setOpenStartDate(true)} // Mở DatePicker khi nhấn vào input
            />

            <DatePicker
              modal
              open={openStartDate}
              date={editPlan?.startedDate ? new Date(editPlan.startedDate) : new Date()}
              mode="date"
              onConfirm={(date) => {
                setOpenStartDate(false);
                setEditPlan(prev => prev ? {...prev, startedDate: date.toISOString().split('T')[0]} : null);
              }}
              onCancel={() => setOpenStartDate(false)}
            />

            <TextInput
              style={styles.input}
              placeholder="Ngày kết thúc"
              value={editPlan?.endDate}
              onFocus={() => setOpenEndDate(true)}
            />

            <DatePicker
              modal
              open={openEndDate}
              date={editPlan?.endDate ? new Date(editPlan.endDate) : new Date()}
              mode="date"
              onConfirm={(date) => {
                setOpenEndDate(false);
                setEditPlan(prev => prev ? {...prev, endDate: date.toISOString().split('T')[0]} : null);
              }}
              onCancel={() => setOpenEndDate(false)}
            />
            <Button title="Lưu" onPress={handleSaveEdit}/>
            <Button title="Hủy" color="red" onPress={() => setModalVisible(false)}/>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    shadowOffset: {width: 0, height: 2},
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
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 8,
  },
  modalContainer: {flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)"},
  modalContent: {backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%"},
  modalTitle: {fontSize: 18, fontWeight: "bold", marginBottom: 10},
  input: {borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10, borderRadius: 5, width: "100%"},
});
