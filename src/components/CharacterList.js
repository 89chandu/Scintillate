// CharacterList.js
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Box, Text, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useDisclosure } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import '../components/styles/CharacterList.css';

const fetchCharacters = async (page = 1) => {
  const { data } = await axios.get(`https://swapi.dev/api/people/?page=${page}`);
  return data;
};

function CharacterList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tab, setTab] = useState('all'); // 'all' or 'favorites'
  const [favorites, setFavorites] = useState([]);

  const { data, isLoading, isError } = useQuery(['characters', currentPage], () =>
    fetchCharacters(currentPage)
  );

  useEffect(() => {
    // Load favorites from local storage
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Chakra UI useDisclosure hook for addition alert
  const { isOpen: isAddAlertOpen, onOpen: onAddAlertOpen, onClose: onAddAlertClose } = useDisclosure();

  // Chakra UI useDisclosure hook for removal alert
  const {
    isOpen: isRemoveAlertOpen,
    onOpen: onRemoveAlertOpen,
    onClose: onRemoveAlertClose,
  } = useDisclosure();

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleAddToFavorites = (character) => {
    setFavorites((prevFavorites) => [...prevFavorites, character]);
    // Save favorites to local storage
    localStorage.setItem('favorites', JSON.stringify([...favorites, character]));

    // Open the addition alert
    onAddAlertOpen();
  };

  const handleRemoveFromFavorites = (character) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((favCharacter) => favCharacter !== character)
    );
    // Save updated favorites to local storage
    localStorage.setItem('favorites', JSON.stringify([...favorites.filter(fav => fav !== character)]));

    // Open the removal alert
    onRemoveAlertOpen();
  };

  const handleTabChange = (selectedTab) => {
    setTab(selectedTab);
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error fetching characters</Text>;

  return (
    <Box className="character-list-container">
      <Box mb={4}>
        <Button
          className="tab-button"
          onClick={() => handleTabChange('all')}
          colorScheme={tab === 'all' ? 'green' : 'gray'}
        >
          All Characters
        </Button>
        <Button
          className="tab-button"
          onClick={() => handleTabChange('favorites')}
          colorScheme={tab === 'favorites' ? 'green' : 'gray'}
        >
          Favorite Characters
        </Button>
      </Box>

      {tab === 'all' && (
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            All Characters
          </Text>
          {data.results.map((character) => (
            <Box key={character.name} className="BoxCard" mb={2}>
              <Link to={`/characters/${character.url.split('/').slice(-2, -1)}`}>
                <Text className="character-name">
                  {character.name}
                </Text>
              </Link>
              <Text>
                Birth Year: {character.birth_year}
              </Text>
              <Text>
                Gender: {character.gender}
              </Text>
              
              <Button
                className="add-to-favorites-button"
                onClick={() => handleAddToFavorites(character)}
              >
                Add to Favorites
              </Button>
            </Box>
          ))}
          <Box mt={4}>
            <Button
              className="pagination-button"
              onClick={handlePrevPage}
              disabled={!data.previous}
            >
              Previous Page
            </Button>
            <Button
              className="pagination-button"
              ml={2}
              onClick={handleNextPage}
              disabled={!data.next}
            >
              Next Page
            </Button>
          </Box>
        </Box>
      )}

      {tab === 'favorites' && (
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Favorite Characters
          </Text>
          {favorites.map((character, index) => (
            <Box key={index} className="BoxCard" mb={2}>
              <Link to={`/characters/${character.url.split('/').slice(-2, -1)}`}>
                <Text className="character-name">
                  {character.name}
                </Text>
              </Link>
              <Text>
                Birth Year: {character.birth_year}
              </Text>
              <Text>
                Gender: {character.gender}
              </Text>
              
              <Button
                className="remove-from-favorites-button"
                onClick={() => handleRemoveFromFavorites(character)}
              >
                Remove from Favorites
              </Button>
            </Box>
          ))}
        </Box>
      )}

      {/* AlertDialog for the addition alert */}

      

      <AlertDialog
        isOpen={isAddAlertOpen}
        onClose={onAddAlertClose}
        isCentered
        className="custom-alert-dialog"
      >
        <AlertDialogContent>
          <AlertDialogHeader className="chakra-modal__header" fontSize="lg" fontWeight="bold">
            Added to Favorites
          </AlertDialogHeader>
          <AlertDialogBody className="chakra-modal__body">
            The character has been added to your favorites.
          </AlertDialogBody>
          <AlertDialogFooter className="chakra-modal__footer">
            <Button
              colorScheme="green"
              onClick={onAddAlertClose}
              className="chakra-modal__close-btn"
              ml={3}
            >
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

     
      

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

export default CharacterList;
