import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, validate } from '../Firebase/firebase.js';
import { ref, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const booksFilePath = path.join(__dirname, '../Firebase/books.json');

// Function to add sample data to Firebase Realtime Database
const addBooksToFirestore = async (req, res) => {
  let books;
  try {
    books = JSON.parse(
      fs.readFileSync(booksFilePath, 'utf-8')
    );
    console.log(books);
  } catch (err) {
    console.error('Error reading books file:', err);
    return res.status(500).json({ error: 'Failed to read books file' });
  }

  const addedBooks = [];

  for (const book of books) {
    if (!validate(book)) {
      console.log(`Invalid book data: ${JSON.stringify(book)}`);
      continue;
    }
    book.rating = book.rating ? book.rating : 0;

    try {
      // Check existing of book in realtime database
      const booksRef = ref(db, 'books');
      const bookQuery = query(booksRef, orderByChild('name'), equalTo(book.name));
      const snapshot = await get(bookQuery);

      if (!snapshot.exists()) {
        // Create unique id for book
        const bookWithId = { ...book, id: uuidv4() };

        await set(ref(db, 'books/' + bookWithId.id), bookWithId);
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

// Function to get all book
const getAllBooks = async (req, res) => {
  const booksRef = ref(db, 'books');
  try {
    const snapshot = await get(booksRef);
    if (snapshot.exists()) {
      const books = [];
      snapshot.forEach((item) => {
        books.push(item.val());
      });
      res.status(200).json({ books });
    } else {
      res.status(404).json({ message: 'No books found' });
    }
  } catch (err) {
    console.error('Error fetching data', err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

export default { addBooksToFirestore, getAllBooks };
