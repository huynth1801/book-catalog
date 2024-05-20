import { useState } from 'react';

const Input = ({ label, inputType, type, name, value, placeHolder, onChange, required, min, max }) => {
  const getBorderClass = () => {
    if (required && value === '') {
      return 'border-red-500';
    }
    if (required && value !== '') {
      return 'border-green-500';
    }
    return 'border-gray-300';
  };

  return (
    <div className='mb-4'>
      <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor={name}>
        {label}:
      </label>
      <div className='relative'>
        {inputType === 'textarea' ? (
          <textarea
            type={type}
            name={name}
            id={name}
            value={value}
            placeholder={placeHolder}
            onChange={onChange}
            required={required}
            min={min}
            max={max}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getBorderClass()}`}
          />
        ) : (
          <input
            type={type}
            name={name}
            id={name}
            value={value}
            placeholder={placeHolder}
            onChange={onChange}
            required={required}
            min={min}
            max={max}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getBorderClass()}`}
          />
        )}
        {required && value !== '' && (
          <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
            <svg className='h-5 w-5 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
