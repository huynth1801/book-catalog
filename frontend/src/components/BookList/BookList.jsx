// src/components/BookList/BookList.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBooks } from '../../redux/bookSlice';
import BookCard from '../BookCard/BookCard';

const groupBooksByYear = (books) => {
  const groupedBooks = books.reduce((acc, book) => {
    const year = book.publicationYear || 'Books without a year';
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(book);
    return acc;
  }, {});

  // Sort groups by year in descending order
  const sortedGroups = Object.keys(groupedBooks)
    .sort((a, b) => (b === 'Books without a year' ? -1 : b - a))
    .map((year) => ({
      year,
      books: groupedBooks[year].sort((a, b) => a.name.localeCompare(b.name))
    }));

  return sortedGroups;
};

const BookList = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const status = useSelector((state) => state.books.status);
  const error = useSelector((state) => state.books.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [dispatch, status]);

  const groupedBooks = groupBooksByYear(books);

  return (
    <div className='container mx-auto px-4'>
      <h1 className='text-2xl font-bold mb-4'>All Books</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && books.length === 0 && <p>No books available</p>}
      {status === 'succeeded' &&
        books.length > 0 &&
        groupedBooks.map((group) => (
          <div key={group.year} className='mb-6'>
            <h2 className='text-xl font-bold mb-2'>{group.year}</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {group.books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default BookList;
