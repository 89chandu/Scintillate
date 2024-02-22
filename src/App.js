// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import CharacterList from './components/CharacterList';
import CharacterDetailsPage from './components/CharacterDetailsPage';
import FavoritesPage from './FavoritesPage'; // Import the new component

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/characters/:id" element={<CharacterDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} /> {/* New route for Favorites page */}
          <Route path="/" element={<CharacterList />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
