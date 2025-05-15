import axios from '@/config/axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    loading: false,
    error: null
};

let fetching = false

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('token');

        if (!token) {
            return rejectWithValue('No authentication token found');
        }  


        try {
            const response = await axios.get('/api/auth/profile', {
                headers: {
                    'Authorization': `${token}`
                }
            });

            if (response.data && response.data.user) {
                return response.data.user; // Return the user object directly
            }
            return rejectWithValue('No user data found');

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload;
        },
        updateUser: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        deleteUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = {
                    _id: action.payload._id,
                    name: action.payload.name,
                    email: action.payload.email,
                    role: action.payload.role,
                    skills: action.payload.skills,
                    company: action.payload.company,
                    __v: action.payload.__v
                };
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { addUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;