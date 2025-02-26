import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GenderSelectionScreen: React.FC = () => {
    // Định nghĩa kiểu dữ liệu cho state
    const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);

    return (
        
        <View style={styles.container}>
            <Text style={styles.title}>Giới tính của bạn?</Text>
            
            <TouchableOpacity 
                style={[styles.option, selectedGender === 'male' && styles.selected]} 
                onPress={() => setSelectedGender('male')}>
                <Ionicons name="male" size={50} color={selectedGender === 'male' ? '#000' : '#fff'} />
                <Text style={styles.optionText}>Nam</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.option, selectedGender === 'female' && styles.selected]} 
                onPress={() => setSelectedGender('female')}>
                <Ionicons name="female" size={50} color={selectedGender === 'female' ? '#000' : '#fff'} />
                <Text style={styles.optionText}>Nữ</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#212020',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 40,
        fontWeight: 'bold',
    },
    option: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#fff',
        marginBottom: 20,
    },
    selected: {
        backgroundColor: '#d8f65c',
        borderColor: '#d8f65c',
    },
    optionText: {
        fontSize: 18,
        color: '#fff',
        marginTop: 10,
        fontWeight: 'bold',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#333',
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 30,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    }
});

export default GenderSelectionScreen;
