import { useState } from 'react';
import BookList from './components/BookList/BookList';

function App() {
  const [isLoading, setLoading] = useState(false);
  return (
    <>
      <BookList />
    </>
  );
}

export default App;
