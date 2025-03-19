import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';

const WeightSelectionScreen = () => {
    const [selectedWeight, setSelectedWeight] = useState(50);
    
    const weights = Array.from({ length: 501 }, (_, i) => i);
    
    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / 80); // Điều chỉnh theo width mới
        setSelectedWeight(weights[index] || 0);
    };
    
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Cân nặng của bạn?</Text>
                
                <View style={styles.selectedWeightContainer}>
                    <Text style={styles.selectedWeight}>{selectedWeight} kg</Text>
                    <View style={styles.triangle} />
                </View>
                
                <View style={styles.sliderBackground}>
                    <FlatList
                        horizontal
                        data={weights}
                        keyExtractor={(item) => item.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        snapToInterval={80} // Điều chỉnh để tránh tràn
                        decelerationRate='fast'
                        renderItem={({ item }) => (
                            <View style={styles.weightWrapper}>
                                <Text style={[
                                    styles.weightItem, 
                                    item === selectedWeight && styles.selectedItem
                                ]}>
                                    {item}
                                </Text>
                            </View>
                        )}
                    />
                </View>
                
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Tiếp tục</Text>
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
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
        marginBottom: 20,
        fontWeight: 'bold',
    },
    selectedWeightContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    selectedWeight: {
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
    },
    triangle: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#d8f65c',
        marginTop: 5,
    },
    sliderBackground: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9370DB',
        paddingVertical: 10,
        borderRadius: 20,
    },
    listContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    weightWrapper: {
        width: 80, // Tăng kích thước để tránh chồng lấn
        justifyContent: 'center',
        alignItems: 'center',
    },
    weightItem: {
        fontSize: 35,
        color: '#ccc',
        textAlign: 'center', // Đảm bảo số được căn giữa
    },
    selectedItem: {
        color: '#fff',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
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

export default WeightSelectionScreen;
