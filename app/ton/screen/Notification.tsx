import React from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Ensure this is installed

const Notification = () => {
  return (
    <ScrollView style={styles.notificationContainer}>
      {/* Notification 1 */}
      <View style={styles.notificationItem}>
        <View style={styles.profileContainer}>
          <Ionicons name="person-circle" size={35} color="#e2f163" style={styles.profileIcon} />
          <Text style={styles.profileName}>Madison</Text>
        </View>
        <Text style={styles.notificationText}>
          Lorem ipsum dolor sit amet consectetur. Tortor aenean suspendisse pretium nunc non facilisi.
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color="#e2f163" />
            <Text style={styles.statText}>30,254</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbox" size={14} color="#e2f163" />
            <Text style={styles.statText}>12,254</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={14} color="#e2f163" />
            <Text style={styles.statText}>1,254</Text>
          </View>
        </View>
      </View>

      {/* Notification 2 */}
      <View style={styles.notificationItem}>
        <View style={styles.profileContainer}>
          <Ionicons name="person-circle" size={35} color="#e2f163" style={styles.profileIcon} />
          <Text style={styles.profileName}>John</Text>
        </View>
        <Text style={styles.notificationText}>
          Quisque placerat ultrices nunc non facilisi. Aenean a massa at nisl varius fermentum.
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color="#e2f163" />
            <Text style={styles.statText}>25,000</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbox" size={14} color="#e2f163" />
            <Text style={styles.statText}>5,000</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={14} color="#e2f163" />
            <Text style={styles.statText}>900</Text>
          </View>
        </View>
      </View>

      {/* More Notifications */}
      <View style={styles.notificationItem}>
        <View style={styles.profileContainer}>
          <Ionicons name="person-circle" size={35} color="#e2f163" style={styles.profileIcon} />
          <Text style={styles.profileName}>Alice</Text>
        </View>
        <Text style={styles.notificationText}>
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color="#e2f163" />
            <Text style={styles.statText}>18,256</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbox" size={14} color="#e2f163" />
            <Text style={styles.statText}>3,200</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={14} color="#e2f163" />
            <Text style={styles.statText}>2,000</Text>
          </View>
        </View>
      </View>

      <View style={styles.notificationItem}>
        <View style={styles.profileContainer}>
          <Ionicons name="person-circle" size={35} color="#e2f163" style={styles.profileIcon} />
          <Text style={styles.profileName}>Bob</Text>
        </View>
        <Text style={styles.notificationText}>
          Nunc aliquet libero id neque auctor, ac lobortis nunc placerat. Curabitur et mi nec nunc pharetra mollis.
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color="#e2f163" />
            <Text style={styles.statText}>15,120</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbox" size={14} color="#e2f163" />
            <Text style={styles.statText}>8,000</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={14} color="#e2f163" />
            <Text style={styles.statText}>1,500</Text>
          </View>
        </View>
      </View>

      <View style={styles.notificationItem}>
        <View style={styles.profileContainer}>
          <Ionicons name="person-circle" size={35} color="#e2f163" style={styles.profileIcon} />
          <Text style={styles.profileName}>Sophia</Text>
        </View>
        <Text style={styles.notificationText}>
          Sed gravida nisl nec sem vulputate, ac sagittis libero aliquam. Nulla facilisi.
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color="#e2f163" />
            <Text style={styles.statText}>40,400</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbox" size={14} color="#e2f163" />
            <Text style={styles.statText}>10,000</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={14} color="#e2f163" />
            <Text style={styles.statText}>5,500</Text>
          </View>
        </View>
      </View>
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
