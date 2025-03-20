import {View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Alert} from "react-native";
import {useEffect, useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/redux/store";
import {useRouter} from "expo-router";
import {clearUser, setUser} from "@/app/redux/userSlice";
import postcss from "postcss";


const API_LOCAL_URL = process.env.LOCAL_API_URL;


interface Member {
    id: string;
    datestart: string;
    enddate: string;
    price: number;
    duration: number;
}

interface MemberPlan {
    id: string;
    datestart: string;
    enddate: string;
    price: number;
    timeinday: number;
    name: string;
}

interface HistoryType {
    id: string;
    members: Member;
    memberPlans: MemberPlan;
}

export default function ProfileScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);

    const [name, setName] = useState(user.name);
    const [phone, setPhone] = useState(user.phone);
    const [isEditing, setIsEditing] = useState<{ name: boolean; phone: boolean }>({
        name: false,
        phone: false,
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadinghs, setIsLoadinghs] = useState<boolean>(false);
    const [history, setHistory] = useState<HistoryType[]>([]);



    useEffect(() => {
        if (!user?.token) {
            router.push("/authen/login");
        }
    }, [user?.token]);

    const khachhangs = () => {
        router.push("/layout/userlistscreen");
    }
    const pt = () => {
        router.push("/layout/ptllistscreen");
    }
    const logout = () => {
        Alert.alert("Xác nhận đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
            {text: "Hủy", style: "cancel"},
            {
                text: "Đăng xuất",
                onPress: () => {
                    dispatch(clearUser());
                    router.push("/authen/login");
                },
                style: "destructive",
            },
        ]);
    };

    const toggleEdit = (field: "name" | "phone") => {
        setIsEditing((prev) => ({...prev, [field]: !prev[field]}));
    };

    const validateInput = (field: "name" | "phone", value: string): boolean => {
        if (!value.trim()) {
            Alert.alert("Lỗi", "Thông tin không được để trống.");
            return false;
        }
        if (field === "phone" && !/^\d{10}$/.test(value)) {
            Alert.alert("Lỗi", "Số điện thoại phải có 10 chữ số.");
            return false;
        }
        return true;
    };


    /////////////////////////////// lay lich su sư dung

    useEffect(() => {
        const loadHistory = async () => {
            try {
                setIsLoadinghs(true);
                const response = await fetch(
                    `https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/booking/user-history/${user.id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Lỗi khi tải lịch sử");
                }
                const result = await response.json().catch(() => {
                    throw new Error("Lỗi khi parse JSON");
                });

                if (Array.isArray(result.data) && result.data.length > 0) {
                    const mappedHistory: HistoryType[] = result.data.map((item) => {
                        return ({
                            id: item.id,
                            members: item.members
                                ? {
                                    id: item.members.id || "",
                                    datestart: item.members.datestart || "",
                                    enddate: item.members.enddate || "",
                                    price: item.members.price || 0,
                                    duration: item.members.duration || 0,
                                }
                                : null,
                            memberPlans: item.memberPlans
                                ? {
                                    id: item.memberPlans.id || "",
                                    datestart: item.memberPlans.datestart || "",
                                    enddate: item.memberPlans.enddate || "",
                                    price: item.memberPlans.price || 0,
                                    timeinday: item.memberPlans.timeinday || "",
                                    name: item.memberPlans.name || "",
                                }
                                : null,
                        });
                    });

                    setHistory(mappedHistory);
                    setIsLoadinghs(false);
                } else {
                    console.error("Dữ liệu không hợp lệ hoặc rỗng:", result.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải lịch sử:", error);
            }
        };

        if (user.id && user.token) {
            loadHistory();
        }
    }, [user.id, user.token]);


    ///////////////////////////////////

    const updateUserInfo = async (field: "name" | "phone", value: string) => {
        if (!validateInput(field, value)) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/users/edit/${user.id}/${field === "name" ? "Name" : "Phone"}?content=${encodeURIComponent(value)}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Cập nhật thất bại");
            }
            Alert.alert("Thành công", `${field === "name" ? "Họ tên" : "Số điện thoại"} đã được cập nhật.`);
            dispatch(setUser({...user, [field]: value}));
            toggleEdit(field);
        } catch (error) {
            Alert.alert("Lỗi", error instanceof Error ? error.message : "Không thể kết nối đến server.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.fixedSection}>
                <View style={styles.profileHeader}>
                    <Ionicons name="person-circle" size={120} color="#fff"/>
                    <Text style={styles.profileTitle}>Hồ sơ của tôi</Text>
                    <Text style={styles.emailText}>{user.email}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <InfoRow
                        label="Họ và tên"
                        value={name}
                        isEditing={isEditing.name}
                        setValue={setName}
                        toggleEdit={() => toggleEdit("name")}
                        onSave={() => updateUserInfo("name", name)}
                    />
                    <InfoRow
                        label="Số điện thoại"
                        value={phone}
                        isEditing={isEditing.phone}
                        setValue={setPhone}
                        toggleEdit={() => toggleEdit("phone")}
                        onSave={() => updateUserInfo("phone", phone)}
                    />
                </View>
            </View>

            {user.roles.includes("ROLE_ADMIN") && (
                <>
                    <Text style={styles.serviceTitle}>Quản lý</Text>
                    <TouchableOpacity style={styles.serviceItem} onPress={() => khachhangs()}>
                        <Text style={styles.serviceText}>Khách hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.serviceItem} onPress={() => pt()}>
                        <Text style={styles.serviceText}>PT</Text>
                    </TouchableOpacity>
                </>
            )}

            {user.roles.includes("ROLE_ADMIN") && (
                <ScrollView style={styles.serviceList} contentContainerStyle={styles.serviceContent}>
                    {["Dịch vụ 1", "Dịch vụ 2", "Dịch vụ 3", "Dịch vụ 4", "Dịch vụ 5"].map((service, index) => (
                        <View key={index} style={styles.serviceItem}>
                            <Text style={styles.serviceText}>{service}</Text>
                        </View>
                    ))}
                </ScrollView>
            )}

            {user.roles.includes("ROLE_USER") && (
                <View>
                    <Text style={styles.sectionTitle}>Lịch sử dịch vụ</Text>
                    {isLoadinghs ? (
                        <Text style={styles.noDataText}>Đang tải ...</Text>
                    ) : history.length > 0 ? (
                        <>
                            {history.map((item, index) => (
                                <View key={index} style={styles.serviceItem}>
                                    <Text style={styles.serviceText}>Gói: {item.memberPlans?.name ?? "Không có"}</Text>
                                    <Text style={styles.statusText}>Bắt đầu: {item.members?.datestart ?? "Không có"}</Text>
                                    <Text style={styles.endTimeText}>
                                        Kết thúc: {item.memberPlans?.enddate ?? "Không có"}{" "}
                                        {item.memberPlans?.enddate &&
                                            new Date(item.memberPlans.enddate) < new Date() && (
                                                <Text style={styles.expiredText}> (Hết hạn)</Text>
                                            )}
                                    </Text>
                                </View>
                            ))}
                        </>
                    ) : (
                        <Text style={styles.noDataText}>Không có dữ liệu lịch sử</Text>
                    )}
                </View>
            )}

            <TouchableOpacity style={styles.logoutButton}
                              onPress={user.token ? logout : () => router.push("/authen/login")}>
                <Text
                    style={styles.logoutButtonText}>{isLoading ? "Đang xử lý..." : user.token ? "Đăng xuất" : "Đăng nhập"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const InfoRow: React.FC<InfoRowProps> = ({label, value, isEditing, setValue, toggleEdit, onSave}) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        {isEditing ? (
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={setValue}
                autoFocus
            />
        ) : (
            <Text style={styles.infoText}>{value}</Text>
        )}
        <TouchableOpacity onPress={isEditing ? onSave : toggleEdit} style={styles.editIcon}>
            <Ionicons name={isEditing ? "checkmark" : "pencil"} size={20} color="#FFD700"/>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    statusText: {
        color: "#13c654",
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: "#ffffff",
    },
    endTimeText: {
        color: "gray",
        fontStyle: "italic",
    },
    container: {
        flex: 1,
        backgroundColor: "#005f73",
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    fixedSection: {
        marginTop: 50,
    },
    profileHeader: {
        alignItems: "center",
    },
    profileTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 15,
    },
    emailText: {
        fontSize: 16,
        color: "#fff",
        marginTop: 5,
    },
    expiredText: {
        color: "red",
        fontWeight: "bold",
    },
    serviceItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
    },
    serviceText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    noDataText: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
        marginTop: 10,
    },
    infoContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
        marginTop: 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
    },
    input: {
        height: 40,
        width: "60%",
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    infoText: {
        fontSize: 16,
        color: "#333",
        flex: 1,
    },
    editIcon: {
        padding: 5,
    },
    serviceList: {
        flex: 1,
        marginTop: 20,
    },
    serviceContent: {
        paddingBottom: 20,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
    },
    logoutButton: {
        backgroundColor: "#ee6c4d",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginTop: 20,
        alignSelf: "center",
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

