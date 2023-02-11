import axios from 'axios';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';


export type FetchPizzasArgs = {
    sortBy: string;
    search: string;
    currentPage: string;
    category: string;
    order: string;
};

export const fetchPizzas = createAsyncThunk<PizzaItem[], FetchPizzasArgs>(
    'pizza/fetchPizzasStatus',
    async (params) => {
        const { search, currentPage, category, sortBy, order } = params;
        const { data } = await axios.get<PizzaItem[]>(
            `https://63c3de2cf0028bf85f9ec115.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
        );

        return data;
    }
);

type PizzaItem = {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    sizes: number[];
    types: number[];
    rating: number;
};

export enum Status {
    LOADING = 'loading',
    SUCCESS = 'success',
    ERROR = 'error',
}

interface PizzaSliceState {
    items: PizzaItem[];
    status: Status;
}

const initialState: PizzaSliceState = {
    items: [],
    status: Status.LOADING /* loading,success,error */,
};

const pizzaSlice = createSlice({
    name: 'pizza',
    initialState,
    reducers: {
        setItems(state, action: PayloadAction<PizzaItem[]>) {
            state.items = action.payload;
        },
    },
    /* Метод async action (fetchPizzas) */
    extraReducers: (builder) => {
        builder.addCase(fetchPizzas.pending, (state) => {
            state.status = Status.LOADING;
            state.items = [];
        });
        builder.addCase(fetchPizzas.fulfilled, (state, action) => {
            state.items = action.payload;
            state.status = Status.SUCCESS;
        });
        builder.addCase(fetchPizzas.rejected, (state) => {
            state.items = [];
            state.status = Status.ERROR;
        });
    },
});

export const selectPizza = (state: RootState) => state.pizza;

export const { setItems } = pizzaSlice.actions;

export default pizzaSlice.reducer;
