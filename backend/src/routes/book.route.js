import bookController from '../controllers/book.controller.js';
import express from 'express';

const router = express.Router();

router.post('/add-sample-data', bookController.addBooksToFirestore);
router.get('/books', bookController.getAllBooks)

export default router;
