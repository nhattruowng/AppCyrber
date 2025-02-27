import { View, Text, Switch } from 'react-native';
import { useState } from 'react';

export default function CalendarScreen() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: isDarkMode ? '#121212' : '#fff' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: isDarkMode ? '#fff' : '#000' }}>
                Settings
            </Text>

            {/* Chế độ tối */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <Text style={{ fontSize: 18, color: isDarkMode ? '#fff' : '#000' }}>Dark Mode</Text>
                <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
            </View>
        </View>
    );
}
