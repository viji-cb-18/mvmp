import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPendingVendors = createAsyncThunk(
  'vendors/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/vendors/pending');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const vendorSlice = createSlice({
  name: 'vendors',
  initialState: {
    pendingVendors: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingVendors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPendingVendors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pendingVendors = action.payload;
      })
      .addCase(fetchPendingVendors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default vendorSlice.reducer;
