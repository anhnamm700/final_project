import { createSlice } from '@reduxjs/toolkit';

const initAdminState = {
    products: {},
    users: [],
    categories: [],
    search: [],
    vendors: [],
    brands: [],
    conditions: [],
    countries: [],
    roles: {},
    shippings: []
}

const adminSlice = createSlice({
    name: 'admin',
    initialState: initAdminState,
    reducers: {
        setProducts: (state: any, action: any) => {
            state.products = {...action.payload};
        },
        setUsers: (state: any, action: any) => {
            state.users = [...action.payload.data];
        },
        setCategories: (state: any, action: any) => {
            state.categories = [...action.payload];
        },
        setSearch: (state: any, action: any) => {
            state.search = [...action.payload.data];
        },
        setVendors: (state: any, action: any) => {
            state.vendors = [...action.payload.data];
        },
        setBrands: (state: any, action: any) => {
            state.brands = [...action.payload];
        },
        setConditions: (state: any, action: any) => {
            state.conditions = [...action.payload.data];
        },
        setCountries: (state: any, action: any) => {
            state.countries = [...action.payload.data];
        },
        setRoles: (state: any, action: any) => {
            state.roles = {...action.payload};
        },
        setShippings: (state: any, action: any) => {
            state.shippings = [...action.payload.data];
        },
    }
});

const { actions, reducer: adminReducer } = adminSlice;

export 
const { setProducts, 
        setUsers,
        setCategories, 
        setSearch, 
        setVendors, 
        setBrands,
        setConditions,
        setCountries,
        setRoles,
        setShippings
        } = actions;

export default adminReducer;

