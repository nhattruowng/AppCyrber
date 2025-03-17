import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import {useSelector} from "react-redux";
import {RootState} from "@/app/redux/store";
import {useRouter} from "expo-router";




// Interface MembershipPlan
interface MembershipPlan {
    name: string;
    description: string;
    price: number;
    startedDate: string;
    endDate: string;
    timeInDay: number;
}

const API_URL = "https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/membership-plan";

const AddMembershipPlanScreen = () => {
    const [plan, setPlan] = useState<MembershipPlan>({
        name: "",
        description: "",
        price: 0,
        startedDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        timeInDay: 1,
    });

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state: RootState) => state.user);
    const router = useRouter();


    const indexpage =() =>{
        router.push("/index");
    }

    const addService = async (): Promise<boolean> => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify(plan),
            });
            if (response.ok) {
                console.log("Thêm gói thành viên thành công!");
                return true;
            } else {
                const errorText = await response.text();
                console.error("Lỗi từ server:", errorText);
                Alert.alert("Lỗi", "Không thể thêm gói: " + errorText);
                return false;
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi thêm gói thành viên.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPlan = async () => {
        if (!plan.name || plan.price < 0 || plan.timeInDay < 1) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ và chính xác thông tin.");
            return;
        }
        const success = await addService();
        if (success) {
            setPlan({
                name: "",
                description: "",
                price: 0,
                startedDate: new Date().toISOString().split("T")[0],
                endDate: new Date().toISOString().split("T")[0],
                timeInDay: 1,
            });
            Alert.alert("Thành công", "Gói thành viên đã được thêm!");

        }
    };

    const onChangeStartDate = (event: any, selectedDate?: Date) => {
        setShowStartDatePicker(false);
        if (selectedDate) {
            const isoDate = selectedDate.toISOString().split("T")[0];
            setPlan({ ...plan, startedDate: isoDate });
        }
    };

    const onChangeEndDate = (event: any, selectedDate?: Date) => {
        setShowEndDatePicker(false);
        if (selectedDate) {
            const isoDate = selectedDate.toISOString().split("T")[0];
            setPlan({ ...plan, endDate: isoDate });
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Thêm Gói Thành Viên</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>

                    {/* Tên gói */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Tên gói</Text>
                        <TextInput
                            style={styles.input}
                            value={plan.name}
                            onChangeText={(text) => setPlan({ ...plan, name: text })}
                        />
                    </View>

                    {/* Mô tả */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mô tả</Text>
                        <TextInput
                            style={styles.input}
                            value={plan.description}
                            onChangeText={(text) =>
                                setPlan({ ...plan, description: text })
                            }
                            multiline
                        />
                    </View>

                    {/* Giá (VND) */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Giá (VND)</Text>
                        <TextInput
                            style={styles.input}
                            value={plan.price.toString()}
                            onChangeText={(text) =>
                                setPlan({ ...plan, price: parseFloat(text) || 0 })
                            }
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Thời gian trong ngày (Picker) */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Thời gian trong ngày</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={plan.timeInDay}
                                onValueChange={(itemValue) =>
                                    setPlan({ ...plan, timeInDay: itemValue })
                                }
                                style={styles.picker}
                            >
                                {Array.from({ length: 30 }, (_, i) => i + 1).map(
                                    (value) => (
                                        <Picker.Item
                                            key={value}
                                            label={`${value} giờ`}
                                            value={value}
                                        />
                                    )
                                )}
                            </Picker>
                        </View>
                    </View>

                    {/* Ngày bắt đầu */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Ngày bắt đầu</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
//                            onPress={() => setShowStartDatePicker(true)}
                        >
                            <Text style={styles.dateText}>{plan.startedDate}</Text>
                            <Ionicons name="calendar-outline" size={24} color="#007bff" />
                        </TouchableOpacity>
                        {showStartDatePicker && (
                            <DateTimePicker
                                value={new Date(plan.startedDate)}
                                mode="date"
                                display="spinner"
                                onChange={onChangeStartDate}
                            />
                        )}
                    </View>

                    {/* Ngày kết thúc */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Ngày kết thúc</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowEndDatePicker(true)}
                        >
                            <Text style={styles.dateText}>{plan.endDate}</Text>
                            <Ionicons name="calendar-outline" size={24} color="#007bff" />
                        </TouchableOpacity>
                        {showEndDatePicker && (
                            <DateTimePicker
                                value={new Date(plan.endDate)}
                                mode="date"
                                display="spinner"
                                onChange={onChangeEndDate}
                            />
                        )}
                    </View>
                </View>

                {/* Nút Thêm gói */}
                <TouchableOpacity
                    style={[styles.addButton, isLoading && styles.disabledButton]}
                    onPress={handleAddPlan}
                    disabled={isLoading}
                >
                    <Text style={styles.addButtonText}>
                        {isLoading ? "Đang xử lý..." : "Thêm gói"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f4f8",
    },
    header: {
        backgroundColor: "#007bff",
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    scrollContainer: {
        padding: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
    },
    picker: {
        height: 50,
        width: "100%",
    },
    dateButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#f9f9f9",
    },
    dateText: {
        fontSize: 16,
        color: "#333",
    },
    addButton: {
        backgroundColor: "#007bff",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    disabledButton: {
        backgroundColor: "#aaa",
    },
    addButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});

export default AddMembershipPlanScreen;