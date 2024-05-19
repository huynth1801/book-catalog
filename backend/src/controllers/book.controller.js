import fs from 'fs';
import { db, validate } from '../Firebase/firebase.js';
import { ref, set, get, child } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

// function to add sample books data to firebase
const addBooksToFirestore = async (req, res) => {
  // Read books data from JSON file
  let books;
  try {
    books = JSON.parse(
      fs.readFileSync('/Users/nguyenthaihuuhuy/book-catalog/backend/src/Firebase/books.json', 'utf-8')
    );
    console.log(books);
  } catch (err) {
    throw err;
  }

  const addedBooks = [];

  for (const book of books) {
    if (!validate(book)) {
      console.log(`Invalid book data: ${JSON.stringify(book)}`);
      continue;
    }
    book.rating = book.rating ? book.rating : 0;

    const bookWithId = { ...book, id: uuidv4() };

    // Check if the book already exists in the Realtime Database
    const bookRef = ref(db, 'books/' + bookWithId.id);
    try {
      const snapshot = await get(child(ref(db), 'books/' + book.name));
      if (!snapshot.exists()) {
        await set(bookRef, bookWithId);
        console.log(`Added book: ${bookWithId.name}`);
        addedBooks.push(bookWithId);
      } else {
        console.log(`Book already exists: ${book.name}`);
      }
    } catch (error) {
      console.error('Error adding book:', error);
      return res.status(500).json({ error: 'Failed to add book' });
    }
  }
  res.status(200).json({ message: 'Books added successfully', books: addedBooks });
};

// Function to get all books
const getAllBooks = async(req, res) => {
  const booksRef = ref(db, 'books')
  try {
    const snapshot = await get(booksRef);
    if(snapshot.exists()) {
      const books = [];
      snapshot.forEach((item) => {
        books.push(item.val())
      })
      res.status(200).json({books})
    } else {
      res.status(404).json({message: 'No books found'})
    }
  } catch(err) {
    console.log('Errors fetching data', err);
    res.status(500).json({error: 'Failed to fetch books'})
  }
}

export default { addBooksToFirestore, getAllBooks };
