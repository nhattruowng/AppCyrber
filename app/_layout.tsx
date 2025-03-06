
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import { store } from "./redux/store";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        const checkUser = async () => {
            try {
                const user = await AsyncStorage.getItem("user");
                setIsLoggedIn(!!user);
            } catch (error) {
                console.error("Lỗi khi kiểm tra user:", error);
            }
        };

        checkUser();
    }, []);

    useEffect(() => {
        if (loaded && isLoggedIn !== null) {
            SplashScreen.hideAsync();
            if (isLoggedIn) {
                router.replace("(tabs)");
            }
        }
    }, [loaded, isLoggedIn]);

    if (!loaded || isLoggedIn === null) {
        return null; // Đợi kiểm tra user xong mới render
    }

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Provider store={store}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="authen/login" options={{ headerShown: false }} />
                    <Stack.Screen name="authen/register" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
            </Provider>
        </ThemeProvider>
    );
}

/// //import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
//import {useFonts} from 'expo-font';
//import {Stack} from 'expo-router';
//import * as SplashScreen from 'expo-splash-screen';
//import {StatusBar} from 'expo-status-bar';
//import {useEffect} from 'react';
//import 'react-native-reanimated';
//
//import {useColorScheme} from '@/hooks/useColorScheme';
//
//
//import {Provider} from 'react-redux'
//import {store} from './redux/store'
//import LoginScreen from "@/app/authen/login";
//
//// Prevent the splash screen from auto-hiding before asset loading is complete.
//SplashScreen.preventAutoHideAsync();
//
//export default function RootLayout() {
//    const colorScheme = useColorScheme();
//    const [loaded] = useFonts({
//        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//    });
//
//    useEffect(() => {
//        if (loaded) {
//            SplashScreen.hideAsync();
//        }
//    }, [loaded]);
//
//    if (!loaded) {
//        return null;
//    }
//
//    return (
//        // <LoginScreen />
//        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//            <Provider store={store}>
//                <Stack>
//                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
//                    <Stack.Screen name="authen/login" options={{headerShown: false}}/>
//                    <Stack.Screen name="authen/register" options={{headerShown: false}}/>
//                    <Stack.Screen name="+not-found"/>
//                </Stack>
//                <StatusBar style="auto"/>
//            </Provider>
//        </ThemeProvider>
//    );
//}
