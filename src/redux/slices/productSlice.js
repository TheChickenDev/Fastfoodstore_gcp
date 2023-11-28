import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    desc: '',
    type: '',
    price: '',
    img: '',
};

export const productSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateProduct: (state, action) => {
            const { name, desc, type, price, img } = action.payload;
            state.name = name;
            state.desc = desc;
            state.type = type;
            state.price = price;
            state.img = img;
        },
        resetProduct: (state) => {
            state.name = '';
            state.desc = '';
            state.type = '';
            state.price = '';
            state.img = '';
        },
    },
});

export const { updateProduct, resetProduct } = productSlice.actions;

export default productSlice.reducer;
