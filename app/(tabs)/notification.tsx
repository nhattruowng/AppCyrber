import React, {useEffect, useState} from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useSelector} from "react-redux";
import {RootState} from "@/app/redux/store";

interface NotificationItemProps {
    id: string;
    header: string;
    content: string;
    dateTime: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({header, content, dateTime}) => {
    return (
        <View style={styles.notificationItem}>
            <View style={styles.profileContainer}>
                <Ionicons name="person-circle" size={40} color="#fdd835" style={styles.profileIcon}/>
                <Text style={styles.profileName}>{header}</Text>
            </View>
            <Text style={styles.notificationText}>{content}</Text>
            <Text style={styles.dateText}>{new Date(dateTime).toLocaleString()}</Text>
        </View>
    );
};

const Notification: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchNotification = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/notifications/${user.id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${user.token}`,
                    }
                });
                const result = await response.json();
                if (result.data) {
                    const sortedData = result.data.sort(
                        (a: NotificationItemProps, b: NotificationItemProps) =>
                            new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
                    );
                    setNotifications(sortedData);
                }
            } catch (e) {
                console.log("Lỗi khi tải thông báo:", e);
            }
        };
        fetchNotification();
        setIsLoading(false);
    }, [user.id, user.token]);


    return (
        <ScrollView style={styles.notificationContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.headerTitle}>Thông báo</Text>
            {isLoading ? (
                <Text style={styles.loadingText}>Đang tải thông báo...</Text>
            ) : (
                notifications.map((notif) => <NotificationItem key={notif.id} {...notif} />)
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    notificationContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    notificationItem: {
        marginBottom: 20,
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#f9f9f9",
        elevation: 2,
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    profileIcon: {
        marginRight: 8,
    },
    profileName: {
        fontSize: 18,
        fontWeight: "600",
    },
    notificationText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 8,
    },
    dateText: {
        fontSize: 14,
        color: "#666",
    },
    noNotificationText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#888",
    },
});

export default Notification;
