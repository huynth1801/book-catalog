import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import books from './books.json' assert {type: 'json'}
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

console.log(firebaseConfig);

// Initialize Firebase
initializeApp(firebaseConfig)
const db = getFirestore()

// Function to validate books data
const validate = (book) => {
  if(!book.name || book.name.length > 100) {
    return false;
  }

  if(!book.authors || !Array.isArray(book.authors) || book.authors.length === 0) {
    return false;
  }
  if(book.publicationYear && book.publicationYear <= 1800) {
    return false;
  }
  if(book.rating && (book.rating < 0 || book.rating > 10)) {
    return false;
  }
  return true;
}

// Function to add books to Firebasestore
const addBooksToFirestore = async () => {
  const booksCollection = collection(db, "books")

  for(const book of books) {
    if(!validate(book)) {
      console.log(`Invalid book data: ${JSON.stringify(book)}`);
      continue;
    }

    book.rating = book.rating ? book.rating : 0

    const bookWithId = {...book, id: uuidv4()}

    try {
      await addDoc(booksCollection, bookWithId)
      console.log(`Added book: ${bookWithId?.name}`);
    } catch(error) {
      console.log('Error adding book',error);
    }
  }
}

addBooksToFirestore()
  .then(() => {
    console.log("All valid books have been added successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error adding books: ", error);
    process.exit(1);
  });