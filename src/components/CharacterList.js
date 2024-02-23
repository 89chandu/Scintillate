import React, { useState, useEffect } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import './CharacterList.css'; // Import the external CSS file
import CustomModal from './CustomModal'; // Import the custom modal component

function CharactersAndFavorites() {
    const [characters, setCharacters] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
    const [showFavorites, setShowFavorites] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCharacters('https://swapi.dev/api/people/');
    }, []);

    const fetchCharacters = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setCharacters(data.results);
            setNextPage(data.next);
            setPrevPage(data.previous);
        } catch (error) {
            console.error('Error fetching characters:', error);
        }
    };

    const handleNextPage = () => {
        if (nextPage) {
            fetchCharacters(nextPage);
        }
    };

    const handlePrevPage = () => {
        if (prevPage) {
            fetchCharacters(prevPage);
        }
    };

    const handleCharacterClick = (characterUrl) => {
        const characterId = characterUrl.split('/').slice(-2, -1)[0];
        navigate(`/character/${characterId}`);
    };

    const toggleFavorite = (character) => {
        const index = favorites.findIndex((fav) => fav.url === character.url);
        if (index !== -1) {
            const updatedFavorites = [...favorites.slice(0, index), ...favorites.slice(index + 1)];
            setFavorites(updatedFavorites);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setModalTitle('Removed successfully');
            setModalMessage('Removed to favorite successfully');
            setIsModalOpen(true);
        } else {
            const updatedFavorites = [...favorites, character];
            setFavorites(updatedFavorites);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setModalTitle('Added successfully');
            setModalMessage('Added to favorite successfully');
            setIsModalOpen(true);
        }
    };

    const isFavorite = (character) => {
        return favorites.some((fav) => fav.url === character.url);
    };

    const handleShowFavorites = () => {
        setShowFavorites(true);
    };

    const handleShowCharacters = () => {
        setShowFavorites(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="background-container">
            <Box className="character-list-container">
                <CustomModal isOpen={isModalOpen} onClose={handleCloseModal} title={modalTitle} message={modalMessage} />
                <div className="buttons-container">
                    <Button className="show-all-button" id="btn2" onClick={handleShowCharacters}>
                        Show Characters
                    </Button>
                    <Button className="favorites-button" id="btn2" onClick={handleShowFavorites}>
                        Show Favorites
                    </Button>
                </div>
                {showFavorites ? (
                    <>
                        <Text className="title character-details-title" fontSize="xl" fontWeight="bold" mb={4}>
                            Favorite Characters
                        </Text>
                        <div className="character-container">
                            {favorites.map((favorite) => (
                                <Box
                                    key={favorite.url}
                                    className="character-card"
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    p={4}
                                    mb={4}
                                    onClick={() => handleCharacterClick(favorite.url)}
                                >
                                    <Text className="name" fontSize="lg" fontWeight="bold">
                                        {favorite.name}
                                    </Text>
                                    <Text className="info">Gender: {favorite.gender}</Text>
                                    <Text className="info">Height: {favorite.height}</Text>
                                    <Button
                                        className={`favorite-button remove ${isFavorite(favorite) ? 'added' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(favorite);
                                        }}
                                        bg="red" // Set background color to red for remove button
                                        color="white" // Set text color to white for better visibility
                                    >
                                        Remove from Favorites
                                    </Button>
                                </Box>
                            ))}
                        </div>
                        <div className="pagination">
                            <Button className="pagination-button" id="btn" onClick={handlePrevPage} disabled={!prevPage} mr={2}>
                                Previous
                            </Button>
                            <Button className="pagination-button" id="btn1" onClick={handleNextPage} disabled={!nextPage}>
                                Next
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <Text className="title character-details-title" fontSize="xl" fontWeight="bold" mb={4}>
                            All Characters
                        </Text>
                        <div className="character-container">
                            {/* Character cards */}
                            {characters.map((character) => (
                                <Box
                                    key={character.name}
                                    className="character-card"
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    p={2}
                                    mb={2}
                                    onClick={() => handleCharacterClick(character.url)}
                                >
                                    <Text className="name" fontSize="lg" fontWeight="bold">
                                        {character.name}
                                    </Text>
                                    <Text className="info">Gender: {character.gender}</Text>
                                    <Text className="info">Height: {character.height}</Text>
                                    <Button
                                        className={`favorite-button ${isFavorite(character) ? 'added' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(character);
                                        }}
                                        bg={isFavorite(character) ? 'red' : 'green'} // Change background color based on favorite status
                                        color="white" // Set text color to white for better visibility
                                    >
                                        {isFavorite(character) ? 'Remove from Favorites' : 'Add to Favorites'}
                                    </Button>
                                </Box>
                            ))}
                        </div>

                        <div className="pagination">
                            <Button className="pagination-button" id="btn" onClick={handlePrevPage} disabled={!prevPage} mr={2}>
                                Previous Page
                            </Button>
                            <Button className="pagination-button" id="btn1" onClick={handleNextPage} disabled={!nextPage}>
                                Next Page
                            </Button>
                        </div>
                    </>
                )}
            </Box>
        </div>
    );
}

export default CharactersAndFavorites;
