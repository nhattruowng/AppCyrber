import {Image, StyleSheet, FlatList, View, Text, TextInput, TouchableOpacity, Modal, Button, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HelloWave} from '@/components/HelloWave';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import axios from 'axios';
import {RootState} from "@/app/redux/store";
import {FontAwesome} from "@expo/vector-icons";
import DatePicker from 'react-native-date-picker';
import {useRouter} from "expo-router";


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
  const router = useRouter();


  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [editPlan, setEditPlan] = useState<MembershipPlan | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [create, setCreact] = useState<boolean>(false);


  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://10.0.2.2:8080/api/membership-plan/all', {
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

  const handleSave = async () => {
    if (!editPlan) return;

    try {
      const response = await fetch('http://10.0.2.2:8080/api/membership-plans/add-plan', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editPlan.id || "", // Nếu là tạo mới, id sẽ là chuỗi rỗng
          name: editPlan.name,
          description: editPlan.description,
          price: editPlan.price,
          startedDate: editPlan.startedDate,
          endDate: editPlan.endDate,
          timeInDay: editPlan.timeInDay,
        }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi thêm gói thành viên');
      }
      const data = await response.json();
      setModalVisible(false);
    } catch (error) {
    }
  };

  const handleEditPress = (plan: MembershipPlan) => {
    setEditPlan(plan);
    setModalVisible(true);
  };


  const handleDeleteConfirmation = (planId: string) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa gói này không?",
      [
        {text: "Hủy", style: "cancel"}, // Nhấn Hủy thì đóng dialog
        {text: "Xác nhận", onPress: () => handleDeletePlan(planId)} // Nhấn Xác nhận thì gọi hàm xóa
      ]
    );
  };
  const handleDeletePlan = async (planId: string) => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/api/membership-plan/delete/${planId}`, {
        method: 'DELETE',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }
      setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
    } catch (error) {
      console.error('Lỗi khi xóa gói:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editPlan) return;

    try {
      const response = await fetch(`http://10.0.2.2:8080/api/membership-plans/update/${editPlan.id}`, {
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

  const addpage = () => {
      router.push("/layout/addservice")
  }

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
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteConfirmation(item.id)}>
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
            <Text style={styles.modalTitle}></Text>
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
              value={editPlan?.timeInDay.toString()}
              onChangeText={(text) => setEditPlan(prev => prev ? {
                ...prev,
                timeInDay: text ? parseInt(text) : 0
              } : null)}
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
      {user.roles.includes("ROLE_ADMIN") && (
        <TouchableOpacity style={styles.fab} onPress={addpage}>
          <FontAwesome name="plus" size={24} color="#fff"/>
        </TouchableOpacity>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

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
