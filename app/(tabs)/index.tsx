import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AOnBoarding from "../screen/AOnBoarding";
import HomeScreen from "../screen/HomeScreen";
import RegisterScreen from "../screen/RegisterScreen";
import LoginScreen from "../screen/LoginScreen";
import Profile from "../screen/Profile";
import Notification from "../screen/Notification";
import TrainingSchedule from "../screen/TrainingSchedule";
import Schedule from "../screen/Schedule.js";
import GenderScreen from "../screen/GenderScreen";
import AgeSelectionScreen from "../screen/AgeSelectionScreen";
import WeightSelectionScreen from "../screen/WeightSelectionScreen";
import HeightSelectionScreen from "../screen/HeightSelectionScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Star") {
            iconName = focused ? "star" : "star-outline";
          } else if (route.name === "Resources") {
            iconName = focused ? "document" : "document-outline";
          } else if (route.name === "Notification") {
            iconName = focused ? "notifications" : "notifications-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false, // Hide the header to reduce space
        tabBarStyle: {
          backgroundColor: "#212020", // Customize your tab bar background if needed
          height: 60, // Adjust tab bar height if needed
        },
        tabBarLabelStyle: {
          fontSize: 14, // Adjust font size for the tab labels
        },
      })}
    >
      <Tab.Screen name="Home" component={GenderScreen} />
      <Tab.Screen name="Resources" component={AgeSelectionScreen} />
      <Tab.Screen name="Star" component={WeightSelectionScreen} />
      <Tab.Screen name="Notification" component={HeightSelectionScreen} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
