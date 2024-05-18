import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
  databaseURL: process.env.DATABASE_URL
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to validate books data
const validate = (book) => {
  if (!book.name || book.name.length > 100) {
    return false;
  }
  if (!book.authors || typeof book.authors !== 'string' || book.authors.trim() === '') {
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
