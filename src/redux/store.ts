import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage'; 

import reducer from './slice';
import authReducer from '../modules/auth/redux/authSlice';
import adminReducer from 'modules/admin/redux/admin';

const rootReducer = combineReducers({
    reducer: reducer, 
    auth: authReducer,
    admin: adminReducer
})


const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['reducer']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({ 
    reducer: persistedReducer ,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

export default store;
