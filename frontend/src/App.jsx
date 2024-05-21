import { useState } from 'react';
import BookList from './components/BookList/BookList';
import BookForm from './components/BookForm/BookForm';
import 'primereact/resources/themes/saga-blue/theme.css'; // theme
import 'primereact/resources/primereact.min.css'; // core css
import 'primeicons/primeicons.css'; // icons

function App() {
  const [isLoading, setLoading] = useState(false);
  return (
    <>
      <BookList />
    </>
  );
}

export default App;
