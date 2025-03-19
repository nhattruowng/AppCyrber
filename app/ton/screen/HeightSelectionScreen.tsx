import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';

const HeightSelectionScreen = () => {
    const [selectedHeight, setSelectedHeight] = useState(160);
    
    const heights = Array.from({ length: 201 }, (_, i) => i + 100);
    
    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / 60);
        setSelectedHeight(heights[index] || 100);
    };
    
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Chiều cao của bạn?</Text>
                
                <View style={styles.selectedHeightContainer}>
                    <Text style={styles.selectedHeight}>{selectedHeight} cm</Text>
                    <View style={styles.triangle} />
                </View>
                
                <View style={styles.sliderBackground}>
                    <FlatList
                        data={heights}
                        keyExtractor={(item) => item.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        snapToInterval={60}
                        decelerationRate='fast'
                        renderItem={({ item }) => (
                            <View style={styles.heightWrapper}>
                                <Text style={[styles.heightItem, item === selectedHeight && styles.selectedItem]}>
                                    {item} cm
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
    selectedHeightContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    selectedHeight: {
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
        height: '60%',
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9370DB',
        paddingVertical: 10,
        borderRadius: 20,
    },
    listContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    heightWrapper: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heightItem: {
        fontSize: 35,
        color: '#ccc',
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

export default HeightSelectionScreen;
