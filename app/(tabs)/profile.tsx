import {View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Alert} from "react-native";
import {useEffect, useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/redux/store";
import {useRouter} from "expo-router";
import {clearUser, setUser} from "@/app/redux/userSlice";
import postcss from "postcss";


const API_LOCAL_URL = process.env.LOCAL_API_URL;

interface Service {
    id: string;
    name: string;
    total: number;
    totalUser: number;
}

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

    const [services, setServices] = useState<Service[]>([]);
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
    const analy = () => {
      router.push("/layout/analysisadmin");
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


    // useEffect(() => {
    //     const fetchDBAnaly = async () => {
    //         try {
    //             const response = await fetch(
    //                 "https://testupoadserver-fmbxg7epg4gscxb6.canadacentral-01.azurewebsites.net/api/booking/analysis",
    //                 {
    //                     method: "GET",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                         Authorization: `Bearer ${user.token}`,
    //                     },
    //                 }
    //             );
    //             if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
    //             const result = await response.json();
    //             const serviceData: Service[] = Object.values(result.data);
    //             setServices(serviceData);
    //         } catch (error) {
    //             console.error("Lỗi khi gọi API:", error);
    //         }
    //     };
    //
    //     if (user.roles.includes("ROLE_ADMIN")) {
    //         fetchDBAnaly();
    //     }
    // }, []);


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

        if (user.id && user.token && user.roles.includes("ROLE_USER")) {
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
                    <TouchableOpacity style={styles.serviceItem} onPress={() => analy()}>
                        <Text style={styles.serviceText}>Thống kê dịch vụ</Text>
                    </TouchableOpacity>
                </>
            )}

            {/*{user.roles.includes("ROLE_ADMIN") && (*/}
            {/*    <ScrollView style={styles.serviceList} contentContainerStyle={styles.serviceContent}>*/}
            {/*        {services.map((service) => (*/}
            {/*            <View key={service.id} style={styles.serviceItem}>*/}
            {/*                <View style={styles.row}>*/}
            {/*                    <Text style={styles.label}>Tên:</Text>*/}
            {/*                    <Text style={styles.value}>{service.name}</Text>*/}
            {/*                </View>*/}

            {/*                <View style={styles.row}>*/}
            {/*                    <Text style={styles.label}>Tổng tiền:</Text>*/}
            {/*                    <Text style={styles.value}>{service.total.toLocaleString()} VND</Text>*/}
            {/*                </View>*/}

            {/*                <View style={styles.row}>*/}
            {/*                    <Text style={styles.label}>Số người:</Text>*/}
            {/*                    <Text style={styles.value}>{service.totalUser} người</Text>*/}
            {/*                </View>*/}
            {/*            </View>*/}
            {/*        ))}*/}
            {/*    </ScrollView>*/}
            {/*)}*/}

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

        <TouchableOpacity
            onPress={isEditing ? onSave : toggleEdit}
            style={styles.editIcon}
        >
            <Ionicons
                name={isEditing ? "checkmark" : "pencil"}
                size={20}
                color="#FFD700"
            />
        </TouchableOpacity>
    </View>

);

const styles = StyleSheet.create({
    statusText: {
        color: "#13c654",
        fontWeight: "bold",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#444",
        flex: 1,
    },
    input: {
        flex: 2,
        fontSize: 16,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        color: "#333",
    },
    infoText: {
        flex: 2,
        fontSize: 16,
        color: "#555",
    },
    editIcon: {
        marginLeft: 12,
        padding: 6,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: "#ffffff",
    },
    serviceList: {
        marginTop: 10,
    },
    serviceContent: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    serviceItem: {
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    value: {
        fontSize: 16,
        color: "#333",
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
    }
});

