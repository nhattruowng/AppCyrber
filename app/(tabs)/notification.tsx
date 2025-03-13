import React from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NotificationItemProps {
    name: string;
    message: string;
    stars: number;
    comments: number;
    views: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ name, message, stars, comments, views }) => {
    return (
        <View style={styles.notificationItem}>
            <View style={styles.profileContainer}>
                <Ionicons name="person-circle" size={40} color="#fdd835" style={styles.profileIcon} />
                <Text style={styles.profileName}>{name}</Text>
            </View>
            <Text style={styles.notificationText}>{message}</Text>
        </View>
    );
};

const Notification: React.FC = () => {
    const notifications: NotificationItemProps[] = [
        { name: "Madison", message: "Lorem ipsum dolor sit amet...", stars: 30254, comments: 12254, views: 1254 },
        { name: "John", message: "Quisque placerat ultrices...", stars: 25000, comments: 5000, views: 900 },
    ];

    return (
        <ScrollView style={styles.notificationContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.headerTitle}>Thông báo</Text>
            {notifications.map((notif, index) => (
                <NotificationItem key={index} {...notif} />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    notificationContainer: {
        flex: 1,
        backgroundColor: "#1e1e1e",
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
        textAlign: "center",
    },
    notificationItem: {
        backgroundColor: "#2a2a2a",
        borderRadius: 15,
        padding: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#3e3e3e",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 6,
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    profileIcon: {
        marginRight: 12,
    },
    profileName: {
        color: "#fdd835",
        fontSize: 16,
        fontWeight: "bold",
    },
    notificationText: {
        color: "#e0e0e0",
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    statText: {
        color: "#b0bec5",
        marginLeft: 6,
        fontSize: 14,
    },
});

export default Notification;
