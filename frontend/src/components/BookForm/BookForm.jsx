import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNewBook, editBook } from '../../redux/bookSlice';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import Input from '../InputField/Input';
import checkValidation from '../../helpers/validationisbn';
import CreatableSelect from 'react-select/creatable';

const BookForm = ({ onSubmit, onClose, initialData, books }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    authors: [],
    publicationYear: '',
    rating: 0,
    ISBN: ''
  });

  const processAuthors = (books) => {
    if (!Array.isArray(books)) {
      throw new Error('books should be an array');
    }
    const allAuthors = books.flatMap((book) =>
      Array.isArray(book.authors)
        ? book.authors.flatMap((author) => author.split(',').map((name) => name.trim()))
        : book.authors.split(',').map((name) => name.trim())
    );
    return [...new Set(allAuthors)].map((author) => ({ label: author, value: author }));
  };

  let allAuthors = [];
  try {
    allAuthors = processAuthors(books);
  } catch (error) {
    console.error(error.message);
  }

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

  const handleAuthorsChange = (selectedAuthors) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      authors: selectedAuthors.map((author) => author.value)
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData?.ISBN) {
      return true;
    } else if (formData?.ISBN?.trim() !== '' && !checkValidation.isValidISBN(formData.ISBN)) {
      errors.ISBN = 'Invalid ISBN';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    if (initialData) {
      dispatch(editBook({ ...initialData, ...formData }));
    } else {
      dispatch(addNewBook(formData));
    }
    onSubmit(formData);
    setFormData({
      name: '',
      authors: [],
      publicationYear: '',
      rating: 0,
      ISBN: ''
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75'
      >
        <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative'>
          <button type='button' className='absolute top-2 right-2 text-red-500 hover:text-red-700' onClick={onClose}>
            <IoMdCloseCircleOutline size={36} />
          </button>
          <h1 className='text-xl mb-4 text-center'>{initialData ? 'Edit Book' : 'Add New Book'}</h1>
          <Input
            label='Name'
            inputType='textarea'
            type='text'
            name='name'
            value={formData.name || ''}
            onChange={handleChange}
            maxLength={100}
            placeHolder='Please type the name of your book'
            required
          />
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Authors (select multiple)</label>
            <CreatableSelect
              isMulti
              value={formData.authors.map((name) => ({ label: name, value: name }))}
              onChange={handleAuthorsChange}
              options={allAuthors}
              placeholder='Select or create authors'
              className='w-full border-2 border-solid'
              required
            />
          </div>
          <Input
            label='Publication Year'
            type='number'
            name='publicationYear'
            value={formData.publicationYear || ''}
            onChange={handleChange}
            placeHolder='Publication year (optional)'
            min='1801'
            max={import.meta.env.VITE_MAXIMUM_PUBLICATION_YEAR}
          />
          <Input
            label='Rating'
            type='number'
            name='rating'
            value={formData.rating || ''}
            onChange={handleChange}
            placeHolder='Rating (optional, 0 by default)'
            min='0'
            max='10'
          />
          <Input
            label='ISBN'
            type='text'
            name='ISBN'
            value={formData.ISBN || ''}
            onChange={handleChange}
            placeHolder='Optional'
          />
          {errors.ISBN && <p className='text-red-500 mb-[12px]'>{errors.ISBN}</p>}
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded items-center text-center w-full hover:bg-blue-600'
          >
            {initialData ? 'Edit Book' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
