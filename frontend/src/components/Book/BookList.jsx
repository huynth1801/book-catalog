import React, { useEffect, useState } from 'react';
import bookService from '../../services/bookService';

const BookList = () => {
  const [books, setBook] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await bookService.getAllBooks();
        setBook(data?.books);
      } catch (error) {
        console.error('Error fetching books', error);
      }
    };
    fetchData();
  }, [books]);
  return (
    <div>
      <h1>All books</h1>
      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        books.map((item, index) => (
          <div key={index}>
            <h2>{item.name}</h2>
            <p>Author: {item.authors}</p>
            <p>Publication Year: {item.publicationYear}</p>
            <p>Rating: {item.rating}</p>
            <p>ISBN: {item.ISBN}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default BookList;
