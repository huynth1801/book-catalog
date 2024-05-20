// src/redux/bookSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookService from "../services/bookService";

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
    const response = await bookService.getAllBooks();
    return response?.books;
});

export const recommendBook = createAsyncThunk('books/recommendBook', async (_, { getState }) => {
    const books = getState().books.books;
    const currentYear = new Date().getFullYear();
    const goodBooks = books.filter(book => {
        const publicationYear = book.publicationYear;
        return publicationYear && publicationYear <= currentYear - 3;
    });

    if (goodBooks.length === 0) {
        return null;
    }

    const highestRating = Math.max(...goodBooks.map(book => book.rating));
    const highestRatedBooks = goodBooks.filter(book => book.rating === highestRating);

    const recommendedBook = highestRatedBooks[Math.floor(Math.random() * highestRatedBooks.length)];
    return recommendedBook;
});

export const addNewBook = createAsyncThunk('books/addNewBook', async(newBookData) => {
    const response = await bookService.addNewBook(newBookData);
    return response
})

export const deleteBook  = createAsyncThunk('books/deleteBook', async(bookId) => {
    await bookService.deleteBook(bookId)
    return bookId 
})

const initialState = {
    books: [],
    status: 'idle',
    error: null,
    recommendedBook: null
};

const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchBooks.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchBooks.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.books = action.payload;
        })
        .addCase(fetchBooks.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        .addCase(recommendBook.fulfilled, (state, action) => {
            state.recommendedBook = action.payload;
        })
        .addCase(addNewBook.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(addNewBook.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.books.push(action.payload);
        })
        .addCase(addNewBook.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        .addCase(deleteBook.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.books = state.books.filter(book => book.id !== action.payload);
        })
        .addCase(deleteBook.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
    }
});

export default bookSlice.reducer;
