import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserState {
    id: string;
    name: string;
    email: string;
    phone: string;
    avata: Uint8Array | null;
    token: string;
}

const initialState: UserState = {
    id: "",
    name: "",
    email: "",
    phone: "",
    avata: null,
    token: "",
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
            state.phone = "";
            state.avata = null;
        }
    },
});

export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
