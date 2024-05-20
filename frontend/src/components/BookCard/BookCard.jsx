import { useDispatch } from 'react-redux';
import { deleteBook } from '../../redux/bookSlice';

const BookCard = ({ book }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    console.log(book?.id);
    dispatch(deleteBook(book?.id));
  };
  return (
    <div className='bg-white shadow-lg rounded-lg p-6 mb-4 flex flex-col justify-between sm:w-full lg:max-w-md xl:max-w-lg'>
      <div>
        <h2 className='text-xl font-semibold mb-2'>{book.name}</h2>
        <div className='flex text-gray-700 mb-4 items-center'>
          <p className='font-bold mr-4'>Authors: </p>
          <p>{book.authors}</p>
        </div>
        <div className='flex text-gray-700 mb-4 items-center'>
          <p className='font-bold mr-4'>Publication Year: </p>
          <p>{book.publicationYear || 'Unknown'}</p>
        </div>
        <div className='flex text-gray-700 mb-4 items-center'>
          <p className='font-bold mr-4'>ISBN: </p>
          <p>{book.ISBN || 'Unknown'}</p>
        </div>
        <div className='flex text-gray-700 mb-4 items-center'>
          <p className='font-bold mr-4'>Rating: </p>
          <p>{book.rating || '0'}</p>
        </div>
      </div>
      <div className='flex justify-end items-center mt-auto'>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded'>Edit</button>
        <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default BookCard;
