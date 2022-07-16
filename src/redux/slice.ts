import { createSlice } from '@reduxjs/toolkit';

const initState: any[] = [];

const mainSlice = createSlice({
    name: 'final',
    initialState: initState,
    reducers: {
        test: (state: any, action: any) => {
            
        }
    }

});

const { actions, reducer } = mainSlice;

export default reducer;