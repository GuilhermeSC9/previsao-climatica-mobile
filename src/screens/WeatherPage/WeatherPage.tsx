import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { styles } from './WeatherPageStyles';
import Header from '../../components/Header/Header';
import { Weather } from '../../models/WeatherModel';
import { api } from '../../lib/axios';
import { FavoriteCity } from '../../models/FavoriteCity';
import WeatherCard from '../../components/WeatherCard/WeatherCard';


export function WeatherPage() {

  const [favoriteCitiesData, setFavoriteCitiesData] = useState<Weather[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cityToSearch, setCityToSearch] = useState("");
  const [cityWeatherData, setCityWeatherData] = useState<Weather>();

  useEffect(()=> {
    getFavoriteCities()
  }, []);


  useEffect(() => {
    getFavoriteCities();
  }, [])

  async function getFavoriteCities() {
    //LIMPAR DADOS ANTERIORES DE CIDADES FAVORITAS
    setFavoriteCitiesData([]);
    //MARCAR COMO CARREGANDO DADOS
    setIsLoading(true);
    //BUSCAR CIDADES FAVORITAS
    const response = await api.get("/favoriteCity");
    //PARA CADA ITEM DO RESPONSE BUSCAR O CLIMA DA CIDADE PELO NOME E ASSIM SALVAR NO ESTADO DE CIDADE FAVORITA
    response.data.forEach(async (item: FavoriteCity) => {
      const responseWeather = await getWeatherByCity(item.name);

      if (responseWeather) {
        setFavoriteCitiesData((prevState) => [...prevState, responseWeather]);
      }
    })


    favoriteCitiesData.sort((a, b) => a.location.name.localeCompare(b.location.name))

    //TODO: DESMARCAR COMO CARREGANDO DADOS
    setIsLoading(false)
  }

  async function getWeatherByCity(cityName: string) {
    //FAZEr A REQUISICAO PARA A API BUSCANDO O CLIMA PELO NOME DA CIDADE E RETORNAR O RESULTADO
    const response = await api.get<Weather>("/weather/" + cityName);

    if (response.status == 200) {
      return response.data
    }
    else {
      console.error("Erro ao carregar clima da cidade")
    }
  }

  async function onSubmitSearch(e: any) {
    e.preventDefault();

    const responseWeather = await getWeatherByCity(cityToSearch);

    if (responseWeather) {
      setCityWeatherData(responseWeather)
    }

    setCityToSearch("")
  }

  function refreshCardSearch(){
    getFavoriteCities();
    setCityWeatherData(undefined);
  }

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.formSearch}>
        <TextInput style={styles.inputSearch} placeholder='Digite o nome da cidade' value={cityToSearch} onChangeText={setCityToSearch} returnKeyLabel='search' onSubmitEditing={onSubmitSearch} />
        <TouchableOpacity style={styles.buttonSearch} onPress={onSubmitSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {cityWeatherData && <WeatherCard weather={cityWeatherData} refreshCard={refreshCardSearch} />}

    <Text style={styles.favoriteCitiesTitle}>Cidades Favoritas</Text>
    {isLoading ? <Text>Carregando cidades favoritas...</Text> : favoriteCitiesData.length === 0 ? <Text>Nenhuma cidade favorita encontrada.</Text> : favoriteCitiesData.map((city) => <WeatherCard key={city.location.name} weather={city} refreshCard={getFavoriteCities} />)}
    </View>
  );
}
