import React, { useState } from 'react';
import { Box, Text, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useDisclosure } from '@chakra-ui/react';

function FavoritesPage() {
  // Retrieve favorites from local storage
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
  
  // Chakra UI useDisclosure hook for removal alert
  const {
    isOpen: isRemoveAlertOpen,
    onOpen: onRemoveAlertOpen,
    onClose: onRemoveAlertClose,
  } = useDisclosure();

  const handleRemoveFromFavorites = (character) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((favCharacter) => favCharacter !== character)
    );
    // Save updated favorites to local storage
    localStorage.setItem('favorites', JSON.stringify([...favorites.filter(fav => fav !== character)]));

    // Open the removal alert
    onRemoveAlertOpen();
  };

  return (
    <Box mt={8}>
      <Text fontSize="xl" fontWeight="bold">
        Favorite Characters
      </Text>
      <ul>
        {favorites.map((character, index) => (
          <li key={index}>
            {character.name} 
            <Button
              ml={2}
              colorScheme="red"
              size="sm"
              onClick={() => handleRemoveFromFavorites(character)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>

      {/* AlertDialog for the removal alert */}
      <AlertDialog
        isOpen={isRemoveAlertOpen}
        onClose={onRemoveAlertClose}
        isCentered
        className="custom-alert-dialog"
      >
        <AlertDialogContent>
          <AlertDialogHeader className="chakra-modal__header" fontSize="lg" fontWeight="bold">
            Removed from Favorites
          </AlertDialogHeader>
          <AlertDialogBody className="chakra-modal__body">
            The character has been removed from your favorites.
          </AlertDialogBody>
          <AlertDialogFooter className="chakra-modal__footer">
            <Button
              colorScheme="green"
              onClick={onRemoveAlertClose}
              className="chakra-modal__close-btn"
              ml={3}
            >
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}

export default FavoritesPage;
