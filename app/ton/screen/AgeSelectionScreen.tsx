import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';

const AgeSelectionScreen = () => {
    const [selectedAge, setSelectedAge] = useState(20);
    
    const ages = Array.from({ length: 91 }, (_, i) => i + 10);
    
    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / 60);
        setSelectedAge(ages[index] || 10);
    };
    
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Số tuổi của bạn?</Text>
                
                <View style={styles.selectedAgeContainer}>
                    <Text style={styles.selectedAge}>{selectedAge}</Text>
                    <View style={styles.triangle} />
                </View>
                
                <View style={styles.sliderBackground}>
                    <FlatList
                        horizontal
                        data={ages}
                        keyExtractor={(item) => item.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        snapToInterval={60}
                        decelerationRate='fast'
                        renderItem={({ item }) => (
                            <View style={styles.ageWrapper}>
                                <Text style={[styles.ageItem, item === selectedAge && styles.selectedItem]}>
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
    selectedAgeContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    selectedAge: {
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
    ageWrapper: {
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ageItem: {
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

export default AgeSelectionScreen;