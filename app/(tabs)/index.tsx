import React, { useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { RootState } from '@/app/redux/store';
import { FontAwesome } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

interface MembershipPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    startedDate: string;
    endDate: string;
    timeInDay: number;
}

interface BookingServiceResponse {
    nameService: string;
    start: string;
    end: string;
    price: number;
    usermail: string;
}

const API_URL = 'https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api';

export default function HomeScreen() {
    const user = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingBookingService, setLoadingBookingService] = useState<boolean>(false);
    const [editPlan, setEditPlan] = useState<MembershipPlan | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [create, setCreate] = useState<boolean>(false);
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>(''); // Thêm state để hiển thị lỗi

    useEffect(() => {
        const fetchPlans = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/membership-plan/all`, {
                    headers: { Accept: '*/*' },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setPlans(result.data || []);
            } catch (error) {
                console.error('Error fetching plans:', error);
                Alert.alert('Lỗi', 'Không thể tải danh sách gói thành viên');
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const validateTimeInDay = (value: number): boolean => {
        if (value < 0 || value > 23) {
            setErrorMessage('Thời gian hoạt động phải từ 0 đến 23 giờ/ngày');
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handleSave = async () => {
        if (!editPlan) return;

        // Kiểm tra giá trị timeInDay trước khi gửi API
        if (!validateTimeInDay(editPlan.timeInDay)) {
            return;
        }

        const method = create ? 'POST' : 'PUT';
        const url = create
            ? `${API_URL}/membership-plan`
            : `${API_URL}/membership-plan/update/${editPlan.id}`;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    Accept: '*/*',
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editPlan.id || '',
                    name: editPlan.name,
                    description: editPlan.description,
                    price: editPlan.price,
                    startedDate: editPlan.startedDate,
                    endDate: editPlan.endDate,
                    timeInDay: editPlan.timeInDay,
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Lỗi khi lưu gói thành viên');
            }

            const result = await response.json();
            if (create) {
                setPlans(prev => [...prev, result.data]);
            } else {
                setPlans(prev =>
                    prev.map(plan => (plan.id === editPlan.id ? editPlan : plan))
                );
            }
            Alert.alert('Thành công', create ? 'Tạo gói thành viên thành công!' : 'Cập nhật gói thành viên thành công!');
            setModalVisible(false);
            setCreate(false);
        } catch (error: any) {
            console.error('Error saving plan:', error);
            Alert.alert('Thất bại', error.message || 'Đã xảy ra lỗi khi lưu gói thành viên');
        }
    };

    const handleEditPress = (plan: MembershipPlan) => {
        setEditPlan(plan);
        setCreate(false);
        setModalVisible(true);
        setErrorMessage('');
    };

    const handleCreatePress = () => {
        setEditPlan({
            id: '',
            name: '',
            description: '',
            price: 0,
            startedDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            timeInDay: 0,
        });
        setCreate(true);
        setModalVisible(true);
        setErrorMessage('');
    };

    const handleDeleteConfirmation = (planId: string) => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa gói này không?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xác nhận', onPress: () => handleDeletePlan(planId) },
            ]
        );
    };

    const handleDeletePlan = async (planId: string) => {
        try {
            const response = await fetch(`${API_URL}/membership-plan/delete/${planId}`, {
                method: 'DELETE',
                headers: {
                    Accept: '*/*',
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
            Alert.alert('Thành công', 'Xóa gói thành viên thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa gói:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xóa gói thành viên');
        }
    };

    const handleBookingService = useCallback(
        async (email: string, id: string, value: number) => {
            if (!email || !id || !value) {
                Alert.alert('Lỗi', 'Vui lòng cung cấp đầy đủ thông tin để booking dịch vụ');
                return;
            }

            setLoadingBookingService(true);
            try {
                const response = await fetch(`${API_URL}/booking/admin/${email}`, {
                    method: 'POST',
                    headers: {
                        Accept: '*/*',
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id,
                        duration: value,
                    }),
                });

                const result = await response.json();
                if (response.ok && result.httpStatus === 'OK') {
                    const data: BookingServiceResponse = result.data;
                    Alert.alert(
                        'Thành công',
                        `Booking dịch vụ thành công!\nDịch vụ: ${data.nameService}\nThời gian: ${data.start} - ${data.end}\nGiá: ${data.price} VNĐ\nUser: ${data.usermail}`
                    );
                } else {
                    Alert.alert('Thất bại', result.message || 'Không thể booking dịch vụ, vui lòng thử lại!');
                }
            } catch (error) {
                console.error('Lỗi khi booking dịch vụ:', error);
                Alert.alert('Lỗi', 'Đã xảy ra lỗi khi booking dịch vụ!');
            } finally {
                setLoadingBookingService(false);
            }
        },
        [user.token]
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={plans}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ThemedView style={styles.serviceItem}>
                        <ThemedText type="defaultSemiBold" style={styles.serviceName}>
                            {item.name}
                        </ThemedText>
                        <ThemedView style={styles.serviceDetails}>
                            <ThemedText style={styles.detailText}>Mô tả: {item.description}</ThemedText>
                            <ThemedText style={styles.detailText}>
                                Thời gian: {item.startedDate} - {item.endDate}
                            </ThemedText>
                            <ThemedText style={styles.priceText}>Giá: {item.price.toLocaleString()} VNĐ</ThemedText>
                            <ThemedText style={styles.detailText}>Hoạt động: {item.timeInDay}h/ngày</ThemedText>
                        </ThemedView>
                        {user.roles.includes('ROLE_ADMIN') && (
                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={styles.editButton} onPress={() => handleEditPress(item)}>
                                    <FontAwesome name="edit" size={20} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteConfirmation(item.id)}
                                >
                                    <FontAwesome name="trash" size={20} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.bookButton}
                                    onPress={() =>
                                        handleBookingService(user.email || 'tester3@gmail.com', item.id, item.timeInDay)
                                    }
                                    disabled={loadingBookingService}
                                >
                                    <FontAwesome
                                        name="calendar-check-o"
                                        size={20}
                                        color={loadingBookingService ? '#ccc' : '#fff'}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    </ThemedView>
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Không có gói thành viên nào</Text>
                }
            />

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {create ? 'Tạo gói thành viên mới' : 'Chỉnh sửa gói thành viên'}
                        </Text>
                        {errorMessage ? (
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        ) : null}
                        <TextInput
                            style={styles.input}
                            placeholder="Tên gói"
                            placeholderTextColor="#999"
                            value={editPlan?.name}
                            onChangeText={text => setEditPlan(prev => prev ? { ...prev, name: text } : null)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Mô tả"
                            placeholderTextColor="#999"
                            value={editPlan?.description}
                            onChangeText={text =>
                                setEditPlan(prev => prev ? { ...prev, description: text } : null)
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Giá (VNĐ)"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            value={editPlan?.price.toString()}
                            onChangeText={text =>
                                setEditPlan(prev =>
                                    prev ? { ...prev, price: text ? parseFloat(text) : 0 } : null
                                )
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Thời gian (h/ngày)"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            value={editPlan?.timeInDay.toString()}
                            onChangeText={text => {
                                const value = text ? parseInt(text) : 0;
                                setEditPlan(prev => prev ? { ...prev, timeInDay: value } : null);
                                validateTimeInDay(value); // Kiểm tra ngay khi người dùng nhập
                            }}
                        />
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setOpenStartDate(true)}
                        >
                            <Text style={styles.dateText}>
                                Ngày bắt đầu: {editPlan?.startedDate || 'Chọn ngày'}
                            </Text>
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            open={openStartDate}
                            date={editPlan?.startedDate ? new Date(editPlan.startedDate) : new Date()}
                            mode="date"
                            onConfirm={date => {
                                setOpenStartDate(false);
                                setEditPlan(prev =>
                                    prev ? { ...prev, startedDate: date.toISOString().split('T')[0] } : null
                                );
                            }}
                            onCancel={() => setOpenStartDate(false)}
                        />
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setOpenEndDate(true)}
                        >
                            <Text style={styles.dateText}>
                                Ngày kết thúc: {editPlan?.endDate || 'Chọn ngày'}
                            </Text>
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            open={openEndDate}
                            date={editPlan?.endDate ? new Date(editPlan.endDate) : new Date()}
                            mode="date"
                            onConfirm={date => {
                                setOpenEndDate(false);
                                setEditPlan(prev =>
                                    prev ? { ...prev, endDate: date.toISOString().split('T')[0] } : null
                                );
                            }}
                            onCancel={() => setOpenEndDate(false)}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.buttonText}>Lưu</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    setCreate(false);
                                    setErrorMessage('');
                                }}
                            >
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {user.roles.includes('ROLE_ADMIN') && (
                <TouchableOpacity style={styles.fab} onPress={handleCreatePress}>
                    <FontAwesome name="plus" size={24} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 80,
    },
    serviceItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 8,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    serviceDetails: {
        gap: 6,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
    },
    priceText: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
        justifyContent: 'flex-end',
    },
    editButton: {
        backgroundColor: '#3498db',
        padding: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        padding: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookButton: {
        backgroundColor: '#2ecc71',
        padding: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#4CAF50',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        width: '90%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 14,
        color: '#e74c3c',
        marginBottom: 12,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f9f9f9',
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#4CAF50',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
});