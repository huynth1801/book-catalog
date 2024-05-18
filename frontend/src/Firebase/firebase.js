import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import books from './books.json' assert {type: 'json'}
import { v4 as uuidv4 } from 'uuid';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};


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

module.exports = {addBooksToFirestore}