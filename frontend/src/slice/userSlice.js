import {createSlice} from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: "users",
    initialState: {
        user: null,
        error: null
    },
    reducers:{
        setUser: (state,action)=>{
            state.user = action.payload;
            state.error = null;
        },
        setError: (state,action)=>{
            state.user = null;
            state.error = action.payload;
        },
        logout: (state)=>{
            state.user = null;
            state.error = null;
        }
    }
})

export const {setUser, setError, logout} = userSlice.actions;
export default userSlice.reducer;