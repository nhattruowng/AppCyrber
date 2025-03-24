import React, { useState } from 'react';
import { Modal, TextInput, TouchableOpacity, View, Text, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
    itemId: string;
    onSubmit: (data: { email: string; number: number; itemId: string }) => void;
};

const AddDialog: React.FC<Props> = ({ itemId, onSubmit }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');

    const openDialog = () => setIsVisible(true);
    const closeDialog = () => setIsVisible(false);

    const handleSubmit = () => {
        if (!email || Number(number) < 1) {
            Alert.alert('Vui lòng nhập email hợp lệ và số lớn hơn hoặc bằng 1!');
            return;
        }
        onSubmit({ email, number: Number(number), itemId });
        closeDialog();
        setEmail('');
        setNumber('');
    };

    return (
        <View>
            <TouchableOpacity onPress={openDialog} style={styles.addButton}>
                <FontAwesome name="plus" size={20} color="#fff" />
            </TouchableOpacity>

            <Modal transparent visible={isVisible} animationType="slide">
                <View style={styles.dialogContainer}>
                    <View style={styles.dialog}>
                        <TextInput
                            placeholder="Nhập email"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Nhập số (≥ 1)"
                            value={number}
                            onChangeText={setNumber}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <View style={styles.dialogActions}>
                            <TouchableOpacity onPress={closeDialog} style={styles.cancelButton}>
                                <Text>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSubmit} style={styles.confirmButton}>
                                <Text>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = {
    addButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        alignItems: 'center' as const, // ✅ Chuyển thành kiểu hợp lệ
    },
    dialogContainer: {
        flex: 1,
        justifyContent: 'center' as const, // ✅ Chuyển thành kiểu hợp lệ
        alignItems: 'center' as const,     // ✅ Chuyển thành kiểu hợp lệ
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    dialog: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 15,
        paddingVertical: 8,
    },
    dialogActions: {
        flexDirection: 'row' as const, // ✅ Chuyển thành kiểu hợp lệ
        justifyContent: 'space-between' as const, // ✅ Chuyển thành kiểu hợp lệ
    },
    cancelButton: {
        padding: 10,
    },
    confirmButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
};


export default AddDialog;
