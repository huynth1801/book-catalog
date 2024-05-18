import fs from 'fs';
import { db, validate } from '../Firebase/firebase.js';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
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

  const booksCollection = collection(db, 'books');
  for (const book of books) {
    if (!validate(book)) {
      console.log(`Invalid book data: ${JSON.stringify(book)}`);
      continue;
    }
    book.rating = book.rating ? book.rating : 0;

    const bookWithId = { ...book, id: uuidv4() };

    try {
      await addDoc(booksCollection, bookWithId);
      console.log(`Added book: ${bookWithId.name}`);
      addedBooks.push(bookWithId);
    } catch (error) {
      console.error('Error adding book:', error);
      return res.status(500).json({ error: 'Failed to add book' });
    }
  }
  res.status(200).json({ message: 'Books added successfully', books: addedBooks });
};

export default { addBooksToFirestore };
