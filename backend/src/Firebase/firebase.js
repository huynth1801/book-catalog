import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

console.log(firebaseConfig);

initializeApp(firebaseConfig);
const db = getFirestore();

// Function to validate books data
const validate = (book) => {
  if (!book.name || book.name.length > 100) {
    return false;
  }
  if (!book.authors || !Array.isArray(book.authors) || book.authors.length === 0) {
    return false;
  }
  if (book.publicationYear && book.publicationYear <= 1800) {
    return false;
  }
  if (book.rating && (book.rating < 0 || book.rating > 10)) {
    return false;
  }
  return true;
};

export { db, validate };
