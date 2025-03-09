import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserState {
    id: string;
    name: string;
    email: string;
    phone: string;
    avata: Uint8Array | null;
    token: string;
    roles: string[];
}

const initialState: UserState = {
    id: "",
    name: "",
    email: "",
    phone: "",
    avata: null,
    token: "",
    roles: [],
};
// s

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            const user = action.payload;
            Object.assign(state, user);
            AsyncStorage.setItem("user", JSON.stringify(user)).catch((err) =>
                console.error("Lưu user thất bại:", err)
            );
        },
        clearUser: (state) => {
            state.token = "";
            AsyncStorage.getItem("user").then((storedUser) => {
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    parsedUser.token = ""; // Chỉ xóa token
                    AsyncStorage.setItem("user", JSON.stringify(parsedUser))
                        .then(() => {
                            console.log("✅ Đã cập nhật user (token = ''):", parsedUser);
                        })
                        .catch((err) => console.error("❌ Cập nhật user thất bại:", err));
                }
            }).catch((err) => console.error("❌ Lấy user thất bại:", err));
        }

    },
});


export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;