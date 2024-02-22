// FavoritesPage.js
import React from 'react';
import { Box, Text } from '@chakra-ui/react';

function FavoritesPage() {
  // Retrieve favorites from local storage
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  return (
    <Box mt={8}>
      <Text fontSize="xl" fontWeight="bold">
        Favorite Characters
      </Text>
      <ul>
        {favorites.map((character, index) => (
          <li key={index}>{character.name}</li>
        ))}
      </ul>
    </Box>
  );
}

export default FavoritesPage;
