import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const getWeatherIcon = (weatherMain) => {
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return 'weather-sunny';
    case 'clouds':
      return 'weather-cloudy';
    case 'rain':
      return 'weather-rainy';
    case 'snow':
      return 'weather-snowy';
    default:
      return 'weather-cloudy';
  }
};

const WeatherListItem = ({ weather }) => {
  return (
    <ListItem containerStyle={styles.listItem}>
      <MaterialCommunityIcons
        name={getWeatherIcon(weather.weather[0].main)}
        size={50}
        color="#FFF"
      />
      <ListItem.Content>
        <ListItem.Title style={styles.cityName}>{weather.name}</ListItem.Title>
        <ListItem.Subtitle style={styles.temperature}>
          {Math.round(weather.main.temp)}°C
        </ListItem.Subtitle>
      </ListItem.Content>
      <View style={styles.detailsContainer}>
        <Text style={styles.weatherDescription}>{weather.weather[0].description}</Text>
        <Text style={styles.humidity}>Humidity: {weather.main.humidity}%</Text>
      </View>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    marginBottom: 10,
  },
  cityName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  temperature: {
    color: '#FFF',
    fontSize: 24,
  },
  detailsContainer: {
    alignItems: 'flex-end',
  },
  weatherDescription: {
    color: '#FFF',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  humidity: {
    color: '#FFF',
    fontSize: 12,
  },
});

export default WeatherListItem;