import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, validate } from '../Firebase/firebase.js';
import { ref, set, get, query, orderByChild, equalTo, remove } from 'firebase/database';
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

const addNewBook = async (req, res) => {
  try {
    const { name, authors, publicationYear, rating, ISBN } = req.body;

    if (!name || !authors || authors.length === 0) {
      return res.status(400).json({ error: 'Name and at least one author are required' });
    }

    if (name.length > 1000) {
      return res.status(400).json({ error: 'Name should not be longer than 1000 characters' });
    }

    if (publicationYear && (publicationYear < 1800 || isNaN(publicationYear))) {
      return res.status(400).json({ error: 'Publication year should be greater than 1800' });
    }

    if (rating && (rating < 0 || rating > 10 )) {
      return res.status(400).json({ error: 'Rating should be an integer value from 0 to 10' });
    }

    // Check if the book already exists by name
    const booksRef = ref(db, 'books');
    const bookQuery = query(booksRef, orderByChild('name'), equalTo(name));
    const snapshot = await get(bookQuery);

    if (!snapshot.exists()) {
      // Book does not exist, proceed to add
      const newBookId = uuidv4();
      await set(ref(db, `books/${newBookId}`), {
        name: name,
        authors: authors,
        publicationYear: publicationYear,
        rating: rating || 0,
        ISBN: ISBN || null
      });

      const newBook = {
        name: name,
        authors: authors,
        publicationYear: publicationYear,
        rating: rating || 0,
        ISBN: ISBN || null,
        id: newBookId
      }
      
      res.status(201).json( newBook );
    } else {
      // Book already exists
      res.status(400).json({ error: 'A book with the same name already exists' });
    }
  } catch (err) {
    console.error('Error adding new book:', err);
    res.status(500).json({ error: 'Failed to add a new book' });
  }
};

// Delete book with id
const deleteBook = async(req, res) => {
  try {
    const bookId = req.params?.id
    await remove(ref(db, `books/${bookId}`))
    res.status(204).send({message: 'Delete book successfully'});
  } catch(err) {
    console.error('Error deleting books', err)
    res.status(500).json({ error: 'Failed to delete the book' });
  }
}


export default { addBooksToFirestore, getAllBooks, addNewBook, deleteBook };
