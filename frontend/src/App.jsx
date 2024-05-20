import { useState } from 'react';
import BookList from './components/BookList/BookList';
import BookForm from './components/BookForm/BookForm';

function App() {
  const [isLoading, setLoading] = useState(false);
  return (
    <>
      <BookList />
    </>
  );
}

export default App;
