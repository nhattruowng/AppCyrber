import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AOnBoarding from "../screen/AOnBoarding"; 
import HomeScreen from "../screen/HomeScreen"; 
import RegisterScreen from "../screen/RegisterScreen";
import LoginScreen from "../screen/LoginScreen";
import Profile from "../screen/Profile";
import Notification from "../screen/Notification";

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
          }else if (route.name === "Resources") {
            iconName = focused ? "document" : "document-outline";
          }else if (route.name === "Notification") {
            iconName = focused ? "notifications" : "notifications-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Resources" component={RegisterScreen} />
      <Tab.Screen name="Star" component={LoginScreen} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Notification" component={Notification} />
    </Tab.Navigator>
  );
}
