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

export default {getAllBooks}