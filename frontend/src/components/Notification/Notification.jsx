import { useEffect } from 'react';

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className='fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg animate-slide-in-right'>
      {message}
    </div>
  );
};

export default Notification;
