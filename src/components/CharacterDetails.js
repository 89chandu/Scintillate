import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Spinner } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import './CharacterDetails.css';

function CharacterDetails() {
    const { id } = useParams();
    const [character, setCharacter] = useState(null);
    const [homeworld, setHomeworld] = useState(null);
    const [films, setFilms] = useState([]);
    const [species, setSpecies] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [starships, setStarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCharacterDetails = async () => {
            try {
                const response = await fetch(`https://swapi.dev/api/people/${id}/`);
                const data = await response.json();
                setCharacter(data);

                await Promise.all([
                    fetchAdditionalData(data.homeworld, setHomeworld),
                    fetchAllAdditionalData(data.films, setFilms),
                    fetchAllAdditionalData(data.species, setSpecies),
                    fetchAllAdditionalData(data.vehicles, setVehicles),
                    fetchAllAdditionalData(data.starships, setStarships)
                ]);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching character details:', error);
                setLoading(false);
            }
        };

        fetchCharacterDetails();
    }, [id]);

    const fetchAdditionalData = async (url, setData) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Error fetching additional data:', error);
        }
    };

    const fetchAllAdditionalData = async (urls, setData) => {
        try {
            const responses = await Promise.all(urls.map(url => fetch(url)));
            const data = await Promise.all(responses.map(response => response.json()));
            setData(data);
        } catch (error) {
            console.error('Error fetching additional data:', error);
        }
    };

    if (loading) {
        return (
            <Box className="main-bg" justifyContent="center" alignItems="center" display="flex" height="100vh">
                <Spinner size="xl" color="green.500" thickness="4px" />
            </Box>
        );
    }

    return (
        <>
            <Box className="main-bg">
                <Box className="character-details-container">
                    <Text className="character-details-title">Name: {character.name}</Text>
                    <div className='c-details' style={{ marginTop: '10px' }}>
                        <Text className="character-details-item" color="white">Height: {character.height}</Text>
                        <Text className="character-details-item" color="white">Mass: {character.mass}</Text>
                        <Text className="character-details-item" color="white">Hair Color: {character.hair_color}</Text>
                        <Text className="character-details-item" color="white">Skin Color: {character.skin_color}</Text>
                        <Text className="character-details-item" color="white">Eye Color: {character.eye_color}</Text>
                        <Text className="character-details-item" color="white">Birth Year: {character.birth_year}</Text>
                        <Text className="character-details-item" color="white">Gender: {character.gender}</Text>
                        <Text className="character-details-item" color="white">Homeworld: {homeworld?.name}</Text>
                    </div>


                    <div className='card'>
    <Text className="character-details-item">
        <div className='movie_title'>
        Movies:
        </div>
       
        {films.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {films.map(film => (
                    <li key={film.url}>{film.title}</li>
                ))}
            </ul>
        ) : (
            "No films available"
        )}
    </Text>
</div>


   

                    <Button onClick={() => navigate('/')} mt={4} className='btn' colorScheme="green">Back</Button>
                </Box>
            </Box>
        </>
    );
}

export default CharacterDetails;