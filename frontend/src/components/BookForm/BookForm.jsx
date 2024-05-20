import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNewBook, editBook } from '../../redux/bookSlice';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import Input from '../InputField/Input';

const BookForm = ({ onSubmit, onClose, initialData }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    authors: '',
    publicationYear: '',
    rating: 0,
    ISBN: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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
    if (initialData) {
      // Edit book
      await dispatch(editBook({ ...initialData, ...formData }));
    } else {
      // Add new book
      await dispatch(addNewBook(formData));
    }
    onSubmit(formData);
    // Reset form data after submission
    setFormData({
      name: '',
      authors: '',
      publicationYear: '',
      rating: 0,
      ISBN: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative'>
        <button type='button' className='absolute top-2 right-2 text-red-500 hover:text-red-700' onClick={onClose}>
          <IoMdCloseCircleOutline size={36} />
        </button>
        <h1 className='text-xl mb-4 text-center'>{initialData ? 'Edit Book' : 'Add New Book'}</h1>
        <Input
          label='Name'
          type='text'
          name='name'
          value={formData.name || ''}
          onChange={handleChange}
          maxLength={100}
          placeholder='Please type the name of your book'
          required
        />
        <Input
          label='Authors (comma separated)'
          type='text'
          name='authors'
          value={formData.authors || ''}
          onChange={handleChange}
          placeholder='Please type the names of the authors'
          required
        />
        <Input
          label='Publication Year'
          type='number'
          name='publicationYear'
          value={formData.publicationYear || ''}
          onChange={handleChange}
          placeholder='Publication year (optional)'
          min='1801'
        />
        <Input
          label='Rating'
          type='number'
          name='rating'
          value={formData.rating || ''}
          onChange={handleChange}
          placeholder='Rating (optional, 0 by default)'
          min='0'
          max='10'
        />
        <Input
          label='ISBN'
          type='text'
          name='ISBN'
          value={formData.ISBN || ''}
          onChange={handleChange}
          placeholder='Optional'
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded items-center text-center w-full hover:bg-blue-600'
        >
          {initialData ? 'Edit Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
