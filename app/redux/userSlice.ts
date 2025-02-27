import {createSlice, PayloadAction} from "@reduxjs/toolkit";

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
            return {...state, ...action.payload};
        },
        clearUser: () => initialState,
    },
});

export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
