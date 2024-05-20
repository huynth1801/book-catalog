import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Input from '../InputField/Input';
import { addNewBook, recommendBook } from '../../redux/bookSlice';
import { IoMdCloseCircleOutline } from 'react-icons/io';

const BookForm = ({ onSubmit, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    authors: '',
    publicationYear: '',
    rating: 0,
    ISBN: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let numericValue = value;

    if (name === 'publicationYear' || name === 'rating') {
      const parsedValue = parseInt(value);
      numericValue = isNaN(parsedValue) ? value : parsedValue;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: numericValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addNewBook(formData));
    onSubmit();
    // Reset form data after submission
    setFormData({
      name: '',
      authors: '',
      publicationYear: '',
      rating: 0,
      ISBN: ''
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 '>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative'>
        <button type='button' className='absolute top-2 right-2 text-red-500 hover:text-red-700' onClick={handleClose}>
          <IoMdCloseCircleOutline size={36} />
        </button>
        <h1 className='text-xl mb-4 text-center'>Add New Book</h1>
        <Input
          label='Name'
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          maxLength={100}
          placeHolder={'Please type a name of your book'}
          required
        />
        <Input
          label='Authors (comma separated)'
          type='text'
          name='authors'
          value={formData.authors}
          placeHolder={'Please type name of the authors'}
          onChange={handleChange}
          required
        />
        <Input
          label='Publication Year'
          type='number'
          name='publicationYear'
          value={formData.publicationYear}
          placeHolder={'Publication year (optional)'}
          onChange={handleChange}
          min='1801'
        />
        <Input
          label='Rating'
          type='number'
          name='rating'
          value={formData.rating}
          onChange={handleChange}
          placeHolder={'Rating (optional, 0 by default)'}
          min='0'
          max='10'
        />
        <Input
          label='ISBN'
          type='text'
          name='ISBN'
          value={formData.ISBN}
          onChange={handleChange}
          placeHolder={'Optional'}
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded items-center text-center w-full hover:bg-blue-600'
        >
          Add Book
        </button>
      </div>
    </form>
  );
};

export default BookForm;
