import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBooks, recommendBook } from '../../redux/bookSlice';
import BookCard from '../BookCard/BookCard';

const BookList = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const status = useSelector((state) => state.books.status);
  const error = useSelector((state) => state.books.error);
  const recommendedBook = useSelector((state) => state.books.recommendedBook);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (status === 'succeeded' && books.length > 0 && !recommendedBook) {
      dispatch(recommendBook());
    }
  }, [dispatch, status, books, recommendedBook]);

  const groupBooksByYear = (books) => {
    const groupedBooks = {};
    books.forEach((book) => {
      const year = book.publicationYear || 'Books without a year';
      if (!groupedBooks[year]) {
        groupedBooks[year] = [];
      }
      groupedBooks[year].push(book);
    });

    const sortedGroups = Object.keys(groupedBooks)
      .sort((a, b) => b - a)
      .map((year) => ({
        year,
        books: groupedBooks[year].sort((a, b) => a.name.localeCompare(b.name))
      }));

    return sortedGroups;
  };

  const groupedBooks = groupBooksByYear(books);

  return (
    <div className='container mx-auto px-4'>
      {recommendedBook && (
        <div className='mb-6'>
          <h1 className='text-2xl font-bold mb-4 text-center'>Recommended Book</h1>
          <BookCard book={recommendedBook} />
        </div>
      )}
      <h1 className='text-2xl font-bold m-4 text-center'>All Books</h1>

      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && books.length === 0 && <p>No books available</p>}
      {status === 'succeeded' &&
        books.length > 0 &&
        groupedBooks.map((group) => (
          <div key={group.year} className='mb-6'>
            <h2 className='text-xl font-bold mb-4'>{group.year}</h2>
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
