import { createSlice } from "@reduxjs/toolkit";


const initAuthState = {
    user: [],
    token: ''
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initAuthState,
    reducers: {
        setToken: (state: any, action: any) => {
            state.token = action.payload
        },
        setUser: (state: any, action: any) => {
            state.user = action.payload
        }
    }
});

const { reducer: authReducer, actions } = authSlice;

export const { setToken, setUser } = actions;

export default authReducer;