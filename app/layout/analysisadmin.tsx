import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface Service {
    id: string;
    name: string;
    total: number;
    totalUser: number;
}

export default function ServiceAnalysisScreen() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const user = useSelector((state: RootState) => state.user);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchDBAnaly = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    "https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/booking/analysis",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
                const result = await response.json();
                const serviceData: Service[] = Object.values(result.data);
                setServices(serviceData);
            } catch (error) {
                console.log("Lỗi khi gọi API:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user.roles.includes("ROLE_ADMIN")) {
            fetchDBAnaly();
        }
    }, [user.roles, user.token]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Phân Tích Dịch Vụ</Text>
            </View>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3498db" />
                    <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                </View>
            ) : services.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không có dữ liệu để hiển thị</Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.serviceList}
                    contentContainerStyle={styles.serviceContent}
                    showsVerticalScrollIndicator={false}
                >
                    {services.map((service) => (
                        <View key={service.id} style={styles.serviceItem}>
                            <Text style={styles.serviceTitle}>{service.name}</Text>
                            <View style={styles.infoContainer}>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Tổng tiền:</Text>
                                    <Text style={styles.value}>{service.total.toLocaleString()} VND</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Số người:</Text>
                                    <Text style={styles.value}>{service.totalUser} người</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
            >
                <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        paddingTop: 24,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    serviceList: {
        flex: 1,
        padding: 16,
    },
    serviceContent: {
        paddingBottom: 80,
    },
    serviceItem: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    infoContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    value: {
        fontSize: 16,
        color: '#2c3e50',
        fontWeight: '600',
    },
    backButton: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        backgroundColor: '#3498db',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    backButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});