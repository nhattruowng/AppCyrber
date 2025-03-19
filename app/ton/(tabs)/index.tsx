import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screen/HomeScreen";
import RegisterScreen from "../screen/login/RegisterScreen";
import LoginScreen from "../screen/login/LoginScreen";
import Profile from "../screen/Profile";
import Notification from "../screen/Notification";
import TrainingSchedule from "../screen/TrainingSchedule";
import Schedule from "../screen/Schedule.js";
import GenderScreen from "../screen/GenderScreen";
import AgeSelectionScreen from "../screen/AgeSelectionScreen";
import WeightSelectionScreen from "../screen/WeightSelectionScreen";
import HeightSelectionScreen from "../screen/HeightSelectionScreen";
import ForgetPasswordScreen from "../screen/login/ForgetPassword";
import ResetPasswordScreen from "../screen/login/ResetPassword";
import GymPackagesScreen from "../screen/GymPackages";
import ManageAccounts from "../screen/admin/ManageAccounts";
import AdminDashboard from "../screen/admin/AdminDashboard";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            case "Star":
              iconName = focused ? "star" : "star-outline";
              break;
            case "Resources":
              iconName = focused ? "document" : "document-outline";
              break;
            case "Notification":
              iconName = focused ? "notifications" : "notifications-outline";
              break;
            default:
              iconName = "help-circle"; // Fallback icon to avoid TypeScript error
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#212020",
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
      })}
    >
      <Tab.Screen name="Home" component={ManageAccounts} />
      <Tab.Screen name="Resources" component={AdminDashboard} />
      <Tab.Screen name="Star" component={LoginScreen} />
      <Tab.Screen name="Notification" component={RegisterScreen} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
