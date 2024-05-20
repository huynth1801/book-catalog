import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_URL

const getAllBooks = async() => {
    try {
        const response = await axios.get(`${baseUrl}/books`)
        return response.data
    } catch(err) {
        console.error("Error fetching books data:", err);
        throw err;
    }
}

const addNewBook = async(newBookData) => {
    try {
        const response = await axios.post(`${baseUrl}/books`, newBookData);
        return response.data;
    } catch(err) {
        console.error('Error adding new book', err)
        throw err;
    }
}

const deleteBook = async(bookId) => {
    try {
        await axios.delete(`${baseUrl}/books/${bookId}`)
    } catch(err) {
        console.error('Error deleting book', err)
        throw err;
    }
}

const editBook = async(bookId, updatedBookData) => {
    try {
        const response = await axios.put(`${baseUrl}/books/${bookId}`, updatedBookData)
        return response
    } catch(err) {
        console.error('Error editing book', err);
        throw err;
    }
}

export default {getAllBooks, addNewBook, deleteBook, editBook}