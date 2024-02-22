// CharacterDetailsPage.js
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { Box, Text } from '@chakra-ui/react';
import './CharacterDetailsPage.css';



const fetchCharacterDetails = async (id) => {
  const { data } = await axios.get(`https://swapi.dev/api/people/${id}/`);
  return data;
};

const fetchFilmDetails = async (filmUrl) => {
  const { data } = await axios.get(filmUrl);
  return data;
};

function CharacterDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: characterData, isLoading: characterLoading, isError: characterError } = useQuery(
    ['characterDetails', id],
    () => fetchCharacterDetails(id)
  );

  useEffect(() => {
    if (characterData) {
      const { films } = characterData;
      queryClient.prefetchQuery(['filmDetails', films], () =>
        Promise.all(films.map((filmUrl) => fetchFilmDetails(filmUrl)))
      );
    }
  }, [characterData, queryClient]);

  if (characterLoading) return <Text>Loading...</Text>;
  if (characterError) return <Text>Error fetching character details</Text>;

  return (
    <Box mt={8} className="character-details-box">
      <Text fontSize="xl" fontWeight="bold" className="character-names">
        {characterData.name}
      </Text>

      <div className="basic-card">
        <Text mt={4} fontWeight="bold" className="base-details">
          Base Details:
        </Text>
        <Box className="base-details-box">
          <Text>Height: {characterData.height}</Text>
          <Text>Mass: {characterData.mass}</Text>
          <Text>Hair Color: {characterData.hair_color}</Text>
          <Text>Skin Color: {characterData.skin_color}</Text>
          <Text>Eye Color: {characterData.eye_color}</Text>
          <Text>Birth Year: {characterData.birth_year}</Text>
          <Text>Gender: {characterData.gender}</Text>
        </Box>
      </div>

      <div className="movie-card">
        <Text mt={4} fontWeight="bold" className="movies-header">
          Movies:
        </Text>
        <Box className="movies-box">
          {characterData.films.map((filmUrl) => (
            <FilmDetails key={filmUrl} filmUrl={filmUrl} />
          ))}
        </Box>
      </div>

      <Box mt={4} ml={4}>
      <button className="go-back-button" onClick={() => navigate('/')}>
          Go Back
        </button>
      </Box>
    </Box>
  );
}

function FilmDetails({ filmUrl }) {
  const { data: filmData, isLoading: filmLoading, isError: filmError } = useQuery(
    ['filmDetails', filmUrl],
    () => fetchFilmDetails(filmUrl)
  );

  if (filmLoading) return <Text>Loading film details...</Text>;
  if (filmError) return <Text>Error fetching film details</Text>;

  return <Text ml={4}>{filmData.title}</Text>;
}

export default CharacterDetailsPage;
