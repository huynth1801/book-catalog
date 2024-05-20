import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNewBook, fetchBooks, recommendBook } from '../../redux/bookSlice';
import { MdAddCircleOutline } from 'react-icons/md';
import BookCard from '../BookCard/BookCard';
import BookForm from '../BookForm/BookForm';

const BookList = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const status = useSelector((state) => state.books.status);
  const error = useSelector((state) => state.books.error);
  const recommendedBook = useSelector((state) => state.books.recommendedBook);

  const [showAddButton, setShowAddButton] = useState(true);
  const [showBookForm, setShowBookForm] = useState(false);
  const [groupingCriteria, setGroupingCriteria] = useState('publicationYear');

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

  const groupBooks = (books, criteria) => {
    const groupedBooks = {};
    books.forEach((book) => {
      const key = book[criteria] || `Books without ${criteria}`;
      if (!groupedBooks[key]) {
        groupedBooks[key] = [];
      }
      groupedBooks[key].push(book);
    });

    const sortedGroups = Object.keys(groupedBooks)
      .sort((a, b) => {
        if (criteria === 'publicationYear') {
          return b - a;
        }
        return a.localeCompare(b);
      })
      .map((key) => ({
        key,
        books: groupedBooks[key].sort((a, b) => a.name.localeCompare(b.name))
      }));

    return sortedGroups;
  };

  const groupedBooks = groupBooks(books, groupingCriteria);

  const handleAddButtonClick = () => {
    setShowBookForm(true);
  };

  const handleBookFormSubmit = () => {
    setShowBookForm(false);
  };

  const handleCloseForm = () => {
    setShowBookForm(false);
  };

  const handleGroupingChange = (e) => {
    setGroupingCriteria(e.target.value);
  };

  return (
    <div className='container mx-auto px-4'>
      {recommendedBook && (
        <div className='mb-6'>
          <h1 className='text-2xl font-bold mb-4 text-center text-red-400'>Recommended Book</h1>
          <BookCard key={recommendedBook.id} book={recommendedBook} />
        </div>
      )}
      <h1 className='text-2xl font-bold m-4 text-center text-red-400'>All Books</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && books.length === 0 && <p>No books available</p>}
      {status === 'succeeded' && books.length > 0 && (
        <div className='m-4'>
          <label htmlFor='groupingCriteria' className='mb-4 font-bold text-xl'>
            Group By:{' '}
          </label>
          <select
            id='groupingCriteria'
            onChange={handleGroupingChange}
            value={groupingCriteria}
            className='ml-4 border-2 p-2 rounded-md border-gray-600 shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
          >
            <option value='publicationYear'>Publication Year</option>
            <option value='rating'>Rating</option>
            <option value='authors'>Author</option>
          </select>
          {groupedBooks.map((group) => (
            <div key={group.key} className='mb-6 mt-2'>
              <h2 className='text-xl font-bold mb-4'>{group.key}</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {group.books.map((book, index) => (
                  <BookCard key={`${group.key}-${index}`} book={book} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {showAddButton && (
        <button
          className='fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg'
          onClick={handleAddButtonClick}
        >
          <MdAddCircleOutline className='text-2xl' />
        </button>
      )}
      {showBookForm && <BookForm onSubmit={handleBookFormSubmit} onClose={handleCloseForm} />}
    </div>
  );
};

export default BookList;
