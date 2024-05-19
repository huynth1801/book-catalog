import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookService from "../services/bookService";

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
    const response = await bookService.getAllBooks();
    return response?.books;
})

const initialState = {
    books: [],
    status: 'idle',
    error: null
}

const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchBooks.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(fetchBooks.fulfilled, (state, action) => {
            state.status = 'succeeded',
            state.books = action.payload
        })
        .addCase(fetchBooks.rejected, (state, action) => {
            state.status = 'failed',
            state.error = action.error.message
        })
    }
})

export default bookSlice.reducer