import React from "react";
import {Text, StyleSheet, View, ScrollView} from "react-native";
import {Ionicons} from "@expo/vector-icons";

interface NotificationItemProps {
    name: string;
    message: string;
    stars: number;
    comments: number;
    views: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({name, message, stars, comments, views}) => {
    return (
        <View style={styles.notificationItem}>
            <View style={styles.profileContainer}>
                <Ionicons name="person-circle" size={35} color="#e2f163" style={styles.profileIcon}/>
                <Text style={styles.profileName}>{name}</Text>
            </View>
            <Text style={styles.notificationText}>{message}</Text>
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Ionicons name="star" size={14} color="#e2f163"/>
                    <Text style={styles.statText}>{stars.toLocaleString()}</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="chatbox" size={14} color="#e2f163"/>
                    <Text style={styles.statText}>{comments.toLocaleString()}</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="eye" size={14} color="#e2f163"/>
                    <Text style={styles.statText}>{views.toLocaleString()}</Text>
                </View>
            </View>
        </View>
    );
};

const Notification: React.FC = () => {
    const notifications: NotificationItemProps[] = [
        {name: "Madison", message: "Lorem ipsum dolor sit amet...", stars: 30254, comments: 12254, views: 1254},
        {name: "John", message: "Quisque placerat ultrices...", stars: 25000, comments: 5000, views: 900},
        {name: "Alice", message: "Vestibulum ante ipsum...", stars: 18256, comments: 3200, views: 2000},
        {name: "Bob", message: "Nunc aliquet libero id...", stars: 15120, comments: 8000, views: 1500},
        {name: "Sophia", message: "Sed gravida nisl nec...", stars: 40400, comments: 10000, views: 5500}, {name: "Madison", message: "Lorem ipsum dolor sit amet...", stars: 30254, comments: 12254, views: 1254},
        {name: "John", message: "Quisque placerat ultrices...", stars: 25000, comments: 5000, views: 900},
        {name: "Alice", message: "Vestibulum ante ipsum...", stars: 18256, comments: 3200, views: 2000},
        {name: "Bob", message: "Nunc aliquet libero id...", stars: 15120, comments: 8000, views: 1500},
        {name: "Sophia", message: "Sed gravida nisl nec...", stars: 40400, comments: 10000, views: 5500}, {name: "Madison", message: "Lorem ipsum dolor sit amet...", stars: 30254, comments: 12254, views: 1254},
        {name: "John", message: "Quisque placerat ultrices...", stars: 25000, comments: 5000, views: 900},
        {name: "Alice", message: "Vestibulum ante ipsum...", stars: 18256, comments: 3200, views: 2000},
        {name: "Bob", message: "Nunc aliquet libero id...", stars: 15120, comments: 8000, views: 1500},
        {name: "Sophia", message: "Sed gravida nisl nec...", stars: 40400, comments: 10000, views: 5500}, {name: "Madison", message: "Lorem ipsum dolor sit amet...", stars: 30254, comments: 12254, views: 1254},
        {name: "John", message: "Quisque placerat ultrices...", stars: 25000, comments: 5000, views: 900},
        {name: "Alice", message: "Vestibulum ante ipsum...", stars: 18256, comments: 3200, views: 2000},
        {name: "Bob", message: "Nunc aliquet libero id...", stars: 15120, comments: 8000, views: 1500},
        {name: "Sophia", message: "Sed gravida nisl nec...", stars: 40400, comments: 10000, views: 5500},
    ];

    return (
        <ScrollView style={styles.notificationContainer}>
            {notifications.map((notif, index) => (
                <NotificationItem key={index} {...notif} />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    notificationContainer: {
        flex: 1,
        backgroundColor: "#212020",
        padding: 20,
    },
    notificationItem: {
        backgroundColor: "#333",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#e2f163",
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    profileIcon: {
        marginRight: 10,
    },
    profileName: {
        color: "#e2f163",
        fontSize: 15,
        fontWeight: "700",
    },
    notificationText: {
        color: "#e2f163",
        fontSize: 14,
        marginBottom: 10,
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
        color: "#e2f163",
        marginLeft: 5,
        fontSize: 13,
    },
});

export default Notification;